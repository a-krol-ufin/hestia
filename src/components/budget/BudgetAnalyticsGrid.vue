<script setup lang="ts">
import BudgetChart from './BudgetChart.vue'
import BudgetTransactionList from './BudgetTransactionList.vue'
import type { BudgetEntry, ExpenseCategory } from '@/types/budget.types'

interface Props {
  expensesByCategory: Record<ExpenseCategory, number>
  entries: BudgetEntry[]
}

defineProps<Props>()
const emit = defineEmits<{
  'delete-entry': [id: string]
}>()

function handleDeleteEntry(id: string) {
  emit('delete-entry', id)
}
</script>

<template>
  <div class="budget-analytics-grid">
    <!-- Chart - 1 column -->
    <div class="lg:col-span-1">
      <BudgetChart :expenses-by-category="expensesByCategory" />
    </div>

    <!-- Transaction list - 2 columns -->
    <div class="lg:col-span-2">
      <BudgetTransactionList
        :entries="entries"
        @delete-entry="handleDeleteEntry"
      />
    </div>
  </div>
</template>
