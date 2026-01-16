import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(authService.getCurrentUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => authService.isAuthenticated() && user.value !== null)

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null

    const response = await authService.login(credentials)

    if (response.success) {
      user.value = authService.getCurrentUser()
    } else {
      error.value = response.error || null
    }

    isLoading.value = false
    return response.success
  }

  async function register(credentials: RegisterCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null

    const response = await authService.register(credentials)

    if (response.success) {
      user.value = authService.getCurrentUser()
    } else {
      error.value = response.error || null
    }

    isLoading.value = false
    return response.success
  }

  function logout(): void {
    authService.logout()
    user.value = null
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  function initAuthListener(): void {
    authService.onAuthChange((isValid, currentUser) => {
      user.value = currentUser
    })
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    initAuthListener,
  }
})
