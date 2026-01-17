<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import ShoppingCategoryIcon from './ShoppingCategoryIcon.vue'
import type { ShoppingItem } from '@/types/shopping.types'

interface Props {
  item: ShoppingItem
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border transition-all',
      item.checked ? 'border-green-200 bg-green-50' : 'border-gray-100'
    ]"
  >
    <div class="flex items-center space-x-4">
      <input
        type="checkbox"
        :checked="item.checked"
        @change="emit('toggle', item.id)"
        class="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
      />
      <div
        v-if="item.category"
        class="flex-shrink-0"
      >
        <ShoppingCategoryIcon :category="item.category" size="md" />
      </div>
      <div>
        <p
          :class="[
            'font-medium',
            item.checked ? 'text-slate-400 line-through' : 'text-slate-800'
          ]"
        >
          {{ item.name }}
        </p>
        <p class="text-sm text-slate-500">
          {{ item.quantity }}{{ item.unit ? ` ${item.unit}` : '' }}
        </p>
      </div>
    </div>
    <button
      @click="emit('delete', item.id)"
      class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <TrashIcon class="w-5 h-5" />
    </button>
  </div>
</template>
