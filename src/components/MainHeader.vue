<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  BellOutlined,
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

type ThemeMode = 'light' | 'dark'
type LocaleCode = 'ru' | 'en'

const props = withDefaults(defineProps<{
  themeMode: ThemeMode
  locale: LocaleCode
}>(), {
  themeMode: 'light',
  locale: 'ru'
})

const emit = defineEmits<{
  (event: 'update:themeMode', value: ThemeMode): void
  (event: 'update:locale', value: LocaleCode): void
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

const loginForm = ref({
  email: 'baxtiyor9730@gmail.com',
  password: '',
  remember: true
})

const isLoginModalVisible = ref(false)
const isLogoutModalVisible = ref(false)

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

function openLoginModal() {
  isLoginModalVisible.value = true
}

function closeLoginModal() {
  isLoginModalVisible.value = false
}

function submitLogin() {
  // Bu demo ilova, shu sababli faqat modalni yopamiz
  setTimeout(() => {
    closeLoginModal()
  }, 160)
}

function openLogoutModal() {
  isLogoutModalVisible.value = true
}

function closeLogoutModal() {
  isLogoutModalVisible.value = false
}

function confirmLogout() {
  // Demo rejim: faqat modalni yopamiz
  closeLogoutModal()
}

function handleMenuClick({ key }: { key: string }) {
  if (key === 'logout') {
    openLogoutModal()
  }
}

const route = useRoute()
const pageTitle = computed(() => {
  const metaTitle = route.meta?.title
  return typeof metaTitle === 'string' && metaTitle.trim().length ? metaTitle : 'Monitoring'
})
</script>

<template>
  <header class="main-header">
    <div class="main-header__left">
      <span class="main-header__title">{{ pageTitle }}</span>
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

          <a-button
            class="main-header__login-button"
            type="default"
            ghost
            size="middle"
            @click="openLoginModal"
          >
            Kirish
          </a-button>

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
              <a-menu selectable @click="handleMenuClick">
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

    <a-modal
      v-model:open="isLoginModalVisible"
      title="Profilga kirish"
      centered
      :footer="null"
      class="main-header__modal"
      @cancel="closeLoginModal"
    >
      <a-form layout="vertical" @submit.prevent="submitLogin">
        <a-form-item label="Email">
          <a-input
            v-model:value="loginForm.email"
            size="large"
            type="email"
            placeholder="foydalanuvchi@kompaniya.uz"
          />
        </a-form-item>
        <a-form-item label="Parol">
          <a-input-password
            v-model:value="loginForm.password"
            size="large"
            placeholder="••••••••"
          />
        </a-form-item>
        <div class="main-header__modal-footer">
          <a-checkbox v-model:checked="loginForm.remember">Meni eslab qol</a-checkbox>
          <a-space>
            <a-button @click="closeLoginModal">Bekor qilish</a-button>
            <a-button type="primary" html-type="submit">Kirish</a-button>
          </a-space>
        </div>
      </a-form>
    </a-modal>

    <a-modal
      v-model:open="isLogoutModalVisible"
      title="Chiqishni tasdiqlang"
      centered
      ok-text="Chiqish"
      cancel-text="Bekor qilish"
      :ok-button-props="{ danger: true }"
      class="main-header__modal"
      @ok="confirmLogout"
      @cancel="closeLogoutModal"
    >
      <p>Haqiqatan ham tizimdan chiqmoqchimisiz? Jarayonlar to‘xtatilmaydi, lekin qayta kirish talab qilinadi.</p>
    </a-modal>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(16, 30, 58, 0.96) 0%, rgba(7, 17, 33, 0.96) 100%);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background-color var(--transition-base), border-color var(--transition-base);
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  backdrop-filter: blur(22px);
  box-shadow: 0 14px 40px rgba(6, 12, 28, 0.28);
}

.main-header__left {
  display: flex;
  align-items: center;
}

.main-header__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.main-header__right {
  display: flex;
  align-items: center;
}

.main-header__divider {
  width: 1px;
  height: 28px;
  background: var(--color-border-subtle);
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
  color: var(--color-text-secondary);
}

.main-header__icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(124, 169, 255, 0.16);
  background: rgba(14, 24, 46, 0.8);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base);
  backdrop-filter: blur(12px);
}

.main-header__icon-button:hover {
  background: rgba(76, 141, 255, 0.18);
  border-color: rgba(124, 169, 255, 0.38);
  color: var(--color-primary);
}

.main-header__login-button {
  border-color: rgba(124, 169, 255, 0.28);
  color: var(--color-primary);
  background: rgba(14, 24, 46, 0.6);
  padding: 0 18px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  transition: border-color var(--transition-base), background-color var(--transition-base), color var(--transition-base);
}

.main-header__login-button:hover {
  border-color: rgba(124, 169, 255, 0.5);
  background: rgba(76, 141, 255, 0.2);
  color: var(--color-primary-hover);
}

.main-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px;
  border-radius: 18px;
  border: 1px solid rgba(124, 169, 255, 0.12);
  cursor: pointer;
  transition: background-color var(--transition-base), border-color var(--transition-base);
  background: rgba(14, 24, 46, 0.72);
}

.main-header__profile:hover {
  background: rgba(76, 141, 255, 0.18);
  border-color: rgba(124, 169, 255, 0.32);
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
  color: var(--color-text-primary);
}

.main-header__email {
  font-size: 12px;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.main-header__caret {
  color: var(--color-text-secondary);
  font-size: 10px;
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
  color: var(--color-text-primary);
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
  border-radius: 14px;
  background: rgba(14, 24, 46, 0.85);
  border: 1px solid rgba(124, 169, 255, 0.12);
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.main-header__notification-item--unread {
  border-color: rgba(76, 141, 255, 0.4);
  background: rgba(76, 141, 255, 0.16);
}

.main-header__notification-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.main-header__notification-body {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.main-header__notification-time {
  font-size: 11px;
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.main-header__notification-empty {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 16px 0;
}

.main-header__modal-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.main-header__modal .ant-modal-content) {
  background: var(--color-bg-surface);
  border: 1px solid rgba(124, 169, 255, 0.18);
  box-shadow: var(--shadow-glow);
}

:deep(.main-header__modal .ant-modal-header) {
  background: transparent;
  border-bottom: 1px solid rgba(124, 169, 255, 0.18);
}

:deep(.main-header__modal .ant-modal-title) {
  color: var(--color-text-primary);
}

:deep(.main-header__modal .ant-modal-body) {
  color: var(--color-text-secondary);
}

:deep(.main-header__modal .ant-form-item-label > label) {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .main-header {
    padding: 12px 16px;
  }

  .main-header__title {
    font-size: 16px;
  }

  .main-header__profile {
    padding: 4px 8px;
  }

  .main-header__identity {
    display: none;
  }
}
</style>
