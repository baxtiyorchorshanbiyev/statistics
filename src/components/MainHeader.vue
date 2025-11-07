<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BellOutlined,
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

type ThemeMode = 'light' | 'dark'
type LocaleCode = 'ru' | 'en'

const props = withDefaults(defineProps<{
  themeMode: ThemeMode
  locale: LocaleCode
  sidebarCollapsed: boolean
}>(), {
  themeMode: 'light',
  locale: 'ru',
  sidebarCollapsed: false
})

const emit = defineEmits<{
  (event: 'update:themeMode', value: ThemeMode): void
  (event: 'update:locale', value: LocaleCode): void
  (event: 'update:sidebarCollapsed', value: boolean): void
}>()

const notifications = ref([
  {
    id: 'notif-1',
    title: 'Gateway trafik cho\'qqisi',
    body: "So'nggi 15 daqiqada so'rovlar hajmi 120% ga oshdi.",
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

function toggleSidebar() {
  emit('update:sidebarCollapsed', !props.sidebarCollapsed)
}
</script>

<template>
  <header class="main-header">
    <div class="main-header__left">
      <button class="main-header__toggle" @click="toggleSidebar">
        <MenuUnfoldOutlined v-if="sidebarCollapsed" />
        <MenuFoldOutlined v-else />
      </button>
    </div>

    <div class="main-header__right">
      <a-space :size="16" align="center" wrap>
        <div class="main-header__divider" role="presentation"></div>

        <a-space size="small" align="center">
          <GlobalOutlined class="main-header__icon" />
          <a-segmented
            v-model:value="currentLocale"
            size="small"
            :options="localeOptions"
            class="main-header__segmented"
          />
        </a-space>

        <a-switch
          v-model:checked="isDarkMode"
          class="main-header__theme-switch"
        >
          <template #checkedChildren>🌙</template>
          <template #unCheckedChildren>☀️</template>
        </a-switch>

        <a-popover
          trigger="click"
          placement="bottomRight"
          overlay-class-name="main-header__notification-popover"
          @openChange="handleNotificationVisibleChange"
        >
          <template #content>
            <div class="main-header__notifications">
              <div class="main-header__notifications-head">
                <span>Bildirishnomalar</span>
                <a-button
                  v-if="unreadCount"
                  type="link"
                  size="small"
                  @click="markAllNotificationsRead"
                >
                  Hammasini o'qilgan belgilash
                </a-button>
              </div>
              <div
                v-if="notifications.length"
                class="main-header__notifications-list"
              >
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="[
                    'main-header__notification-item',
                    {
                      'main-header__notification-item--unread':
                        !notification.read,
                    },
                  ]"
                >
                  <div class="main-header__notification-title">
                    {{ notification.title }}
                  </div>
                  <div class="main-header__notification-body">
                    {{ notification.body }}
                  </div>
                  <div class="main-header__notification-time">
                    {{ notification.time }}
                  </div>
                </div>
              </div>
              <div v-else class="main-header__notification-empty">
                Hozircha bildirishnomalar yo'q
              </div>
            </div>
          </template>
          <a-badge :count="unreadCount" :overflow-count="9">
            <button class="main-header__icon-button" type="button">
              <BellOutlined />
            </button>
          </a-badge>
        </a-popover>

        <a-dropdown placement="bottomRight" trigger="click">
          <a-space class="main-header__profile" size="small">
            <a-avatar class="main-header__avatar" size="large">
              <template #icon>
                <span>{{ userInitials }}</span>
              </template>
            </a-avatar>
            <div class="main-header__identity">
              <span class="main-header__name">{{ userProfile.name }}</span>
              <span class="main-header__email">{{ userProfile.email }}</span>
            </div>
            <DownOutlined class="main-header__caret" />
          </a-space>
          <template #overlay>
            <a-menu selectable>
              <a-menu-item key="profile">
                <UserOutlined />
                <span>Profilni ko'rish</span>
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
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e8eaed;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
}

[data-theme="dark"] .main-header {
  background: #202124;
  border-bottom-color: #3c4043;
}

.main-header__left {
  display: flex;
  align-items: center;
}

.main-header__toggle {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #5f6368;
  transition: background-color 0.2s ease, color 0.2s ease;
}

[data-theme="dark"] .main-header__toggle {
  color: #9aa0a6;
}

.main-header__toggle:hover {
  background: #e8f0fe;
  color: #1a73e8;
}

[data-theme="dark"] .main-header__toggle:hover {
  background: rgba(138, 180, 248, 0.12);
  color: #8ab4f8;
}

.main-header__right {
  display: flex;
  align-items: center;
}

.main-header__divider {
  width: 1px;
  height: 28px;
  background: #e8eaed;
}

[data-theme="dark"] .main-header__divider {
  background: #3c4043;
}

.main-header__segmented {
  background: transparent;
}

:deep(.main-header__segmented .ant-segmented-group) {
  background: var(--color-bg-page);
  border-radius: 16px;
  padding: 2px;
}

:deep(.main-header__segmented .ant-segmented-item) {
  font-size: 12px;
}

:deep(.main-header__segmented .ant-segmented-item-selected) {
  box-shadow: none;
}

.main-header__theme-switch {
  background: transparent;
}

:deep(.main-header__theme-switch.ant-switch) {
  background: var(--color-border-subtle);
}

:deep(.main-header__theme-switch.ant-switch.ant-switch-checked) {
  background: var(--color-primary);
}

:deep(.main-header__theme-switch .ant-switch-inner) {
  font-size: 14px;
  line-height: 22px;
}

.main-header__icon {
  font-size: 16px;
  color: #5f6368;
}

[data-theme="dark"] .main-header__icon {
  color: #9aa0a6;
}

.main-header__icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #dadce0;
  background: transparent;
  color: #5f6368;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

[data-theme="dark"] .main-header__icon-button {
  border-color: #5f6368;
  color: #9aa0a6;
}

.main-header__icon-button:hover {
  background: #e8f0fe;
  border-color: #1a73e8;
  color: #1a73e8;
}

[data-theme="dark"] .main-header__icon-button:hover {
  background: rgba(138, 180, 248, 0.12);
  border-color: #8ab4f8;
  color: #8ab4f8;
}

.main-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.main-header__profile:hover {
  background: #e8f0fe;
  border-color: #dadce0;
}

[data-theme="dark"] .main-header__profile:hover {
  background: rgba(138, 180, 248, 0.12);
  border-color: #5f6368;
}

.main-header__avatar {
  background: linear-gradient(
    135deg,
    rgba(26, 115, 232, 0.88),
    rgba(86, 161, 255, 0.92)
  );
  color: #fff;
  font-weight: 600;
}

.main-header__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.main-header__name {
  font-size: 13px;
  font-weight: 600;
  color: #202124;
}

[data-theme="dark"] .main-header__name {
  color: #e8eaed;
}

.main-header__email {
  font-size: 12px;
  color: #5f6368;
}

[data-theme="dark"] .main-header__email {
  color: #9aa0a6;
}

.main-header__caret {
  color: #5f6368;
  font-size: 10px;
}

[data-theme="dark"] .main-header__caret {
  color: #9aa0a6;
}

.main-header__notifications {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-header__notifications-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #202124;
}

[data-theme="dark"] .main-header__notifications-head {
  color: #e8eaed;
}

.main-header__notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-header__notification-item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

[data-theme="dark"] .main-header__notification-item {
  background: #292a2d;
}

.main-header__notification-item--unread {
  border-color: rgba(26, 115, 232, 0.3);
  background: #e8f0fe;
}

[data-theme="dark"] .main-header__notification-item--unread {
  border-color: rgba(138, 180, 248, 0.3);
  background: rgba(138, 180, 248, 0.12);
}

.main-header__notification-title {
  font-size: 13px;
  font-weight: 600;
  color: #202124;
}

[data-theme="dark"] .main-header__notification-title {
  color: #e8eaed;
}

.main-header__notification-body {
  font-size: 12px;
  color: #5f6368;
}

[data-theme="dark"] .main-header__notification-body {
  color: #9aa0a6;
}

.main-header__notification-time {
  font-size: 11px;
  color: #5f6368;
  opacity: 0.7;
}

[data-theme="dark"] .main-header__notification-time {
  color: #9aa0a6;
}

.main-header__notification-empty {
  text-align: center;
  font-size: 13px;
  color: #5f6368;
  padding: 16px 0;
}

[data-theme="dark"] .main-header__notification-empty {
  color: #9aa0a6;
}

@media (max-width: 768px) {
  .main-header {
    padding: 12px 16px;
  }

  .main-header__profile {
    padding: 4px 8px;
  }

  .main-header__identity {
    display: none;
  }
}
</style>
