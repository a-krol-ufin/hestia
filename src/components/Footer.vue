<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const footerLinks = [
  { id: 'features', href: '#features' },
  { id: 'about', href: '#about' },
  { id: 'github', href: 'https://github.com/a-krol-ufin' },
]

const socialLinks = [
  { id: 'linkedin', href: 'https://www.linkedin.com/in/antoni-król', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { id: 'github', href: 'https://github.com/a-krol-ufin', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { id: 'website', href: 'https://brightstack.dev', icon: 'M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 0 1 4.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 0 1 4.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 0 1-4.469 6.201z' },
]
</script>

<template>
  <footer class="bg-slate-800 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <!-- Brand -->
        <div class="flex items-center space-x-2">
          <img src="/img/logo.png" alt="Hestia" class="w-12 h-12" />
          <span class="font-bold text-lg">Hestia</span>
        </div>

        <!-- Links -->
        <nav class="flex flex-wrap justify-center gap-6">
          <a
            v-for="link in footerLinks"
            :key="link.id"
            :href="link.href"
            class="text-gray-400 hover:text-orange-400 transition-colors text-sm"
          >
            {{ t(`content.footer.links.${link.id}`) }}
          </a>
        </nav>

        <!-- Social Icons -->
        <div class="flex items-center space-x-4">
          <a
            v-for="social in socialLinks"
            :key="social.id"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-orange-400 transition-colors"
            :aria-label="social.id"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path :d="social.icon" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-700 mt-8 pt-8 text-center">
        <p class="text-gray-400 text-sm">{{ t('content.footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>
