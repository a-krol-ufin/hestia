<script setup lang="ts">
import { useAppStore } from '@/stores/app'

interface Props {
  title: string
}

defineProps<Props>()

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <span class="text-4xl">{{ appStore.content.navbar.logoIcon }}</span>
          <h1 class="text-2xl font-bold text-slate-800 mt-2">{{ title }}</h1>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
