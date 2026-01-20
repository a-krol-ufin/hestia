import pb from './pocketbase'
import type { Notification, UpdateNotification } from '@/types/notification.types'
import type { UnsubscribeFunc } from 'pocketbase'

class NotificationService {
  private collection = 'household_notifications'

  async getNotifications(limit?: number): Promise<Notification[]> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return []

      const records = await pb.collection(this.collection).getList<Notification>(1, limit || 50, {
        filter: `user = "${userId}"`,
        expand: 'related_invitation',
        requestKey: 'notifications-list',
      })
      return records.items
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist (migrations not applied)
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch notifications:', error)
      return []
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return 0

      const result = await pb.collection(this.collection).getList<Notification>(1, 1, {
        filter: `user = "${userId}" && read = false`,
      })
      return result.totalItems
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return 0
      }
      console.error('Failed to fetch unread count:', error)
      return 0
    }
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    try {
      const record = await pb.collection(this.collection).update<Notification>(notificationId, {
        read: true,
      } as UpdateNotification)
      return record
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      return null
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return false

      const unreadNotifications = await pb.collection(this.collection).getFullList<Notification>({
        filter: `user = "${userId}" && read = false`,
      })

      for (const notification of unreadNotifications) {
        await pb.collection(this.collection).update(notification.id, { read: true })
      }

      return true
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      return false
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).delete(notificationId)
      return true
    } catch (error) {
      console.error('Failed to delete notification:', error)
      return false
    }
  }

  async deleteAllRead(): Promise<boolean> {
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return false

      const readNotifications = await pb.collection(this.collection).getFullList<Notification>({
        filter: `user = "${userId}" && read = true`,
      })

      for (const notification of readNotifications) {
        await pb.collection(this.collection).delete(notification.id)
      }

      return true
    } catch (error) {
      console.error('Failed to delete all read notifications:', error)
      return false
    }
  }

  // Real-time subscription
  async subscribe(callback: (event: { action: string; record: Notification }) => void): Promise<UnsubscribeFunc | null> {
    try {
      return await pb.collection(this.collection).subscribe<Notification>('*', (e) => {
        const userId = pb.authStore.record?.id
        if (e.record.user === userId) {
          callback(e)
        }
      })
    } catch (error: unknown) {
      // Silently ignore if collection doesn't exist
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return null
      }
      console.error('Failed to subscribe to notifications:', error)
      return null
    }
  }

  unsubscribe(): void {
    pb.collection(this.collection).unsubscribe('*')
  }
}

export const notificationService = new NotificationService()
