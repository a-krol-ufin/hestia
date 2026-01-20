<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserCircleIcon, TrashIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { ShieldCheckIcon, UserIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/solid'
import type { HouseholdMember, MemberRole } from '@/types/member.types'

const props = defineProps<{
  member: HouseholdMember
  currentUserRole: MemberRole
  isOwner: boolean
}>()

const emit = defineEmits<{
  changeRole: [memberId: string, newRole: MemberRole]
  remove: [memberId: string]
}>()

const { t } = useI18n({ useScope: 'global' })

const roleIcon = computed(() => {
  switch (props.member.role) {
    case 'admin':
      return ShieldCheckIcon
    case 'manager':
      return WrenchScrewdriverIcon
    default:
      return UserIcon
  }
})

const roleColor = computed(() => {
  switch (props.member.role) {
    case 'admin':
      return 'text-orange-500 bg-orange-50'
    case 'manager':
      return 'text-purple-500 bg-purple-50'
    default:
      return 'text-slate-500 bg-slate-50'
  }
})

const canChangeRole = computed(() => {
  if (props.currentUserRole !== 'admin') return false
  if (props.member.role === 'admin') return false
  return true
})

const canRemove = computed(() => {
  if (props.member.role === 'admin') return false
  if (props.currentUserRole === 'admin') return true
  if (props.currentUserRole === 'manager' && props.member.role === 'member') return true
  return false
})

const memberName = computed(() => {
  return props.member.expand?.user?.name || props.member.expand?.user?.email || t('members.unknownUser')
})

const memberEmail = computed(() => {
  return props.member.expand?.user?.email || ''
})

const avatarUrl = computed(() => {
  const user = props.member.expand?.user
  if (!user?.avatar) return null
  return `/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
})

function handleRoleChange(event: Event) {
  const select = event.target as HTMLSelectElement
  emit('changeRole', props.member.id, select.value as MemberRole)
}

function handleRemove() {
  emit('remove', props.member.id)
}
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="memberName"
        class="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
      />
      <UserCircleIcon v-else class="w-10 h-10 text-slate-400" />
    </div>

    <!-- Member info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="font-medium text-slate-800 truncate">
          {{ memberName }}
        </p>
        <span v-if="isOwner" class="text-xs text-orange-600 font-medium">
          ({{ t('members.owner') }})
        </span>
      </div>
      <p class="text-sm text-slate-500 truncate">
        {{ memberEmail }}
      </p>
    </div>

    <!-- Role badge / selector -->
    <div class="flex items-center gap-3">
      <!-- Role display or selector -->
      <div v-if="canChangeRole" class="relative">
        <select
          :value="member.role"
          @change="handleRoleChange"
          class="appearance-none pr-8 pl-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        >
          <option value="manager">{{ t('members.roles.manager') }}</option>
          <option value="member">{{ t('members.roles.member') }}</option>
        </select>
        <ChevronUpDownIcon class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      <div
        v-else
        :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium', roleColor]"
      >
        <component :is="roleIcon" class="w-4 h-4" />
        <span>{{ t(`members.roles.${member.role}`) }}</span>
      </div>

      <!-- Remove button -->
      <button
        v-if="canRemove"
        @click="handleRemove"
        class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        :title="t('members.remove')"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
