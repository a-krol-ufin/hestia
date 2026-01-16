<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import type { BudgetCategory, CreateBudgetPlan } from '@/types/budget.types'

const emit = defineEmits<{
  submit: [plan: CreateBudgetPlan]
}>()

const { t } = useI18n({ useScope: 'global' })

const category = ref<BudgetCategory>('food')
const amount = ref<number>(0)
const month = ref<string>(new Date().toISOString().slice(0, 7))
const recurrent = ref<boolean>(false)

const categories: BudgetCategory[] = [
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
            {{ t(`budget.categories.${cat}`) }}
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
      <div class="flex items-center gap-3">
        <input
          v-model="recurrent"
          type="checkbox"
          id="recurrent"
          class="w-5 h-5 text-orange-500 border-slate-300 rounded focus:ring-2 focus:ring-orange-200"
        />
        <label for="recurrent" class="text-sm font-medium text-slate-700 cursor-pointer">
          {{ t('budget.recurrent') }}
        </label>
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
