<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  type?: 'text' | 'email' | 'password'
  label: string
  modelValue: string
  placeholder?: string
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => [
  'w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2',
  props.error
    ? 'border-red-500 focus:ring-red-200'
    : 'border-slate-300 focus:border-orange-500 focus:ring-orange-200',
])
</script>

<template>
  <div class="space-y-1">
    <label :for="id" class="block text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :class="inputClasses"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
