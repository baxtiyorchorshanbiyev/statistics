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
    return "light";
  }
  const stored = window.localStorage.getItem("dashboard-theme-mode");
  return stored === "dark" ? "dark" : "light";
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
    <div class="app-shell">
      <AdminSidebar :collapsed="sidebarCollapsed" />
      <div class="app-shell__main">
        <MainHeader
          v-model:theme-mode="themeMode"
          v-model:locale="localeCode"
          v-model:sidebar-collapsed="sidebarCollapsed"
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
  background: #f8f9fa;
  color: #202124;
  font-family: "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

[data-theme="dark"] .app-shell {
  background: #202124;
  color: #e8eaed;
}

.app-shell__main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 260px;
  transition: margin-left 0.3s ease, background-color 0.3s ease;
}

.app-shell:has(.sidebar--collapsed) .app-shell__main {
  margin-left: 80px;
}

.router-view-container {
  padding-top: 64px;
  overflow-y: auto;
  flex: 1;
  min-height: calc(100vh - 64px);
  background: #f8f9fa;
}

[data-theme="dark"] .router-view-container {
  background: #202124;
}

@media (max-width: 920px) {
  .app-shell__main {
    margin-left: 0;
  }
}
</style>
