<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const isAppReady = ref(false)

onMounted(async () => {

  await authStore.initSession()

  authStore.initAuthListener()
  isAppReady.value = true
})

// Subscribe to notifications when user is authenticated
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await notificationStore.fetchNotifications()
      await notificationStore.fetchPendingInvitations()
      await notificationStore.subscribe()
    } else {
      notificationStore.clearNotifications()
    }
  },
  { immediate: true }
)
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
