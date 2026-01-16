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

export default pb
