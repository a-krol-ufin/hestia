<script setup lang="ts">
import ShoppingItemRow from './ShoppingItemRow.vue'
import ShoppingEmptyState from './ShoppingEmptyState.vue'
import type { ShoppingItem, ShoppingUnit } from '@/types/shopping.types'

interface Props {
  items: ShoppingItem[]
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, data: { name?: string; quantity?: number; unit?: ShoppingUnit }]
}>()
</script>

<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex justify-center py-12">
    <div class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
  </div>

  <!-- Empty state -->
  <ShoppingEmptyState v-else-if="items.length === 0" />

  <!-- Items list -->
  <div v-else>
    <ShoppingItemRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      @toggle="emit('toggle', $event)"
      @delete="emit('delete', $event)"
      @update="(id, data) => emit('update', id, data)"
    />
  </div>
</template>
