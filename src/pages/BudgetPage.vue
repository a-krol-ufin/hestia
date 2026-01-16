<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import { ArrowLeftIcon, ChartPieIcon, TrashIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import BudgetChart from '@/components/budget/BudgetChart.vue'
import BudgetEntryForm from '@/components/budget/BudgetEntryForm.vue'
import BudgetPlanForm from '@/components/budget/BudgetPlanForm.vue'
import BudgetCategoryProgress from '@/components/budget/BudgetCategoryProgress.vue'
import CategoryIcon from '@/components/budget/CategoryIcon.vue'
import type { CreateBudgetEntry, CreateBudgetPlan } from '@/types/budget.types'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const budgetStore = useBudgetStore()

const showPlanForm = ref(false)
const newHouseholdName = ref('')
const showHouseholdForm = ref(false)

onMounted(async () => {
  await budgetStore.fetchHouseholds()

  // If no household exists, show form to create one
  if (budgetStore.households.length === 0) {
    showHouseholdForm.value = true
  }
})

const groupedEntries = computed(() => {
  const groups: Record<string, typeof budgetStore.entries> = {}

  budgetStore.entries.forEach(entry => {
    const date = entry.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(entry)
  })

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
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

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
        <!-- Header -->
        <div class="mb-8">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-slate-600 hover:text-orange-500 transition-colors mb-4"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>{{ t('budget.back') }}</span>
          </button>

          <div class="flex items-center space-x-3">
            <div class="bg-orange-100 p-3 rounded-lg">
              <ChartPieIcon class="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-slate-800">{{ t('budget.title') }}</h1>
              <p v-if="budgetStore.currentHousehold" class="text-slate-600">
                {{ budgetStore.currentHousehold.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- No household - create one -->
        <div v-if="showHouseholdForm && budgetStore.households.length === 0"
             class="max-w-md mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-6">
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
                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {{ t('budget.createHouseholdButton') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Main budget view -->
        <div v-else-if="budgetStore.currentHousehold" class="space-y-6">
          <!-- Loading state -->
          <div v-if="budgetStore.isLoading" class="text-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          </div>

          <template v-else>
            <!-- Summary -->
            <BudgetSummary
              :total-income="budgetStore.monthlySummary.totalIncome"
              :total-expenses="budgetStore.monthlySummary.totalExpenses"
              :total-planned="budgetStore.monthlySummary.totalPlanned"
              :balance="budgetStore.monthlySummary.balance"
              :available-balance="budgetStore.monthlySummary.availableBalance"
              :month="budgetStore.currentMonth"
              @previous-month="budgetStore.goToPreviousMonth"
              @next-month="budgetStore.goToNextMonth"
            />

            <!-- Two column layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left column: Chart and Plans -->
              <div class="space-y-6">
                <!-- Chart -->
                <BudgetChart
                  :expenses-by-category="budgetStore.monthlySummary.expensesByCategory"
                />

                <!-- Budget Plans -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-slate-800">
                      {{ t('budget.plans') }}
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
              </div>

              <!-- Right column: Entry form and entries list -->
              <div class="space-y-6">
                <!-- Add entry form -->
                <BudgetEntryForm @submit="handleAddEntry" />

                <!-- Entries list -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    {{ t('budget.entries') }}
                  </h3>

                  <div v-if="budgetStore.entries.length === 0" class="text-center py-12">
                    <ChartPieIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p class="text-slate-500">{{ t('budget.empty') }}</p>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="[date, entries] in groupedEntries"
                      :key="date"
                      class="space-y-2"
                    >
                      <h4 class="text-sm font-medium text-slate-600 mb-2">
                        {{ formatDate(date) }}
                      </h4>

                      <div
                        v-for="entry in entries"
                        :key="entry.id"
                        class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div class="flex items-center gap-3 flex-1">
                          <CategoryIcon :category="entry.category" size="sm" />
                          <div class="flex-1">
                            <p class="font-medium text-slate-800">
                              {{ entry.type === 'expense' ? t(`budget.expenseCategories.${entry.category}`) : t(`budget.incomeCategories.${entry.category}`) }}
                            </p>
                            <p v-if="entry.description" class="text-sm text-slate-600">
                              {{ entry.description }}
                            </p>
                          </div>
                        </div>

                        <div class="flex items-center gap-3">
                          <span
                            :class="[
                              'font-semibold',
                              entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                            ]"
                          >
                            {{ entry.type === 'income' ? '+' : '-' }}{{ entry.amount.toFixed(2) }}
                          </span>
                          <button
                            @click="handleDeleteEntry(entry.id)"
                            class="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon class="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
