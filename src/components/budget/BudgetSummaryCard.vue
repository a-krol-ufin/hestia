<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: number
  variant: 'balance' | 'income' | 'expense'
  trend?: string
}

const props = defineProps<Props>()

const cardClass = computed(() => {
  const base = 'budget-summary-card'
  switch (props.variant) {
    case 'balance':
      return `${base} budget-summary-card--balance`
    case 'income':
      return `${base} budget-summary-card--income`
    case 'expense':
      return `${base} budget-summary-card--expense`
    default:
      return base
  }
})

const valueClass = computed(() => {
  switch (props.variant) {
    case 'balance':
      return 'text-white'
    case 'income':
      return 'text-emerald-600'
    case 'expense':
      return 'text-rose-600'
    default:
      return 'text-slate-800'
  }
})

const labelClass = computed(() => {
  return props.variant === 'balance' ? 'text-slate-300' : 'text-slate-500'
})

const formattedValue = computed(() => {
  return props.value.toFixed(2)
})
</script>

<template>
  <div :class="cardClass">
    <p :class="['text-sm font-medium mb-1', labelClass]">
      {{ label }}
    </p>
    <p :class="['text-2xl font-bold', valueClass]">
      {{ formattedValue }}
    </p>
    <p v-if="trend" :class="['text-xs mt-2', labelClass]">
      {{ trend }}
    </p>
  </div>
</template>
