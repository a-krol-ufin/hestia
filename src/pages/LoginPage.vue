<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AuthFormCard from '@/components/auth/AuthFormCard.vue'
import AuthFormInput from '@/components/auth/AuthFormInput.vue'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const isFormValid = computed(() => email.value.length > 0 && password.value.length > 0)

async function handleSubmit() {
  if (!isFormValid.value) return

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    await nextTick()
    router.push('/')
  }
}

function navigateToRegister() {
  authStore.clearError()
  router.push('/register')
}
</script>

<template>
  <AuthFormCard :title="t('auth.login.title')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <AuthFormInput
        id="email"
        type="email"
        v-model="email"
        :label="t('auth.form.email')"
        :placeholder="t('auth.form.emailPlaceholder')"
        required
      />

      <AuthFormInput
        id="password"
        type="password"
        v-model="password"
        :label="t('auth.form.password')"
        :placeholder="t('auth.form.passwordPlaceholder')"
        required
      />

      <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ authStore.error }}</p>
      </div>

      <button
        type="submit"
        :disabled="!isFormValid || authStore.isLoading"
        class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
      >
        <span v-if="authStore.isLoading">{{ t('auth.form.loading') }}</span>
        <span v-else>{{ t('auth.login.submit') }}</span>
      </button>

      <p class="text-center text-slate-600">
        {{ t('auth.login.noAccount') }}
        <button
          type="button"
          @click="navigateToRegister"
          class="text-orange-500 hover:text-orange-600 font-semibold"
        >
          {{ t('auth.login.registerLink') }}
        </button>
      </p>
    </form>
  </AuthFormCard>
</template>
