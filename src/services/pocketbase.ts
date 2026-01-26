import PocketBase from 'pocketbase'

// Declare global definition for window.env
declare global {
  interface Window {
    env?: {
      VITE_POCKETBASE_URL?: string
    }
  }
}

const POCKETBASE_URL = window.env?.VITE_POCKETBASE_URL || import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

const pb = new PocketBase(POCKETBASE_URL)

// Token refresh configuration
const TOKEN_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours before expiration
const TOKEN_CHECK_INTERVAL_MS = 5 * 60 * 1000 // Check every 5 minutes

let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null

interface JwtPayload {
  exp: number
  [key: string]: unknown
}

/**
 * Parse JWT token to extract payload
 */
function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Check if token should be refreshed (expires within threshold)
 */
export function shouldRefreshToken(): boolean {
  const token = pb.authStore.token
  if (!token) return false

  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false

  const expirationTime = payload.exp * 1000 // Convert to milliseconds
  const timeUntilExpiration = expirationTime - Date.now()

  return timeUntilExpiration < TOKEN_REFRESH_THRESHOLD_MS && timeUntilExpiration > 0
}

/**
 * Try to refresh the auth token
 */
export async function tryRefreshToken(): Promise<boolean> {
  if (!pb.authStore.isValid) return false

  try {
    await pb.collection('users').authRefresh({ requestKey: null })
    return true
  } catch {
    pb.authStore.clear()
    return false
  }
}

/**
 * Start the token refresh scheduler
 */
export function startTokenRefreshScheduler(): void {
  stopTokenRefreshScheduler()

  tokenRefreshInterval = setInterval(async () => {
    if (shouldRefreshToken()) {
      await tryRefreshToken()
    }
  }, TOKEN_CHECK_INTERVAL_MS)

  // Also check immediately
  if (shouldRefreshToken()) {
    tryRefreshToken()
  }
}

/**
 * Stop the token refresh scheduler
 */
export function stopTokenRefreshScheduler(): void {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval)
    tokenRefreshInterval = null
  }
}

/**
 * Validate session with the server
 */
export async function validateSession(): Promise<boolean> {
  if (!pb.authStore.token) return false

  try {
    // Disable auto-cancellation to prevent conflicts with recent auth calls
    await pb.collection('users').authRefresh({ requestKey: null })
    return true
  } catch {
    pb.authStore.clear()
    return false
  }
}

/**
 * Check if an error is an authentication error (401/403)
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status
    return status === 401 || status === 403
  }
  return false
}

/**
 * Handle 401 error by clearing auth store
 */
export function handle401Error(): void {
  pb.authStore.clear()
}

export default pb
