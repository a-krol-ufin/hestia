<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="shopping-empty-state">
    <ShoppingCartIcon class="shopping-empty-state__icon" />
    <p class="shopping-empty-state__title">{{ t('shopping.emptyTitle') }}</p>
    <p class="shopping-empty-state__subtitle">{{ t('shopping.emptySubtitle') }}</p>
  </div>
</template>
