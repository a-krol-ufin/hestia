<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n({ useScope: 'global' })

const name = ref('')
const quantity = ref(1)

const emit = defineEmits<{
  add: [item: { name: string; quantity: number }]
}>()

function handleSubmit() {
  if (!name.value.trim()) return

  emit('add', {
    name: name.value.trim(),
    quantity: quantity.value,
  })

  name.value = ''
  quantity.value = 1
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex gap-3">
    <input
      v-model="name"
      type="text"
      :placeholder="t('shopping.addPlaceholder')"
      class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
    />
    <input
      v-model.number="quantity"
      type="number"
      min="1"
      class="w-20 px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-center"
    />
    <button
      type="submit"
      :disabled="!name.trim()"
      class="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
    >
      <PlusIcon class="w-5 h-5" />
      <span>{{ t('shopping.addButton') }}</span>
    </button>
  </form>
</template>
