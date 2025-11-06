<script setup lang="ts">
import { computed, ref } from 'vue'

interface StatCard {
  id: string
  title: string
  value: number
  unit?: string
  change: number
  description: string
}

interface MetricTab {
  id: 'requests' | 'latency' | 'errors'
  label: string
  color: string
  unit?: string
  description: string
}

interface EndpointRow {
  endpoint: string
  calls: number
  change: number
  avgWait: number
  errorRate: number
}

interface StatusBreakdown {
  label: string
  value: number
  color: string
  description: string
}

interface LatencyBucket {
  bucket: string
  percentage: number
  avg: number
}

const integerFormatter = new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('uz-UZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const statCards = ref<StatCard[]>([
  {
    id: 'totalRequests',
    title: 'Jami API chaqiriqlar',
    value: 48652,
    change: 12.4,
    description: 'Tanlangan davrda gateway tomonidan qabul qilingan umumiy so‘rovlar'
  },
  {
    id: 'activeClients',
    title: 'Faol integratsiyalar',
    value: 38,
    change: 5.3,
    description: 'Oxirgi 28 kunda so‘rov yuborgan tizimlar va hamkorlar soni'
  },
  {
    id: 'avgLatency',
    title: 'O‘rtacha kutish vaqti',
    value: 286,
    unit: 'ms',
    change: -8.1,
    description: 'Gateway so‘rovni qayta ishlashi uchun sarflangan o‘rtacha vaqt'
  },
  {
    id: 'errorShare',
    title: 'Xatolik ulushi',
    value: 2.3,
    unit: '%',
    change: -0.6,
    description: '4xx va 5xx javoblarini chiqarayotgan chaqiriqlarning umumiy ulushi'
  }
])

const metricTabs = ref<MetricTab[]>([
  {
    id: 'requests',
    label: 'Chaqiriqlar',
    color: '#1a73e8',
    description: 'Kunlik API chaqiriqlari dinamikasi'
  },
  {
    id: 'latency',
    label: 'Kutish vaqti',
    color: '#12b5cb',
    unit: 'ms',
    description: 'Gatewaydan qaytgan o‘rtacha kechikish'
  },
  {
    id: 'errors',
    label: 'Xatoliklar',
    color: '#d93025',
    unit: '%',
    description: '4xx va 5xx javoblar ulushi'
  }
])

const metricSeries: Record<MetricTab['id'], number[]> = {
  requests: [6123, 6402, 7031, 7288, 7420, 7684, 8021],
  latency: [342, 318, 296, 288, 279, 272, 268],
  errors: [3.4, 3.1, 2.8, 2.6, 2.5, 2.3, 2.1]
}

const metricTrends: Record<MetricTab['id'], number> = {
  requests: 12.4,
  latency: -8.1,
  errors: -0.9
}

const chartLabels = ref(['30 Okt', '31 Okt', '1 Noy', '2 Noy', '3 Noy', '4 Noy', '5 Noy'])

const topEndpoints = ref<EndpointRow[]>([
  { endpoint: 'POST /v1/invoice/create', calls: 18432, change: 14.2, avgWait: 312, errorRate: 1.3 },
  { endpoint: 'GET /v1/invoice/status', calls: 15207, change: 9.8, avgWait: 246, errorRate: 0.9 },
  { endpoint: 'POST /v1/payment/process', calls: 9320, change: -3.4, avgWait: 428, errorRate: 3.1 },
  { endpoint: 'GET /v1/payment/history', calls: 8127, change: 6.2, avgWait: 384, errorRate: 1.7 }
])

const statusBreakdown = ref<StatusBreakdown[]>([
  {
    label: '2xx muvaffaqiyatli',
    value: 88,
    color: '#1a73e8',
    description: 'Muvaffaqiyatli yakunlangan chaqiriqlar ulushi'
  },
  {
    label: '4xx mijoz xatolari',
    value: 9,
    color: '#fbbc04',
    description: 'Noto‘g‘ri parametr yoki autentifikatsiya bilan bog‘liq xatolar'
  },
  {
    label: '5xx server xatolari',
    value: 3,
    color: '#d93025',
    description: 'Ichki xatoliklar. Kuzatish va tahlil talab etiladi'
  }
])

