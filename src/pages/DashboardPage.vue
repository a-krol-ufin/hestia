<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { ShoppingCartIcon, ChartPieIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const features = [
  {
    id: 'shopping',
    icon: ShoppingCartIcon,
    route: '/shopping',
    available: true,
  },
  {
    id: 'budget',
    icon: ChartPieIcon,
    route: '/budget',
    available: false,
  },
  {
    id: 'tasks',
    icon: ClipboardDocumentListIcon,
    route: '/tasks',
    available: false,
  },
]

function navigateTo(route: string, available: boolean) {
  if (available) {
    router.push(route)
  }
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <div class="container mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-800">{{ t('dashboard.title') }}</h1>
          <p class="text-slate-600 mt-2">
            {{ t('dashboard.welcome') }}, <span class="font-semibold">{{ authStore.user?.email }}</span>
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.id"
            @click="navigateTo(feature.route, feature.available)"
            :class="[
              'bg-white rounded-xl shadow-md p-6 transition-all',
              feature.available
                ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
                : 'opacity-50 cursor-not-allowed'
            ]"
          >
            <div class="flex items-center space-x-4">
              <div class="bg-orange-100 p-3 rounded-lg">
                <component :is="feature.icon" class="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800">
                  {{ t(`dashboard.features.${feature.id}.title`) }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ t(`dashboard.features.${feature.id}.description`) }}
                </p>
              </div>
            </div>
            <div v-if="!feature.available" class="mt-4">
              <span class="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                {{ t('dashboard.comingSoon') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
