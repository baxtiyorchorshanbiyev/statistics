<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  DashboardOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  BugOutlined,
  LineChartOutlined,
  DownOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export interface NavItem {
  label: string
  badge?: string
  path: string
  icon: any
}

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'logout'): void
}>()

const route = useRoute()

const resources = ref([
  { label: 'osonkassa.uz', value: 'osonkassa', icon: '🏢' },
  { label: 'api.osonkassa.uz', value: 'api', icon: '⚙️' },
  { label: 'staging.osonkassa.uz', value: 'staging', icon: '🧪' }
])

const selectedResource = ref('osonkassa')

const navItems: NavItem[] = [
  { label: 'Statistika', path: '/', icon: DashboardOutlined },
  { label: 'API monitoringi', badge: 'Yangi', path: '/api-monitoring', icon: ApiOutlined },
  { label: 'Javob vaqtlari', path: '/response-times', icon: ClockCircleOutlined },
  { label: 'Xatoliklarni kuzatuv', path: '/error-tracking', icon: BugOutlined },
  { label: 'Menyu analitikasi', path: '/menu-analytics', icon: LineChartOutlined }
]

const dashboardVersion = 'v1.4.0'

function isActive(item: NavItem) {
  return route.path === item.path
}

function toggleSidebar() {
  emit('update:collapsed', !props.collapsed)
}

function requestLogout() {
  emit('logout')
  message.info('Chiqish funksiyasi tez orada faollashtiriladi.')
}
</script>

<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': props.collapsed }]">
    <div class="sidebar__top">
      <button class="sidebar__collapse-btn" type="button" @click="toggleSidebar">
        <MenuUnfoldOutlined v-if="props.collapsed" />
        <MenuFoldOutlined v-else />
      </button>
      <div class="sidebar__brand">
        <MenuOutlined v-if="props.collapsed" class="sidebar__brand-icon" />
        <span v-else class="sidebar__brand-text">
          <span class="sidebar__brand-emoji">📊</span>
          <span>Osonkassa Monitoring</span>
        </span>
      </div>
    </div>

    <div v-if="!props.collapsed" class="sidebar__resource">
      <a-select
        v-model:value="selectedResource"
        class="sidebar__select"
        :bordered="false"
      >
        <template #suffixIcon>
          <DownOutlined class="sidebar__select-arrow" />
        </template>
        <a-select-option
          v-for="resource in resources"
          :key="resource.value"
          :value="resource.value"
        >
          <span class="sidebar__select-icon">{{ resource.icon }}</span>
          <span>{{ resource.label }}</span>
        </a-select-option>
      </a-select>
    </div>

    <nav class="sidebar__nav">
      <ul>
        <li v-for="item in navItems" :key="item.path">
          <a-tooltip
            v-if="props.collapsed"
            placement="right"
            :title="item.label"
            :mouse-enter-delay="0.2"
          >
            <router-link
              :to="item.path"
              :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span class="sidebar__link-text">{{ item.label }}</span>
              <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
            </router-link>
          </a-tooltip>
          <router-link
            v-else
            :to="item.path"
            :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
          >
            <component :is="item.icon" class="sidebar__icon" />
            <span class="sidebar__link-text">{{ item.label }}</span>
            <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div :class="['sidebar__footer', { 'sidebar__footer--collapsed': props.collapsed }]">
      <template v-if="props.collapsed">
        <a-tooltip placement="right" title="Chiqish">
          <button class="sidebar__footer-action" type="button" @click="requestLogout">
            <LogoutOutlined />
          </button>
        </a-tooltip>
        <a-tooltip placement="right" :title="`Versiya ${dashboardVersion}`">
          <div class="sidebar__version">
            {{ dashboardVersion }}
          </div>
        </a-tooltip>
      </template>
      <template v-else>
        <div class="sidebar__version">
          <span>Dashboard versiyasi</span>
          <strong>{{ dashboardVersion }}</strong>
        </div>
        <button class="sidebar__footer-action" type="button" @click="requestLogout">
          <LogoutOutlined />
          <span>Chiqish</span>
        </button>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  background: var(--color-bg-sidebar);
  border-right: 1px solid var(--color-border-subtle);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  transition: width var(--transition-base);
  overflow: hidden;
  z-index: 100;
  color: var(--color-text-secondary);
}

