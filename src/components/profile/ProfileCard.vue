<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>
      <p v-if="description" class="text-sm text-gray-500 mt-1">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
