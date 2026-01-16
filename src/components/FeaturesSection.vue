<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ShoppingCartIcon, ChartPieIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n({ useScope: 'global' })

const features = [
  {
    id: 'shopping',
    icon: ShoppingCartIcon,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    id: 'budget',
    icon: ChartPieIcon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'tasks',
    icon: ClipboardDocumentCheckIcon,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
]
</script>

<template>
  <section id="features" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
        {{ t('content.featuresSection.title') }}
      </h2>
      <p class="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
        {{ t('content.featuresSection.subtitle') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
        >
          <div :class="[feature.iconBg, 'w-14 h-14 rounded-xl flex items-center justify-center mb-6']">
            <component :is="feature.icon" :class="[feature.iconColor, 'w-7 h-7']" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">
            {{ t(`content.featuresSection.cards.${feature.id}.title`) }}
          </h3>
          <p class="text-slate-600 leading-relaxed">
            {{ t(`content.featuresSection.cards.${feature.id}.description`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
