<script setup lang="ts">
import {
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon,
  HeartIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/vue/24/outline'
import type { BudgetCategory } from '@/types/budget.types'

interface Props {
  category: BudgetCategory
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const iconMap = {
  food: ShoppingBagIcon,
  bills: HomeIcon,
  transport: TruckIcon,
  entertainment: FilmIcon,
  health: HeartIcon,
  clothing: ShoppingCartIcon,
  education: AcademicCapIcon,
  other: EllipsisHorizontalCircleIcon,
}

const colorMap = {
  food: 'text-orange-500',
  bills: 'text-blue-500',
  transport: 'text-green-500',
  entertainment: 'text-purple-500',
  health: 'text-red-500',
  clothing: 'text-pink-500',
  education: 'text-indigo-500',
  other: 'text-slate-500',
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const IconComponent = iconMap[props.category]
const colorClass = colorMap[props.category]
const sizeClass = sizeMap[props.size]
</script>

<template>
  <component :is="IconComponent" :class="[colorClass, sizeClass]" />
</template>
