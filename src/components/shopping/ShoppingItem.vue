<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import ShoppingProductIcon from './ShoppingProductIcon.vue'
import type { ShoppingItem, ShoppingUnit } from '@/types/shopping.types'

interface Props {
  item: ShoppingItem
}

const props = defineProps<Props>()

const { t } = useI18n({ useScope: 'global' })

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, data: { name?: string; quantity?: number; unit?: ShoppingUnit }]
}>()

const isEditing = ref(false)
const editName = ref('')
const editQuantity = ref(0)
const editUnit = ref<ShoppingUnit>('szt')

const AVAILABLE_UNITS: ShoppingUnit[] = ['kg', 'g', 'l', 'ml', 'szt', 'op']

function startEdit() {
  editName.value = props.item.name
  editQuantity.value = props.item.quantity
  editUnit.value = props.item.unit || 'szt'
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  emit('update', props.item.id, {
    name: editName.value.trim(),
    quantity: editQuantity.value,
    unit: editUnit.value,
  })
  isEditing.value = false
}
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border transition-all',
      item.checked ? 'border-green-200 bg-green-50' : 'border-gray-100'
    ]"
  >
    <!-- Normal view -->
    <div v-if="!isEditing" class="flex items-center space-x-4 flex-1">
      <input
        type="checkbox"
        :checked="item.checked"
        @change="emit('toggle', item.id)"
        class="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
      />
      <div class="flex-shrink-0">
        <ShoppingProductIcon :product-name="item.name" :category="item.category" size="md" />
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
          {{ item.quantity }}{{ item.unit ? ` ${t(`shopping.units.${item.unit}`)}` : '' }}
        </p>
      </div>
    </div>

    <!-- Edit view -->
    <div v-else class="flex items-center gap-2 flex-1">
      <input
        v-model="editName"
        type="text"
        class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
      />
      <input
        v-model.number="editQuantity"
        type="number"
        min="0.01"
        step="0.01"
        class="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-center"
      />
      <select
        v-model="editUnit"
        class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
      >
        <option v-for="unit in AVAILABLE_UNITS" :key="unit" :value="unit">
          {{ t(`shopping.units.${unit}`) }}
        </option>
      </select>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-2">
      <template v-if="!isEditing">
        <button
          @click="startEdit"
          class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
        <button
          @click="emit('delete', item.id)"
          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </template>
      <template v-else>
        <button
          @click="saveEdit"
          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <CheckIcon class="w-5 h-5" />
        </button>
        <button
          @click="cancelEdit"
          class="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </template>
    </div>
  </div>
</template>
