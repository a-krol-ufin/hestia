<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { MagnifyingGlassIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline'
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
  } else if (event.key === 'Enter' && selectedIndex.value === -1) {
    event.preventDefault()
    handleSubmit()
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

function incrementQuantity() {
  quantity.value = Math.round((quantity.value + 1) * 100) / 100
}

function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value = Math.round((quantity.value - 1) * 100) / 100
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
  <form @submit.prevent="handleSubmit" class="autocomplete-container">
    <div class="shopping-input-bar">
      <MagnifyingGlassIcon class="shopping-input-bar__icon" />

      <input
        ref="inputRef"
        v-model="name"
        type="text"
        :placeholder="t('shopping.inputPlaceholder')"
        @keydown="handleKeydown"
        class="shopping-input-bar__input"
      />

      <div class="shopping-input-bar__actions">
        <!-- Quantity selector -->
        <div class="shopping-input-bar__quantity">
          <button
            type="button"
            @click="decrementQuantity"
            class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-orange-500 transition"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
          <input
            v-model.number="quantity"
            type="number"
            min="0.01"
            step="0.01"
            class="w-12 text-center bg-transparent border-none focus:ring-0 text-slate-700 font-medium"
          />
          <button
            type="button"
            @click="incrementQuantity"
            class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-orange-500 transition"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Add button -->
        <button
          type="submit"
          :disabled="!name.trim()"
          class="shopping-input-bar__add-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Autocomplete dropdown -->
      <div
        v-if="showDropdown && (filteredProducts.length > 0 || showOtherOption)"
        class="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-50"
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
  </form>
</template>
