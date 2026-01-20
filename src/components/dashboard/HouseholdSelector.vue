<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHouseholdStore } from '@/stores/household'
import {
  HomeIcon,
  ChevronDownIcon,
  PlusIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import ManageHouseholdsModal from '@/components/budget/ManageHouseholdsModal.vue'
import HouseholdMembersModal from '@/components/budget/HouseholdMembersModal.vue'

const { t } = useI18n({ useScope: 'global' })
const householdStore = useHouseholdStore()

const isDropdownOpen = ref(false)
const showManageModal = ref(false)
const showMembersModal = ref(false)

onMounted(async () => {
  if (householdStore.households.length === 0) {
    await householdStore.fetchHouseholds()
  }
})

function selectHousehold(id: string) {
  householdStore.selectHousehold(id)
  isDropdownOpen.value = false
}

function openManageModal() {
  showManageModal.value = true
  isDropdownOpen.value = false
}

function openMembersModal() {
  showMembersModal.value = true
  isDropdownOpen.value = false
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-orange-100 rounded-xl">
          <HomeIcon class="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium">{{ t('household.current') }}</p>
          <h2 class="text-xl font-bold text-slate-800">
            {{ householdStore.currentHousehold?.name || t('household.none') }}
          </h2>
        </div>
      </div>

      <!-- Dropdown and Actions -->
      <div class="flex items-center gap-2">
        <!-- Members Button -->
        <button
          v-if="householdStore.currentHousehold"
          @click="openMembersModal"
          class="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          :title="t('household.members')"
        >
          <UsersIcon class="w-5 h-5" />
        </button>

        <!-- Settings Button -->
        <button
          @click="openManageModal"
          class="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          :title="t('household.manage')"
        >
          <Cog6ToothIcon class="w-5 h-5" />
        </button>

        <!-- Dropdown -->
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-colors font-medium"
          >
            <span>{{ t('household.switch') }}</span>
            <ChevronDownIcon
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': isDropdownOpen }"
            />
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
              @click.stop
            >
              <!-- No households message -->
              <div v-if="householdStore.households.length === 0" class="px-4 py-3 text-sm text-slate-500">
                {{ t('household.noHouseholds') }}
              </div>

              <!-- Household list -->
              <button
                v-for="household in householdStore.households"
                :key="household.id"
                @click="selectHousehold(household.id)"
                class="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center gap-3 transition-colors"
                :class="{
                  'bg-orange-50 text-orange-600': household.id === householdStore.currentHouseholdId,
                  'text-slate-700': household.id !== householdStore.currentHouseholdId,
                }"
              >
                <HomeIcon class="w-5 h-5" />
                <span class="font-medium truncate">{{ household.name }}</span>
              </button>

              <!-- Divider -->
              <div class="border-t border-slate-200 my-2"></div>

              <!-- Create new household -->
              <button
                @click="openManageModal"
                class="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-600 transition-colors"
              >
                <PlusIcon class="w-5 h-5" />
                <span class="font-medium">{{ t('household.create') }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>

  <!-- Modals -->
  <ManageHouseholdsModal
    v-if="showManageModal"
    @close="showManageModal = false"
  />

  <HouseholdMembersModal
    v-if="showMembersModal && householdStore.currentHousehold"
    :household-id="householdStore.currentHousehold.id"
    :household-name="householdStore.currentHousehold.name"
    :owner-id="householdStore.currentHousehold.owner"
    @close="showMembersModal = false"
  />
</template>
