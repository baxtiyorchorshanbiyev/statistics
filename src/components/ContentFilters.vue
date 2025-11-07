<script setup lang="ts">
import { DownloadOutlined } from '@ant-design/icons-vue'

interface Environment {
  label: string
  description: string
  value: string
}

interface DateRangeOption {
  label: string
  value: string
}

defineProps<{
  environment: string
  dateRange: string
  environments: Environment[]
  dateRangeOptions: DateRangeOption[]
  title: string
  subtitle: string
}>()

const emit = defineEmits<{
  (event: 'update:environment', value: string): void
  (event: 'update:dateRange', value: string): void
}>()

function updateEnvironment(value: string) {
  emit('update:environment', value)
}

function updateDateRange(value: string) {
  emit('update:dateRange', value)
}
</script>

<template>
  <div class="content-filters">
    <div class="content-filters__left">
      <div class="content-filters__breadcrumbs">
        <span>Monitoring paneli</span>
        <span class="content-filters__breadcrumbs-divider">/</span>
        <span class="content-filters__breadcrumbs-current">{{ title }}</span>
      </div>
      <div class="content-filters__title-group">
        <h1 class="content-filters__title">{{ title }}</h1>
        <p class="content-filters__subtitle">{{ subtitle }}</p>
      </div>
      <div class="content-filters__tags">
        <a-tag color="blue" class="content-filters__tag">
          {{ environments.find(e => e.value === environment)?.label }}
        </a-tag>
        <a-tag class="content-filters__tag content-filters__tag--muted">
          {{ dateRangeOptions.find(o => o.value === dateRange)?.label }}
        </a-tag>
      </div>
    </div>

    <div class="content-filters__right">
      <a-space :size="16" align="center" wrap>
        <a-select
          :value="environment"
          @update:value="updateEnvironment"
          class="content-filters__select"
          :options="environments"
          :dropdown-match-select-width="240"
        >
          <template #option="{ label, description }">
            <div class="content-filters__option">
              <span class="content-filters__option-label">{{ label }}</span>
              <span class="content-filters__option-description">{{ description }}</span>
            </div>
          </template>
        </a-select>

        <a-select
          :value="dateRange"
          @update:value="updateDateRange"
          class="content-filters__select"
          :options="dateRangeOptions"
          :dropdown-match-select-width="220"
        />

        <a-button type="primary" shape="round" size="middle">
          <template #icon>
            <DownloadOutlined />
          </template>
          Eksport
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.content-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 32px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.content-filters__left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-filters__breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.content-filters__breadcrumbs-divider {
  opacity: 0.4;
}

.content-filters__breadcrumbs-current {
  color: var(--color-text-primary);
  font-weight: 500;
}

.content-filters__title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.content-filters__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.content-filters__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.content-filters__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.content-filters__tag {
  border-radius: 999px;
  font-size: 12px;
  padding: 0 12px;
  line-height: 24px;
}

.content-filters__tag--muted {
  color: var(--color-text-secondary);
  border-color: var(--color-border-subtle);
  background: transparent;
}

.content-filters__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  min-width: 280px;
}

.content-filters__select {
  min-width: 200px;
}

:deep(.content-filters__select .ant-select-selector) {
  border-radius: 12px;
}

.content-filters__option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.content-filters__option-label {
  font-weight: 600;
  color: var(--color-text-primary);
}

.content-filters__option-description {
  font-size: 12px;
  color: var(--color-text-secondary);
}

@media (max-width: 1024px) {
  .content-filters {
    padding: 20px 24px;
  }

  .content-filters__right {
    justify-content: flex-start;
  }

  .content-filters__select {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .content-filters {
    flex-direction: column;
  }

  .content-filters__right {
    width: 100%;
  }
}
</style>