const latencyBuckets = ref<LatencyBucket[]>([
  { bucket: '< 200 ms', percentage: 42, avg: 168 },
  { bucket: '200-400 ms', percentage: 36, avg: 284 },
  { bucket: '400-800 ms', percentage: 17, avg: 512 },
  { bucket: '> 800 ms', percentage: 5, avg: 917 }
])

const selectedMetricId = ref<MetricTab['id']>('requests')

const hasTraffic = computed(() => statCards.value.some((card) => card.value > 0))

const selectedMetric = computed(() => metricTabs.value.find((tab) => tab.id === selectedMetricId.value) ?? metricTabs.value[0])
const selectedSeries = computed(() => metricSeries[selectedMetricId.value] ?? [])
const selectedTrend = computed(() => metricTrends[selectedMetricId.value] ?? 0)
const selectedCurrentValue = computed(() => selectedSeries.value[selectedSeries.value.length - 1] ?? 0)
const selectedAverageValue = computed(() => {
  if (!selectedSeries.value.length) {
    return 0
  }
  const total = selectedSeries.value.reduce((sum, value) => sum + value, 0)
  return total / selectedSeries.value.length
})

const chartGradientId = computed(() => `chart-gradient-${selectedMetricId.value}`)

const chartGeometry = computed(() => {
  const series = selectedSeries.value
  if (!series.length) {
    return {
      polyline: '',
      area: '',
      points: [] as Array<{ x: number; y: number }>,
      yTicks: [] as Array<{ value: number; y: number }>,
      baseline: 52
    }
  }

  const max = Math.max(...series)
  const min = Math.min(...series)
  const paddingTop = 6
  const paddingBottom = 8
  const height = 60 - paddingTop - paddingBottom
  const baseline = 60 - paddingBottom
  const range = max - min || max || 1

  const points = series.map((value, index) => {
    const x = series.length === 1 ? 0 : (index / (series.length - 1)) * 100
    const normalized = range === 0 ? 0.5 : (value - min) / range
    const y = baseline - normalized * height
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }
  })

  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPath = [
    `M 0 ${baseline}`,
    ...points.map((point) => `L ${point.x} ${point.y}`),
    `L 100 ${baseline}`,
    'Z'
  ].join(' ')

  const tickCount = 4
  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const ratio = index / tickCount
    const value = max - ratio * (range === 0 ? max || 1 : range)
    const y = baseline - ratio * height
    return { value, y: Number(y.toFixed(2)) }
  })

  return {
    polyline,
    area: areaPath,
    points,
    yTicks,
    baseline
  }
})

function formatMetricValue(value: number, unit?: string) {
  if (unit === '%') {
    return `${decimalFormatter.format(value)}%`
  }
  if (unit === 'ms') {
    return `${integerFormatter.format(Math.round(value))} ms`
  }
  if (unit === 's') {
    return `${decimalFormatter.format(value)} s`
  }
  return integerFormatter.format(Math.round(value))
}

function formatCardValue(card: StatCard) {
  return formatMetricValue(card.value, card.unit)
}

function formatTrend(change: number) {
  if (!change) {
    return '—'
  }
  const formatted = decimalFormatter.format(Math.abs(change))
  return `${change > 0 ? '+' : '-'}${formatted}%`
}

function getTrendClass(change: number) {
  if (change > 0) return 'statistics__trend--positive'
  if (change < 0) return 'statistics__trend--negative'
  return 'statistics__trend--neutral'
}

function formatNumber(value: number) {
  return integerFormatter.format(Math.round(value))
}

function formatErrorRate(value: number) {
  return `${decimalFormatter.format(value)}%`
}

function formatLatency(value: number) {
  return `${integerFormatter.format(Math.round(value))} ms`
}
</script>

