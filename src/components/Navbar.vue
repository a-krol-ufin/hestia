<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const appStore = useAppStore()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function navigateToLogin() {
  router.push('/login')
}

function handleLogout() {
  authStore.logout()
  closeDropdown()
  router.push('/')
}
</script>

<template>
  <header class="shadow-md bg-white sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <span class="text-2xl">{{ appStore.content.navbar.logoIcon }}</span>
        <span :class="`font-bold text-xl text-${appStore.theme.primaryColor}`">{{ appStore.content.navbar.logoText }}</span>
      </div>
      <nav class="hidden md:flex items-center space-x-8">
        <a v-for="link in appStore.content.navbar.links" :key="link.id" :href="link.href" class="text-gray-600 hover:text-orange-500 transition-colors">
          {{ t(`content.navbar.links.${link.id}.label`) }}
        </a>
      </nav>
      <div class="flex items-center space-x-4">
        <button @click="appStore.toggleLanguage" class="text-gray-600 hover:text-orange-500 transition-colors font-semibold">
          {{ t('content.navbar.languageSwitch.label') }}
        </button>

        <!-- Auth: Login button or User dropdown -->
        <template v-if="authStore.isAuthenticated">
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <UserCircleIcon class="w-8 h-8" />
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm text-gray-500">{{ t('content.navbar.user.loggedAs') }}</p>
                <p class="text-sm font-medium text-slate-800 truncate">{{ authStore.user?.email }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full px-4 py-2 text-left text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                <span>{{ t('content.navbar.user.logout') }}</span>
              </button>
            </div>
          </div>

          <!-- Click outside to close -->
          <div
            v-if="isDropdownOpen"
            class="fixed inset-0 z-[-1]"
            @click="closeDropdown"
          />
        </template>

        <template v-else>
          <button
            @click="navigateToLogin"
            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('content.navbar.user.login') }}
          </button>
        </template>
      </div>
    </div>
  </header>
</template>
