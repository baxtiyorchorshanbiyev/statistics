<script setup lang="ts">
export interface NavItem {
  label: string
  badge?: string
  active?: boolean
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Statistika', active: true },
  { label: 'API monitoringi', badge: 'Yangi' },
  { label: 'Javob vaqtlari' },
  { label: 'Xatoliklarni kuzatuv' },
  {
    label: 'Integratsiyalar',
    children: [{ label: 'Gateway sozlamalari' }, { label: 'Webhooklar' }, { label: 'Partner API lar' }]
  },
  { label: 'Resurslar', children: [{ label: 'Hujjatlar' }, { label: 'Foydalanish qo‘llanmalari' }] },
  { label: 'Sozlamalar' }
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__product">Osonkassa Monitoring</div>
      <div class="sidebar__workspace">osonkassa</div>
    </div>
    <nav class="sidebar__nav">
      <ul>
        <li v-for="item in navItems" :key="item.label">
          <button :class="['sidebar__link', { 'sidebar__link--active': item.active }]">
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
          </button>
          <ul v-if="item.children" class="sidebar__child-list">
            <li v-for="child in item.children" :key="child.label">
              <button class="sidebar__sublink">
                <span>{{ child.label }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="sidebar__footer">
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
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-border-subtle);
  height: 100vh;
  position: sticky;
  top: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar__header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--color-border-muted);
}

.sidebar__product {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sidebar__workspace {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
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
  padding: 10px 24px;
  font-size: 14px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 0 24px 24px 0;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.sidebar__link:hover,
.sidebar__sublink:hover {
  background: rgba(26, 115, 232, 0.08);
  color: var(--color-primary);
}

.sidebar__link--active {
  background: rgba(26, 115, 232, 0.15);
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar__child-list {
  margin-top: 4px;
  margin-bottom: 8px;
}

.sidebar__child-list .sidebar__sublink {
  padding-left: 40px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.sidebar__badge {
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  margin-left: 8px;
}

.sidebar__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--color-border-muted);
  font-size: 12px;
  color: var(--color-text-secondary);
}

.sidebar__feedback {
  border: none;
  background: none;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 12px;
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
