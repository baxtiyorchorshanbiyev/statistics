<script setup lang="ts">
import { ref } from 'vue'
import StatisticsPanel from '../components/StatisticsPanel.vue'
import ContentFilters from '../components/ContentFilters.vue'

const environments = [
  { label: 'Osonkassa', description: 'Prod muhit', value: 'osonkassa' },
  { label: 'Osonkassa Sandbox', description: 'Test muhit', value: 'sandbox' }
]

const dateRangeOptions = [
  { label: 'Oxirgi 7 kun', value: 'last-7' },
  { label: 'Oxirgi 28 kun', value: 'last-28' },
  { label: 'Oxirgi 3 oy', value: 'last-90' }
]

const selectedEnv = ref(environments[0]?.value ?? '')
const selectedRange = ref(dateRangeOptions[1]?.value ?? dateRangeOptions[0]?.value ?? '')
</script>

<template>
  <div class="page-view">
    <ContentFilters
      v-model:environment="selectedEnv"
      v-model:dateRange="selectedRange"
      :environments="environments"
      :date-range-options="dateRangeOptions"
      title="Statistika paneli"
      subtitle="API gateway faoliyati bo'yicha asosiy ko'rsatkichlar"
    />
    <StatisticsPanel />
  </div>
</template>

<style scoped>
.page-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>

