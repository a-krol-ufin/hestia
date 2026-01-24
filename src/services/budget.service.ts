import pb from './pocketbase'
import { memberService } from './member.service'
import type {
  Household,
  CreateHousehold,
  UpdateHousehold,
  BudgetEntry,
  CreateBudgetEntry,
  UpdateBudgetEntry,
  BudgetPlan,
  CreateBudgetPlan,
  UpdateBudgetPlan,
} from '@/types/budget.types'

class BudgetService {
  private householdsCollection = 'households'
  private entriesCollection = 'budget_entries'
  private plansCollection = 'budget_plans'

  // Households
  async getHouseholds(): Promise<Household[]> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return []

      // Get households where user is owner
      const ownedHouseholds = await pb.collection(this.householdsCollection).getFullList<Household>({
        filter: `owner = "${userId}"`,
      })

      // Get households where user is a member (through household_members)
      const memberHouseholds: Household[] = []
      try {
        const memberships = await pb.collection('household_members').getFullList({
          filter: `user = "${userId}"`,
          expand: 'household',
        })

        // Extract expanded households from memberships
        for (const membership of memberships) {
          const expandedHousehold = membership.expand?.household as Household | undefined

          if (expandedHousehold) {
            // Only add if not already in owned list
            if (!ownedHouseholds.find(h => h.id === expandedHousehold.id)) {
              memberHouseholds.push(expandedHousehold)
            }
          } else if (membership.household) {
            // Expand failed - try to fetch household directly
            try {
              const household = await pb.collection(this.householdsCollection).getOne<Household>(membership.household)
              if (household && !ownedHouseholds.find(h => h.id === household.id)) {
                memberHouseholds.push(household)
              }
            } catch {
              // Could not fetch household - user might not have access
            }
          }
        }
      } catch {
        // household_members collection might not exist yet
      }

      // Combine and return unique households
      return [...ownedHouseholds, ...memberHouseholds]
    } catch (error) {
      console.error('Failed to fetch households:', error)
      return []
    }
  }

  async getHousehold(id: string): Promise<Household | null> {
    try {
      const record = await pb.collection(this.householdsCollection).getOne<Household>(id)
      return record
    } catch (error) {
      console.error('Failed to fetch household:', error)
      return null
    }
  }

  async createHousehold(data: CreateHousehold): Promise<Household | null> {
    try {
      const userId = pb.authStore.record?.id
      const record = await pb.collection(this.householdsCollection).create<Household>({
        ...data,
        owner: userId,
      })

      // Create household_member record for owner
      await memberService.createMemberForOwner(record.id)

      return record
    } catch (error) {
      console.error('Failed to create household:', error)
      return null
    }
  }

  async updateHousehold(id: string, data: UpdateHousehold): Promise<Household | null> {
    try {
      const record = await pb.collection(this.householdsCollection).update<Household>(id, data)
      return record
    } catch (error) {
      console.error('Failed to update household:', error)
      return null
    }
  }

  async deleteHousehold(id: string): Promise<boolean> {
    try {
      await pb.collection(this.householdsCollection).delete(id)
      return true
    } catch (error) {
      console.error('Failed to delete household:', error)
      return false
    }
  }

  // Budget Entries
  async getEntries(householdId: string, month?: string): Promise<BudgetEntry[]> {
    try {
      let filter = `household = "${householdId}"`
      if (month) {
        const startDate = `${month}-01`
        const endDate = `${month}-31`
        filter += ` && date >= "${startDate}" && date <= "${endDate}"`
      }

      const records = await pb.collection(this.entriesCollection).getFullList<BudgetEntry>({
        filter,
        sort: '-date',
      })
      return records
    } catch (error) {
      console.error('Failed to fetch budget entries:', error)
      return []
    }
  }

  async createEntry(householdId: string, data: CreateBudgetEntry): Promise<BudgetEntry | null> {
    try {
      const record = await pb.collection(this.entriesCollection).create<BudgetEntry>({
        ...data,
        household: householdId,
        created_by: pb.authStore.record?.id,
      })
      return record
    } catch (error) {
      console.error('Failed to create budget entry:', error)
      return null
    }
  }

  async updateEntry(id: string, data: UpdateBudgetEntry): Promise<BudgetEntry | null> {
    try {
      const record = await pb.collection(this.entriesCollection).update<BudgetEntry>(id, data)
      return record
    } catch (error) {
      console.error('Failed to update budget entry:', error)
      return null
    }
  }

  async deleteEntry(id: string): Promise<boolean> {
    try {
      await pb.collection(this.entriesCollection).delete(id)
      return true
    } catch (error) {
      console.error('Failed to delete budget entry:', error)
      return false
    }
  }

  // Budget Plans
  async getPlans(householdId: string, month?: string): Promise<BudgetPlan[]> {
    try {
      let filter = `household = "${householdId}"`
      if (month) {
        filter += ` && (month = "${month}" || recurrent = true)`
      }

      const records = await pb.collection(this.plansCollection).getFullList<BudgetPlan>({
        filter,
      })
      return records
    } catch (error) {
      console.error('Failed to fetch budget plans:', error)
      return []
    }
  }

  async createPlan(householdId: string, data: CreateBudgetPlan): Promise<BudgetPlan | null> {
    try {
      const record = await pb.collection(this.plansCollection).create<BudgetPlan>({
        ...data,
        household: householdId,
        created_by: pb.authStore.record?.id,
      })
      return record
    } catch (error) {
      console.error('Failed to create budget plan:', error)
      return null
    }
  }

  async updatePlan(id: string, data: UpdateBudgetPlan): Promise<BudgetPlan | null> {
    try {
      const record = await pb.collection(this.plansCollection).update<BudgetPlan>(id, data)
      return record
    } catch (error) {
      console.error('Failed to update budget plan:', error)
      return null
    }
  }

  async deletePlan(id: string): Promise<boolean> {
    try {
      await pb.collection(this.plansCollection).delete(id)
      return true
    } catch (error) {
      console.error('Failed to delete budget plan:', error)
      return false
    }
  }
}

export const budgetService = new BudgetService()
