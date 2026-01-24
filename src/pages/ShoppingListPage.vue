<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShoppingStore } from '@/stores/shopping'
import { useHouseholdStore } from '@/stores/household'
import { HomeIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ShoppingHeader from '@/components/shopping/ShoppingHeader.vue'
import ShoppingInputBar from '@/components/shopping/ShoppingInputBar.vue'
import ShoppingQuickChips from '@/components/shopping/ShoppingQuickChips.vue'
import ShoppingListContainer from '@/components/shopping/ShoppingListContainer.vue'
import type { ShoppingCategory, ShoppingUnit } from '@/types/shopping.types'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const shoppingStore = useShoppingStore()
const householdStore = useHouseholdStore()

const currentHousehold = computed(() => householdStore.currentHousehold)
const hasHousehold = computed(() => householdStore.hasHouseholds)

onMounted(async () => {
  // Make sure we have households loaded
  if (!householdStore.hasHouseholds) {
    await householdStore.fetchHouseholds()
  }

  // If we have a household, fetch items (watcher in store handles this too)
  if (currentHousehold.value) {
    await shoppingStore.fetchItems()
  }
})

function handleAddItem(item: { name: string; quantity: number; unit?: ShoppingUnit; category?: ShoppingCategory }) {
  shoppingStore.addItem(item)
}

function handleQuickAdd(item: { name: string; category: ShoppingCategory }) {
  shoppingStore.addItem({
    name: item.name,
    quantity: 1,
    unit: 'szt',
    category: item.category,
  })
}

function handleUpdateItem(id: string, data: { name?: string; quantity?: number; unit?: ShoppingUnit }) {
  shoppingStore.updateItem(id, data)
}

function handleToggleItem(id: string) {
  shoppingStore.toggleItem(id)
}

function handleDeleteItem(id: string) {
  shoppingStore.deleteItem(id)
}

function goBack() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex flex-col">
    <Navbar />
    <main class="flex-grow pt-28">
      <div class="shopping-content mx-auto px-4">
        <!-- Header -->
        <ShoppingHeader @go-back="goBack" />

        <!-- No household selected -->
        <div v-if="!hasHousehold" class="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <HomeIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p class="text-slate-600 font-medium mb-2">{{ t('shopping.noHousehold') }}</p>
          <p class="text-slate-500 text-sm mb-4">{{ t('shopping.noHouseholdDescription') }}</p>
          <button
            @click="router.push('/budget')"
            class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          >
            {{ t('shopping.goToBudget') }}
          </button>
        </div>

        <template v-else>
          <!-- Input Bar -->
          <div class="mb-8">
            <ShoppingInputBar @add="handleAddItem" />
          </div>

          <!-- Quick Chips -->
          <ShoppingQuickChips @quick-add="handleQuickAdd" />

          <!-- List -->
          <ShoppingListContainer
            :items="shoppingStore.items"
            :is-loading="shoppingStore.isLoading"
            @toggle="handleToggleItem"
            @delete="handleDeleteItem"
            @update="handleUpdateItem"
          />
        </template>
      </div>
    </main>
    <Footer />
  </div>
</template>