<template>
  <section class="statistics">
    <div class="statistics__banner">
      <span class="statistics__badge">Yangilanish</span>
      <div>
        Monitoring panelining beta versiyasi ishga tushirildi. Endi eng ko‘p ishlatilayotgan API lar va ularning samaradorligini bir joydan kuzatish mumkin.
        <a href="#">Qo‘llanmani o‘qish</a>
      </div>
    </div>

    <div class="statistics__cards">
      <article v-for="card in statCards" :key="card.id" class="statistics__card">
        <div class="statistics__card-top">
          <span class="statistics__card-title">{{ card.title }}</span>
        </div>
        <div class="statistics__card-main">
          <span class="statistics__card-value">{{ formatCardValue(card) }}</span>
          <span class="statistics__trend" :class="getTrendClass(card.change)">
            <span class="statistics__trend-indicator">{{ formatTrend(card.change) }}</span>
            <span class="statistics__trend-text">o‘tgan davrga nisbatan</span>
          </span>
        </div>
        <p class="statistics__card-description">{{ card.description }}</p>
      </article>
    </div>

    <div class="statistics__panel statistics__panel--wide">
      <div class="statistics__panel-header">
        <div>
          <h2>Faoliyat grafigi</h2>
          <p>{{ selectedMetric.description }}</p>
        </div>
        <div class="statistics__panel-metric" :style="{ '--panel-accent': selectedMetric.color }">
          <span class="statistics__panel-value">{{ formatMetricValue(selectedCurrentValue, selectedMetric.unit) }}</span>
          <span class="statistics__panel-caption">So‘nggi kun</span>
          <span class="statistics__panel-trend" :class="getTrendClass(selectedTrend)">{{ formatTrend(selectedTrend) }}</span>
          <span class="statistics__panel-sub">O‘rtacha: {{ formatMetricValue(selectedAverageValue, selectedMetric.unit) }}</span>
        </div>
      </div>
      <div class="statistics__tablist">
        <button
          v-for="tab in metricTabs"
          :key="tab.id"
          type="button"
          :class="['statistics__tab-button', { 'statistics__tab-button--active': tab.id === selectedMetricId }]"
          :style="tab.id === selectedMetricId ? { '--tab-color': tab.color } : undefined"
          @click="selectedMetricId = tab.id"
        >
          <span class="statistics__tab-dot" :style="{ background: tab.color }"></span>
          {{ tab.label }}
        </button>
      </div>
      <div class="statistics__chart">
        <div class="statistics__chart-stage">
          <ul class="statistics__chart-yaxis">
            <li v-for="(tick, index) in chartGeometry.yTicks" :key="`y-${index}`">
              {{ formatMetricValue(tick.value, selectedMetric.unit) }}
            </li>
          </ul>
          <svg class="statistics__chart-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="chartGradientId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="selectedMetric.color" stop-opacity="0.32" />
                <stop offset="100%" :stop-color="selectedMetric.color" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="statistics__chart-grid">
              <line v-for="tick in chartGeometry.yTicks" :key="tick.y" x1="0" :y1="tick.y" x2="100" :y2="tick.y" />
            </g>
            <path
              v-if="chartGeometry.area"
              :d="chartGeometry.area"
              :fill="`url(#${chartGradientId})`"
              class="statistics__chart-area"
            />
            <polyline
              v-if="chartGeometry.polyline"
              :points="chartGeometry.polyline"
              :stroke="selectedMetric.color"
              class="statistics__chart-line"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <ul class="statistics__chart-xaxis">
          <li v-for="(label, index) in chartLabels" :key="`x-${index}`">{{ label }}</li>
        </ul>
      </div>
    </div>

    <div class="statistics__grid">
      <div class="statistics__panel">
        <div class="statistics__panel-header statistics__panel-header--compact">
          <div>
            <h3>Holat bo‘yicha taqsimot</h3>
            <p>API chaqiriqlari javob kodlari kesimida</p>
          </div>
        </div>
        <div class="statistics__status-list">
          <div v-for="status in statusBreakdown" :key="status.label" class="statistics__status">
            <div class="statistics__status-row">
              <span class="statistics__status-label">{{ status.label }}</span>
              <span class="statistics__status-value">{{ status.value }}%</span>
            </div>
            <div class="statistics__progress">
              <span class="statistics__progress-bar" :style="{ width: `${status.value}%`, background: status.color }"></span>
            </div>
            <p class="statistics__status-description">{{ status.description }}</p>
          </div>
        </div>
      </div>
      <div class="statistics__panel">
        <div class="statistics__panel-header statistics__panel-header--compact">
          <div>
            <h3>Kutish vaqti segmentlari</h3>
            <p>Gateway orqali o‘tgan so‘rovlarning taqsimoti</p>
          </div>
        </div>
        <ul class="statistics__latency-list">
          <li v-for="bucket in latencyBuckets" :key="bucket.bucket">
            <div class="statistics__latency-head">
              <span>{{ bucket.bucket }}</span>
              <span>{{ bucket.percentage }}%</span>
            </div>
            <div class="statistics__latency-bar">
              <span :style="{ width: `${bucket.percentage}%` }"></span>
            </div>
            <p>O‘rtacha: {{ formatLatency(bucket.avg) }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="statistics__panel">
      <div class="statistics__panel-header">
        <div>
          <h2>Eng ko‘p ishlatilgan API endpointlar</h2>
          <p>Chaqiriqlar soni, javob vaqti va xatoliklar kesimida</p>
        </div>
        <button type="button" class="statistics__panel-action">Detallar</button>
      </div>
      <table class="statistics__table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Chaqiriqlar</th>
            <th>Trend</th>
            <th>O‘rtacha kutish</th>
            <th>Xatoliklar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!topEndpoints.length">
            <td colspan="5" class="statistics__table-empty">
              Hali ma’lumot yo‘q. Integratsiyadan so‘ng statistikalar bu yerda paydo bo‘ladi.
            </td>
          </tr>
          <tr v-for="endpoint in topEndpoints" :key="endpoint.endpoint">
            <td>{{ endpoint.endpoint }}</td>
            <td>{{ formatNumber(endpoint.calls) }}</td>
            <td>
              <span class="statistics__table-trend" :class="getTrendClass(endpoint.change)">
                {{ formatTrend(endpoint.change) }}
              </span>
            </td>
            <td>{{ formatLatency(endpoint.avgWait) }}</td>
            <td>{{ formatErrorRate(endpoint.errorRate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!hasTraffic" class="statistics__empty">
      <div class="statistics__empty-icon">—</div>
      <h2>Tanlangan davrda trafik topilmadi</h2>
      <p>
        Foydali ma’lumotlar hozircha mavjud emas. Trafik paydo bo‘lishi bilan bu yerda asosiy metrikalar aks etadi.
        <a href="#">Optimallashtirish bo‘yicha qo‘llanma</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px 48px;
  background: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.statistics__banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #e8f0fe;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 14px;
  color: #174ea6;
  line-height: 1.5;
}

.statistics__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: #1a73e8;
  color: #fff;
  border-radius: 999px;
}

.statistics__banner a {
  color: #174ea6;
  text-decoration: underline;
}

.statistics__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.statistics__card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.statistics__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.statistics__card-title {
  font-size: 14px;
  font-weight: 600;
  color: #3c4043;
}

.statistics__card-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.statistics__card-value {
  font-size: 32px;
  font-weight: 600;
  color: #202124;
}

.statistics__trend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #5f6368;
}

.statistics__trend-indicator {
  font-weight: 600;
}

.statistics__trend--positive .statistics__trend-indicator,
.statistics__trend--positive {
  color: #188038;
}

.statistics__trend--negative .statistics__trend-indicator,
.statistics__trend--negative {
  color: #d93025;
}

.statistics__trend--neutral .statistics__trend-indicator {
  color: #5f6368;
}

.statistics__card-description {
  margin: 0;
  font-size: 13px;
  color: #5f6368;
  line-height: 1.5;
}

.statistics__panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.statistics__panel--wide {
  gap: 24px;
}

.statistics__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.statistics__panel-header h2,
.statistics__panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #202124;
}

