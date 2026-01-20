// Member roles
export type MemberRole = 'admin' | 'manager' | 'member'

// Household Member
export interface HouseholdMember {
  id: string
  household: string
  user: string
  role: MemberRole
  joined_at: string
  created: string
  updated: string
  // Expanded relations
  expand?: {
    user?: {
      id: string
      email: string
      name?: string
      avatar?: string
    }
  }
}

export interface CreateHouseholdMember {
  household: string
  user: string
  role: MemberRole
}

export interface UpdateHouseholdMember {
  role?: MemberRole
}

// Role permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canManageHousehold: true,
    canDeleteHousehold: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canAssignManagerRole: true,
    canEditItems: true,
    canDeleteItems: true,
  },
  manager: {
    canManageHousehold: false,
    canDeleteHousehold: false,
    canInviteMembers: true,
    canRemoveMembers: true, // Only members, not admins/managers
    canChangeRoles: false,
    canAssignManagerRole: false,
    canEditItems: true,
    canDeleteItems: true,
  },
  member: {
    canManageHousehold: false,
    canDeleteHousehold: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canAssignManagerRole: false,
    canEditItems: true,
    canDeleteItems: true,
  },
} as const

export type RolePermissions = typeof ROLE_PERMISSIONS[MemberRole]
