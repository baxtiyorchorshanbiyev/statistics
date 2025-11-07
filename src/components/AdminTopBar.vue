<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BellOutlined,
  DownloadOutlined,
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

type ThemeMode = 'light' | 'dark'
type LocaleCode = 'ru' | 'en'

const props = defineProps<{
  themeMode: ThemeMode
  locale: LocaleCode
}>()

const emit = defineEmits<{
  (event: 'update:themeMode', value: ThemeMode): void
  (event: 'update:locale', value: LocaleCode): void
}>()

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

const notifications = ref([
  {
    id: 'notif-1',
    title: 'Gateway trafik cho‘qqisi',
    body: 'So‘nggi 15 daqiqada so‘rovlar hajmi 120% ga oshdi.',
    time: '2 daqiqa oldin',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Yangi integratsiya',
    body: 'Payme sandbox integratsiyasi muvaffaqiyatli ulandi.',
    time: '1 soat oldin',
    read: false
  },
  {
    id: 'notif-3',
    title: 'SSL sertifikat yangilandi',
    body: 'Yangi sertifikat 2026-yilgacha amal qiladi.',
    time: 'Kecha',
    read: true
  }
])

const localeOptions: Array<{ label: string; value: LocaleCode }> = [
  { label: 'RU', value: 'ru' },
  { label: 'EN', value: 'en' }
]

const userProfile = {
  name: 'Baxtiyor Chor shanbiyev',
  email: 'baxtiyor9730@gmail.com'
}

const selectedEnvLabel = computed(() => environments.find((env) => env.value === selectedEnv.value)?.label ?? '')
const selectedRangeLabel = computed(() => dateRangeOptions.find((option) => option.value === selectedRange.value)?.label ?? '')
const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)
const userInitials = computed(() =>
  userProfile.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

const isDarkMode = computed({
  get: () => props.themeMode === 'dark',
  set: (checked: boolean) => {
    emit('update:themeMode', checked ? 'dark' : 'light')
  }
})

const currentLocale = computed({
  get: () => props.locale,
  set: (value: string | number) => {
    emit('update:locale', value === 'en' ? 'en' : 'ru')
  }
})

const markAllNotificationsRead = () => {
  notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
}

const handleNotificationVisibleChange = (visible: boolean) => {
  if (visible) {
    markAllNotificationsRead()
  }
}
</script>

<template>
  <header class="dashboard-header">
    <div class="dashboard-header__left">
      <div class="dashboard-header__breadcrumbs">
        <span>Monitoring paneli</span>
        <span class="dashboard-header__breadcrumbs-divider">/</span>
        <span class="dashboard-header__breadcrumbs-current">Statistika</span>
      </div>
      <div class="dashboard-header__title-group">
        <h1 class="dashboard-header__title">Statistika paneli</h1>
        <p class="dashboard-header__subtitle">API gateway faoliyati bo‘yicha asosiy ko‘rsatkichlar</p>
      </div>
      <div class="dashboard-header__tags">
        <a-tag color="blue" class="dashboard-header__tag">{{ selectedEnvLabel }}</a-tag>
        <a-tag class="dashboard-header__tag dashboard-header__tag--muted">{{ selectedRangeLabel }}</a-tag>
      </div>
    </div>

    <div class="dashboard-header__right">
      <a-space :size="16" align="center" wrap>
        <a-select
          v-model:value="selectedEnv"
          class="dashboard-header__select"
          :options="environments"
          :dropdown-match-select-width="240"
        >
          <template #option="{ label, description }">
            <div class="dashboard-header__option">
              <span class="dashboard-header__option-label">{{ label }}</span>
              <span class="dashboard-header__option-description">{{ description }}</span>
            </div>
          </template>
        </a-select>

        <a-select
          v-model:value="selectedRange"
          class="dashboard-header__select"
          :options="dateRangeOptions"
          :dropdown-match-select-width="220"
        />

        <a-button type="primary" shape="round" size="middle">
          <template #icon>
            <DownloadOutlined />
          </template>
          Eksport
        </a-button>

        <div class="dashboard-header__divider" role="presentation"></div>

        <a-space size="small" align="center">
          <GlobalOutlined class="dashboard-header__icon" />
          <a-segmented
            v-model:value="currentLocale"
            size="small"
            :options="localeOptions"
            class="dashboard-header__segmented"
          />
        </a-space>

        <a-switch v-model:checked="isDarkMode" class="dashboard-header__theme-switch">
          <template #checkedChildren>🌙</template>
          <template #unCheckedChildren>☀️</template>
        </a-switch>

        <a-popover
          trigger="click"
          placement="bottomRight"
          overlay-class-name="dashboard-header__notification-popover"
          @visibleChange="handleNotificationVisibleChange"
        >
          <template #content>
            <div class="dashboard-header__notifications">
              <div class="dashboard-header__notifications-head">
                <span>Bildirishnomalar</span>
                <a-button v-if="unreadCount" type="link" size="small" @click="markAllNotificationsRead">
                  Hammasini o‘qilgan belgilash
                </a-button>
              </div>
              <div v-if="notifications.length" class="dashboard-header__notifications-list">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="[
                    'dashboard-header__notification-item',
                    { 'dashboard-header__notification-item--unread': !notification.read }
                  ]"
                >
                  <div class="dashboard-header__notification-title">{{ notification.title }}</div>
                  <div class="dashboard-header__notification-body">{{ notification.body }}</div>
                  <div class="dashboard-header__notification-time">{{ notification.time }}</div>
                </div>
              </div>
              <div v-else class="dashboard-header__notification-empty">Hozircha bildirishnomalar yo‘q</div>
            </div>
          </template>
          <a-badge :count="unreadCount" :overflow-count="9">
            <button class="dashboard-header__icon-button" type="button">
              <BellOutlined />
            </button>
          </a-badge>
        </a-popover>

        <a-dropdown placement="bottomRight" trigger="click">
          <a-space class="dashboard-header__profile" size="small">
            <a-avatar class="dashboard-header__avatar" size="large">
              <template #icon>
                <span>{{ userInitials }}</span>
              </template>
            </a-avatar>
            <div class="dashboard-header__identity">
              <span class="dashboard-header__name">{{ userProfile.name }}</span>
              <span class="dashboard-header__email">{{ userProfile.email }}</span>
            </div>
            <DownOutlined class="dashboard-header__caret" />
          </a-space>
          <template #overlay>
            <a-menu selectable>
              <a-menu-item key="profile">
                <UserOutlined />
                <span>Profilni ko‘rish</span>
              </a-menu-item>
              <a-menu-item key="settings">
                <SettingOutlined />
                <span>Sozlamalar</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout">
                <LogoutOutlined />
                <span>Chiqish</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 32px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dashboard-header__left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-header__breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.dashboard-header__breadcrumbs-divider {
  opacity: 0.4;
}

