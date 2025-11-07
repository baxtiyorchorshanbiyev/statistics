<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { theme as antdTheme } from 'ant-design-vue'
import ruRu from 'ant-design-vue/es/locale/ru_RU'
import enUs from 'ant-design-vue/es/locale/en_US'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminTopBar from './components/AdminTopBar.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'

type ThemeMode = 'light' | 'dark'
type LocaleCode = 'ru' | 'en'

const { defaultAlgorithm, darkAlgorithm } = antdTheme

const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }
  const stored = window.localStorage.getItem('dashboard-theme-mode')
  return stored === 'dark' ? 'dark' : 'light'
}

const getStoredLocale = (): LocaleCode => {
  if (typeof window === 'undefined') {
    return 'ru'
  }
  const stored = window.localStorage.getItem('dashboard-locale')
  return stored === 'en' ? 'en' : 'ru'
}

const themeMode = ref<ThemeMode>(getStoredThemeMode())
const localeCode = ref<LocaleCode>(getStoredLocale())

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#1a73e8',
    fontFamily: 'Inter, Roboto, Helvetica Neue, Arial, sans-serif',
    borderRadius: 8
  },
  algorithm: themeMode.value === 'dark' ? [darkAlgorithm] : [defaultAlgorithm]
}))

const currentLocale = computed(() => (localeCode.value === 'ru' ? ruRu : enUs))

watch(
  themeMode,
  (mode) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode)
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dashboard-theme-mode', mode)
    }
  },
  { immediate: true }
)

watch(localeCode, (locale) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('dashboard-locale', locale)
  }
})
</script>

<template>
  <a-config-provider :locale="currentLocale" :theme="themeConfig">
    <div class="app-shell">
      <AdminSidebar />
      <div class="app-shell__main">
        <AdminTopBar v-model:theme-mode="themeMode" v-model:locale="localeCode" />
        <StatisticsPanel />
      </div>
    </div>
  </a-config-provider>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-bg-page);
  transition: background-color 0.3s ease;
}

@media (max-width: 920px) {
  .app-shell {
    flex-direction: column;
  }

  .app-shell__main {
    min-height: calc(100vh - 320px);
  }
}
</style>
