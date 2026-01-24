<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  EnvelopeIcon,
  UserGroupIcon,
  ArrowRightStartOnRectangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import type { Notification, Invitation } from '@/types/notification.types'

const props = defineProps<{
  notification?: Notification
  invitation?: Invitation
  type: 'notification' | 'invitation'
}>()

const emit = defineEmits<{
  markRead: [id: string]
  delete: [id: string]
  accept: [id: string]
  reject: [id: string]
}>()

const { t } = useI18n({ useScope: 'global' })

const icon = computed(() => {
  if (props.type === 'invitation') {
    return EnvelopeIcon
  }

  switch (props.notification?.type) {
    case 'invitation':
      return EnvelopeIcon
    case 'role_changed':
      return UserGroupIcon
    case 'removed':
      return ArrowRightStartOnRectangleIcon
    case 'invitation_accepted':
      return CheckCircleIcon
    default:
      return EnvelopeIcon
  }
})

const iconColor = computed(() => {
  if (props.type === 'invitation') {
    return 'text-blue-500 bg-blue-50'
  }

  switch (props.notification?.type) {
    case 'invitation':
      return 'text-blue-500 bg-blue-50'
    case 'role_changed':
      return 'text-purple-500 bg-purple-50'
    case 'removed':
      return 'text-red-500 bg-red-50'
    case 'invitation_accepted':
      return 'text-green-500 bg-green-50'
    default:
      return 'text-gray-500 bg-gray-50'
  }
})

const title = computed(() => {
  if (props.type === 'invitation' && props.invitation) {
    return t('notifications.invitationTitle', { household: props.invitation.expand?.household?.name || '' })
  }
  return props.notification?.title || ''
})

const message = computed(() => {
  if (props.type === 'invitation' && props.invitation) {
    const inviterName = props.invitation.expand?.inviter?.name || props.invitation.expand?.inviter?.email
    return t('notifications.invitationMessage', {
      inviter: inviterName,
      role: t(`notifications.roles.${props.invitation.role}`)
    })
  }
  return props.notification?.message || ''
})

const timeAgo = computed(() => {
  const date = props.type === 'invitation'
    ? props.invitation?.created
    : props.notification?.created

  if (!date) return ''

  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('notifications.justNow')
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes })
  if (hours < 24) return t('notifications.hoursAgo', { count: hours })
  return t('notifications.daysAgo', { count: days })
})

function handleMarkRead() {
  if (props.notification) {
    emit('markRead', props.notification.id)
  }
}

function handleDelete() {
  if (props.notification) {
    emit('delete', props.notification.id)
  }
}

function handleAccept() {
  if (props.invitation) {
    emit('accept', props.invitation.id)
  }
}

function handleReject() {
  if (props.invitation) {
    emit('reject', props.invitation.id)
  }
}
</script>

<template>
  <div
    :class="[
      'p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors',
      type === 'notification' && !notification?.read && 'bg-orange-50/50'
    ]"
  >
    <div class="flex gap-3">
      <!-- Icon -->
      <div :class="['p-2 rounded-full flex-shrink-0', iconColor]">
        <component :is="icon" class="w-5 h-5" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="font-medium text-sm text-slate-800">
          {{ title }}
        </p>
        <p class="text-sm text-slate-600 mt-1">
          {{ message }}
        </p>
        <p class="text-xs text-slate-400 mt-1">
          {{ timeAgo }}
        </p>

        <!-- Invitation actions -->
        <div v-if="type === 'invitation'" class="flex gap-2 mt-3">
          <button
            @click="handleAccept"
            class="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {{ t('notifications.accept') }}
          </button>
          <button
            @click="handleReject"
            class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            {{ t('notifications.reject') }}
          </button>
        </div>

        <!-- Notification actions -->
        <div v-else class="flex gap-2 mt-2">
          <button
            v-if="!notification?.read"
            @click="handleMarkRead"
            class="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            {{ t('notifications.markAsRead') }}
          </button>
          <button
            @click="handleDelete"
            class="text-xs text-slate-500 hover:text-red-600 font-medium"
          >
            {{ t('notifications.delete') }}
          </button>
        </div>
      </div>

      <!-- Unread indicator -->
      <div v-if="type === 'notification' && !notification?.read" class="flex-shrink-0">
        <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
      </div>
    </div>
  </div>
</template>
