<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { CreateBudgetEntry, ExpenseCategory, IncomeCategory, BudgetCategory, EntryType } from '@/types/budget.types'

interface Props {
  expenseCategories: ExpenseCategory[]
  incomeCategories: IncomeCategory[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [entry: CreateBudgetEntry]
}>()

const { t } = useI18n({ useScope: 'global' })

const type = ref<EntryType>('expense')
const amount = ref<number | null>(null)
const category = ref<BudgetCategory>('food')

const categories = computed<BudgetCategory[]>(() => {
  return type.value === 'expense' ? props.expenseCategories : props.incomeCategories
})

// Reset category when type changes
watch(type, (newType) => {
  if (newType === 'expense') {
    category.value = props.expenseCategories[0] || 'food'
  } else {
    category.value = props.incomeCategories[0] || 'salary'
  }
})

function handleSubmit() {
  if (!amount.value || amount.value <= 0) return

  emit('submit', {
    type: type.value,
    category: category.value,
    amount: amount.value,
    date: new Date().toISOString().slice(0, 10),
  })

  // Reset form
  amount.value = null
}

function getCategoryLabel(cat: BudgetCategory): string {
  if (type.value === 'expense') {
    return t(`budget.expenseCategories.${cat}`)
  }
  return t(`budget.incomeCategories.${cat}`)
}
</script>

<template>
  <div class="budget-quick-action-bar">
    <!-- Type toggle -->
    <div class="budget-type-toggle flex-shrink-0">
      <button
        type="button"
        @click="type = 'expense'"
        :class="[
          'budget-type-toggle__btn',
          type === 'expense'
            ? 'budget-type-toggle__btn--active-expense'
            : 'budget-type-toggle__btn--inactive'
        ]"
      >
        {{ t('budget.expense') }}
      </button>
      <button
        type="button"
        @click="type = 'income'"
        :class="[
          'budget-type-toggle__btn',
          type === 'income'
            ? 'budget-type-toggle__btn--active-income'
            : 'budget-type-toggle__btn--inactive'
        ]"
      >
        {{ t('budget.income') }}
      </button>
    </div>

    <!-- Divider -->
    <div class="hidden md:block w-px h-8 bg-slate-200 mx-4"></div>

    <!-- Amount input -->
    <div class="flex items-center my-2 md:my-0">
      <input
        v-model.number="amount"
        type="number"
        min="0"
        step="0.01"
        class="budget-amount-input"
        :placeholder="t('budget.amountPlaceholder')"
      />
    </div>

    <!-- Divider -->
    <div class="hidden md:block w-px h-8 bg-slate-200 mx-4"></div>

    <!-- Category select -->
    <select
      v-model="category"
      class="budget-category-select"
    >
      <option v-for="cat in categories" :key="cat" :value="cat">
        {{ getCategoryLabel(cat) }}
      </option>
    </select>

    <!-- Submit button -->
    <button
      @click="handleSubmit"
      :disabled="!amount || amount <= 0"
      class="budget-btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mt-2 md:mt-0"
    >
      <PlusIcon class="w-5 h-5" />
      <span>{{ t('budget.addButton') }}</span>
    </button>
  </div>
</template>
