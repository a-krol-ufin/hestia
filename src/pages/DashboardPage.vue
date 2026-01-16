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
    available: true,
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
  <div class="min-h-screen bg-orange-50 flex flex-col font-sans">
    <Navbar />
    <main class="flex-grow pt-28">
      <div class="container mx-auto px-6 py-8">
        <!-- Header Section -->
        <div class="mb-12 text-center md:text-left">
          <h1 class="text-4xl font-extrabold text-slate-800 mb-2">{{ t('dashboard.title') }}</h1>
          <p class="text-lg text-slate-600">
            {{ t('dashboard.welcome') }}, <span class="font-bold text-orange-600">{{ authStore.user?.email }}</span>!
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.id"
            @click="navigateTo(feature.route, feature.available)"
            :class="[
              'relative overflow-hidden bg-white rounded-2xl p-8 transition-all duration-300 border border-transparent',
              feature.available
                ? 'cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-2 hover:border-orange-100'
                : 'opacity-75 cursor-not-allowed shadow-sm bg-slate-50'
            ]"
          >
            <!-- Background Decoration for active cards -->
            <div v-if="feature.available" class="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:bg-orange-100 transition-colors"></div>

            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-start justify-between mb-4">
                <div :class="[
                  'p-4 rounded-xl inline-flex',
                  feature.available ? 'bg-orange-100 text-orange-500' : 'bg-slate-200 text-slate-500'
                ]">
                  <component :is="feature.icon" class="w-8 h-8" />
                </div>
                
                <span v-if="!feature.available" class="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                  {{ t('dashboard.comingSoon') }}
                </span>
              </div>

              <h3 class="text-2xl font-bold text-slate-800 mb-2">
                {{ t(`dashboard.features.${feature.id}.title`) }}
              </h3>
              <p class="text-slate-600 mb-4 flex-grow">
                {{ t(`dashboard.features.${feature.id}.description`) }}
              </p>

              <div v-if="feature.available" class="mt-auto">
                <span class="text-orange-500 font-semibold flex items-center group">
                  Open {{ t(`dashboard.features.${feature.id}.title`) }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>