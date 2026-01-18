<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AuthFormInput from '@/components/auth/AuthFormInput.vue'

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const name = ref(authStore.user?.name || '')
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const hasChanges = computed(() => name.value !== (authStore.user?.name || ''))
const isValid = computed(() => name.value.trim().length > 0)

async function handleSubmit() {
  if (!isValid.value) {
    error.value = t('profile.name.errorEmpty')
    return
  }

  isLoading.value = true
  error.value = null
  successMessage.value = null

  const success = await authStore.updateProfile({ name: name.value.trim() })

  if (success) {
    successMessage.value = t('profile.name.success')
  } else {
    error.value = authStore.error || t('profile.name.errorUpdate')
  }

  isLoading.value = false
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AuthFormInput
      id="profile-name"
      type="text"
      :label="t('profile.name.label')"
      v-model="name"
      :placeholder="t('profile.name.placeholder')"
      :error="error || undefined"
    />

    <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>

    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="isLoading || !hasChanges || !isValid"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? t('profile.saving') : t('profile.name.save') }}
      </button>
    </div>
  </form>
</template>
