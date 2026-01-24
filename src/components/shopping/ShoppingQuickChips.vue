<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ShoppingCategory } from '@/types/shopping.types'

interface QuickChipItem {
  emoji: string
  name: string
  nameEn: string
  category: ShoppingCategory
}

interface Props {
  items?: QuickChipItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { emoji: '🥛', name: 'Mleko', nameEn: 'Milk', category: 'dairy' },
    { emoji: '🍞', name: 'Chleb', nameEn: 'Bread', category: 'bread' },
    { emoji: '🥚', name: 'Jajka', nameEn: 'Eggs', category: 'dairy' },
    { emoji: '🧻', name: 'Papier toaletowy', nameEn: 'Toilet paper', category: 'hygiene' },
  ],
})

const emit = defineEmits<{
  'quick-add': [item: { name: string; category: ShoppingCategory }]
}>()

const { t, locale } = useI18n({ useScope: 'global' })

function handleQuickAdd(item: QuickChipItem) {
  const name = locale.value === 'pl' ? item.name : item.nameEn
  emit('quick-add', { name, category: item.category })
}
</script>

<template>
  <div class="shopping-quick-chips">
    <span class="shopping-quick-chips__label">{{ t('shopping.quickAddLabel') }}</span>
    <button
      v-for="item in props.items"
      :key="item.name"
      type="button"
      class="shopping-quick-chip"
      @click="handleQuickAdd(item)"
    >
      <span>{{ item.emoji }}</span>
      <span>{{ locale === 'pl' ? item.name : item.nameEn }}</span>
    </button>
  </div>
</template>
