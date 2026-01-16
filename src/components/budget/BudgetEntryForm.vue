<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import type { BudgetCategory, EntryType, CreateBudgetEntry, ExpenseCategory, IncomeCategory } from '@/types/budget.types'
import CategoryIcon from './CategoryIcon.vue'

const emit = defineEmits<{
  submit: [entry: CreateBudgetEntry]
}>()

const { t } = useI18n({ useScope: 'global' })

const type = ref<EntryType>('expense')
const category = ref<BudgetCategory>('food')
const amount = ref<number>(0)
const description = ref<string>('')
const date = ref<string>(new Date().toISOString().slice(0, 10))

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

const categories = computed<BudgetCategory[]>(() => {
  return type.value === 'expense' ? expenseCategories : incomeCategories
})

// Reset category when type changes
watch(type, (newType) => {
  if (newType === 'expense') {
    category.value = 'food'
  } else {
    category.value = 'salary'
  }
})

function handleSubmit() {
  if (amount.value <= 0) return

  emit('submit', {
    type: type.value,
    category: category.value,
    amount: amount.value,
    description: description.value || undefined,
    date: date.value,
  })

  // Reset form
  amount.value = 0
  description.value = ''
  date.value = new Date().toISOString().slice(0, 10)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-slate-800 mb-4">
      {{ t('budget.addEntry') }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Type selector -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.type') }}
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            @click="type = 'expense'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
              type === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            {{ t('budget.expense') }}
          </button>
          <button
            type="button"
            @click="type = 'income'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
              type === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            {{ t('budget.income') }}
          </button>
        </div>
      </div>

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
            {{ type === 'expense' ? t(`budget.expenseCategories.${cat}`) : t(`budget.incomeCategories.${cat}`) }}
          </option>
        </select>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.amount') }}
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

      <!-- Date -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.date') }}
        </label>
        <input
          v-model="date"
          type="date"
          required
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          {{ t('budget.description') }} ({{ t('budget.optional') }})
        </label>
        <input
          v-model="description"
          type="text"
          maxlength="500"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          :placeholder="t('budget.descriptionPlaceholder')"
        />
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="amount <= 0"
        class="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        {{ t('budget.addButton') }}
      </button>
    </form>
  </div>
</template>
