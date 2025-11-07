<script setup lang="ts">
import { ref } from 'vue'
import ContentFilters from '../components/ContentFilters.vue'

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

interface ApiEndpoint {
  id: string
  endpoint: string
  method: string
  status: 'healthy' | 'warning' | 'error'
  uptime: number
  avgResponseTime: number
  requestsPerMinute: number
  errorRate: number
  lastChecked: string
}

const apiEndpoints = ref<ApiEndpoint[]>([
  {
    id: '1',
    endpoint: '/v1/invoice/create',
    method: 'POST',
    status: 'healthy',
    uptime: 99.8,
    avgResponseTime: 312,
    requestsPerMinute: 45,
    errorRate: 1.3,
    lastChecked: '2 daqiqa oldin'
  },
  {
    id: '2',
    endpoint: '/v1/invoice/status',
    method: 'GET',
    status: 'healthy',
    uptime: 99.9,
    avgResponseTime: 246,
    requestsPerMinute: 38,
    errorRate: 0.9,
    lastChecked: '1 daqiqa oldin'
  },
  {
    id: '3',
    endpoint: '/v1/payment/process',
    method: 'POST',
    status: 'warning',
    uptime: 98.4,
    avgResponseTime: 428,
    requestsPerMinute: 22,
    errorRate: 3.1,
    lastChecked: '30 soniya oldin'
  },
  {
    id: '4',
    endpoint: '/v1/payment/history',
    method: 'GET',
    status: 'healthy',
    uptime: 99.6,
    avgResponseTime: 384,
    requestsPerMinute: 19,
    errorRate: 1.7,
    lastChecked: '1 daqiqa oldin'
  }
])

function getStatusBadge(status: string) {
  const badges = {
    healthy: { color: 'success', text: 'Faol' },
    warning: { color: 'warning', text: 'Ogohlantirish' },
    error: { color: 'error', text: 'Xato' }
  }
  return badges[status as keyof typeof badges] || badges.healthy
}

function getMethodColor(method: string) {
  const colors = {
    POST: 'blue',
    GET: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple'
  }
  return colors[method as keyof typeof colors] || 'default'
}
</script>

<template>
  <div class="page-view">
    <ContentFilters
      v-model:environment="selectedEnv"
      v-model:dateRange="selectedRange"
      :environments="environments"
      :date-range-options="dateRangeOptions"
      title="API Monitoring"
      subtitle="Real-time API endpointlar holati va ishlashi"
    />
    
    <div class="page-content">
      <div class="monitoring-grid">
        <a-card v-for="endpoint in apiEndpoints" :key="endpoint.id" class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-info">
              <a-tag :color="getMethodColor(endpoint.method)" class="method-tag">
                {{ endpoint.method }}
              </a-tag>
              <span class="endpoint-path">{{ endpoint.endpoint }}</span>
            </div>
            <a-badge :status="endpoint.status === 'healthy' ? 'success' : endpoint.status === 'warning' ? 'warning' : 'error'" 
                     :text="getStatusBadge(endpoint.status).text" />
          </div>
          
          <a-divider style="margin: 16px 0" />
          
          <div class="endpoint-metrics">
            <div class="metric">
              <span class="metric-label">Uptime</span>
              <span class="metric-value success">{{ endpoint.uptime }}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">Javob vaqti</span>
              <span class="metric-value">{{ endpoint.avgResponseTime }} ms</span>
            </div>
            <div class="metric">
              <span class="metric-label">So'rovlar/min</span>
              <span class="metric-value primary">{{ endpoint.requestsPerMinute }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Xatolar</span>
              <span class="metric-value" :class="endpoint.errorRate > 2 ? 'error' : ''">
                {{ endpoint.errorRate }}%
              </span>
            </div>
          </div>
          
          <div class="endpoint-footer">
            <span class="last-checked">Oxirgi tekshiruv: {{ endpoint.lastChecked }}</span>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page-content {
  padding: 24px 32px 48px;
  background: var(--color-bg-page);
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.endpoint-card {
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.endpoint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.endpoint-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.method-tag {
  font-weight: 600;
  font-size: 11px;
  border-radius: 6px;
}

.endpoint-path {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.endpoint-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.metric-value.success {
  color: #188038;
}

.metric-value.primary {
  color: var(--color-primary);
}

.metric-value.error {
  color: #d93025;
}

.endpoint-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-subtle);
}

.last-checked {
  font-size: 12px;
  color: var(--color-text-secondary);
}

@media (max-width: 1024px) {
  .page-content {
    padding: 20px 24px 32px;
  }
  
  .monitoring-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
}
</style>

