<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BudgetSummaryCard from './BudgetSummaryCard.vue'

interface Props {
  balance: number
  totalIncome: number
  totalExpenses: number
}

defineProps<Props>()
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="budget-summary-grid">
    <BudgetSummaryCard
      :label="t('budget.balance')"
      :value="balance"
      variant="balance"
    />
    <BudgetSummaryCard
      :label="t('budget.totalIncome')"
      :value="totalIncome"
      variant="income"
    />
    <BudgetSummaryCard
      :label="t('budget.totalExpenses')"
      :value="totalExpenses"
      variant="expense"
    />
  </div>
</template>
