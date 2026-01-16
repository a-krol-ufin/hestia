import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { budgetService } from '@/services/budget.service'
import type {
  Household,
  CreateHousehold,
  BudgetEntry,
  CreateBudgetEntry,
  BudgetPlan,
  CreateBudgetPlan,
  MonthlySummary,
  BudgetCategory,
} from '@/types/budget.types'

export const useBudgetStore = defineStore('budget', () => {
  // State
  const households = ref<Household[]>([])
  const currentHousehold = ref<Household | null>(null)
  const entries = ref<BudgetEntry[]>([])
  const plans = ref<BudgetPlan[]>([])
  const currentMonth = ref<string>(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const monthlySummary = computed<MonthlySummary>(() => {
    const income = entries.value
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)

    const expenses = entries.value
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)

    const expensesByCategory: Record<BudgetCategory, number> = {
      food: 0,
      bills: 0,
      transport: 0,
      entertainment: 0,
      health: 0,
      clothing: 0,
      education: 0,
      other: 0,
    }

    entries.value
      .filter(e => e.type === 'expense')
      .forEach(e => {
        expensesByCategory[e.category] += e.amount
      })

    return {
      month: currentMonth.value,
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expensesByCategory,
    }
  })

  // Households
  async function fetchHouseholds() {
    isLoading.value = true
    error.value = null
    households.value = await budgetService.getHouseholds()

    if (households.value.length > 0 && !currentHousehold.value) {
      const firstHousehold = households.value[0]
      if (firstHousehold) {
        currentHousehold.value = firstHousehold
        await fetchEntriesForMonth(currentMonth.value)
        await fetchPlansForMonth(currentMonth.value)
      }
    }

    isLoading.value = false
  }

  async function createHousehold(data: CreateHousehold) {
    error.value = null
    const household = await budgetService.createHousehold(data)
    if (household) {
      households.value.unshift(household)
      currentHousehold.value = household
    } else {
      error.value = 'Failed to create household'
    }
  }

  async function selectHousehold(household: Household) {
    currentHousehold.value = household
    await fetchEntriesForMonth(currentMonth.value)
    await fetchPlansForMonth(currentMonth.value)
  }

  // Entries
  async function fetchEntriesForMonth(month: string) {
    if (!currentHousehold.value) return

    isLoading.value = true
    error.value = null
    currentMonth.value = month
    entries.value = await budgetService.getEntries(currentHousehold.value.id, month)
    isLoading.value = false
  }

  async function addEntry(entry: CreateBudgetEntry) {
    if (!currentHousehold.value) {
      error.value = 'No household selected'
      return
    }

    error.value = null
    const newEntry = await budgetService.createEntry(currentHousehold.value.id, entry)
    if (newEntry) {
      entries.value.unshift(newEntry)
    } else {
      error.value = 'Failed to add entry'
    }
  }

  async function deleteEntry(id: string) {
    error.value = null
    const success = await budgetService.deleteEntry(id)
    if (success) {
      entries.value = entries.value.filter(e => e.id !== id)
    } else {
      error.value = 'Failed to delete entry'
    }
  }

  // Plans
  async function fetchPlansForMonth(month: string) {
    if (!currentHousehold.value) return

    error.value = null
    plans.value = await budgetService.getPlans(currentHousehold.value.id, month)
  }

  async function addPlan(plan: CreateBudgetPlan) {
    if (!currentHousehold.value) {
      error.value = 'No household selected'
      return
    }

    error.value = null
    const newPlan = await budgetService.createPlan(currentHousehold.value.id, plan)
    if (newPlan) {
      plans.value.unshift(newPlan)
    } else {
      error.value = 'Failed to add plan'
    }
  }

  async function deletePlan(id: string) {
    error.value = null
    const success = await budgetService.deletePlan(id)
    if (success) {
      plans.value = plans.value.filter(p => p.id !== id)
    } else {
      error.value = 'Failed to delete plan'
    }
  }

  // Navigation
  function goToPreviousMonth() {
    const date = new Date(currentMonth.value + '-01')
    date.setMonth(date.getMonth() - 1)
    const newMonth = date.toISOString().slice(0, 7)
    fetchEntriesForMonth(newMonth)
    fetchPlansForMonth(newMonth)
  }

  function goToNextMonth() {
    const date = new Date(currentMonth.value + '-01')
    date.setMonth(date.getMonth() + 1)
    const newMonth = date.toISOString().slice(0, 7)
    fetchEntriesForMonth(newMonth)
    fetchPlansForMonth(newMonth)
  }

  function clearData() {
    households.value = []
    currentHousehold.value = null
    entries.value = []
    plans.value = []
    error.value = null
  }

  return {
    // State
    households,
    currentHousehold,
    entries,
    plans,
    currentMonth,
    isLoading,
    error,

    // Computed
    monthlySummary,

    // Actions
    fetchHouseholds,
    createHousehold,
    selectHousehold,
    fetchEntriesForMonth,
    addEntry,
    deleteEntry,
    fetchPlansForMonth,
    addPlan,
    deletePlan,
    goToPreviousMonth,
    goToNextMonth,
    clearData,
  }
})
