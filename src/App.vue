<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { theme as antdTheme } from "ant-design-vue";
import enUs from "ant-design-vue/es/locale/en_US";
import ruRu from "ant-design-vue/es/locale/ru_RU";
import AdminSidebar from "./components/AdminSidebar.vue";
import MainHeader from "./components/MainHeader.vue";

type ThemeMode = "light" | "dark";
type LocaleCode = "ru" | "en";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const stored = window.localStorage.getItem("dashboard-theme-mode");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return "dark";
};

const getStoredLocale = (): LocaleCode => {
  if (typeof window === "undefined") {
    return "ru";
  }
  const stored = window.localStorage.getItem("dashboard-locale");
  return stored === "en" ? "en" : "ru";
};

const getStoredSidebarState = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const stored = window.localStorage.getItem("dashboard-sidebar-collapsed");
  return stored === "true";
};

const themeMode = ref<ThemeMode>(getStoredThemeMode());
const localeCode = ref<LocaleCode>(getStoredLocale());
const sidebarCollapsed = ref<boolean>(getStoredSidebarState());

const themeConfig = computed(() => ({
  token: {
    colorPrimary: "#1a73e8",
    fontFamily: "Inter, Roboto, Helvetica Neue, Arial, sans-serif",
    borderRadius: 8,
  },
  algorithm: themeMode.value === "dark" ? [darkAlgorithm] : [defaultAlgorithm],
}));

const currentLocale = computed(() => (localeCode.value === "ru" ? ruRu : enUs));

watch(
  themeMode,
  (mode) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dashboard-theme-mode", mode);
    }
  },
  { immediate: true }
);

watch(localeCode, (locale) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("dashboard-locale", locale);
  }
});

watch(sidebarCollapsed, (collapsed) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("dashboard-sidebar-collapsed", String(collapsed));
  }
});
</script>

<template>
  <a-config-provider :locale="currentLocale" :theme="themeConfig">
    <div class="app-shell" :class="{ 'app-shell--sidebar-collapsed': sidebarCollapsed }">
        <AdminSidebar v-model:collapsed="sidebarCollapsed" />
      <div class="app-shell__main">
        <MainHeader
          v-model:theme-mode="themeMode"
          v-model:locale="localeCode"
        />
        <div class="router-view-container">
          <router-view />
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--color-bg-content);
  color: var(--color-text-primary);
  font-family: "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.app-shell__main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: var(--sidebar-width, 260px);
  transition: margin-left var(--transition-base), background-color var(--transition-base);
  background: var(--color-bg-content);
}

.app-shell--sidebar-collapsed .app-shell__main {
  margin-left: var(--sidebar-width-collapsed, 80px);
}

.router-view-container {
  padding-top: 64px;
  overflow-y: auto;
  flex: 1;
  min-height: calc(100vh - 64px);
  background: var(--color-bg-content);
  transition: background-color var(--transition-base);
}

@media (max-width: 920px) {
  .app-shell__main {
    margin-left: 0;
  }
}
</style>
