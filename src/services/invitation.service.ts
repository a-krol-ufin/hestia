import pb from './pocketbase'
import type { Invitation, CreateInvitation, InvitationStatus } from '@/types/notification.types'
import type { MemberRole } from '@/types/member.types'

class InvitationService {
  private collection = 'household_invitations'

  async getInvitations(householdId?: string): Promise<Invitation[]> {
    try {
      let filter = ''
      if (householdId) {
        filter = `household = "${householdId}"`
      }

      const records = await pb.collection(this.collection).getFullList<Invitation>({
        filter,
        expand: 'household,inviter,invitee',
      })
      return records
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch invitations:', error)
      return []
    }
  }

  async getPendingInvitationsForUser(): Promise<Invitation[]> {
    try {
      const userId = pb.authStore.record?.id
      const userEmail = pb.authStore.record?.email
      if (!userId) return []

      // Search by invitee ID or by email (for invitations sent before user registered)
      let filter = `status = "pending" && (invitee = "${userId}"`
      if (userEmail) {
        filter += ` || invitee_email = "${userEmail}"`
      }
      filter += ')'

      const records = await pb.collection(this.collection).getFullList<Invitation>({
        filter,
        expand: 'household,inviter',
        requestKey: null, // Disable auto-cancellation
      })
      return records
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch pending invitations:', error)
      return []
    }
  }

  async getInvitation(id: string): Promise<Invitation | null> {
    try {
      const record = await pb.collection(this.collection).getOne<Invitation>(id, {
        expand: 'household,inviter,invitee',
      })
      return record
    } catch (error) {
      console.error('Failed to fetch invitation:', error)
      return null
    }
  }

  async sendInvitation(data: CreateInvitation): Promise<Invitation | null> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return null

      // Check if user with this email exists
      let inviteeId: string | undefined
      try {
        // Use the correct users collection name in PocketBase
        const users = await pb.collection('users').getList(1, 1, {
          filter: `email = "${data.invitee_email}"`,
        })
        const firstUser = users.items[0]
        if (firstUser) {
          inviteeId = firstUser.id
        }
      } catch {
        // User not found, invitation will be pending - this is OK
      }

      // Check if there's already a pending invitation (skip if collection doesn't exist)
      try {
        const existingInvitations = await pb.collection(this.collection).getList(1, 1, {
          filter: `household = "${data.household}" && invitee_email = "${data.invitee_email}" && status = "pending"`,
        })

        if (existingInvitations.items.length > 0) {
          console.error('Pending invitation already exists for this email')
          return null
        }
      } catch {
        // Collection might not exist, continue with creating the invitation
      }

      const record = await pb.collection(this.collection).create<Invitation>({
        ...data,
        inviter: userId,
        invitee: inviteeId,
        status: 'pending' as InvitationStatus,
      })

      return record
    } catch (error: unknown) {
      // Log detailed error for debugging
      if (error && typeof error === 'object' && 'data' in error) {
        console.error('Failed to send invitation:', error, (error as { data?: unknown }).data)
      } else {
        console.error('Failed to send invitation:', error)
      }
      return null
    }
  }

  async acceptInvitation(invitationId: string): Promise<boolean> {
    try {
      const userId = pb.authStore.record?.id
      const userEmail = pb.authStore.record?.email
      if (!userId) return false

      // Get the invitation first
      const invitation = await this.getInvitation(invitationId)
      if (!invitation) {
        console.error('Invitation not found')
        return false
      }

      // Check if invitation is for current user (by ID or email)
      const isForCurrentUser = invitation.invitee === userId ||
        (invitation.invitee_email && invitation.invitee_email === userEmail)

      if (!isForCurrentUser) {
        console.error('Invitation not for current user')
        return false
      }

      // Update invitation status and set invitee if not set
      await pb.collection(this.collection).update(invitationId, {
        status: 'accepted' as InvitationStatus,
        invitee: userId, // Set invitee to current user
      })

      // Create household_member record
      await pb.collection('household_members').create({
        household: invitation.household,
        user: userId,
        role: invitation.role as MemberRole,
        joined_at: new Date().toISOString(),
      })

      // Create notification for the inviter
      try {
        const userName = pb.authStore.record?.name || pb.authStore.record?.email || 'Someone'
        await pb.collection('household_notifications').create({
          user: invitation.inviter,
          type: 'invitation_accepted',
          title: 'Invitation accepted',
          message: `${userName} accepted your invitation`,
          read: false,
          related_invitation: invitationId,
          data: JSON.stringify({
            household: invitation.household,
            acceptedBy: userId
          }),
        })
      } catch (notifError) {
        // Don't fail if notification creation fails
        console.warn('Failed to create notification for inviter:', notifError)
      }

      return true
    } catch (error) {
      console.error('Failed to accept invitation:', error)
      return false
    }
  }

  async rejectInvitation(invitationId: string): Promise<boolean> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return false

      // Get invitation to set invitee if needed
      const invitation = await this.getInvitation(invitationId)

      await pb.collection(this.collection).update(invitationId, {
        status: 'rejected' as InvitationStatus,
        invitee: userId, // Set invitee to current user
      })

      // Optionally notify the inviter
      if (invitation) {
        try {
          const userName = pb.authStore.record?.name || pb.authStore.record?.email || 'Someone'
          await pb.collection('household_notifications').create({
            user: invitation.inviter,
            type: 'invitation_accepted', // Using same type, message explains rejection
            title: 'Invitation declined',
            message: `${userName} declined your invitation`,
            read: false,
            related_invitation: invitationId,
          })
        } catch {
          // Don't fail if notification creation fails
        }
      }

      return true
    } catch (error) {
      console.error('Failed to reject invitation:', error)
      return false
    }
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).update(invitationId, {
        status: 'cancelled' as InvitationStatus,
      })

      return true
    } catch (error) {
      console.error('Failed to cancel invitation:', error)
      return false
    }
  }

  async deleteInvitation(invitationId: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).delete(invitationId)
      return true
    } catch (error) {
      console.error('Failed to delete invitation:', error)
      return false
    }
  }
}

export const invitationService = new InvitationService()
