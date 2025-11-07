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

interface ErrorLog {
  id: string
  timestamp: string
  endpoint: string
  method: string
  statusCode: number
  errorType: string
  message: string
  count: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const errorLogs = ref<ErrorLog[]>([
  {
    id: '1',
    timestamp: '2025-11-07 10:24:15',
    endpoint: '/v1/payment/process',
    method: 'POST',
    statusCode: 500,
    errorType: 'Internal Server Error',
    message: 'Database connection timeout',
    count: 23,
    severity: 'high'
  },
  {
    id: '2',
    timestamp: '2025-11-07 10:18:42',
    endpoint: '/v1/invoice/create',
    method: 'POST',
    statusCode: 400,
    errorType: 'Bad Request',
    message: 'Invalid merchant ID format',
    count: 8,
    severity: 'medium'
  },
  {
    id: '3',
    timestamp: '2025-11-07 09:56:31',
    endpoint: '/v1/invoice/status',
    method: 'GET',
    statusCode: 404,
    errorType: 'Not Found',
    message: 'Invoice not found',
    count: 5,
    severity: 'low'
  },
  {
    id: '4',
    timestamp: '2025-11-07 09:42:18',
    endpoint: '/v1/payment/history',
    method: 'GET',
    statusCode: 503,
    errorType: 'Service Unavailable',
    message: 'Third-party service unavailable',
    count: 12,
    severity: 'critical'
  }
])

function getSeverityColor(severity: string) {
  const colors = {
    low: 'default',
    medium: 'warning',
    high: 'orange',
    critical: 'error'
  }
  return colors[severity as keyof typeof colors] || 'default'
}

function getSeverityText(severity: string) {
  const texts = {
    low: 'Past',
    medium: 'O\'rtacha',
    high: 'Yuqori',
    critical: 'Kritik'
  }
  return texts[severity as keyof typeof texts] || severity
}

function getStatusColor(code: number) {
  if (code >= 200 && code < 300) return 'success'
  if (code >= 400 && code < 500) return 'warning'
  if (code >= 500) return 'error'
  return 'default'
}
</script>

<template>
  <div class="page-view">
    <ContentFilters
      v-model:environment="selectedEnv"
      v-model:dateRange="selectedRange"
      :environments="environments"
      :date-range-options="dateRangeOptions"
      title="Xatoliklarni kuzatuv"
      subtitle="Real-time xatolar va ularning tahlili"
    />
    
    <div class="page-content">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic title="Jami xatolar" :value="48" :value-style="{ color: '#d93025' }" />
            <div class="stat-footer">
              <span class="trend negative">+12% o'tgan haftaga nisbatan</span>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic title="Kritik xatolar" :value="1" :value-style="{ color: '#d93025', fontWeight: 700 }" />
            <div class="stat-footer">
              <span class="trend negative">+1 yangi</span>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic title="4xx xatolari" :value="35" suffix="%" :value-style="{ color: '#fbbc04' }" />
            <div class="stat-footer">
              <span class="trend positive">-3% yaxshilandi</span>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic title="5xx xatolari" :value="13" suffix="%" :value-style="{ color: '#d93025' }" />
            <div class="stat-footer">
              <span class="trend negative">+2% oshdi</span>
            </div>
          </a-card>
        </a-col>
      </a-row>
      
      <a-card title="Xatolar jadvali" class="errors-table-card" style="margin-top: 16px">
        <template #extra>
          <a-space>
            <a-button type="primary">Eksport</a-button>
            <a-button>Filtrlar</a-button>
          </a-space>
        </template>
        
        <a-table 
          :dataSource="errorLogs" 
          :pagination="{ pageSize: 10 }"
          :scroll="{ x: 'max-content' }"
          row-key="id"
        >
          <a-table-column key="timestamp" title="Vaqt" dataIndex="timestamp" :width="160" />
          <a-table-column key="endpoint" title="Endpoint" dataIndex="endpoint" :width="220">
            <template #default="{ record }">
              <div style="font-family: 'Courier New', monospace; font-size: 12px;">
                <a-tag :color="record.method === 'POST' ? 'blue' : 'green'" size="small">
                  {{ record.method }}
                </a-tag>
                {{ record.endpoint }}
              </div>
            </template>
          </a-table-column>
          <a-table-column key="statusCode" title="Status" dataIndex="statusCode" :width="100">
            <template #default="{ record }">
              <a-tag :color="getStatusColor(record.statusCode)">
                {{ record.statusCode }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column key="errorType" title="Xato turi" dataIndex="errorType" :width="180" />
          <a-table-column key="message" title="Xabar" dataIndex="message" />
          <a-table-column key="count" title="Soni" dataIndex="count" :width="80" align="center">
            <template #default="{ text }">
              <a-badge :count="text" :overflow-count="99" :number-style="{ backgroundColor: '#d93025' }" />
            </template>
          </a-table-column>
          <a-table-column key="severity" title="Muhimlik" dataIndex="severity" :width="120">
            <template #default="{ record }">
              <a-tag :color="getSeverityColor(record.severity)">
                {{ getSeverityText(record.severity) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column key="actions" title="Amallar" :width="120">
            <template #default>
              <a-space>
                <a-button type="link" size="small">Detallar</a-button>
              </a-space>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
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

.stat-card {
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.stat-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-subtle);
}

.trend {
  font-size: 12px;
  font-weight: 500;
}

.trend.positive {
  color: #188038;
}

.trend.negative {
  color: #d93025;
}

.errors-table-card {
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

@media (max-width: 1024px) {
  .page-content {
    padding: 20px 24px 32px;
  }
}
</style>

