<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import { TrashIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BudgetHeader from '@/components/budget/BudgetHeader.vue'
import BudgetSummaryGrid from '@/components/budget/BudgetSummaryGrid.vue'
import BudgetQuickActionBar from '@/components/budget/BudgetQuickActionBar.vue'
import BudgetAnalyticsGrid from '@/components/budget/BudgetAnalyticsGrid.vue'
import BudgetPlanForm from '@/components/budget/BudgetPlanForm.vue'
import BudgetCategoryProgress from '@/components/budget/BudgetCategoryProgress.vue'
import BudgetEntryForm from '@/components/budget/BudgetEntryForm.vue'
import CategoryIcon from '@/components/budget/CategoryIcon.vue'
import ManageHouseholdsModal from '@/components/budget/ManageHouseholdsModal.vue'
import type { CreateBudgetEntry, CreateBudgetPlan, ExpenseCategory, IncomeCategory } from '@/types/budget.types'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const budgetStore = useBudgetStore()

const showPlanForm = ref(false)
const newHouseholdName = ref('')
const showHouseholdForm = ref(false)
const showManageModal = ref(false)

const expenseCategories: ExpenseCategory[] = [
  'food',
  'bills',
  'transport',
  'entertainment',
  'health',
  'clothing',
  'education',
  'other',
]

const incomeCategories: IncomeCategory[] = [
  'salary',
  'freelance',
  'bonus',
  'investment',
  'other',
]

onMounted(async () => {
  await budgetStore.fetchHouseholds()

  // If no household exists, show form to create one
  if (budgetStore.households.length === 0) {
    showHouseholdForm.value = true
  }
})

function handleAddEntry(entry: CreateBudgetEntry) {
  budgetStore.addEntry(entry)
}

function handleAddPlan(plan: CreateBudgetPlan) {
  budgetStore.addPlan(plan)
  showPlanForm.value = false
}

function handleDeleteEntry(id: string) {
  if (confirm(t('budget.confirmDelete'))) {
    budgetStore.deleteEntry(id)
  }
}

function handleDeletePlan(id: string) {
  if (confirm(t('budget.confirmDelete'))) {
    budgetStore.deletePlan(id)
  }
}

async function createHousehold() {
  if (!newHouseholdName.value.trim()) return

  await budgetStore.createHousehold({ name: newHouseholdName.value })
  newHouseholdName.value = ''
  showHouseholdForm.value = false
}

function goBack() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex flex-col">
    <Navbar />
    <main class="flex-grow pt-28">
      <div class="container mx-auto px-6 py-8 max-w-7xl">
        <!-- No household - create one -->
        <div v-if="showHouseholdForm && budgetStore.households.length === 0"
             class="max-w-md mx-auto">
          <div class="budget-card">
            <h2 class="text-xl font-semibold text-slate-800 mb-4">
              {{ t('budget.createHousehold') }}
            </h2>
            <p class="text-slate-600 mb-4">
              {{ t('budget.createHouseholdDescription') }}
            </p>
            <form @submit.prevent="createHousehold" class="space-y-4">
              <input
                v-model="newHouseholdName"
                type="text"
                required
                maxlength="200"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                :placeholder="t('budget.householdNamePlaceholder')"
              />
              <button
                type="submit"
                class="budget-btn-primary w-full"
              >
                {{ t('budget.createHouseholdButton') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Main budget view -->
        <div v-else-if="budgetStore.currentHousehold">
          <!-- Loading state -->
          <div v-if="budgetStore.isLoading" class="text-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          </div>

          <template v-else>
            <!-- 1. Header -->
            <BudgetHeader
              :current-month="budgetStore.currentMonth"
              @previous-month="budgetStore.goToPreviousMonth"
              @next-month="budgetStore.goToNextMonth"
              @go-back="goBack"
              @open-manage-modal="showManageModal = true"
            />

            <!-- 2. Summary Grid (3 karty) -->
            <BudgetSummaryGrid
              :balance="budgetStore.monthlySummary.availableBalance"
              :total-income="budgetStore.monthlySummary.totalIncome"
              :total-expenses="budgetStore.monthlySummary.totalExpenses"
            />

            <!-- 3. Quick Action Bar -->
            <BudgetQuickActionBar
              :expense-categories="expenseCategories"
              :income-categories="incomeCategories"
              @submit="handleAddEntry"
            />

            <!-- 4. Analytics Grid (wykres + transakcje) -->
            <BudgetAnalyticsGrid
              :expenses-by-category="budgetStore.monthlySummary.expensesByCategory"
              :entries="budgetStore.entries"
              @delete-entry="handleDeleteEntry"
            />

            <!-- 5. Advanced entry form (collapsible) -->
            <details class="budget-card mt-6">
              <summary class="cursor-pointer text-slate-700 font-medium hover:text-orange-500 transition-colors">
                {{ t('budget.advancedAddEntry') || 'Zaawansowane dodawanie' }}
              </summary>
              <div class="mt-4">
                <BudgetEntryForm @submit="handleAddEntry" />
              </div>
            </details>

            <!-- 6. Budget Plans Section (collapsible) -->
            <details class="budget-card mt-6">
              <summary class="cursor-pointer text-slate-700 font-medium hover:text-orange-500 transition-colors">
                {{ t('budget.plans') }}
              </summary>
              <div class="mt-4 space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-slate-800">
                    {{ t('budget.planningBudget') || 'Planowanie budżetu' }}
                  </h3>
                  <button
                    @click="showPlanForm = !showPlanForm"
                    class="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {{ showPlanForm ? t('budget.cancel') : t('budget.addPlanButton') }}
                  </button>
                </div>

                <BudgetPlanForm v-if="showPlanForm" @submit="handleAddPlan" class="mb-4" />

                <!-- Budget Progress Bars -->
                <div v-if="budgetStore.categoryProgress.length === 0" class="text-center py-8 text-slate-500">
                  {{ t('budget.noPlans') }}
                </div>

                <div v-else class="space-y-3">
                  <BudgetCategoryProgress
                    v-for="progress in budgetStore.categoryProgress"
                    :key="progress.category"
                    :progress="progress"
                  />
                </div>

                <!-- Raw Plans List (collapsed by default) -->
                <details v-if="budgetStore.plans.length > 0" class="mt-4">
                  <summary class="cursor-pointer text-sm text-slate-600 hover:text-slate-800 font-medium">
                    {{ t('budget.showAllPlans') }} ({{ budgetStore.plans.length }})
                  </summary>
                  <div class="mt-3 space-y-2">
                    <div
                      v-for="plan in budgetStore.plans"
                      :key="plan.id"
                      class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div class="flex items-center gap-3">
                        <CategoryIcon :category="plan.category" size="sm" />
                        <div>
                          <p class="font-medium text-slate-800">
                            {{ t(`budget.expenseCategories.${plan.category}`) }}
                          </p>
                          <p class="text-sm text-slate-600">
                            {{ plan.recurrent ? t('budget.monthly') : plan.month }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="font-semibold text-slate-800">
                          {{ plan.amount.toFixed(2) }}
                        </span>
                        <button
                          @click="handleDeletePlan(plan.id)"
                          class="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </details>
          </template>
        </div>
      </div>
    </main>
    <Footer />

    <!-- Manage Households Modal -->
    <ManageHouseholdsModal
      v-if="showManageModal"
      @close="showManageModal = false"
    />
  </div>
</template>