.statistics__panel-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #5f6368;
}

.statistics__panel-header--compact {
  align-items: center;
}

.statistics__panel-metric {
  display: grid;
  gap: 4px;
  text-align: right;
  min-width: 140px;
}

.statistics__panel-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--panel-accent, #1a73e8);
}

.statistics__panel-caption {
  font-size: 12px;
  color: #5f6368;
}

.statistics__panel-trend {
  font-size: 12px;
  font-weight: 600;
}

.statistics__panel-sub {
  font-size: 12px;
  color: #5f6368;
}

.statistics__tablist {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f3f4;
  border-radius: 9999px;
  padding: 4px;
  width: fit-content;
}

.statistics__tab-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #5f6368;
  border: none;
  background: transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.statistics__tab-button:hover {
  background: rgba(26, 115, 232, 0.1);
}

.statistics__tab-button--active {
  background: #fff;
  color: var(--tab-color, #1a73e8);
  box-shadow: 0 1px 4px rgba(32, 33, 36, 0.18);
}

.statistics__tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.statistics__chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.statistics__chart-stage {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: stretch;
  gap: 12px;
}

.statistics__chart-yaxis {
  list-style: none;
  margin: 0;
  padding: 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: #5f6368;
  min-width: 60px;
}

.statistics__chart-svg {
  width: 100%;
  height: 220px;
  border-radius: 16px;
  background: #fff;
}

.statistics__chart-grid line {
  stroke: #e0e3e7;
  stroke-width: 0.6;
  stroke-dasharray: 4 4;
}

.statistics__chart-area {
  fill-opacity: 1;
}

.statistics__chart-line {
  stroke-width: 2;
}

.statistics__chart-xaxis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0 0 0 60px;
  font-size: 11px;
  color: #5f6368;
}

