import { defineStore } from 'pinia'
import { ref } from 'vue'
import { shoppingService } from '@/services/shopping.service'
import type { ShoppingItem, CreateShoppingItem, UpdateShoppingItem } from '@/types/shopping.types'

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    isLoading.value = true
    error.value = null
    items.value = await shoppingService.getItems()
    isLoading.value = false
  }

  async function addItem(item: CreateShoppingItem) {
    error.value = null

    const normalizedName = item.name.trim().toLowerCase()
    const existingItem = items.value.find(
      i => i.name.trim().toLowerCase() === normalizedName && !i.checked
    )

    if (existingItem) {
      const newQuantity = existingItem.quantity + (item.quantity || 1)
      const updated = await shoppingService.updateItem(existingItem.id, { quantity: newQuantity })
      if (updated) {
        const index = items.value.findIndex(i => i.id === existingItem.id)
        if (index !== -1) {
          items.value[index] = updated
        }
      } else {
        error.value = 'Failed to update item quantity'
      }
    } else {
      const newItem = await shoppingService.addItem(item)
      if (newItem) {
        items.value.unshift(newItem)
      } else {
        error.value = 'Failed to add item'
      }
    }
  }

  async function deleteItem(id: string) {
    error.value = null
    const success = await shoppingService.deleteItem(id)
    if (success) {
      items.value = items.value.filter(item => item.id !== id)
    } else {
      error.value = 'Failed to delete item'
    }
  }

  async function updateItem(id: string, data: UpdateShoppingItem) {
    error.value = null
    const updated = await shoppingService.updateItem(id, data)
    if (updated) {
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) {
        items.value[index] = updated
      }
    } else {
      error.value = 'Failed to update item'
    }
  }

  async function toggleItem(id: string) {
    const item = items.value.find(i => i.id === id)
    if (!item) return

    const updated = await shoppingService.toggleChecked(id, item.checked)
    if (updated) {
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) {
        items.value[index] = updated
      }
    }
  }

  function clearItems() {
    items.value = []
    error.value = null
  }

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    clearItems,
  }
})
