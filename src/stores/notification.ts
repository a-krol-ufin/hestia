import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService } from '@/services/notification.service'
import { invitationService } from '@/services/invitation.service'
import type { Notification } from '@/types/notification.types'
import type { Invitation } from '@/types/notification.types'
import type { UnsubscribeFunc } from 'pocketbase'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const pendingInvitations = ref<Invitation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: UnsubscribeFunc | null = null

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const pendingInvitationsCount = computed(() => pendingInvitations.value.length)
  const totalBadgeCount = computed(() => unreadCount.value + pendingInvitationsCount.value)

  async function fetchNotifications() {
    isLoading.value = true
    error.value = null
    try {
      notifications.value = await notificationService.getNotifications()
    } catch (e) {
      error.value = 'Failed to fetch notifications'
      console.error(e)
    }
    isLoading.value = false
  }

  async function fetchPendingInvitations() {
    try {
      pendingInvitations.value = await invitationService.getPendingInvitationsForUser()
    } catch (e) {
      console.error('Failed to fetch pending invitations:', e)
    }
  }

  async function markAsRead(notificationId: string) {
    const notification = await notificationService.markAsRead(notificationId)
    if (notification) {
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value[index] = notification
      }
    }
  }

  async function markAllAsRead() {
    const success = await notificationService.markAllAsRead()
    if (success) {
      notifications.value = notifications.value.map(n => ({ ...n, read: true }))
    }
  }

  async function deleteNotification(notificationId: string) {
    const success = await notificationService.deleteNotification(notificationId)
    if (success) {
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    }
  }

  async function deleteAllRead() {
    const success = await notificationService.deleteAllRead()
    if (success) {
      notifications.value = notifications.value.filter(n => !n.read)
    }
  }

  async function acceptInvitation(invitationId: string) {
    const success = await invitationService.acceptInvitation(invitationId)
    if (success) {
      pendingInvitations.value = pendingInvitations.value.filter(i => i.id !== invitationId)
      return true
    }
    return false
  }

  async function rejectInvitation(invitationId: string) {
    const success = await invitationService.rejectInvitation(invitationId)
    if (success) {
      pendingInvitations.value = pendingInvitations.value.filter(i => i.id !== invitationId)
      return true
    }
    return false
  }

  async function subscribe() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    const unsub = await notificationService.subscribe((event) => {
      if (event.action === 'create') {
        notifications.value.unshift(event.record)
      } else if (event.action === 'update') {
        const index = notifications.value.findIndex(n => n.id === event.record.id)
        if (index !== -1) {
          notifications.value[index] = event.record
        }
      } else if (event.action === 'delete') {
        notifications.value = notifications.value.filter(n => n.id !== event.record.id)
      }
    })

    if (unsub) {
      unsubscribe = unsub
    }
  }

  function unsubscribeFromNotifications() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    notificationService.unsubscribe()
  }

  function clearNotifications() {
    notifications.value = []
    pendingInvitations.value = []
    error.value = null
    unsubscribeFromNotifications()
  }

  return {
    notifications,
    pendingInvitations,
    isLoading,
    error,
    unreadCount,
    pendingInvitationsCount,
    totalBadgeCount,
    fetchNotifications,
    fetchPendingInvitations,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    acceptInvitation,
    rejectInvitation,
    subscribe,
    unsubscribeFromNotifications,
    clearNotifications,
  }
})
