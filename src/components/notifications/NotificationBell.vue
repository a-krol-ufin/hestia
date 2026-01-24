<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import NotificationDropdown from './NotificationDropdown.vue'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await notificationStore.fetchNotifications()
    await notificationStore.fetchPendingInvitations()
    await notificationStore.subscribe()
  }
})

onUnmounted(() => {
  notificationStore.unsubscribeFromNotifications()
})
</script>

<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
    >
      <BellIcon class="w-6 h-6" />

      <!-- Badge -->
      <span
        v-if="notificationStore.totalBadgeCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-orange-500 rounded-full"
      >
        {{ notificationStore.totalBadgeCount > 99 ? '99+' : notificationStore.totalBadgeCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <NotificationDropdown
      v-if="isDropdownOpen"
      @close="closeDropdown"
    />

    <!-- Click outside to close -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-[-1]"
      @click="closeDropdown"
    />
  </div>
</template>
