<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'
import NotificationItem from './NotificationItem.vue'
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineEmits<{
  close: []
}>()

const { t } = useI18n({ useScope: 'global' })
const notificationStore = useNotificationStore()

const hasNotifications = computed(() =>
  notificationStore.notifications.length > 0 ||
  notificationStore.pendingInvitations.length > 0
)

const hasUnread = computed(() => notificationStore.unreadCount > 0)

async function handleMarkRead(id: string) {
  await notificationStore.markAsRead(id)
}

async function handleDelete(id: string) {
  await notificationStore.deleteNotification(id)
}

async function handleAccept(id: string) {
  await notificationStore.acceptInvitation(id)
}

async function handleReject(id: string) {
  await notificationStore.rejectInvitation(id)
}

async function handleMarkAllRead() {
  await notificationStore.markAllAsRead()
}

async function handleDeleteAllRead() {
  await notificationStore.deleteAllRead()
}
</script>

<template>
  <div class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-100">
      <h3 class="font-semibold text-slate-800">
        {{ t('notifications.title') }}
      </h3>
      <div class="flex items-center gap-2">
        <button
          v-if="hasUnread"
          @click="handleMarkAllRead"
          class="p-1.5 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          :title="t('notifications.markAllAsRead')"
        >
          <CheckIcon class="w-4 h-4" />
        </button>
        <button
          v-if="hasNotifications"
          @click="handleDeleteAllRead"
          class="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          :title="t('notifications.deleteAllRead')"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="max-h-96 overflow-y-auto">
      <!-- Pending invitations -->
      <div v-if="notificationStore.pendingInvitations.length > 0">
        <div class="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <p class="text-xs font-medium text-blue-700">
            {{ t('notifications.pendingInvitations') }}
          </p>
        </div>
        <NotificationItem
          v-for="invitation in notificationStore.pendingInvitations"
          :key="invitation.id"
          type="invitation"
          :invitation="invitation"
          @accept="handleAccept"
          @reject="handleReject"
        />
      </div>

      <!-- Notifications -->
      <div v-if="notificationStore.notifications.length > 0">
        <div v-if="notificationStore.pendingInvitations.length > 0" class="px-4 py-2 bg-slate-50 border-b border-slate-100">
          <p class="text-xs font-medium text-slate-600">
            {{ t('notifications.recentNotifications') }}
          </p>
        </div>
        <NotificationItem
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          type="notification"
          :notification="notification"
          @mark-read="handleMarkRead"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty state -->
      <div v-if="!hasNotifications" class="py-12 text-center text-slate-500">
        <p>{{ t('notifications.empty') }}</p>
      </div>
    </div>
  </div>
</template>