.statistics__chart-xaxis li {
  text-align: center;
}

.statistics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.statistics__status-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.statistics__status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #202124;
}

.statistics__status-description {
  margin: 8px 0 0;
  font-size: 12px;
  color: #5f6368;
  line-height: 1.4;
}

.statistics__progress {
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 10px;
}

.statistics__progress-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.statistics__latency-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.statistics__latency-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #202124;
}

.statistics__latency-bar {
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0 6px;
}

.statistics__latency-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #12b5cb 0%, #1a73e8 100%);
}

.statistics__latency-list p {
  margin: 0;
  font-size: 12px;
  color: #5f6368;
}

.statistics__panel-action {
  border: none;
  background: none;
  color: #1a73e8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.statistics__panel-action:hover {
  text-decoration: underline;
}

.statistics__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.statistics__table thead th {
  text-align: left;
  padding: 12px 24px;
  background: #f8f9fa;
  color: #5f6368;
  font-weight: 500;
}

.statistics__table td {
  padding: 16px 24px;
  border-top: 1px solid #f1f3f4;
  color: #3c4043;
}

.statistics__table tr:first-of-type td {
  border-top: none;
}

.statistics__table-trend {
  font-weight: 600;
  font-size: 12px;
}

.statistics__table-empty {
  text-align: center;
  color: #5f6368;
  font-style: italic;
}

.statistics__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  color: #5f6368;
  box-shadow: inset 0 0 0 1px #e0e3e7;
}

.statistics__empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f1f3f4;
  color: #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.statistics__empty h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #202124;
}

.statistics__empty p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.statistics__empty a {
  color: #1a73e8;
}

@media (max-width: 1024px) {
  .statistics__panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .statistics__panel-metric {
    text-align: left;
  }

  .statistics__chart-xaxis {
    padding-left: 0;
  }
}

@media (max-width: 720px) {
  .statistics {
    padding: 20px 16px 32px;
  }

  .statistics__banner {
    flex-direction: column;
  }

  .statistics__cards {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .statistics__panel {
    padding: 20px;
  }

  .statistics__chart-stage {
    grid-template-columns: 1fr;
  }

  .statistics__chart-yaxis {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
  }

  .statistics__chart-xaxis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .statistics__panel-header {
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .statistics__tablist {
    flex-wrap: wrap;
  }

  .statistics__chart-svg {
    height: 180px;
  }

  .statistics__panel-value {
    font-size: 26px;
  }
}
</style>
