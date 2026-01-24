<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import HouseholdDropdown from './HouseholdDropdown.vue'
import { useBudgetStore } from '@/stores/budget'

interface Props {
  currentMonth: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'previous-month': []
  'next-month': []
  'go-back': []
  'open-manage-modal': []
}>()

const { t, locale } = useI18n({ useScope: 'global' })
const budgetStore = useBudgetStore()

const formattedMonth = computed(() => {
  const date = new Date(props.currentMonth + '-01')
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long'
  })
})
</script>

<template>
  <div class="budget-header">
    <div class="budget-header__title-group">
      <button
        @click="emit('go-back')"
        class="budget-header__back-btn"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        <span class="sr-only sm:not-sr-only">{{ t('budget.back') }}</span>
      </button>
      <h1 class="budget-header__title">{{ t('budget.title') }}</h1>
    </div>

    <div class="flex items-center gap-4">
      <!-- Month selector pill -->
      <div class="budget-month-pill">
        <button
          @click="emit('previous-month')"
          class="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        <span class="min-w-[120px] text-center">{{ formattedMonth }}</span>
        <button
          @click="emit('next-month')"
          class="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Household dropdown -->
      <HouseholdDropdown
        v-if="budgetStore.currentHousehold"
        @open-manage-modal="emit('open-manage-modal')"
      />
    </div>
  </div>
</template>
