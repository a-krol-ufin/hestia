<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { XMarkIcon, UsersIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import { memberService } from '@/services/member.service'
import { invitationService } from '@/services/invitation.service'
import { useAuthStore } from '@/stores/auth'
import type { HouseholdMember, MemberRole } from '@/types/member.types'
import type { Invitation } from '@/types/notification.types'
import MemberListItem from './MemberListItem.vue'
import InviteMemberForm from './InviteMemberForm.vue'

const props = defineProps<{
  householdId: string
  householdName: string
  ownerId: string
}>()

const emit = defineEmits<{
  close: []
  memberRemoved: []
}>()

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const members = ref<HouseholdMember[]>([])
const pendingInvitations = ref<Invitation[]>([])
const currentUserMembership = ref<HouseholdMember | null>(null)
const isLoading = ref(false)
const showInviteForm = ref(false)
const error = ref<string | null>(null)

// Check if current user is the household owner
const isOwner = computed(() => authStore.user?.id === props.ownerId)

// Current user role - owner is always admin even without membership record
const currentUserRole = computed<MemberRole>(() => {
  if (isOwner.value) return 'admin'
  return currentUserMembership.value?.role || 'member'
})

// Owner and managers can invite
const canInvite = computed(() => isOwner.value || currentUserRole.value === 'admin' || currentUserRole.value === 'manager')

async function loadMembers() {
  isLoading.value = true
  error.value = null

  try {
    members.value = await memberService.getMembers(props.householdId)
    currentUserMembership.value = await memberService.getCurrentUserMembership(props.householdId)

    // Load pending invitations if user can invite
    if (canInvite.value) {
      const invitations = await invitationService.getInvitations(props.householdId)
      pendingInvitations.value = invitations.filter(i => i.status === 'pending')
    }
  } catch (e) {
    error.value = t('members.errorLoading')
    console.error(e)
  }

  isLoading.value = false
}

async function handleChangeRole(memberId: string, newRole: MemberRole) {
  const success = await memberService.updateMemberRole(memberId, { role: newRole })
  if (success) {
    await loadMembers()
  } else {
    error.value = t('members.errorChangeRole')
  }
}

async function handleRemoveMember(memberId: string) {
  if (!confirm(t('members.confirmRemove'))) return

  const success = await memberService.removeMember(memberId)
  if (success) {
    await loadMembers()
    emit('memberRemoved')
  } else {
    error.value = t('members.errorRemove')
  }
}

async function handleInvite(email: string, role: Exclude<MemberRole, 'admin'>, message?: string) {
  error.value = null

  const invitation = await invitationService.sendInvitation({
    household: props.householdId,
    invitee_email: email,
    role,
    message,
  })

  if (invitation) {
    showInviteForm.value = false
    await loadMembers()
  } else {
    error.value = t('members.errorInvite')
  }
}

async function handleCancelInvitation(invitationId: string) {
  if (!confirm(t('members.confirmCancelInvitation'))) return

  const success = await invitationService.cancelInvitation(invitationId)
  if (success) {
    pendingInvitations.value = pendingInvitations.value.filter(i => i.id !== invitationId)
  } else {
    error.value = t('members.errorCancelInvitation')
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

onMounted(() => {
  loadMembers()
})
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click="handleBackdropClick"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <UsersIcon class="w-6 h-6 text-orange-500" />
          <div>
            <h2 class="text-xl font-bold text-slate-800">
              {{ t('members.title') }}
            </h2>
            <p class="text-sm text-slate-500">
              {{ householdName }}
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <XMarkIcon class="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Error message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Invite button / form -->
        <div v-if="canInvite" class="mb-6">
          <InviteMemberForm
            v-if="showInviteForm"
            @invite="handleInvite"
            @cancel="showInviteForm = false"
          />
          <button
            v-else
            @click="showInviteForm = true"
            class="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <UserPlusIcon class="w-5 h-5" />
            <span class="font-medium">{{ t('members.inviteMember') }}</span>
          </button>
        </div>

        <!-- Pending invitations -->
        <div v-if="pendingInvitations.length > 0" class="mb-6">
          <h3 class="text-sm font-semibold text-slate-600 mb-3">
            {{ t('members.pendingInvitations') }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="invitation in pendingInvitations"
              :key="invitation.id"
              class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div>
                <p class="font-medium text-slate-800">{{ invitation.invitee_email }}</p>
                <p class="text-sm text-slate-500">
                  {{ t(`members.roles.${invitation.role}`) }} - {{ t('members.pending') }}
                </p>
              </div>
              <button
                @click="handleCancelInvitation(invitation.id)"
                class="text-sm text-slate-600 hover:text-red-600 font-medium"
              >
                {{ t('members.cancel') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8 text-slate-500">
          {{ t('members.loading') }}
        </div>

        <!-- Members list -->
        <div v-else>
          <h3 class="text-sm font-semibold text-slate-600 mb-3">
            {{ t('members.members') }} ({{ members.length || (isOwner ? 1 : 0) }})
          </h3>

          <!-- Show owner info if no members but user is owner -->
          <div v-if="members.length === 0 && isOwner" class="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span class="text-orange-600 font-semibold">{{ authStore.user?.name?.charAt(0) || authStore.user?.email?.charAt(0) || '?' }}</span>
              </div>
              <div>
                <p class="font-medium text-slate-800">{{ authStore.user?.name || authStore.user?.email }}</p>
                <p class="text-sm text-orange-600 font-medium">{{ t('members.owner') }} ({{ t('members.roles.admin') }})</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <MemberListItem
              v-for="member in members"
              :key="member.id"
              :member="member"
              :current-user-role="currentUserRole"
              :is-owner="member.user === ownerId"
              @change-role="handleChangeRole"
              @remove="handleRemoveMember"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-slate-200">
        <button
          @click="emit('close')"
          class="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {{ t('budget.close') }}
        </button>
      </div>
    </div>
  </div>
</template>
