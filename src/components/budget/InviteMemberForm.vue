<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import type { MemberRole } from '@/types/member.types'

const emit = defineEmits<{
  invite: [email: string, role: Exclude<MemberRole, 'admin'>, message?: string]
  cancel: []
}>()

const { t } = useI18n({ useScope: 'global' })

const email = ref('')
const role = ref<Exclude<MemberRole, 'admin'>>('member')
const message = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function handleSubmit() {
  error.value = null

  if (!email.value.trim()) {
    error.value = t('members.errorEmailRequired')
    return
  }

  if (!validateEmail(email.value.trim())) {
    error.value = t('members.errorEmailInvalid')
    return
  }

  isLoading.value = true
  emit('invite', email.value.trim(), role.value, message.value.trim() || undefined)
  isLoading.value = false
}

function handleCancel() {
  email.value = ''
  role.value = 'member'
  message.value = ''
  error.value = null
  emit('cancel')
}
</script>

<template>
  <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
    <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
      <EnvelopeIcon class="w-5 h-5 text-orange-500" />
      {{ t('members.inviteMember') }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email input -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ t('members.emailLabel') }}
        </label>
        <input
          v-model="email"
          type="email"
          :placeholder="t('members.emailPlaceholder')"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
          :disabled="isLoading"
        />
      </div>

      <!-- Role selector -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ t('members.roleLabel') }}
        </label>
        <select
          v-model="role"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
          :disabled="isLoading"
        >
          <option value="manager">{{ t('members.roles.manager') }}</option>
          <option value="member">{{ t('members.roles.member') }}</option>
        </select>
        <p class="text-xs text-slate-500 mt-1">
          {{ role === 'manager' ? t('members.managerDescription') : t('members.memberDescription') }}
        </p>
      </div>

      <!-- Optional message -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ t('members.messageLabel') }}
          <span class="text-slate-400 font-normal">{{ t('budget.optional') }}</span>
        </label>
        <textarea
          v-model="message"
          :placeholder="t('members.messagePlaceholder')"
          rows="2"
          maxlength="500"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
          :disabled="isLoading"
        />
      </div>

      <!-- Error message -->
      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleCancel"
          :disabled="isLoading"
          class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {{ t('budget.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="isLoading || !email.trim()"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-300 flex items-center gap-2"
        >
          <PaperAirplaneIcon class="w-4 h-4" />
          {{ t('members.sendInvitation') }}
        </button>
      </div>
    </form>
  </div>
</template>
