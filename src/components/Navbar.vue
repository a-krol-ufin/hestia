<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
const appStore = useAppStore()

</script>

<template>
  <header class="shadow-md bg-white sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <span class="text-2xl">{{ appStore.content.navbar.logoIcon }}</span>
        <span :class="`font-bold text-xl text-${appStore.theme.primaryColor}`">{{ appStore.content.navbar.logoText }}</span>
      </div>
      <nav class="hidden md:flex items-center space-x-8">
        <a v-for="link in appStore.content.navbar.links" :key="link.id" :href="link.href" class="text-gray-600 hover:text-orange-500 transition-colors">
          {{ t(`content.navbar.links.${link.id}.label`) }}
        </a>
      </nav>
      <div class="flex items-center space-x-4">
        <button @click="appStore.toggleLanguage" class="text-gray-600 hover:text-orange-500 transition-colors font-semibold">
          {{ t('content.navbar.languageSwitch.label') }}
        </button>
      </div>
    </div>
  </header>
</template>
