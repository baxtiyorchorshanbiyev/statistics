<script setup lang="ts">
import { ref } from 'vue'

const dateRangeOptions = ['За последние 7 дней', 'За последние 28 дней', 'За последние 3 месяца']
const selectedRange = ref(dateRangeOptions[1])

const environments = ['osonkassa.uz', 'sandbox.osonkassa.uz']
const selectedEnv = ref(environments[0])
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <div class="topbar__title">Statistika</div>
      <p class="topbar__description">so'nggi qarashlar va asosiy ko'rsatkichlar</p>
    </div>
    <div class="topbar__controls">
      <label class="topbar__field">
        <span class="topbar__label">Sayt</span>
        <select v-model="selectedEnv" class="topbar__select">
          <option v-for="env in environments" :key="env" :value="env">{{ env }}</option>
        </select>
      </label>
      <label class="topbar__field">
        <span class="topbar__label">Davr</span>
        <select v-model="selectedRange" class="topbar__select">
          <option v-for="range in dateRangeOptions" :key="range" :value="range">{{ range }}</option>
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
  text-transform: lowercase;
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
