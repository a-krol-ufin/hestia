<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrashIcon } from '@heroicons/vue/24/outline'
import CategoryIcon from './CategoryIcon.vue'
import type { BudgetEntry } from '@/types/budget.types'

interface Props {
  entry: BudgetEntry
}

const props = defineProps<Props>()
const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n({ useScope: 'global' })

const categoryLabel = computed(() => {
  if (props.entry.type === 'expense') {
    return t(`budget.expenseCategories.${props.entry.category}`)
  }
  return t(`budget.incomeCategories.${props.entry.category}`)
})

const amountClass = computed(() => {
  return props.entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
})

const formattedAmount = computed(() => {
  const prefix = props.entry.type === 'income' ? '+' : '-'
  return `${prefix}${props.entry.amount.toFixed(2)}`
})

function handleDelete() {
  emit('delete', props.entry.id)
}
</script>

<template>
  <div class="budget-transaction-item">
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
        <CategoryIcon :category="entry.category" size="sm" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-slate-800 truncate">
          {{ categoryLabel }}
        </p>
        <p v-if="entry.description" class="text-sm text-slate-500 truncate">
          {{ entry.description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3 flex-shrink-0">
      <span :class="['font-semibold', amountClass]">
        {{ formattedAmount }}
      </span>
      <button
        @click="handleDelete"
        class="text-slate-400 hover:text-rose-500 transition-colors p-1"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
