import { defineStore } from 'pinia'
import { computed } from 'vue'
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

  const theme = computed(() => config.meta.theme)
  const content = computed(() => config.content)

  function toggleLanguage() {
    i18n.global.locale.value = i18n.global.locale.value === 'en' ? 'pl' : 'en'
  }

  return {
    theme,
    content,
    toggleLanguage,
  }
})
