<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

function handleCtaClick() {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <section class="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
    <!-- Soft glow background -->
    <div class="absolute inset-0 bg-gradient-radial from-orange-100/50 via-transparent to-transparent pointer-events-none"></div>

    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Column - Text Content -->
        <div class="text-center lg:text-left">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-6 leading-tight">
            Hestia: {{ t('content.hero.headline') }}
          </h1>
          <p class="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
            {{ t('content.hero.subheadline') }}
          </p>
          <button
            @click="handleCtaClick"
            class="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
          >
            {{ t('content.hero.ctaButton.text') }}
          </button>
        </div>

        <!-- Right Column - Illustration -->
        <div class="relative">
          <div class="relative z-10">
            <img
              src="/img/hero-image-family.png"
              :alt="t('content.hero.imageAlt')"
              class="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
          <!-- Decorative elements -->
          <div class="absolute -top-4 -right-4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-4 -left-4 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
}
</style>
