import type { RecordModel } from 'pocketbase'

export interface AuthUser extends RecordModel {
  email: string
  name?: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  passwordConfirm: string
}

export interface AuthResponse {
  success: boolean
  error?: string
}

export interface UpdateProfileData {
  name?: string
  avatar?: File | null
}

export interface ChangePasswordData {
  oldPassword: string
  password: string
  passwordConfirm: string
}
