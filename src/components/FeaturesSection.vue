<script setup lang="ts">
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { ShoppingCartIcon, ChartPieIcon, LockClosedIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '@/stores/app';

const { t } = useI18n({ useScope: 'global' });
const appStore = useAppStore();

const featuresContent = appStore.content.featuresSection;

const icons: { [key: string]: any } = {
  ShoppingCartIcon,
  ChartPieIcon,
  LockClosedIcon,
};

const getIcon = (iconName: string) => {
  return h(icons[iconName]);
};
</script>

<template>
  <section id="features" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
        {{ t('content.featuresSection.title') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="card in featuresContent.cards" :key="card.id" class="bg-white rounded-lg shadow-lg p-8 transform hover:-translate-y-2 transition-transform duration-300">
          <div :class="`text-${appStore.theme.primaryColor} w-12 h-12 mb-4`">
             <component :is="getIcon(card.icon)" />
          </div>
          <h3 class="text-2xl font-bold text-slate-800 mb-2">
            {{ t(`content.featuresSection.cards.${card.id}.title`) }}
          </h3>
          <p class="text-slate-600">
            {{ t(`content.featuresSection.cards.${card.id}.description`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
