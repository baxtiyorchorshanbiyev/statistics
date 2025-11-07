<script setup lang="ts">
import { computed, ref } from 'vue'
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

interface ResponseTimeData {
  endpoint: string
  p50: number
  p75: number
  p90: number
  p95: number
  p99: number
  avg: number
}

const responseData = ref<ResponseTimeData[]>([
  {
    endpoint: '/v1/invoice/create',
    p50: 245,
    p75: 312,
    p90: 428,
    p95: 562,
    p99: 834,
    avg: 312
  },
  {
    endpoint: '/v1/invoice/status',
    p50: 198,
    p75: 246,
    p90: 324,
    p95: 412,
    p99: 628,
    avg: 246
  },
  {
    endpoint: '/v1/payment/process',
    p50: 324,
    p75: 428,
    p90: 612,
    p95: 798,
    p99: 1142,
    avg: 428
  },
  {
    endpoint: '/v1/payment/history',
    p50: 298,
    p75: 384,
    p90: 512,
    p95: 648,
    p99: 924,
    avg: 384
  }
])

const chartData = computed(() => {
  return responseData.value.map(item => ({
    endpoint: item.endpoint.split('/').pop() || item.endpoint,
    fullEndpoint: item.endpoint,
    p50: item.p50,
    p75: item.p75,
    p90: item.p90,
    p95: item.p95,
    p99: item.p99
  }))
})

function getPercentileColor(value: number) {
  if (value < 300) return '#188038'
  if (value < 500) return '#fbbc04'
  return '#d93025'
}
</script>

<template>
  <div class="page-view">
    <ContentFilters
      v-model:environment="selectedEnv"
      v-model:dateRange="selectedRange"
      :environments="environments"
      :date-range-options="dateRangeOptions"
      title="Javob vaqtlari"
      subtitle="API endpointlar bo'yicha javob vaqti percentillari"
    />
    
    <div class="page-content">
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-card title="Percentile ko'rsatkichlari" class="chart-card">
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-dot" style="background: #1a73e8"></span>
                P50 (Median)
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background: #12b5cb"></span>
                P75
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background: #fbbc04"></span>
                P90
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background: #f28b82"></span>
                P95
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background: #d93025"></span>
                P99
              </span>
            </div>
            
            <div class="chart-container">
              <div v-for="item in chartData" :key="item.fullEndpoint" class="chart-row">
                <div class="chart-label">{{ item.fullEndpoint }}</div>
                <div class="chart-bars">
                  <div class="bar-group">
                    <div class="bar" :style="{ width: `${(item.p50 / 1200) * 100}%`, background: '#1a73e8' }">
                      <span class="bar-value">{{ item.p50 }}</span>
                    </div>
                  </div>
                  <div class="bar-group">
                    <div class="bar" :style="{ width: `${(item.p75 / 1200) * 100}%`, background: '#12b5cb' }">
                      <span class="bar-value">{{ item.p75 }}</span>
                    </div>
                  </div>
                  <div class="bar-group">
                    <div class="bar" :style="{ width: `${(item.p90 / 1200) * 100}%`, background: '#fbbc04' }">
                      <span class="bar-value">{{ item.p90 }}</span>
                    </div>
                  </div>
                  <div class="bar-group">
                    <div class="bar" :style="{ width: `${(item.p95 / 1200) * 100}%`, background: '#f28b82' }">
                      <span class="bar-value">{{ item.p95 }}</span>
                    </div>
                  </div>
                  <div class="bar-group">
                    <div class="bar" :style="{ width: `${(item.p99 / 1200) * 100}%`, background: '#d93025' }">
                      <span class="bar-value">{{ item.p99 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="24">
          <a-card title="Batafsil jadval">
            <a-table :dataSource="responseData" :pagination="false" row-key="endpoint">
              <a-table-column key="endpoint" title="Endpoint" dataIndex="endpoint" :width="250" />
              <a-table-column key="p50" title="P50" dataIndex="p50" :width="100">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column key="p75" title="P75" dataIndex="p75" :width="100">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column key="p90" title="P90" dataIndex="p90" :width="100">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column key="p95" title="P95" dataIndex="p95" :width="100">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column key="p99" title="P99" dataIndex="p99" :width="100">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column key="avg" title="O'rtacha" dataIndex="avg" :width="120">
                <template #default="{ text }">
                  <a-tag :color="getPercentileColor(text)">
                    {{ text }} ms
                  </a-tag>
                </template>
              </a-table-column>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
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

.chart-card {
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  align-items: center;
}

.chart-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  font-family: 'Courier New', monospace;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-group {
  position: relative;
  height: 24px;
  background: var(--color-bg-page);
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  border-radius: 4px;
  transition: width 0.3s ease;
  min-width: 60px;
}

.bar-value {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}

@media (max-width: 1024px) {
  .page-content {
    padding: 20px 24px 32px;
  }
  
  .chart-row {
    grid-template-columns: 150px 1fr;
  }
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .chart-label {
    font-size: 11px;
  }
}
</style>

