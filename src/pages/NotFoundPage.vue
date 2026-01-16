<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex flex-col">
    <Navbar />
    <main class="flex-grow pt-28 flex items-center justify-center">
      <div class="container mx-auto px-6 py-12 text-center">
        <div class="max-w-md mx-auto">
          <img src="/img/404-image.png" alt="404" class="w-full h-auto mb-8 rounded-lg shadow-sm" />
          <h1 class="text-4xl font-bold text-slate-800 mb-4">{{ t('notFound.title') }}</h1>
          <p class="text-lg text-slate-600 mb-8">{{ t('notFound.description') }}</p>
          <button
            @click="goHome"
            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
          >
            {{ t('notFound.backButton') }}
          </button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
