<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const appStore = useAppStore()
const authStore = useAuthStore()

const heroContent = appStore.content.hero
const ctaButton = heroContent.ctaButton

function handleCtaClick() {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <section class="py-20 md:py-32">
    <div class="container mx-auto px-6 text-center">
      <h1 class="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 leading-tight">
        {{ t('content.hero.headline') }}
      </h1>
      <p class="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
        {{ t('content.hero.subheadline') }}
      </p>
      <button @click="handleCtaClick" :class="ctaButton.styleClass">
        {{ t('content.hero.ctaButton.text') }}
      </button>
      <div class="mt-12">
        <div class="bg-gray-200 h-64 w-full max-w-4xl mx-auto rounded-lg shadow-xl flex items-center justify-center">
          <span class="text-gray-500">{{ heroContent.imagePlaceholder }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
