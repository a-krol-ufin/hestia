<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import type { ExpenseCategory, CreateBudgetPlan } from '@/types/budget.types'

const emit = defineEmits<{
  submit: [plan: CreateBudgetPlan]
}>()

const { t } = useI18n({ useScope: 'global' })

const category = ref<ExpenseCategory>('food')
const amount = ref<number>(0)
const month = ref<string>(new Date().toISOString().slice(0, 7))
const recurrent = ref<boolean>(false)

const categories: ExpenseCategory[] = [
  'food',
  'bills',
  'transport',
  'entertainment',
  'health',
  'clothing',
  'education',
  'other',
]

function handleSubmit() {
  if (amount.value <= 0) return

  emit('submit', {
    category: category.value,
    amount: amount.value,
    month: month.value,
    recurrent: recurrent.value,
  })

  // Reset form
  amount.value = 0
  month.value = new Date().toISOString().slice(0, 7)
  recurrent.value = false
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-slate-800 mb-4">
      {{ t('budget.addPlan') }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Category selector -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.category') }}
        </label>
        <select
          v-model="category"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        >
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ t(`budget.expenseCategories.${cat}`) }}
          </option>
        </select>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.plannedAmount') }}
        </label>
        <input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          required
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          :placeholder="t('budget.amountPlaceholder')"
        />
      </div>

      <!-- Month -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.month') }}
        </label>
        <input
          v-model="month"
          type="month"
          required
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        />
      </div>

      <!-- Recurrent -->
      <div class="border-2 border-dashed border-orange-200 rounded-lg p-4 bg-orange-50/50">
        <div class="flex items-start gap-3">
          <input
            v-model="recurrent"
            type="checkbox"
            id="recurrent"
            class="w-5 h-5 mt-0.5 text-orange-500 border-slate-300 rounded focus:ring-2 focus:ring-orange-200"
          />
          <div class="flex-1">
            <label for="recurrent" class="text-sm font-semibold text-slate-800 cursor-pointer block mb-1">
              {{ t('budget.recurrent') }}
            </label>
            <p class="text-xs text-slate-600">
              {{ t('budget.recurrentDescription') }}
            </p>
          </div>
        </div>
        <div v-if="recurrent" class="mt-3 pt-3 border-t border-orange-200">
          <p class="text-xs text-orange-700 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t('budget.recurrentNote') }}
          </p>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="amount <= 0"
        class="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        {{ t('budget.addPlanButton') }}
      </button>
    </form>
  </div>
</template>
