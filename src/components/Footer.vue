<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app';

const { t } = useI18n({ useScope: 'global' });
const appStore = useAppStore();

const footerContent = appStore.content.footer;
</script>

<template>
  <footer class="bg-gray-100 py-8">
    <div class="container mx-auto px-6 text-center text-gray-600">
      <p>{{ t('content.footer.copyright') }}</p>
      <p class="text-sm mt-2">{{ footerContent.techStackText }}</p>
    </div>
  </footer>
</template>