.dashboard-header__breadcrumbs-current {
  color: var(--color-text-primary);
  font-weight: 500;
}

.dashboard-header__title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dashboard-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.dashboard-header__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.dashboard-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dashboard-header__tag {
  border-radius: 999px;
  font-size: 12px;
  padding: 0 12px;
  line-height: 24px;
}

.dashboard-header__tag--muted {
  color: var(--color-text-secondary);
  border-color: var(--color-border-subtle);
  background: transparent;
}

.dashboard-header__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  min-width: 280px;
}

.dashboard-header__select {
  min-width: 200px;
}

:deep(.dashboard-header__select .ant-select-selector) {
  border-radius: 12px;
}

.dashboard-header__option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboard-header__option-label {
  font-weight: 600;
  color: var(--color-text-primary);
}

.dashboard-header__option-description {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dashboard-header__divider {
  width: 1px;
  height: 28px;
  background: var(--color-border-subtle);
}

.dashboard-header__segmented {
  background: transparent;
}

:deep(.dashboard-header__segmented .ant-segmented-group) {
  background: var(--color-bg-page);
  border-radius: 16px;
  padding: 2px;
}

:deep(.dashboard-header__segmented .ant-segmented-item) {
  font-size: 12px;
}

:deep(.dashboard-header__segmented .ant-segmented-item-selected) {
  box-shadow: none;
}

.dashboard-header__theme-switch {
  background: transparent;
}

:deep(.dashboard-header__theme-switch.ant-switch) {
  background: var(--color-border-subtle);
}

:deep(.dashboard-header__theme-switch.ant-switch.ant-switch-checked) {
  background: var(--color-primary);
}

:deep(.dashboard-header__theme-switch .ant-switch-inner) {
  font-size: 14px;
  line-height: 22px;
}

.dashboard-header__icon {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.dashboard-header__icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--color-border-subtle);
  background: transparent;
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.dashboard-header__icon-button:hover {
  background: rgba(26, 115, 232, 0.08);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.dashboard-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.dashboard-header__profile:hover {
  background: rgba(26, 115, 232, 0.08);
  border-color: var(--color-border-subtle);
}

.dashboard-header__avatar {
  background: linear-gradient(135deg, rgba(26, 115, 232, 0.88), rgba(86, 161, 255, 0.92));
  color: #fff;
  font-weight: 600;
}

.dashboard-header__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboard-header__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dashboard-header__email {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dashboard-header__caret {
  color: var(--color-text-secondary);
  font-size: 10px;
}

.dashboard-header__notifications {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard-header__notifications-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dashboard-header__notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard-header__notification-item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: var(--color-bg-page);
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.dashboard-header__notification-item--unread {
  border-color: rgba(74, 119, 255, 0.3);
  background: rgba(74, 119, 255, 0.06);
}

.dashboard-header__notification-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dashboard-header__notification-body {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dashboard-header__notification-time {
  font-size: 11px;
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.dashboard-header__notification-empty {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 16px 0;
}

@media (max-width: 1024px) {
  .dashboard-header {
    padding: 20px 24px;
  }

  .dashboard-header__right {
    justify-content: flex-start;
  }

  .dashboard-header__select {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
  }

  .dashboard-header__right {
    width: 100%;
  }

  .dashboard-header__profile {
    padding: 4px 8px;
  }
}
</style>
