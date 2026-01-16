<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

interface Props {
  totalIncome: number
  totalExpenses: number
  totalPlanned: number
  balance: number
  availableBalance: number
  month: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  previousMonth: []
  nextMonth: []
}>()

const { t } = useI18n({ useScope: 'global' })

const formattedMonth = computed(() => {
  const [year = '', month = ''] = props.month.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
})

const balanceColor = computed(() => {
  if (props.availableBalance > 0) return 'text-green-600'
  if (props.availableBalance < 0) return 'text-red-600'
  return 'text-slate-600'
})

const balanceIcon = computed(() => {
  return props.availableBalance >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
})
</script>

<template>
  <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-6">
      <button
        @click="emit('previousMonth')"
        class="p-2 hover:bg-white/20 rounded-lg transition-colors"
        :aria-label="t('budget.previousMonth')"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>

      <h2 class="text-2xl font-bold">
        {{ formattedMonth }}
      </h2>

      <button
        @click="emit('nextMonth')"
        class="p-2 hover:bg-white/20 rounded-lg transition-colors"
        :aria-label="t('budget.nextMonth')"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Income -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <ArrowTrendingUpIcon class="w-5 h-5" />
          <span class="text-sm font-medium">{{ t('budget.income') }}</span>
        </div>
        <p class="text-2xl font-bold">
          {{ totalIncome.toFixed(2) }}
        </p>
      </div>

      <!-- Expenses -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <ArrowTrendingDownIcon class="w-5 h-5" />
          <span class="text-sm font-medium">{{ t('budget.expenses') }}</span>
        </div>
        <p class="text-2xl font-bold">
          {{ totalExpenses.toFixed(2) }}
        </p>
      </div>

      <!-- Planned -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <BanknotesIcon class="w-5 h-5" />
          <span class="text-sm font-medium">{{ t('budget.planned') }}</span>
        </div>
        <p class="text-2xl font-bold">
          {{ totalPlanned.toFixed(2) }}
        </p>
      </div>

      <!-- Available Balance -->
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <BanknotesIcon class="w-5 h-5" />
          <span class="text-sm font-medium">{{ t('budget.available') }}</span>
        </div>
        <p class="text-2xl font-bold flex items-center gap-2">
          <component :is="balanceIcon" class="w-6 h-6" />
          {{ availableBalance.toFixed(2) }}
        </p>
      </div>
    </div>
  </div>
</template>
