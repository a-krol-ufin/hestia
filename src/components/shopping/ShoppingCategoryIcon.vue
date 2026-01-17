<script setup lang="ts">
import {
  SparklesIcon,
  CakeIcon,
  FireIcon,
  BeakerIcon,
  HeartIcon,
  HomeModernIcon,
  ShoppingBagIcon,
  CubeIcon,
  GlobeAltIcon,
  ArchiveBoxIcon,
  BoltIcon,
  FaceSmileIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
  PaintBrushIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/vue/24/outline'
import type { ShoppingCategory } from '@/types/shopping.types'

interface Props {
  category: ShoppingCategory
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const iconMap: Record<ShoppingCategory, unknown> = {
  fruits: SparklesIcon,
  vegetables: GlobeAltIcon,
  meat: FireIcon,
  fish: ScaleIcon,
  dairy: CakeIcon,
  bread: BuildingStorefrontIcon,
  grains: ArchiveBoxIcon,
  pasta: CubeIcon,
  canned: ArchiveBoxIcon,
  frozen: BoltIcon,
  snacks: ShoppingBagIcon,
  sweets: CakeIcon,
  beverages: BeakerIcon,
  alcohol: BeakerIcon,
  spices: SparklesIcon,
  oils: BeakerIcon,
  sauces: BeakerIcon,
  baking: CakeIcon,
  baby: HeartIcon,
  pet: HeartIcon,
  cleaning: SparklesIcon,
  hygiene: FaceSmileIcon,
  cosmetics: PaintBrushIcon,
  health: HeartIcon,
  household: HomeModernIcon,
  other: EllipsisHorizontalCircleIcon,
}

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
