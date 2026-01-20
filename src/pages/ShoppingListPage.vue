<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShoppingStore } from '@/stores/shopping'
import { useBudgetStore } from '@/stores/budget'
import { ArrowLeftIcon, ShoppingCartIcon, HomeIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ShoppingItem from '@/components/shopping/ShoppingItem.vue'
import AddItemForm from '@/components/shopping/AddItemForm.vue'
import type { ShoppingCategory, ShoppingUnit } from '@/types/shopping.types'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const shoppingStore = useShoppingStore()
const budgetStore = useBudgetStore()

const currentHousehold = computed(() => budgetStore.currentHousehold)
const hasHousehold = computed(() => !!currentHousehold.value)

onMounted(async () => {
  // Make sure we have households loaded
  if (budgetStore.households.length === 0) {
    await budgetStore.fetchHouseholds()
  }

  // If we have a household, set it and fetch items
  if (currentHousehold.value) {
    shoppingStore.setCurrentHousehold(currentHousehold.value.id)
    await shoppingStore.fetchItems()
  }
})

// Watch for household changes
watch(currentHousehold, async (newHousehold) => {
  if (newHousehold) {
    shoppingStore.setCurrentHousehold(newHousehold.id)
    await shoppingStore.fetchItems()
  } else {
    shoppingStore.clearItems()
  }
})

function handleAddItem(item: { name: string; quantity: number; unit?: ShoppingUnit; category?: ShoppingCategory }) {
  shoppingStore.addItem(item)
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
      <div class="container mx-auto px-6 py-8 max-w-2xl">
        <div class="mb-8">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-slate-600 hover:text-orange-500 transition-colors mb-4"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>{{ t('shopping.back') }}</span>
          </button>

          <div class="flex items-center space-x-3">
            <div class="bg-orange-100 p-3 rounded-lg">
              <ShoppingCartIcon class="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-slate-800">{{ t('shopping.title') }}</h1>
              <p v-if="currentHousehold" class="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <HomeIcon class="w-4 h-4" />
                {{ currentHousehold.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- No household selected -->
        <div v-if="!hasHousehold" class="text-center py-12 bg-white rounded-lg border border-slate-200">
          <HomeIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p class="text-slate-600 font-medium mb-2">{{ t('shopping.noHousehold') }}</p>
          <p class="text-slate-500 text-sm mb-4">{{ t('shopping.noHouseholdDescription') }}</p>
          <button
            @click="router.push('/budget')"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            {{ t('shopping.goToBudget') }}
          </button>
        </div>

        <template v-else>
          <div class="mb-6">
            <AddItemForm @add="handleAddItem" />
          </div>

        <div v-if="shoppingStore.isLoading" class="text-center py-12">
          <div class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        </div>

        <div v-else-if="shoppingStore.items.length === 0" class="text-center py-12">
          <ShoppingCartIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p class="text-slate-500">{{ t('shopping.empty') }}</p>
        </div>

        <div v-else class="space-y-3">
          <ShoppingItem
            v-for="item in shoppingStore.items"
            :key="item.id"
            :item="item"
            @toggle="handleToggleItem"
            @update="handleUpdateItem"
            @delete="handleDeleteItem"
          />
        </div>
        </template>
      </div>
    </main>
    <Footer />
  </div>
</template>
