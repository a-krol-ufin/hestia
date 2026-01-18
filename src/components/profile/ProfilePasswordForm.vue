<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AuthFormInput from '@/components/auth/AuthFormInput.vue'

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const oldPassword = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const MIN_PASSWORD_LENGTH = 8

const passwordsMatch = computed(() => password.value === passwordConfirm.value)
const isPasswordLongEnough = computed(() => password.value.length >= MIN_PASSWORD_LENGTH)
const isValid = computed(() =>
  oldPassword.value.length > 0 &&
  isPasswordLongEnough.value &&
  passwordsMatch.value
)

const passwordError = computed(() => {
  if (password.value.length > 0 && !isPasswordLongEnough.value) {
    return t('profile.password.errorTooShort', { min: MIN_PASSWORD_LENGTH })
  }
  return undefined
})

const confirmError = computed(() => {
  if (passwordConfirm.value.length > 0 && !passwordsMatch.value) {
    return t('auth.form.passwordMismatch')
  }
  return undefined
})

async function handleSubmit() {
  if (!isValid.value) return

  isLoading.value = true
  error.value = null
  successMessage.value = null

  const success = await authStore.changePassword({
    oldPassword: oldPassword.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  })

  if (success) {
    successMessage.value = t('profile.password.success')
    resetForm()
  } else {
    error.value = authStore.error || t('profile.password.errorChange')
  }

  isLoading.value = false
}

function resetForm() {
  oldPassword.value = ''
  password.value = ''
  passwordConfirm.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AuthFormInput
      id="current-password"
      type="password"
      :label="t('profile.password.currentLabel')"
      v-model="oldPassword"
      :placeholder="t('profile.password.currentPlaceholder')"
    />

    <AuthFormInput
      id="new-password"
      type="password"
      :label="t('profile.password.newLabel')"
      v-model="password"
      :placeholder="t('profile.password.newPlaceholder')"
      :error="passwordError"
    />

    <AuthFormInput
      id="confirm-password"
      type="password"
      :label="t('profile.password.confirmLabel')"
      v-model="passwordConfirm"
      :placeholder="t('profile.password.confirmPlaceholder')"
      :error="confirmError"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>

    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="isLoading || !isValid"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? t('profile.saving') : t('profile.password.save') }}
      </button>
    </div>
  </form>
</template>
