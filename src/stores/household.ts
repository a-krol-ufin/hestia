import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { budgetService } from '@/services/budget.service'
import type { Household, CreateHousehold } from '@/types/budget.types'

export const useHouseholdStore = defineStore('household', () => {
  // State
  const households = ref<Household[]>([])
  const currentHouseholdId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const currentHousehold = computed<Household | null>(() => {
    if (!currentHouseholdId.value) return null
    return households.value.find(h => h.id === currentHouseholdId.value) || null
  })

  const hasHouseholds = computed(() => households.value.length > 0)

  // Actions
  async function fetchHouseholds() {
    isLoading.value = true
    error.value = null

    try {
      households.value = await budgetService.getHouseholds()

      // Auto-select first household if none selected
      if (households.value.length > 0 && !currentHouseholdId.value) {
        const firstHousehold = households.value[0]
        if (firstHousehold) {
          currentHouseholdId.value = firstHousehold.id
        }
      }

      // Clear selection if current household no longer exists
      if (currentHouseholdId.value && !households.value.find(h => h.id === currentHouseholdId.value)) {
        currentHouseholdId.value = households.value[0]?.id || null
      }
    } catch (e) {
      error.value = 'Failed to fetch households'
      console.error('Failed to fetch households:', e)
    }

    isLoading.value = false
  }

  async function createHousehold(data: CreateHousehold): Promise<Household | null> {
    error.value = null

    try {
      const household = await budgetService.createHousehold(data)
      if (household) {
        households.value.unshift(household)
        currentHouseholdId.value = household.id
        return household
      }
    } catch (e) {
      error.value = 'Failed to create household'
      console.error('Failed to create household:', e)
    }

    return null
  }

  async function updateHousehold(id: string, data: { name: string }): Promise<Household | null> {
    error.value = null

    try {
      const updated = await budgetService.updateHousehold(id, data)
      if (updated) {
        const index = households.value.findIndex(h => h.id === id)
        if (index !== -1) {
          households.value[index] = updated
        }
        return updated
      }
    } catch (e) {
      error.value = 'Failed to update household'
      console.error('Failed to update household:', e)
    }

    return null
  }

  async function deleteHousehold(id: string): Promise<boolean> {
    error.value = null

    try {
      const success = await budgetService.deleteHousehold(id)
      if (success) {
        households.value = households.value.filter(h => h.id !== id)

        // Select another household if the deleted one was selected
        if (currentHouseholdId.value === id) {
          currentHouseholdId.value = households.value[0]?.id || null
        }
        return true
      }
    } catch (e) {
      error.value = 'Failed to delete household'
      console.error('Failed to delete household:', e)
    }

    return false
  }

  function selectHousehold(id: string) {
    if (households.value.find(h => h.id === id)) {
      currentHouseholdId.value = id
    }
  }

  function clearData() {
    households.value = []
    currentHouseholdId.value = null
    error.value = null
  }

  return {
    // State
    households,
    currentHouseholdId,
    isLoading,
    error,

    // Computed
    currentHousehold,
    hasHouseholds,

    // Actions
    fetchHouseholds,
    createHousehold,
    updateHousehold,
    deleteHousehold,
    selectHousehold,
    clearData,
  }
})
