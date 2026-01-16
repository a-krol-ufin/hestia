<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CategoryProgress } from '@/types/budget.types'
import CategoryIcon from './CategoryIcon.vue'

interface Props {
  progress: CategoryProgress
}

const props = defineProps<Props>()
const { t } = useI18n({ useScope: 'global' })

const progressColor = computed(() => {
  if (props.progress.percentage < 75) return 'bg-green-500'
  if (props.progress.percentage < 100) return 'bg-yellow-500'
  return 'bg-red-500'
})

const progressBarColor = computed(() => {
  if (props.progress.percentage < 75) return 'bg-green-100'
  if (props.progress.percentage < 100) return 'bg-yellow-100'
  return 'bg-red-100'
})

const statusText = computed(() => {
  if (props.progress.remaining > 0) {
    return t('budget.underBudget')
  } else if (props.progress.remaining === 0) {
    return t('budget.onBudget')
  } else {
    return t('budget.overBudget')
  }
})

const statusColor = computed(() => {
  if (props.progress.remaining > 0) return 'text-green-600'
  if (props.progress.remaining === 0) return 'text-slate-600'
  return 'text-red-600'
})
</script>

<template>
  <div class="bg-white rounded-lg p-4 border border-slate-200">
    <!-- Category header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <CategoryIcon :category="progress.category" size="sm" />
        <span class="font-medium text-slate-800">
          {{ t(`budget.expenseCategories.${progress.category}`) }}
        </span>
      </div>
      <span :class="['text-sm font-medium', statusColor]">
        {{ statusText }}
      </span>
    </div>

    <!-- Progress bar -->
    <div :class="['w-full h-3 rounded-full mb-2', progressBarColor]">
      <div
        :class="['h-full rounded-full transition-all duration-300', progressColor]"
        :style="{ width: `${Math.min(progress.percentage, 100)}%` }"
      />
    </div>

    <!-- Stats -->
    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-4">
        <span class="text-slate-600">
          {{ t('budget.spent') }}: <span class="font-semibold text-slate-800">{{ progress.spent.toFixed(2) }}</span>
        </span>
        <span class="text-slate-600">
          {{ t('budget.planned') }}: <span class="font-semibold text-slate-800">{{ progress.planned.toFixed(2) }}</span>
        </span>
      </div>
      <span class="font-semibold" :class="statusColor">
        {{ progress.percentage.toFixed(0) }}%
      </span>
    </div>

    <!-- Remaining amount -->
    <div class="mt-2 text-xs text-slate-500">
      {{ t('budget.remaining') }}:
      <span :class="['font-semibold', statusColor]">
        {{ Math.abs(progress.remaining).toFixed(2) }}
        {{ progress.remaining < 0 ? t('budget.over') : '' }}
      </span>
    </div>
  </div>
</template>
