<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import { XMarkIcon, HomeIcon, TrashIcon, PencilIcon, PlusIcon, UsersIcon } from '@heroicons/vue/24/outline'
import HouseholdMembersModal from './HouseholdMembersModal.vue'

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n({ useScope: 'global' })
const budgetStore = useBudgetStore()

const editingId = ref<string | null>(null)
const editingName = ref('')
const newHouseholdName = ref('')
const showCreateForm = ref(false)
const showMembersModal = ref(false)
const selectedHousehold = ref<{ id: string; name: string; owner: string } | null>(null)

function openMembersModal(household: { id: string; name: string; owner: string }) {
  selectedHousehold.value = household
  showMembersModal.value = true
}

function closeMembersModal() {
  showMembersModal.value = false
  selectedHousehold.value = null
}

function startEdit(id: string, name: string) {
  editingId.value = id
  editingName.value = name
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

async function saveEdit(id: string) {
  if (!editingName.value.trim()) return

  await budgetStore.updateHousehold(id, { name: editingName.value })
  editingId.value = null
  editingName.value = ''
}

async function deleteHousehold(id: string) {
  if (confirm(t('budget.confirmDeleteHousehold'))) {
    await budgetStore.deleteHousehold(id)
  }
}

async function createHousehold() {
  if (!newHouseholdName.value.trim()) return

  await budgetStore.createHousehold({ name: newHouseholdName.value })
  newHouseholdName.value = ''
  showCreateForm.value = false
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click="handleBackdropClick"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-800">
          {{ t('budget.manageHouseholds') }}
        </h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <XMarkIcon class="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Create new household form -->
        <div v-if="showCreateForm" class="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 class="font-semibold text-slate-800 mb-3">
            {{ t('budget.createNewHousehold') }}
          </h3>
          <div class="flex gap-2">
            <input
              v-model="newHouseholdName"
              type="text"
              :placeholder="t('budget.householdNamePlaceholder')"
              maxlength="200"
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              @keyup.enter="createHousehold"
            />
            <button
              @click="createHousehold"
              :disabled="!newHouseholdName.trim()"
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
            >
              {{ t('budget.create') }}
            </button>
            <button
              @click="showCreateForm = false; newHouseholdName = ''"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              {{ t('budget.cancel') }}
            </button>
          </div>
        </div>

        <!-- Create button -->
        <button
          v-else
          @click="showCreateForm = true"
          class="w-full mb-6 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
        >
          <PlusIcon class="w-5 h-5" />
          <span class="font-medium">{{ t('budget.createNewHousehold') }}</span>
        </button>

        <!-- Households list -->
        <div v-if="budgetStore.households.length === 0" class="text-center py-12 text-slate-500">
          {{ t('budget.noHouseholds') }}
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="household in budgetStore.households"
            :key="household.id"
            class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
          >
            <HomeIcon class="w-6 h-6 text-slate-600 flex-shrink-0" />

            <!-- Display mode -->
            <div v-if="editingId !== household.id" class="flex-1 flex items-center justify-between">
              <div>
                <p class="font-semibold text-slate-800">
                  {{ household.name }}
                </p>
                <p v-if="household.id === budgetStore.currentHousehold?.id" class="text-xs text-orange-600 font-medium">
                  {{ t('budget.household') }} ({{ t('budget.onBudget').toLowerCase() }})
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="openMembersModal(household)"
                  class="p-2 text-slate-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
                  :title="t('members.title')"
                >
                  <UsersIcon class="w-5 h-5" />
                </button>
                <button
                  @click="startEdit(household.id, household.name)"
                  class="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button
                  @click="deleteHousehold(household.id)"
                  :disabled="budgetStore.households.length === 1"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Edit mode -->
            <div v-else class="flex-1 flex items-center gap-2">
              <input
                v-model="editingName"
                type="text"
                maxlength="200"
                class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                @keyup.enter="saveEdit(household.id)"
                @keyup.escape="cancelEdit"
              />
              <button
                @click="saveEdit(household.id)"
                :disabled="!editingName.trim()"
                class="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
              >
                {{ t('budget.create') }}
              </button>
              <button
                @click="cancelEdit"
                class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
              >
                {{ t('budget.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-slate-200">
        <button
          @click="emit('close')"
          class="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {{ t('budget.close') }}
        </button>
      </div>
    </div>

    <!-- Members Modal -->
    <HouseholdMembersModal
      v-if="showMembersModal && selectedHousehold"
      :household-id="selectedHousehold.id"
      :household-name="selectedHousehold.name"
      :owner-id="selectedHousehold.owner"
      @close="closeMembersModal"
    />
  </div>
</template>
