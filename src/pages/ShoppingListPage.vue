<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShoppingStore } from '@/stores/shopping'
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ShoppingItem from '@/components/shopping/ShoppingItem.vue'
import AddItemForm from '@/components/shopping/AddItemForm.vue'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const shoppingStore = useShoppingStore()

onMounted(() => {
  shoppingStore.fetchItems()
})

function handleAddItem(item: { name: string; quantity: number }) {
  shoppingStore.addItem(item)
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
            <h1 class="text-3xl font-bold text-slate-800">{{ t('shopping.title') }}</h1>
          </div>
        </div>

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
            @delete="handleDeleteItem"
          />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
