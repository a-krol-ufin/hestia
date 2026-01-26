import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { AuthUser, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(authService.getCurrentUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => authService.isAuthenticated() && user.value !== null)

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null

    const response = await authService.login(credentials)

    if (response.success) {
      user.value = authService.getCurrentUser()
      isInitialized.value = true
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
      isInitialized.value = true // Prevent router guard from calling initSession after registration
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
      if (!isValid) {
        user.value = null
      } else {
        user.value = currentUser
      }
    })
  }

  async function initSession(): Promise<void> {
    if (isInitialized.value) return

    const wasValid = await authService.validateAndRefresh()
    if (wasValid) {
      user.value = authService.getCurrentUser()
    } else {
      user.value = null
    }
    isInitialized.value = true
  }

  async function updateProfile(data: UpdateProfileData): Promise<boolean> {
    if (!user.value) return false

    isLoading.value = true
    error.value = null

    const response = await authService.updateProfile(user.value.id, data)

    if (response.success) {
      user.value = authService.getCurrentUser()
    } else {
      error.value = response.error || null
    }

    isLoading.value = false
    return response.success
  }

  async function changePassword(data: ChangePasswordData): Promise<boolean> {
    isLoading.value = true
    error.value = null

    const response = await authService.changePassword(data)

    if (!response.success) {
      error.value = response.error || null
    }

    isLoading.value = false
    return response.success
  }

  function getAvatarUrl(): string | null {
    return authService.getAvatarUrl(user.value)
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout,
    clearError,
    initAuthListener,
    initSession,
    updateProfile,
    changePassword,
    getAvatarUrl,
  }
})
