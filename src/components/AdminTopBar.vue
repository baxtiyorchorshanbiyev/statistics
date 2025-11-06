<script setup lang="ts">
import { computed, ref } from 'vue'

const dateRangeOptions = [
  { label: 'Oxirgi 7 kun', value: 'last-7' },
  { label: 'Oxirgi 28 kun', value: 'last-28' },
  { label: 'Oxirgi 3 oy', value: 'last-90' }
]
const selectedRange = ref(dateRangeOptions[1].value)

const environments = [
  { label: 'Osonkassa', value: 'osonkassa' },
  { label: 'Osonkassa Sandbox', value: 'sandbox' }
]
const selectedEnv = ref(environments[0].value)

const selectedRangeLabel = computed(() => dateRangeOptions.find((option) => option.value === selectedRange.value)?.label ?? '')
const selectedEnvLabel = computed(() => environments.find((option) => option.value === selectedEnv.value)?.label ?? '')
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <div class="topbar__title">Statistika paneli</div>
      <p class="topbar__description">API gateway faoliyati bo‘yicha asosiy ko‘rsatkichlar</p>
      <div class="topbar__meta">
        <span class="topbar__chip">{{ selectedEnvLabel }}</span>
        <span class="topbar__chip topbar__chip--outline">{{ selectedRangeLabel }}</span>
      </div>
    </div>
    <div class="topbar__controls">
      <label class="topbar__field">
        <span class="topbar__label">Hisob</span>
        <select v-model="selectedEnv" class="topbar__select">
          <option v-for="env in environments" :key="env.value" :value="env.value">{{ env.label }}</option>
        </select>
      </label>
      <label class="topbar__field">
        <span class="topbar__label">Davr</span>
        <select v-model="selectedRange" class="topbar__select">
          <option v-for="range in dateRangeOptions" :key="range.value" :value="range.value">{{ range.label }}</option>
        </select>
      </label>
      <button class="topbar__action" type="button">Eksport</button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  background: #fff;
  border-bottom: 1px solid #e0e3e7;
}

.topbar__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.topbar__title {
  font-size: 20px;
  font-weight: 600;
  color: #202124;
}

.topbar__description {
  font-size: 13px;
  color: #5f6368;
  margin: 0;
}

.topbar__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.topbar__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #1a73e8;
  border-radius: 9999px;
  background: rgba(26, 115, 232, 0.12);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.topbar__chip--outline {
  background: transparent;
  color: #5f6368;
  border: 1px solid #dadce0;
}

.topbar__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #5f6368;
}

.topbar__label {
  font-weight: 500;
}

.topbar__select {
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: 14px;
  color: #202124;
  background: #fff;
  appearance: none;
  background-image: url('data:image/svg+xml,%3Csvg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M7 10l5 5 5-5" stroke="%235f6368" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.topbar__select:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.topbar__action {
  padding: 10px 16px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.topbar__action:hover {
  background: #1557b0;
}

@media (max-width: 960px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .topbar__controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .topbar__select {
    min-width: 160px;
  }
}
</style>
