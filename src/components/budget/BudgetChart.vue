<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExpenseCategory } from '@/types/budget.types'
import CategoryIcon from './CategoryIcon.vue'

interface Props {
  expensesByCategory: Record<ExpenseCategory, number>
}

const props = defineProps<Props>()
const { t } = useI18n({ useScope: 'global' })

const colorMap: Record<ExpenseCategory, string> = {
  food: '#f97316',      // orange-500
  bills: '#3b82f6',     // blue-500
  transport: '#22c55e', // green-500
  entertainment: '#a855f7', // purple-500
  health: '#ef4444',    // red-500
  clothing: '#ec4899',  // pink-500
  education: '#6366f1', // indigo-500
  other: '#64748b',     // slate-500
}

const total = computed(() => {
  return Object.values(props.expensesByCategory).reduce((sum, val) => sum + val, 0)
})

const chartData = computed(() => {
  const categories = Object.keys(props.expensesByCategory) as ExpenseCategory[]
  const data = categories
    .map(cat => ({
      category: cat,
      amount: props.expensesByCategory[cat],
      percentage: total.value > 0 ? (props.expensesByCategory[cat] / total.value) * 100 : 0,
      color: colorMap[cat],
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  // Calculate cumulative percentages for pie chart
  let cumulative = 0
  return data.map(item => {
    const startAngle = (cumulative / 100) * 360
    cumulative += item.percentage
    const endAngle = (cumulative / 100) * 360
    return {
      ...item,
      startAngle,
      endAngle,
    }
  })
})

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ")
}
</script>

<template>
  <div class="bg-white rounded-3xl shadow-sm p-6">
    <h3 class="text-lg font-semibold text-slate-800 mb-4">
      {{ t('budget.expensesByCategory') }}
    </h3>

    <div v-if="total === 0" class="text-center py-12 text-slate-500">
      {{ t('budget.noExpenses') }}
    </div>

    <div v-else class="space-y-6">
      <!-- Pie Chart -->
      <div class="flex justify-center">
        <svg viewBox="0 0 200 200" class="w-48 h-48">
          <path
            v-for="(item, index) in chartData"
            :key="index"
            :d="describeArc(100, 100, 80, item.startAngle, item.endAngle)"
            :fill="item.color"
            class="transition-opacity hover:opacity-80 cursor-pointer"
          />
          <!-- Center circle with glassmorphism effect -->
          <circle cx="100" cy="100" r="50" fill="white" />
          <text
            x="100"
            y="95"
            text-anchor="middle"
            class="text-2xl font-bold fill-slate-800"
          >
            {{ total.toFixed(0) }}
          </text>
          <text
            x="100"
            y="110"
            text-anchor="middle"
            class="text-xs fill-slate-500"
          >
            {{ t('budget.totalExpenses') }}
          </text>
        </svg>
      </div>

      <!-- Legend -->
      <div class="space-y-1">
        <div
          v-for="item in chartData"
          :key="item.category"
          class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: item.color }"
            />
            <CategoryIcon :category="item.category" size="sm" />
            <span class="text-sm font-medium text-slate-700">
              {{ t(`budget.expenseCategories.${item.category}`) }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-500">
              {{ item.percentage.toFixed(0) }}%
            </span>
            <span class="text-sm font-semibold text-slate-800 min-w-[60px] text-right">
              {{ item.amount.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
