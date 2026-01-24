<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { ChartPieIcon } from '@heroicons/vue/24/outline'
import BudgetTransactionItem from './BudgetTransactionItem.vue'
import type { BudgetEntry } from '@/types/budget.types'

interface Props {
  entries: BudgetEntry[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'delete-entry': [id: string]
}>()

const { t } = useI18n({ useScope: 'global' })
const appStore = useAppStore()

const groupedEntries = computed(() => {
  const groups: Record<string, BudgetEntry[]> = {}

  props.entries.forEach(entry => {
    const date = entry.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(entry)
  })

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(appStore.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleDelete(id: string) {
  emit('delete-entry', id)
}
</script>

<template>
  <div class="budget-transaction-list">
    <h3 class="text-lg font-semibold text-slate-800 mb-4">
      {{ t('budget.entries') }}
    </h3>

    <div v-if="entries.length === 0" class="text-center py-12">
      <ChartPieIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p class="text-slate-500">{{ t('budget.empty') }}</p>
    </div>

    <div v-else class="space-y-1">
      <template v-for="[date, dateEntries] in groupedEntries" :key="date">
        <h4 class="budget-date-group">
          {{ formatDate(date) }}
        </h4>
        <BudgetTransactionItem
          v-for="entry in dateEntries"
          :key="entry.id"
          :entry="entry"
          @delete="handleDelete"
        />
      </template>
    </div>
  </div>
</template>
