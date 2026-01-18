<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { UserCircleIcon, PhotoIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const currentAvatarUrl = computed(() => authStore.getAvatarUrl())
const displayUrl = computed(() => previewUrl.value || currentAvatarUrl.value)
const hasAvatar = computed(() => !!authStore.user?.avatar)
const hasChanges = computed(() => selectedFile.value !== null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  error.value = null
  successMessage.value = null

  if (!file.type.startsWith('image/')) {
    error.value = t('profile.avatar.errorInvalidType')
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    error.value = t('profile.avatar.errorTooLarge')
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function saveAvatar() {
  if (!selectedFile.value) return

  isLoading.value = true
  error.value = null
  successMessage.value = null

  const success = await authStore.updateProfile({ avatar: selectedFile.value })

  if (success) {
    successMessage.value = t('profile.avatar.success')
    clearPreview()
  } else {
    error.value = authStore.error || t('profile.avatar.errorUpload')
  }

  isLoading.value = false
}

async function removeAvatar() {
  isLoading.value = true
  error.value = null
  successMessage.value = null

  const success = await authStore.updateProfile({ avatar: null })

  if (success) {
    successMessage.value = t('profile.avatar.removed')
    clearPreview()
  } else {
    error.value = authStore.error || t('profile.avatar.errorRemove')
  }

  isLoading.value = false
}

function cancelPreview() {
  clearPreview()
}

function clearPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Avatar Display -->
    <div class="relative">
      <div
        class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg"
      >
        <img
          v-if="displayUrl"
          :src="displayUrl"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
        <UserCircleIcon v-else class="w-24 h-24 text-gray-400" />
      </div>

      <!-- Change Photo Button -->
      <button
        type="button"
        @click="triggerFileInput"
        class="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-md transition-colors"
        :disabled="isLoading"
      >
        <PhotoIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Error/Success Messages -->
    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
    <p v-if="successMessage" class="text-sm text-green-600 text-center">{{ successMessage }}</p>

    <!-- Action Buttons -->
    <div class="flex flex-wrap justify-center gap-2">
      <!-- Save Button (when preview exists) -->
      <button
        v-if="hasChanges"
        type="button"
        @click="saveAvatar"
        :disabled="isLoading"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {{ isLoading ? t('profile.saving') : t('profile.avatar.save') }}
      </button>

      <!-- Cancel Button (when preview exists) -->
      <button
        v-if="hasChanges"
        type="button"
        @click="cancelPreview"
        :disabled="isLoading"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {{ t('profile.cancel') }}
      </button>

      <!-- Remove Button (when avatar exists and no preview) -->
      <button
        v-if="hasAvatar && !hasChanges"
        type="button"
        @click="removeAvatar"
        :disabled="isLoading"
        class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-1"
      >
        <TrashIcon class="w-4 h-4" />
        <span>{{ t('profile.avatar.remove') }}</span>
      </button>
    </div>

    <!-- Help Text -->
    <p class="text-xs text-gray-500 text-center">
      {{ t('profile.avatar.helpText') }}
    </p>
  </div>
</template>
