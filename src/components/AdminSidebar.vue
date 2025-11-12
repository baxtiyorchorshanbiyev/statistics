<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  DashboardOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  BugOutlined,
  AppstoreOutlined,
  BookOutlined,
  SettingOutlined,
  DownOutlined,
  MenuOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'

export interface NavItem {
  label: string
  badge?: string
  path?: string
  icon: any
  children?: NavItem[]
}

defineProps<{
  collapsed: boolean
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
  { label: 'Menyu analitikasi', path: '/menu-analytics', icon: LineChartOutlined },
  { label: 'API monitoringi', badge: 'Yangi', path: '/api-monitoring', icon: ApiOutlined },
  { label: 'Javob vaqtlari', path: '/response-times', icon: ClockCircleOutlined },
  { label: 'Xatoliklarni kuzatuv', path: '/error-tracking', icon: BugOutlined },
  {
    label: 'Integratsiyalar',
    icon: AppstoreOutlined,
    children: [{ label: 'Gateway sozlamalari' }, { label: 'Webhooklar' }, { label: 'Partner API lar' }]
  },
  { label: 'Resurslar', icon: BookOutlined, children: [{ label: 'Hujjatlar' }, { label: 'Foydalanish qo\'llanmalari' }] },
  { label: 'Sozlamalar', icon: SettingOutlined }
]

function isActive(item: NavItem) {
  if (!item.path) return false
  return route.path === item.path
}
</script>

<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': collapsed }]">
    <div class="sidebar__header">
      <div class="sidebar__logo-section">
        <div class="sidebar__logo">
          <MenuOutlined v-if="collapsed" />
          <span v-else class="sidebar__logo-text">
            <span class="sidebar__logo-icon">📊</span>
            <span>Osonkassa Monitoring</span>
          </span>
        </div>
      </div>
      
      <div v-if="!collapsed" class="sidebar__resource-selector">
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
    </div>
    <nav class="sidebar__nav">
      <ul>
        <li v-for="item in navItems" :key="item.label">
          <a-tooltip v-if="collapsed" placement="right" :title="item.label">
            <router-link 
              v-if="item.path" 
              :to="item.path"
              :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span v-if="!collapsed" class="sidebar__link-text">{{ item.label }}</span>
              <span v-if="item.badge && !collapsed" class="sidebar__badge">{{ item.badge }}</span>
            </router-link>
            <button 
              v-else
              :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span v-if="!collapsed" class="sidebar__link-text">{{ item.label }}</span>
              <span v-if="item.badge && !collapsed" class="sidebar__badge">{{ item.badge }}</span>
            </button>
          </a-tooltip>
          <template v-else>
            <router-link 
              v-if="item.path" 
              :to="item.path"
              :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span class="sidebar__link-text">{{ item.label }}</span>
              <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
            </router-link>
            <button 
              v-else
              :class="['sidebar__link', { 'sidebar__link--active': isActive(item) }]"
            >
              <component :is="item.icon" class="sidebar__icon" />
              <span class="sidebar__link-text">{{ item.label }}</span>
              <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
            </button>
          </template>
          <ul v-if="item.children && !collapsed" class="sidebar__child-list">
            <li v-for="child in item.children" :key="child.label">
              <button class="sidebar__sublink">
                <span>{{ child.label }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div v-if="!collapsed" class="sidebar__footer">
      <button class="sidebar__feedback">Fikr bildirish</button>
      <div class="sidebar__legal">
        <a href="#">Yordam markazi</a>
        <div>
          <a href="#">Maxfiylik</a>
          <span> · </span>
          <a href="#">Foydalanish shartlari</a>
        </div>
      </div>
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
  transition: width var(--transition-base), transform var(--transition-base);
  overflow: hidden;
  z-index: 100;
  backdrop-filter: blur(26px);
  box-shadow: 0 0 0 1px rgba(124, 169, 255, 0.08);
}

.sidebar--collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar__header {
  padding: 18px 14px 12px;
  border-bottom: 1px solid var(--color-border-subtle);
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(36, 61, 118, 0.45) 0%, rgba(9, 19, 37, 0) 100%);
}

.sidebar__logo-section {
  margin-bottom: 16px;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  font-size: 20px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  background: rgba(76, 141, 255, 0.06);
}

.sidebar--collapsed .sidebar__logo {
  justify-content: center;
}

.sidebar__logo-text {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.sidebar__logo-icon {
  font-size: 22px;
}

.sidebar__resource-selector {
  margin: 0 4px;
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
  transition: all 0.2s ease;
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
  padding: 12px 0 18px;
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
  background: rgba(124, 169, 255, 0.35);
}

.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 4px;
}

.sidebar__link,
.sidebar__sublink {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 12px 18px;
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  text-decoration: none;
  font-weight: 500;
}

.sidebar--collapsed .sidebar__link,
.sidebar--collapsed .sidebar__sublink {
  padding: 12px 0;
  justify-content: center;
  gap: 0;
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

.sidebar__badge {
  background: rgba(76, 141, 255, 0.24);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: auto;
}

.sidebar__link:hover,
.sidebar__sublink:hover {
  background: rgba(76, 141, 255, 0.12);
  color: var(--color-primary);
  transform: translateX(4px);
}

.sidebar__link--active {
  background: linear-gradient(90deg, rgba(76, 141, 255, 0.28) 0%, rgba(76, 141, 255, 0.05) 100%);
  color: var(--color-primary);
  box-shadow: inset 2px 0 0 rgba(76, 141, 255, 0.6);
}

.sidebar__child-list {
  margin-top: 6px;
  margin-bottom: 8px;
  display: grid;
  gap: 2px;
}

.sidebar__child-list .sidebar__sublink {
  padding-left: 48px;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.sidebar__footer {
  padding: 20px 22px 28px;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 12px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  background: linear-gradient(0deg, rgba(20, 32, 60, 0.92) 0%, rgba(9, 19, 37, 0.65) 100%);
}

.sidebar__feedback {
  border: none;
  background: none;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  padding: 0;
  font-weight: 500;
}

.sidebar__feedback:hover,
.sidebar__legal a:hover {
  text-decoration: underline;
}

.sidebar__legal a {
  color: inherit;
  text-decoration: none;
}

.sidebar__legal span {
  margin: 0 4px;
}
</style>
