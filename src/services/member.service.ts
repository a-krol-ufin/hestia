import pb from './pocketbase'
import type { HouseholdMember, MemberRole, UpdateHouseholdMember } from '@/types/member.types'

class MemberService {
  private collection = 'household_members'

  async getMembers(householdId: string): Promise<HouseholdMember[]> {
    try {
      const records = await pb.collection(this.collection).getFullList<HouseholdMember>({
        filter: `household = "${householdId}"`,
        expand: 'user',
      })
      return records
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch household members:', error)
      return []
    }
  }

  async getMember(householdId: string, userId: string): Promise<HouseholdMember | null> {
    try {
      const records = await pb.collection(this.collection).getList<HouseholdMember>(1, 1, {
        filter: `household = "${householdId}" && user = "${userId}"`,
        expand: 'user',
      })
      return records.items[0] || null
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return null
      }
      console.error('Failed to fetch household member:', error)
      return null
    }
  }

  async getCurrentUserMembership(householdId: string): Promise<HouseholdMember | null> {
    const userId = pb.authStore.record?.id
    if (!userId) return null
    return this.getMember(householdId, userId)
  }

  async updateMemberRole(memberId: string, data: UpdateHouseholdMember): Promise<HouseholdMember | null> {
    try {
      const record = await pb.collection(this.collection).update<HouseholdMember>(memberId, data, {
        expand: 'user',
      })
      return record
    } catch (error) {
      console.error('Failed to update member role:', error)
      return null
    }
  }

  async removeMember(memberId: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).delete(memberId)
      return true
    } catch (error) {
      console.error('Failed to remove member:', error)
      return false
    }
  }

  async createMemberForOwner(householdId: string): Promise<HouseholdMember | null> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return null

      const record = await pb.collection(this.collection).create<HouseholdMember>({
        household: householdId,
        user: userId,
        role: 'admin' as MemberRole,
        joined_at: new Date().toISOString(),
      })
      return record
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return null
      }
      console.error('Failed to create member record for owner:', error)
      return null
    }
  }

  async getUserHouseholds(): Promise<string[]> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return []

      const records = await pb.collection(this.collection).getFullList<HouseholdMember>({
        filter: `user = "${userId}"`,
      })
      return records.map(r => r.household)
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch user households:', error)
      return []
    }
  }
}

export const memberService = new MemberService()
