<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ProfileAvatarUpload from '@/components/profile/ProfileAvatarUpload.vue'
import ProfileNameForm from '@/components/profile/ProfileNameForm.vue'
import ProfilePasswordForm from '@/components/profile/ProfilePasswordForm.vue'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="min-h-screen bg-orange-50 flex flex-col font-sans">
    <Navbar />
    <main class="flex-grow pt-28">
      <div class="container mx-auto px-6 py-8 max-w-2xl">
        <!-- Back Link -->
        <router-link
          to="/dashboard"
          class="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          {{ t('profile.back') }}
        </router-link>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-800">{{ t('profile.title') }}</h1>
        </div>

        <!-- Profile Sections -->
        <div class="space-y-6">
          <!-- Avatar Section -->
          <ProfileCard
            :title="t('profile.avatar.title')"
            :description="t('profile.avatar.description')"
          >
            <ProfileAvatarUpload />
          </ProfileCard>

          <!-- Name Section -->
          <ProfileCard
            :title="t('profile.name.title')"
            :description="t('profile.name.description')"
          >
            <ProfileNameForm />
          </ProfileCard>

          <!-- Password Section -->
          <ProfileCard
            :title="t('profile.password.title')"
            :description="t('profile.password.description')"
          >
            <ProfilePasswordForm />
          </ProfileCard>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
