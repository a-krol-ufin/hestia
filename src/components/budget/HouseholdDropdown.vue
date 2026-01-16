<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import { ChevronDownIcon, HomeIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  openManageModal: []
}>()

const { t } = useI18n({ useScope: 'global' })
const budgetStore = useBudgetStore()
const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectHousehold(id: string) {
  budgetStore.selectHousehold(id)
  isOpen.value = false
}

function openManageModal() {
  isOpen.value = false
  emit('openManageModal')
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.household-dropdown')) {
    isOpen.value = false
  }
}

// Add event listener when dropdown is open
function setupClickOutside() {
  if (isOpen.value) {
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}

// Watch for dropdown state changes
import { watch } from 'vue'
watch(isOpen, setupClickOutside)
</script>

<template>
  <div class="relative household-dropdown">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
    >
      <HomeIcon class="w-5 h-5" />
      <span class="font-medium">
        {{ budgetStore.currentHousehold?.name || t('budget.household') }}
      </span>
      <ChevronDownIcon
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-slate-200 min-w-[250px] z-50 overflow-hidden"
    >
      <!-- Households list -->
      <div class="max-h-64 overflow-y-auto">
        <button
          v-for="household in budgetStore.households"
          :key="household.id"
          @click="selectHousehold(household.id)"
          class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3"
          :class="{
            'bg-orange-50 text-orange-700 font-semibold': household.id === budgetStore.currentHousehold?.id
          }"
        >
          <HomeIcon class="w-5 h-5 flex-shrink-0" />
          <span class="truncate">{{ household.name }}</span>
        </button>
      </div>

      <!-- Manage button -->
      <div class="border-t border-slate-200">
        <button
          @click="openManageModal"
          class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700 font-medium"
        >
          <Cog6ToothIcon class="w-5 h-5 flex-shrink-0" />
          <span>{{ t('budget.manageHouseholds') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
