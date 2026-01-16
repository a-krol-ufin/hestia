import pb from './pocketbase'
import type { LoginCredentials, RegisterCredentials, AuthUser, AuthResponse } from '@/types/auth.types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await pb.collection('users').authWithPassword(credentials.email, credentials.password)
      return { success: true }
    } catch (error) {
      return { success: false, error: this.parseError(error) }
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      await pb.collection('users').create({
        email: credentials.email,
        password: credentials.password,
        passwordConfirm: credentials.passwordConfirm,
      })
      await this.login({ email: credentials.email, password: credentials.password })
      return { success: true }
    } catch (error) {
      return { success: false, error: this.parseError(error) }
    }
  }

  logout(): void {
    pb.authStore.clear()
  }

  getCurrentUser(): AuthUser | null {
    return pb.authStore.record as AuthUser | null
  }

  isAuthenticated(): boolean {
    return pb.authStore.isValid
  }

  onAuthChange(callback: (isValid: boolean, user: AuthUser | null) => void): () => void {
    return pb.authStore.onChange(() => {
      callback(pb.authStore.isValid, pb.authStore.record as AuthUser | null)
    })
  }

  private parseError(error: unknown): string {
    if (error instanceof Error) {
      const pbError = error as unknown as { response?: { data?: Record<string, { message?: string }> } }
      if (pbError.response?.data) {
        const firstError = Object.values(pbError.response.data)[0]
        return firstError?.message || error.message
      }
      return error.message
    }
    return 'An unexpected error occurred'
  }
}

export const authService = new AuthService()
