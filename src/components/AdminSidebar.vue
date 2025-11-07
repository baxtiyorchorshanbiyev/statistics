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
  MenuOutlined
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
  width: 260px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e8eaed;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 100;
}

[data-theme="dark"] .sidebar {
  background: #202124;
  border-right-color: #3c4043;
}

.sidebar--collapsed {
  width: 80px;
}

.sidebar__header {
  padding: 16px 12px;
  border-bottom: 1px solid #e8eaed;
  flex-shrink: 0;
  background: #ffffff;
}

[data-theme="dark"] .sidebar__header {
  background: #202124;
  border-bottom-color: #3c4043;
}

.sidebar__logo-section {
  margin-bottom: 16px;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 20px;
  color: #5f6368;
}

[data-theme="dark"] .sidebar__logo {
  color: #9aa0a6;
}

.sidebar__logo-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 400;
  color: #5f6368;
}

[data-theme="dark"] .sidebar__logo-text {
  color: #e8eaed;
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
  background: transparent !important;
  border: 1px solid #dadce0 !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  height: auto !important;
  transition: all 0.2s ease;
}

:deep([data-theme="dark"] .sidebar__select .ant-select-selector) {
  background: transparent !important;
  border-color: #5f6368 !important;
}

:deep(.sidebar__select .ant-select-selector:hover) {
  border-color: #1a73e8 !important;
  background: rgba(26, 115, 232, 0.04) !important;
}

:deep(.sidebar__select.ant-select-focused .ant-select-selector) {
  border-color: #1a73e8 !important;
  box-shadow: 0 0 0 1px rgba(26, 115, 232, 0.2) !important;
}

:deep(.sidebar__select .ant-select-selection-item),
:deep(.sidebar__select .ant-select-item) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #202124;
}

:deep([data-theme="dark"] .sidebar__select .ant-select-selection-item),
:deep([data-theme="dark"] .sidebar__select .ant-select-item) {
  color: #e8eaed;
}

.sidebar__select-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.sidebar__select-arrow {
  font-size: 12px;
  color: #5f6368;
}

[data-theme="dark"] .sidebar__select-arrow {
  color: #9aa0a6;
}

:deep(.sidebar__select .ant-select-item-option:hover) {
  background: #e8f0fe !important;
}

:deep([data-theme="dark"] .sidebar__select .ant-select-item-option:hover) {
  background: rgba(138, 180, 248, 0.12) !important;
}

:deep(.sidebar__select .ant-select-item-option-selected) {
  background: #e8f0fe !important;
  font-weight: 400 !important;
}

:deep([data-theme="dark"] .sidebar__select .ant-select-item-option-selected) {
  background: rgba(138, 180, 248, 0.12) !important;
}

.sidebar__product {
  font-size: 14px;
  color: #5f6368;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

[data-theme="dark"] .sidebar__product {
  color: #9aa0a6;
}

.sidebar__workspace {
  font-size: 16px;
  font-weight: 600;
  color: #202124;
}

[data-theme="dark"] .sidebar__workspace {
  color: #e8eaed;
}

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  background: #f8f9fa;
}

[data-theme="dark"] .sidebar__nav {
  background: #202124;
}

.sidebar__nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar__nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar__nav::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 3px;
}

[data-theme="dark"] .sidebar__nav::-webkit-scrollbar-thumb {
  background: #5f6368;
}

.sidebar__nav::-webkit-scrollbar-thumb:hover {
  background: #bdc1c6;
}

[data-theme="dark"] .sidebar__nav::-webkit-scrollbar-thumb:hover {
  background: #80868b;
}

.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__link,
.sidebar__sublink {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  padding: 10px 16px;
  margin: 2px 8px;
  font-size: 14px;
  color: #5f6368;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 0 24px 24px 0;
  transition: background 0.2s ease, color 0.2s ease;
  text-decoration: none;
  font-weight: 400;
}

[data-theme="dark"] .sidebar__link,
[data-theme="dark"] .sidebar__sublink {
  color: #9aa0a6;
}

.sidebar--collapsed .sidebar__link,
.sidebar--collapsed .sidebar__sublink {
  padding: 10px 20px;
  margin: 2px 4px;
  justify-content: center;
  gap: 0;
}

.sidebar__icon {
  font-size: 18px;
  flex-shrink: 0;
  color: #5f6368;
}

[data-theme="dark"] .sidebar__icon {
  color: #9aa0a6;
}

.sidebar__link-text {
  flex: 1;
  min-width: 0;
}

.sidebar__link:hover,
.sidebar__sublink:hover {
  background: #e8f0fe;
  color: #1a73e8;
}

[data-theme="dark"] .sidebar__link:hover,
[data-theme="dark"] .sidebar__sublink:hover {
  background: rgba(138, 180, 248, 0.12);
  color: #8ab4f8;
}

.sidebar__link:hover .sidebar__icon,
.sidebar__sublink:hover .sidebar__icon {
  color: #1a73e8;
}

[data-theme="dark"] .sidebar__link:hover .sidebar__icon,
[data-theme="dark"] .sidebar__sublink:hover .sidebar__icon {
  color: #8ab4f8;
}

.sidebar__link--active {
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: 500;
}

[data-theme="dark"] .sidebar__link--active {
  background: rgba(138, 180, 248, 0.16);
  color: #8ab4f8;
}

.sidebar__link--active .sidebar__icon {
  color: #1a73e8;
}

[data-theme="dark"] .sidebar__link--active .sidebar__icon {
  color: #8ab4f8;
}

.sidebar__child-list {
  margin-top: 4px;
  margin-bottom: 8px;
}

.sidebar__child-list .sidebar__sublink {
  padding-left: 48px;
  font-size: 13px;
  color: #5f6368;
}

[data-theme="dark"] .sidebar__child-list .sidebar__sublink {
  color: #9aa0a6;
}

.sidebar__badge {
  background: #1a73e8;
  color: #ffffff;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: auto;
}

[data-theme="dark"] .sidebar__badge {
  background: #8ab4f8;
  color: #202124;
}

.sidebar__footer {
  padding: 16px 20px 24px;
  border-top: 1px solid #e8eaed;
  font-size: 12px;
  color: #5f6368;
  flex-shrink: 0;
  background: #f8f9fa;
}

[data-theme="dark"] .sidebar__footer {
  background: #202124;
  border-top-color: #3c4043;
  color: #9aa0a6;
}

.sidebar__feedback {
  border: none;
  background: none;
  color: #1a73e8;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  padding: 0;
  font-weight: 400;
}

[data-theme="dark"] .sidebar__feedback {
  color: #8ab4f8;
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
