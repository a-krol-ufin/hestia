<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  'go-back': []
}>()

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="shopping-header">
    <button
      @click="emit('go-back')"
      class="shopping-header__back"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      <span>{{ t('shopping.back') }}</span>
    </button>

    <h1 class="shopping-header__title">
      <span>{{ t('shopping.headerTitle') }}</span>
    </h1>
    <p class="shopping-header__subtitle">{{ t('shopping.headerSubtitle') }}</p>
  </div>
</template>
