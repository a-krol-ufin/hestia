import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '@/i18n'

export const useAppStore = defineStore('app', () => {
  const config = {
    meta: {
      appName: "Hestia",
      version: "1.0.0",
      theme: {
        primaryColor: "orange-500",
        secondaryColor: "slate-800",
        backgroundColor: "bg-orange-50",
        fontFamily: "sans-serif"
      }
    },
    content: {
      navbar: {
        logoText: "Hestia",
        logoIcon: "🔥",
        links: [
          { id: "features", href: "#features" },
          { id: "install", href: "#install" },
          { id: "github", href: "https://github.com/twoj-user/hestia" }
        ]
      },
      hero: {
        ctaButton: {
          action: "/login",
          styleClass: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
        },
        imagePlaceholder: "hero-dashboard-preview.png"
      },
      featuresSection: {
        cards: [
          { id: "shopping", icon: "ShoppingCartIcon" },
          { id: "budget", icon: "ChartPieIcon" },
          { id: "privacy", icon: "LockClosedIcon" }
        ]
      },
      footer: {
        techStackText: "Powered by Vue 3, PocketBase & Docker."
      }
    }
  }

  const storedLang = localStorage.getItem('user-language')
  const defaultLang = storedLang || 'en'
  const language = ref(defaultLang)

  // Initialize i18n
  if (i18n.global.locale.value !== language.value) {
    i18n.global.locale.value = language.value as 'en' | 'pl'
  }

  const theme = computed(() => config.meta.theme)
  const content = computed(() => config.content)

  function setLanguage(lang: string) {
    language.value = lang
    i18n.global.locale.value = lang as 'en' | 'pl'
    localStorage.setItem('user-language', lang)
  }

  function toggleLanguage() {
    const newLang = language.value === 'en' ? 'pl' : 'en'
    setLanguage(newLang)
  }

  return {
    theme,
    content,
    language,
    setLanguage,
    toggleLanguage,
  }
})
