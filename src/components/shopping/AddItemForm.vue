<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { PREDEFINED_PRODUCTS } from '@/data/products'
import ShoppingProductIcon from './ShoppingProductIcon.vue'
import type { ShoppingCategory, ShoppingUnit, PredefinedProduct } from '@/types/shopping.types'

const { t, locale } = useI18n({ useScope: 'global' })

const name = ref('')
const quantity = ref(1)
const selectedUnit = ref<ShoppingUnit>('szt')
const selectedCategory = ref<ShoppingCategory | undefined>()
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const inputRef = ref<HTMLInputElement>()

const AVAILABLE_UNITS: ShoppingUnit[] = ['kg', 'g', 'l', 'ml', 'szt', 'op']

const emit = defineEmits<{
  add: [item: { name: string; quantity: number; unit?: ShoppingUnit; category?: ShoppingCategory }]
}>()

// Filter products based on input
const filteredProducts = computed(() => {
  if (!name.value.trim()) return []

  const searchTerm = name.value.toLowerCase()
  const products = PREDEFINED_PRODUCTS.filter((product) => {
    const productName = locale.value === 'pl' ? product.name : product.nameEn
    return productName.toLowerCase().includes(searchTerm)
  })

  // Limit to 8 results
  return products.slice(0, 8)
})

// Show "Other" option when typing
const showOtherOption = computed(() => {
  return name.value.trim().length > 0
})

// Watch name changes to show/hide dropdown
watch(name, (newValue) => {
  if (newValue.trim().length > 0) {
    showDropdown.value = true
    selectedIndex.value = -1
  } else {
    showDropdown.value = false
    selectedCategory.value = undefined
  }
})

function selectProduct(product: PredefinedProduct) {
  const productName = locale.value === 'pl' ? product.name : product.nameEn
  name.value = productName
  selectedCategory.value = product.category
  showDropdown.value = false
  selectedIndex.value = -1

  // Set default unit and quantity
  if (product.defaultUnit) {
    selectedUnit.value = product.defaultUnit
    quantity.value = 1
  }
}

function selectOther() {
  selectedCategory.value = 'other'
  showDropdown.value = false
  selectedIndex.value = -1
  inputRef.value?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value) return

  const itemsCount = filteredProducts.value.length + (showOtherOption.value ? 1 : 0)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % itemsCount
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = selectedIndex.value <= 0 ? itemsCount - 1 : selectedIndex.value - 1
  } else if (event.key === 'Enter' && selectedIndex.value >= 0) {
    event.preventDefault()
    const product = filteredProducts.value[selectedIndex.value]
    if (selectedIndex.value < filteredProducts.value.length && product) {
      selectProduct(product)
    } else {
      selectOther()
    }
  } else if (event.key === 'Escape') {
    showDropdown.value = false
    selectedIndex.value = -1
  }
}

function handleSubmit() {
  if (!name.value.trim()) return

  emit('add', {
    name: name.value.trim(),
    quantity: quantity.value,
    unit: selectedUnit.value,
    category: selectedCategory.value,
  })

  name.value = ''
  quantity.value = 1
  selectedUnit.value = 'szt'
  selectedCategory.value = undefined
  showDropdown.value = false
  selectedIndex.value = -1
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.autocomplete-container')) {
    showDropdown.value = false
    selectedIndex.value = -1
  }
}

// Add click outside listener
watch(showDropdown, (isOpen) => {
  if (isOpen) {
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex gap-3">
    <div class="flex-1 relative autocomplete-container">
      <input
        ref="inputRef"
        v-model="name"
        type="text"
        :placeholder="t('shopping.addPlaceholder')"
        @keydown="handleKeydown"
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
      />

      <!-- Selected product/category indicator -->
      <div
        v-if="name && !showDropdown"
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <ShoppingProductIcon :product-name="name" :category="selectedCategory" size="sm" />
      </div>

      <!-- Autocomplete dropdown -->
      <div
        v-if="showDropdown && (filteredProducts.length > 0 || showOtherOption)"
        class="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-50"
      >
        <!-- Product suggestions -->
        <button
          v-for="(product, index) in filteredProducts"
          :key="`${product.category}-${product.name}`"
          type="button"
          @click="selectProduct(product)"
          class="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-b-0"
          :class="{ 'bg-orange-50': selectedIndex === index }"
        >
          <ShoppingProductIcon
            :product-name="locale === 'pl' ? product.name : product.nameEn"
            :category="product.category"
            size="md"
          />
          <div class="flex-1">
            <div class="font-medium text-slate-800">
              {{ locale === 'pl' ? product.name : product.nameEn }}
            </div>
            <div class="text-sm text-slate-500">
              {{ t(`shopping.categories.${product.category}`) }}
            </div>
          </div>
        </button>

        <!-- "Other" option -->
        <button
          v-if="showOtherOption"
          type="button"
          @click="selectOther"
          class="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-3 border-t border-slate-200"
          :class="{ 'bg-orange-50': selectedIndex === filteredProducts.length }"
        >
          <ShoppingProductIcon product-name="" category="other" size="md" />
          <div class="flex-1">
            <div class="font-medium text-slate-800">
              {{ name }}
            </div>
            <div class="text-sm text-slate-500">
              {{ t('shopping.categories.other') }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <input
      v-model.number="quantity"
      type="number"
      min="0.01"
      step="0.01"
      class="w-20 px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-center"
    />
    <select
      v-model="selectedUnit"
      class="px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
    >
      <option v-for="unit in AVAILABLE_UNITS" :key="unit" :value="unit">
        {{ t(`shopping.units.${unit}`) }}
      </option>
    </select>
    <button
      type="submit"
      :disabled="!name.trim()"
      class="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
    >
      <PlusIcon class="w-5 h-5" />
      <span>{{ t('shopping.addButton') }}</span>
    </button>
  </form>
</template>
