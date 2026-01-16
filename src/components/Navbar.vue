<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const appStore = useAppStore()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

const currentLocale = computed(() => appStore.language)

const navLinks = [
  { id: 'home', href: '/' },
  { id: 'features', href: '#features' },
  { id: 'about', href: '#about' },
  { id: 'contact', href: '#contact' },
]

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

function setLanguage(lang: string) {
  appStore.setLanguage(lang)
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Brand -->
      <router-link to="/" class="flex items-center space-x-2">
        <img src="/img/logo.png" alt="Hestia" class="w-16 h-16" />
        <span class="font-bold text-xl text-slate-800">Hestia</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <template v-for="link in navLinks" :key="link.id">
          <router-link
            v-if="link.href === '/'"
            :to="link.href"
            class="text-gray-600 hover:text-orange-500 transition-colors"
          >
            {{ t(`content.navbar.links.${link.id}.label`) }}
          </router-link>
          <a
            v-else
            :href="link.href"
            class="text-gray-600 hover:text-orange-500 transition-colors"
          >
            {{ t(`content.navbar.links.${link.id}.label`) }}
          </a>
        </template>
      </nav>

      <div class="flex items-center space-x-4">
        <!-- Language Switcher with Flags -->
        <div class="flex items-center space-x-1">
          <button
            @click="setLanguage('pl')"
            :class="[
              'px-2 py-1 rounded transition-all text-sm font-medium',
              currentLocale === 'pl' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <span class="mr-1">🇵🇱</span>PL
          </button>
          <button
            @click="setLanguage('en')"
            :class="[
              'px-2 py-1 rounded transition-all text-sm font-medium',
              currentLocale === 'en' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <span class="mr-1">🇬🇧</span>EN
          </button>
        </div>

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
            class="hidden md:block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('content.navbar.user.login') }}
          </button>
        </template>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden text-gray-600">
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 px-6 py-4">
      <nav class="flex flex-col space-y-4">
        <template v-for="link in navLinks" :key="link.id">
          <router-link
            v-if="link.href === '/'"
            :to="link.href"
            class="text-gray-600 hover:text-orange-500 transition-colors"
            @click="toggleMobileMenu"
          >
            {{ t(`content.navbar.links.${link.id}.label`) }}
          </router-link>
          <a
            v-else
            :href="link.href"
            class="text-gray-600 hover:text-orange-500 transition-colors"
            @click="toggleMobileMenu"
          >
            {{ t(`content.navbar.links.${link.id}.label`) }}
          </a>
        </template>
        <button
          v-if="!authStore.isAuthenticated"
          @click="navigateToLogin(); toggleMobileMenu()"
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
        >
          {{ t('content.navbar.user.login') }}
        </button>
      </nav>
    </div>
  </header>
</template>
