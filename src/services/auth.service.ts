import pb from './pocketbase'
import type { LoginCredentials, RegisterCredentials, AuthUser, AuthResponse, UpdateProfileData, ChangePasswordData } from '@/types/auth.types'

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

  async updateProfile(userId: string, data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const formData = new FormData()

      if (data.name !== undefined) {
        formData.append('name', data.name)
      }

      if (data.avatar !== undefined) {
        if (data.avatar === null) {
          formData.append('avatar', '')
        } else {
          formData.append('avatar', data.avatar)
        }
      }

      await pb.collection('users').update(userId, formData)
      await pb.collection('users').authRefresh()
      return { success: true }
    } catch (error) {
      return { success: false, error: this.parseError(error) }
    }
  }

  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    try {
      const user = this.getCurrentUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      await pb.collection('users').update(user.id, {
        oldPassword: data.oldPassword,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      })

      await pb.collection('users').authWithPassword(user.email, data.password)
      return { success: true }
    } catch (error) {
      return { success: false, error: this.parseError(error) }
    }
  }

  getAvatarUrl(user: AuthUser | null): string | null {
    if (!user || !user.avatar) {
      return null
    }
    return pb.files.getURL(user, user.avatar)
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