.sidebar--collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.sidebar__collapse-btn {
  flex-shrink: 0;
  border: none;
  background: rgba(76, 141, 255, 0.12);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 18px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar__collapse-btn:hover {
  background: rgba(76, 141, 255, 0.22);
  color: var(--color-primary);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 17px;
}

.sidebar__brand-emoji {
  font-size: 20px;
}

.sidebar__brand-icon {
  font-size: 20px;
  color: var(--color-text-primary);
}

.sidebar__resource {
  padding: 0 18px 12px;
}

.sidebar__select {
  width: 100%;
}

:deep(.sidebar__select .ant-select-selector) {
  background: var(--color-bg-surface) !important;
  border: 1px solid var(--color-border-subtle) !important;
  border-radius: var(--radius-md) !important;
  padding: 8px 12px !important;
  height: auto !important;
  color: var(--color-text-primary) !important;
}

:deep(.sidebar__select.ant-select-focused .ant-select-selector) {
  border-color: var(--color-primary) !important;
  box-shadow: var(--focus-ring) !important;
}

:deep(.sidebar__select .ant-select-selection-item),
:deep(.sidebar__select .ant-select-item) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
}

.sidebar__select-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.sidebar__select-arrow {
  font-size: 12px;
  color: var(--color-text-secondary);
}

:deep(.sidebar__select .ant-select-item-option:hover) {
  background: rgba(76, 141, 255, 0.12) !important;
}

:deep(.sidebar__select .ant-select-item-option-selected) {
  background: rgba(76, 141, 255, 0.16) !important;
  font-weight: 500 !important;
}

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px 20px;
  background: transparent;
}

.sidebar__nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar__nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar__nav::-webkit-scrollbar-thumb {
  background: rgba(124, 169, 255, 0.25);
  border-radius: 3px;
}

.sidebar__nav::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 169, 255, 0.32);
}

.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}

.sidebar__link {
  width: 100%;
  border: none;
  background: transparent;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
  font-weight: 500;
}

.sidebar--collapsed .sidebar__link {
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  text-align: center;
}

.sidebar__icon {
  font-size: 18px;
  flex-shrink: 0;
  color: inherit;
  transition: color 0.2s ease;
}

.sidebar__link-text {
  flex: 1;
  min-width: 0;
}

.sidebar--collapsed .sidebar__link-text {
  flex: none;
  font-size: 11px;
  line-height: 1.2;
  max-width: 60px;
  white-space: normal;
  color: var(--color-text-secondary);
}

.sidebar__badge {
  background: rgba(76, 141, 255, 0.2);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: auto;
}

.sidebar--collapsed .sidebar__badge {
  display: none;
}

.sidebar__link:hover {
  background: rgba(76, 141, 255, 0.14);
  color: var(--color-primary);
}

.sidebar__link--active {
  background: rgba(76, 141, 255, 0.22);
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px rgba(76, 141, 255, 0.35);
}

.sidebar__footer {
  padding: 16px 18px 20px;
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--color-bg-sidebar);
}

.sidebar__footer--collapsed {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 14px 0 18px;
}

.sidebar__footer-action {
  background: rgba(76, 141, 255, 0.12);
  border: 1px solid rgba(76, 141, 255, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 13px;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.sidebar__footer-action:hover {
  background: rgba(76, 141, 255, 0.22);
  border-color: rgba(76, 141, 255, 0.38);
  color: var(--color-primary);
}

.sidebar__footer--collapsed .sidebar__footer-action {
  padding: 10px;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  justify-content: center;
}

.sidebar__version {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--color-text-secondary);
  font-size: 12px;
  text-align: left;
}

.sidebar__version strong {
  color: var(--color-text-primary);
  font-size: 13px;
}

.sidebar__footer--collapsed .sidebar__version {
  font-size: 11px;
  text-align: center;
  color: var(--color-text-secondary);
}
</style>
