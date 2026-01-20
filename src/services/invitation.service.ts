import pb from './pocketbase'
import type { Invitation, CreateInvitation, InvitationStatus } from '@/types/notification.types'
import type { MemberRole } from '@/types/member.types'

class InvitationService {
  private collection = 'invitations'

  async getInvitations(householdId?: string): Promise<Invitation[]> {
    try {
      let filter = ''
      if (householdId) {
        filter = `household = "${householdId}"`
      }

      const records = await pb.collection(this.collection).getFullList<Invitation>({
        filter,
        expand: 'household,inviter,invitee',
        sort: '-created',
      })
      return records
    } catch (error) {
      console.error('Failed to fetch invitations:', error)
      return []
    }
  }

  async getPendingInvitationsForUser(): Promise<Invitation[]> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return []

      const records = await pb.collection(this.collection).getFullList<Invitation>({
        filter: `invitee = "${userId}" && status = "pending"`,
        expand: 'household,inviter',
        sort: '-created',
      })
      return records
    } catch (error) {
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
        const users = await pb.collection('users').getList(1, 1, {
          filter: `email = "${data.invitee_email}"`,
        })
        const firstUser = users.items[0]
        if (firstUser) {
          inviteeId = firstUser.id
        }
      } catch {
        // User not found, invitation will be pending
      }

      // Check if there's already a pending invitation
      const existingInvitations = await pb.collection(this.collection).getList(1, 1, {
        filter: `household = "${data.household}" && invitee_email = "${data.invitee_email}" && status = "pending"`,
      })

      if (existingInvitations.items.length > 0) {
        console.error('Pending invitation already exists for this email')
        return null
      }

      const record = await pb.collection(this.collection).create<Invitation>({
        ...data,
        inviter: userId,
        invitee: inviteeId,
        status: 'pending' as InvitationStatus,
      })

      return record
    } catch (error) {
      console.error('Failed to send invitation:', error)
      return null
    }
  }

  async acceptInvitation(invitationId: string): Promise<boolean> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return false

      // Get the invitation first
      const invitation = await this.getInvitation(invitationId)
      if (!invitation || invitation.invitee !== userId) {
        console.error('Invitation not found or not for current user')
        return false
      }

      // Update invitation status
      await pb.collection(this.collection).update(invitationId, {
        status: 'accepted' as InvitationStatus,
      })

      // Create household_member record
      await pb.collection('household_members').create({
        household: invitation.household,
        user: userId,
        role: invitation.role as MemberRole,
        joined_at: new Date().toISOString(),
      })

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

      await pb.collection(this.collection).update(invitationId, {
        status: 'rejected' as InvitationStatus,
      })

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
