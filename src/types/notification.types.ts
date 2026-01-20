import type { MemberRole } from './member.types'

// Notification types
export type NotificationType = 'invitation' | 'role_changed' | 'removed' | 'invitation_accepted'

// Invitation status
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

// Notification
export interface Notification {
  id: string
  user: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, unknown>
  related_invitation?: string
  created: string
  updated: string
  // Expanded relations
  expand?: {
    related_invitation?: Invitation
  }
}

export interface UpdateNotification {
  read?: boolean
}

// Invitation
export interface Invitation {
  id: string
  household: string
  inviter: string
  invitee_email: string
  invitee?: string
  role: Exclude<MemberRole, 'admin'>
  status: InvitationStatus
  message?: string
  created: string
  updated: string
  // Expanded relations
  expand?: {
    household?: {
      id: string
      name: string
    }
    inviter?: {
      id: string
      email: string
      name?: string
      avatar?: string
    }
    invitee?: {
      id: string
      email: string
      name?: string
      avatar?: string
    }
  }
}

export interface CreateInvitation {
  household: string
  invitee_email: string
  role: Exclude<MemberRole, 'admin'>
  message?: string
}

export interface UpdateInvitation {
  status?: InvitationStatus
}

// Notification data types for specific notification types
export interface InvitationNotificationData {
  household_id: string
  household_name: string
  inviter_name?: string
  role: MemberRole
}

export interface RoleChangedNotificationData {
  household_id: string
  household_name: string
  old_role: MemberRole
  new_role: MemberRole
}

export interface RemovedNotificationData {
  household_id: string
  household_name: string
}

export interface InvitationAcceptedNotificationData {
  household_id: string
  household_name: string
  invitee_name?: string
  invitee_email: string
}
