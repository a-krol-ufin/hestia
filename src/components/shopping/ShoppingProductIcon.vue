<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as LucideIcons from 'lucide-vue-next'
import { PREDEFINED_PRODUCTS } from '@/data/products'
import ShoppingCategoryIcon from './ShoppingCategoryIcon.vue'
import type { ShoppingCategory } from '@/types/shopping.types'

interface Props {
  productName: string
  category?: ShoppingCategory
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { locale } = useI18n({ useScope: 'global' })

// Find matching product by name
const matchingProduct = computed(() => {
  return PREDEFINED_PRODUCTS.find((product) => {
    const productNameToMatch = locale.value === 'pl' ? product.name : product.nameEn
    return productNameToMatch.toLowerCase() === props.productName.toLowerCase()
  })
})

// Get icon component from Lucide
const LucideIconComponent = computed(() => {
  if (!matchingProduct.value) return null

  const iconName = matchingProduct.value.icon
  // @ts-ignore - Dynamic icon lookup
  return LucideIcons[iconName] || null
})

// Get category for color mapping
const productCategory = computed(() => {
  return matchingProduct.value?.category || props.category || 'other'
})

// Color map matching category colors
const colorMap: Record<ShoppingCategory, string> = {
  fruits: 'text-orange-500',
  vegetables: 'text-green-600',
  meat: 'text-red-600',
  fish: 'text-blue-500',
  dairy: 'text-yellow-500',
  bread: 'text-amber-600',
  grains: 'text-yellow-600',
  pasta: 'text-amber-500',
  canned: 'text-slate-500',
  frozen: 'text-cyan-500',
  snacks: 'text-orange-600',
  sweets: 'text-pink-500',
  beverages: 'text-blue-400',
  alcohol: 'text-purple-600',
  spices: 'text-rose-600',
  oils: 'text-yellow-700',
  sauces: 'text-red-500',
  baking: 'text-amber-500',
  baby: 'text-pink-400',
  pet: 'text-green-500',
  cleaning: 'text-blue-600',
  hygiene: 'text-teal-500',
  cosmetics: 'text-purple-500',
  health: 'text-red-400',
  household: 'text-slate-600',
  other: 'text-slate-400',
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
}

const colorClass = computed(() => colorMap[productCategory.value])
const iconSize = computed(() => sizeMap[props.size])
</script>

<template>
  <!-- Show Lucide icon if product found -->
  <component
    v-if="LucideIconComponent"
    :is="LucideIconComponent"
    :size="iconSize"
    :class="colorClass"
    :stroke-width="2"
  />
  <!-- Fallback to category icon -->
  <ShoppingCategoryIcon
    v-else-if="category"
    :category="category"
    :size="size"
  />
</template>
