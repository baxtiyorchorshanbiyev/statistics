<script setup lang="ts">
import { computed, ref } from 'vue'
import ContentFilters from '../components/ContentFilters.vue'

type MetricTabId = 'clicks' | 'latency' | 'errors'

interface MetricTab {
  id: MetricTabId
  label: string
  color: string
  unit?: string
  description: string
}

interface MenuChildMetric {
  id: string
  title: string
  path: string
  clicks: number
  clickTrend: number
  avgLatency: number
  errorRate: number
}

interface MenuHistoryPoint {
  date: string
  clicks: number
  avgLatency: number
  errorRate: number
}

type IssueImpact = 'high' | 'medium' | 'low'

interface MenuIssue {
  id: string
  label: string
  impact: IssueImpact
  description: string
  affected: string
}

interface MenuHighlight {
  id: string
  label: string
  value: string
  delta?: number
  deltaPositive?: boolean
  description?: string
}

interface MenuGroupMetric {
  id: string
  title: string
  description: string
  totalClicks: number
  clickTrend: number
  averageLatency: number
  latencyTrend: number
  errorRate: number
  errorTrend: number
  satisfaction: number
  childMetrics: MenuChildMetric[]
  history: MenuHistoryPoint[]
  issues: MenuIssue[]
  highlights: MenuHighlight[]
}

const integerFormatter = new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('uz-UZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const environments = [
  { label: 'Prod', description: 'Asosiy foydalanuvchilar uchun ishchi muhit', value: 'production' },
  { label: 'Sandbox', description: 'Sinov va integratsiya muhiti', value: 'sandbox' }
]

const dateRangeOptions = [
  { label: 'Oxirgi 7 kun', value: 'last-7' },
  { label: 'Oxirgi 28 kun', value: 'last-28' },
  { label: 'Oxirgi 3 oy', value: 'last-90' }
]

const metricTabs = ref<MetricTab[]>([
  {
    id: 'clicks',
    label: 'Kliklar',
    color: '#4c8dff',
    description: 'Menyular bo‘yicha umumiy kliklar dinamikasi'
  },
  {
    id: 'latency',
    label: 'Kutish vaqti',
    color: '#12b5cb',
    unit: 'ms',
    description: 'Tanlangan menyunun o‘rtacha javob vaqti'
  },
  {
    id: 'errors',
    label: 'Xatoliklar',
    color: '#ff6b81',
    unit: '%',
    description: '4xx va 5xx kesimida xatoliklar ulushi'
  }
])

const selectedEnv = ref(environments[0]?.value ?? '')
const selectedRange = ref(dateRangeOptions[0]?.value ?? '')

const menuGroups = ref<MenuGroupMetric[]>([
  {
    id: 'supplies',
    title: 'Ta’minot (Supplies)',
    description: 'Barcha yetkazib berish jarayonlari va ularning holatini monitoring qilish',
    totalClicks: 18536,
    clickTrend: 18.4,
    averageLatency: 286,
    latencyTrend: -11.2,
    errorRate: 1.3,
    errorTrend: -0.5,
    satisfaction: 92,
    childMetrics: [
      {
        id: 'supplies-all',
        title: 'Barcha so‘rovlar',
        path: '/supplies',
        clicks: 8420,
        clickTrend: 14.3,
        avgLatency: 284,
        errorRate: 1.2
      },
      {
        id: 'supplies-editing',
        title: 'Tahrirlash jarayonida',
        path: '/supplies/editing',
        clicks: 5240,
        clickTrend: 11.8,
        avgLatency: 308,
        errorRate: 1.7
      },
      {
        id: 'supplies-active',
        title: 'Faol ta’minotlar',
        path: '/supplies/active',
        clicks: 4876,
        clickTrend: 26.5,
        avgLatency: 248,
        errorRate: 0.8
      }
    ],
    history: [
      { date: '30 Okt', clicks: 2380, avgLatency: 328, errorRate: 1.8 },
      { date: '31 Okt', clicks: 2456, avgLatency: 318, errorRate: 1.6 },
      { date: '1 Noy', clicks: 2588, avgLatency: 308, errorRate: 1.4 },
      { date: '2 Noy', clicks: 2662, avgLatency: 299, errorRate: 1.3 },
      { date: '3 Noy', clicks: 2744, avgLatency: 288, errorRate: 1.2 },
      { date: '4 Noy', clicks: 2810, avgLatency: 279, errorRate: 1.2 },
      { date: '5 Noy', clicks: 2896, avgLatency: 268, errorRate: 1.1 }
    ],
    issues: [
      {
        id: 'supplies-issue-latency',
        label: 'Tahrirlash kesimida kechikishlar',
        impact: 'medium',
        description: 'Editing segmentida o‘rtacha kechikish 308 ms bo‘lib, umumiy o‘rtachadan 7% yuqori.',
        affected: 'Ma’lumotlarni tekshirish formulalari'
      },
      {
        id: 'supplies-issue-auth',
        label: '401 autentifikatsiya xatolari',
        impact: 'high',
        description: 'API kaliti noto‘g‘ri yuborilgan 112 ta so‘rov qayd etildi. Ofislar bo‘yicha kirish siyosatini yangilash zarur.',
        affected: 'Regional operatorlar'
      }
    ],
    highlights: [
      {
        id: 'supplies-highlight-top',
        label: 'Eng ko‘p klik qilingan child',
        value: 'Barcha so‘rovlar — 8 420 ta',
        description: 'Kundalik operatsiyalarni boshqaruvchi asosiy sahifa'
      },
      {
        id: 'supplies-highlight-sla',
        label: 'SLA bajarilishi',
        value: '94%',
        delta: 3.2,
        deltaPositive: true,
        description: 'Shartnoma bo‘yicha qabul qilingan javob vaqti 400 ms dan past'
      }
    ]
  },
  {
    id: 'move-out',
    title: 'Chiqarish (Move-out)',
    description: 'Mahsulotlarni chiqarish jarayonlarini avtomatlashtirish',
    totalClicks: 16284,
    clickTrend: 15.1,
    averageLatency: 312,
    latencyTrend: -7.8,
    errorRate: 2.1,
    errorTrend: -0.2,
    satisfaction: 88,
    childMetrics: [
      {
        id: 'move-out-all',
        title: 'Barcha buyurtmalar',
        path: '/move-out',
        clicks: 6824,
        clickTrend: 12.2,
        avgLatency: 324,
        errorRate: 2.4
      },
      {
        id: 'move-out-checking',
        title: 'Tekshirish jarayonida',
        path: '/move-out/checking',
        clicks: 4720,
        clickTrend: 18.9,
        avgLatency: 306,
        errorRate: 2.0
      },
      {
        id: 'move-out-sent',
        title: 'Yuborilganlar',
        path: '/move-out/sent',
        clicks: 4740,
        clickTrend: 14.7,
        avgLatency: 292,
        errorRate: 1.6
      }
    ],
    history: [
      { date: '30 Okt', clicks: 2120, avgLatency: 332, errorRate: 2.6 },
      { date: '31 Okt', clicks: 2198, avgLatency: 329, errorRate: 2.5 },
      { date: '1 Noy', clicks: 2286, avgLatency: 321, errorRate: 2.3 },
      { date: '2 Noy', clicks: 2342, avgLatency: 312, errorRate: 2.1 },
      { date: '3 Noy', clicks: 2394, avgLatency: 306, errorRate: 2.0 },
      { date: '4 Noy', clicks: 2446, avgLatency: 298, errorRate: 1.9 },
      { date: '5 Noy', clicks: 2498, avgLatency: 294, errorRate: 1.8 }
    ],
    issues: [
      {
        id: 'move-out-issue-stock',
        label: 'Ombor sinxronizatsiyasi',
        impact: 'medium',
        description: 'Sent statusidagi so‘rovlar 14% hollarda inventar bilan sinxron bo‘lmayapti.',
        affected: 'Filial №17 va №21'
      },
      {
        id: 'move-out-issue-validation',
        label: 'Validatsiya xatolari',
        impact: 'low',
        description: 'Tekshirish bosqichida 0.6% hujjatlar format xatosi bilan rad etildi.',
        affected: 'Excel eksport'
      }
    ],
    highlights: [
      {
        id: 'move-out-highlight-speed',
        label: 'Tezkor segment',
        value: 'Yuborilganlar — 292 ms',
        description: 'Yetkazib berish bo‘yicha SLA 300 ms dan past'
      },
      {
        id: 'move-out-highlight-error',
        label: 'Xatolik ulushi',
        value: '2.1%',
        delta: 0.4,
        deltaPositive: true,
        description: 'O‘tgan davrga nisbatan 0.4 p.p. ga kamaydi'
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventarizatsiya',
    description: 'Inventarizatsiya jarayonlarini real vaqt rejimida kuzatib borish',
    totalClicks: 13942,
    clickTrend: 12.7,
    averageLatency: 334,
    latencyTrend: -5.4,
    errorRate: 2.4,
    errorTrend: -0.1,
    satisfaction: 84,
    childMetrics: [
      {
        id: 'inventory-all',
        title: 'Barcha invetarizatsiya',
        path: '/inventory',
        clicks: 5430,
        clickTrend: 9.6,
        avgLatency: 346,
        errorRate: 2.9
      },
      {
        id: 'inventory-process',
        title: 'Jarayonda',
        path: '/inventory/process',
        clicks: 4320,
        clickTrend: 15.5,
        avgLatency: 332,
        errorRate: 2.5
      },
      {
        id: 'inventory-completed',
        title: 'Yakunlangan',
        path: '/inventory/completed',
        clicks: 4192,
        clickTrend: 13.9,
        avgLatency: 312,
        errorRate: 1.6
      }
    ],
    history: [
      { date: '30 Okt', clicks: 1840, avgLatency: 358, errorRate: 2.9 },
      { date: '31 Okt', clicks: 1896, avgLatency: 352, errorRate: 2.7 },
      { date: '1 Noy', clicks: 1964, avgLatency: 344, errorRate: 2.6 },
      { date: '2 Noy', clicks: 2018, avgLatency: 336, errorRate: 2.5 },
      { date: '3 Noy', clicks: 2056, avgLatency: 331, errorRate: 2.4 },
      { date: '4 Noy', clicks: 2102, avgLatency: 326, errorRate: 2.3 },
      { date: '5 Noy', clicks: 2190, avgLatency: 318, errorRate: 2.1 }
    ],
    issues: [
      {
        id: 'inventory-issue-upload',
        label: 'Yuklashdagi og‘ishlar',
        impact: 'high',
        description: 'Inventarizatsiya faylini yuklashda 83 ta so‘rov 504 bilan yakunlandi.',
        affected: 'CSV bulk upload'
      },
      {
        id: 'inventory-issue-audit',
        label: 'Audit sinxronizatsiyasi',
        impact: 'medium',
        description: 'Audit API bilan sinxronlashish 1.2 soniyagacha cho‘zilmoqda.',
        affected: 'Audit xizmati'
      }
    ],
    highlights: [
      {
        id: 'inventory-highlight-completed',
        label: 'Yakunlangan jarayonlar',
        value: '4 192 ta',
        description: 'O‘tgan haftaga nisbatan +13%'
      },
      {
        id: 'inventory-highlight-latency',
        label: 'Kechikish kamayishi',
        value: '−5.4%',
        delta: 5.4,
        deltaPositive: true,
        description: 'Optimallashtirilgan indekslar natijasi'
      }
    ]
  }
])

const selectedMenuId = ref<string>(menuGroups.value[0]?.id ?? '')
const selectedMetricId = ref<MetricTabId>('clicks')

const selectedMenu = computed<MenuGroupMetric | undefined>(() =>
  menuGroups.value.find((group) => group.id === selectedMenuId.value)
)

const chartLabels = computed(() => selectedMenu.value?.history.map((point) => point.date) ?? [])

const selectedMetricTab = computed<MetricTab>(
  () => metricTabs.value.find((tab) => tab.id === selectedMetricId.value) ?? metricTabs.value[0]!
)

const selectedSeries = computed<number[]>(() => {
  if (!selectedMenu.value) return []
  return selectedMenu.value.history.map((point) => {
    if (selectedMetricId.value === 'clicks') return point.clicks
    if (selectedMetricId.value === 'latency') return point.avgLatency
    return point.errorRate
  })
})

const selectedTrend = computed(() => {
  if (!selectedMenu.value) return 0
  if (selectedMetricId.value === 'clicks') return selectedMenu.value.clickTrend
  if (selectedMetricId.value === 'latency') return selectedMenu.value.latencyTrend
  return selectedMenu.value.errorTrend
})

const selectedCurrentValue = computed(() => selectedSeries.value.at(-1) ?? 0)

const selectedAverageValue = computed(() => {
  if (!selectedSeries.value.length) return 0
  const total = selectedSeries.value.reduce((sum, value) => sum + value, 0)
  return total / selectedSeries.value.length
})

const chartGradientId = computed(() => `menu-insights-chart-gradient-${selectedMetricId.value}`)

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

const sparklinePaths = computed<Map<string, string>>(() => {
  const map = new Map<string, string>()
  menuGroups.value.forEach((group) => {
    const values = group.history.map((point) => point.clicks)
    map.set(group.id, buildSparkline(values))
  })
  return map
})

const totalClicks = computed(() => menuGroups.value.reduce((sum, group) => sum + group.totalClicks, 0))

function weightedAverage(selector: (group: MenuGroupMetric) => number) {
  const total = totalClicks.value
  if (!total) return 0
  const sum = menuGroups.value.reduce((acc, group) => acc + selector(group) * group.totalClicks, 0)
  return sum / total
}

const overallClickTrend = computed(() => weightedAverage((group) => group.clickTrend))
const overallLatency = computed(() => weightedAverage((group) => group.averageLatency))
const overallLatencyTrend = computed(() => weightedAverage((group) => group.latencyTrend))
const overallErrorRate = computed(() => weightedAverage((group) => group.errorRate))
const overallErrorTrend = computed(() => weightedAverage((group) => group.errorTrend))

const selectedMenuIssues = computed(() => selectedMenu.value?.issues ?? [])
const selectedMenuHighlights = computed(() => selectedMenu.value?.highlights ?? [])
const selectedChildMetrics = computed(() => selectedMenu.value?.childMetrics ?? [])

const impactLabels: Record<IssueImpact, string> = {
  high: 'Yuqori',
  medium: 'O‘rta',
  low: 'Past'
}

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

function formatTrend(change: number) {
  if (!change) {
    return '—'
  }
  const formatted = decimalFormatter.format(Math.abs(change))
  return `${change > 0 ? '+' : '-'}${formatted}%`
}

function getTrendClass(change: number) {
  if (change > 0) return 'menu-insights__trend--positive'
  if (change < 0) return 'menu-insights__trend--negative'
  return 'menu-insights__trend--neutral'
}

function getMetricTrendClass(change: number, metric: MetricTabId) {
  if (metric === 'clicks') {
    return getTrendClass(change)
  }
  // latency va errors uchun pastga harakat ijobiy
  return getTrendClass(-change)
}

function buildSparkline(values: number[]) {
  if (!values.length) return ''
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const height = 40
  const padding = 6
  const usableHeight = height - padding * 2

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100
      const normalized = range === 0 ? 0.5 : (value - min) / range
      const y = height - padding - normalized * usableHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}
</script>

<template>
  <div class="menu-insights">
    <ContentFilters
      v-model:environment="selectedEnv"
      v-model:dateRange="selectedRange"
      :environments="environments"
      :date-range-options="dateRangeOptions"
      title="Menyu analitikasi"
      subtitle="Google Search Console uslubidagi menyu samaradorligi va foydalanish tahlili"
    />

    <section class="menu-insights__metrics">
      <article class="menu-insights__summary-card">
        <span class="menu-insights__summary-label">Jami kliklar</span>
        <strong class="menu-insights__summary-value">{{ formatMetricValue(totalClicks) }}</strong>
        <span class="menu-insights__summary-caption">Monitoring qilinayotgan menyular bo‘yicha</span>
        <span class="menu-insights__trend" :class="getTrendClass(overallClickTrend)">
          {{ formatTrend(overallClickTrend) }}
          <span>o‘tgan davrga nisbatan</span>
        </span>
      </article>
      <article class="menu-insights__summary-card">
        <span class="menu-insights__summary-label">O‘rtacha kutish vaqti</span>
        <strong class="menu-insights__summary-value">{{ formatMetricValue(overallLatency, 'ms') }}</strong>
        <span class="menu-insights__summary-caption">Tanlangan menyularning o‘rtacha javob vaqti</span>
        <span class="menu-insights__trend" :class="getTrendClass(-overallLatencyTrend)">
          {{ formatTrend(overallLatencyTrend) }}
          <span>kechikishdagi o‘zgarish</span>
        </span>
      </article>
      <article class="menu-insights__summary-card">
        <span class="menu-insights__summary-label">Xatolik ulushi</span>
        <strong class="menu-insights__summary-value">{{ formatMetricValue(overallErrorRate, '%') }}</strong>
        <span class="menu-insights__summary-caption">4xx va 5xx javoblari ulushi</span>
        <span class="menu-insights__trend" :class="getTrendClass(-overallErrorTrend)">
          {{ formatTrend(overallErrorTrend) }}
          <span>stabilizatsiya darajasi</span>
        </span>
      </article>
    </section>

    <section class="menu-insights__split">
      <div class="menu-insights__panel menu-insights__panel--chart">
        <div class="menu-insights__panel-head">
          <div>
            <h2>Menu ishlatilish trendlari</h2>
            <p>{{ selectedMetricTab.description }}</p>
          </div>
          <div class="menu-insights__panel-stat" :style="{ '--accent': selectedMetricTab.color }">
            <span class="menu-insights__panel-value">
              {{ formatMetricValue(selectedCurrentValue, selectedMetricTab.unit) }}
            </span>
            <span class="menu-insights__panel-caption">So‘nggi kun</span>
            <span class="menu-insights__panel-trend" :class="getMetricTrendClass(selectedTrend, selectedMetricId)">
              {{ formatTrend(selectedTrend) }}
            </span>
            <span class="menu-insights__panel-sub">
              O‘rtacha: {{ formatMetricValue(selectedAverageValue, selectedMetricTab.unit) }}
            </span>
          </div>
        </div>
        <div class="menu-insights__tablist">
          <button
            v-for="tab in metricTabs"
            :key="tab.id"
            type="button"
            class="menu-insights__tab"
            :class="{ 'menu-insights__tab--active': tab.id === selectedMetricId }"
            :style="tab.id === selectedMetricId ? { '--tab-color': tab.color } : undefined"
            @click="selectedMetricId = tab.id"
          >
            <span class="menu-insights__tab-dot" :style="{ background: tab.color }"></span>
            {{ tab.label }}
          </button>
        </div>
        <div class="menu-insights__chart">
          <div class="menu-insights__chart-stage">
            <ul class="menu-insights__chart-yaxis">
              <li v-for="(tick, index) in chartGeometry.yTicks" :key="`y-${index}`">
                {{ formatMetricValue(tick.value, selectedMetricTab.unit) }}
              </li>
            </ul>
            <svg class="menu-insights__chart-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="chartGradientId" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="selectedMetricTab.color" stop-opacity="0.35" />
                  <stop offset="100%" :stop-color="selectedMetricTab.color" stop-opacity="0" />
                </linearGradient>
              </defs>
              <g class="menu-insights__chart-grid">
                <line
                  v-for="tick in chartGeometry.yTicks"
                  :key="tick.y"
                  x1="0"
                  :y1="tick.y"
                  x2="100"
                  :y2="tick.y"
                />
              </g>
              <path
                v-if="chartGeometry.area"
                :d="chartGeometry.area"
                :fill="`url(#${chartGradientId})`"
                class="menu-insights__chart-area"
              />
              <polyline
                v-if="chartGeometry.polyline"
                :points="chartGeometry.polyline"
                :stroke="selectedMetricTab.color"
                class="menu-insights__chart-line"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <ul class="menu-insights__chart-xaxis">
            <li v-for="(label, index) in chartLabels" :key="`x-${index}`">{{ label }}</li>
          </ul>
        </div>
      </div>

      <aside class="menu-insights__panel menu-insights__panel--menus">
        <header class="menu-insights__panel-head menu-insights__panel-head--compact">
          <div>
            <h3>Monitoring qilinayotgan menyular</h3>
            <p>Tezkor ko‘rsatkichlar va trendlar</p>
          </div>
        </header>
        <ul class="menu-insights__menu-list">
          <li v-for="menu in menuGroups" :key="menu.id">
            <button
              type="button"
              class="menu-card"
              :class="{ 'menu-card--active': menu.id === selectedMenuId }"
              @click="selectedMenuId = menu.id"
            >
              <div class="menu-card__head">
                <span class="menu-card__title">{{ menu.title }}</span>
                <span class="menu-insights__trend" :class="getTrendClass(menu.clickTrend)">
                  {{ formatTrend(menu.clickTrend) }}
                </span>
              </div>
              <p class="menu-card__description">{{ menu.description }}</p>
              <div class="menu-card__metrics">
                <div>
                  <span class="menu-card__metric-value">{{ formatMetricValue(menu.totalClicks) }}</span>
                  <span class="menu-card__metric-label">Kliklar</span>
                </div>
                <div>
                  <span class="menu-card__metric-value">{{ formatMetricValue(menu.averageLatency, 'ms') }}</span>
                  <span class="menu-card__metric-label">Kutish</span>
                </div>
                <div>
                  <span class="menu-card__metric-value">{{ formatMetricValue(menu.errorRate, '%') }}</span>
                  <span class="menu-card__metric-label">Xatolik</span>
                </div>
              </div>
              <div class="menu-card__sparkline">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`sparkline-${menu.id}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#4c8dff" stop-opacity="0.4" />
                      <stop offset="100%" stop-color="#4c8dff" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    v-if="sparklinePaths.get(menu.id)"
                    :d="`${sparklinePaths.get(menu.id)} L 100 40 L 0 40 Z`"
                    :fill="`url(#sparkline-${menu.id})`"
                    class="menu-card__sparkline-area"
                  />
                  <path
                    v-if="sparklinePaths.get(menu.id)"
                    :d="sparklinePaths.get(menu.id) ?? ''"
                    class="menu-card__sparkline-line"
                  />
                </svg>
              </div>
              <dl class="menu-card__facts">
                <div>
                  <dt>Mamnunlik</dt>
                  <dd>{{ formatMetricValue(menu.satisfaction, '%') }}</dd>
                </div>
                <div>
                  <dt>Kechikish trendi</dt>
                  <dd :class="getMetricTrendClass(menu.latencyTrend, 'latency')">{{ formatTrend(menu.latencyTrend) }}</dd>
                </div>
              </dl>
            </button>
          </li>
        </ul>
      </aside>
    </section>

    <section class="menu-insights__panel">
      <div class="menu-insights__panel-head menu-insights__panel-head--tight">
        <div>
          <h3>{{ selectedMenu?.title ?? 'Menyu' }} menyusi bo‘yicha batafsil</h3>
          <p>Child menyular kesimida kliklar, kechikish va xatoliklar</p>
        </div>
        <span v-if="selectedMenu" class="menu-insights__pill">
          Mamnunlik {{ formatMetricValue(selectedMenu.satisfaction, '%') }}
        </span>
      </div>
      <table class="menu-insights__table">
        <thead>
          <tr>
            <th>Yo‘nalish</th>
            <th>Path</th>
            <th>Kliklar</th>
            <th>Trend</th>
            <th>O‘rtacha kutish</th>
            <th>Xatolik</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!selectedChildMetrics.length">
            <td colspan="6" class="menu-insights__table-empty">
              Tanlangan menyu uchun ma’lumot topilmadi.
            </td>
          </tr>
          <tr v-for="child in selectedChildMetrics" :key="child.id">
            <td>{{ child.title }}</td>
            <td>
              <code class="menu-insights__code">{{ child.path }}</code>
            </td>
            <td>{{ formatMetricValue(child.clicks) }}</td>
            <td>
              <span class="menu-insights__trend" :class="getTrendClass(child.clickTrend)">
                {{ formatTrend(child.clickTrend) }}
              </span>
            </td>
            <td>{{ formatMetricValue(child.avgLatency, 'ms') }}</td>
            <td>{{ formatMetricValue(child.errorRate, '%') }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="menu-insights__grid">
      <div class="menu-insights__panel">
        <div class="menu-insights__panel-head menu-insights__panel-head--tight">
          <div>
            <h3>Muammo segmentlari</h3>
            <p>Tezkor chora-tadbir talab qilinadigan jarayonlar</p>
          </div>
        </div>
        <ul class="menu-insights__issue-list">
          <li v-if="!selectedMenuIssues.length" class="menu-insights__issue-empty">
            Hozircha kritik muammo topilmadi.
          </li>
          <li v-for="issue in selectedMenuIssues" :key="issue.id" class="menu-insights__issue">
            <span class="menu-insights__issue-impact" :class="`menu-insights__issue-impact--${issue.impact}`">
              {{ impactLabels[issue.impact] }}
            </span>
            <div class="menu-insights__issue-body">
              <h4>{{ issue.label }}</h4>
              <p>{{ issue.description }}</p>
              <span class="menu-insights__issue-affected">Ta’sir ko‘lami: {{ issue.affected }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="menu-insights__panel">
        <div class="menu-insights__panel-head menu-insights__panel-head--tight">
          <div>
            <h3>Yutuqlar va tavsiyalar</h3>
            <p>Optimallashtirish bo‘yicha tezkor tavsiyalar</p>
          </div>
        </div>
        <ul class="menu-insights__highlight-list">
          <li v-if="!selectedMenuHighlights.length" class="menu-insights__highlight-empty">
            Statistik ma’lumotlar shakllantirilmoqda.
          </li>
          <li v-for="item in selectedMenuHighlights" :key="item.id" class="menu-insights__highlight">
            <div class="menu-insights__highlight-top">
              <span class="menu-insights__highlight-label">{{ item.label }}</span>
              <span class="menu-insights__highlight-value">{{ item.value }}</span>
            </div>
            <p v-if="item.description" class="menu-insights__highlight-description">{{ item.description }}</p>
            <span
              v-if="item.delta !== undefined"
              class="menu-insights__highlight-delta"
              :class="item.deltaPositive ? 'menu-insights__trend--positive' : 'menu-insights__trend--negative'"
            >
              {{ formatTrend(item.delta) }}
            </span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.menu-insights {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 32px 48px;
  background: linear-gradient(180deg, rgba(9, 19, 37, 0.2) 0%, rgba(9, 19, 37, 0.8) 100%);
  color: var(--color-text-primary);
}

.menu-insights__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.menu-insights__summary-card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: grid;
  gap: 10px;
  border: 1px solid rgba(124, 169, 255, 0.16);
  box-shadow: var(--shadow-glow);
  backdrop-filter: blur(18px);
}

.menu-insights__summary-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
}

.menu-insights__summary-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.menu-insights__summary-caption {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.menu-insights__trend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.menu-insights__trend span {
  font-weight: 400;
  opacity: 0.7;
}

.menu-insights__trend--positive {
  color: var(--color-success);
}

.menu-insights__trend--negative {
  color: var(--color-danger);
}

.menu-insights__trend--neutral {
  color: var(--color-text-secondary);
}

.menu-insights__split {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.menu-insights__panel {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid rgba(124, 169, 255, 0.16);
  box-shadow: var(--shadow-glow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  backdrop-filter: blur(18px);
}

.menu-insights__panel--chart {
  gap: 24px;
}

.menu-insights__panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.menu-insights__panel-head h2,
.menu-insights__panel-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.menu-insights__panel-head p {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.menu-insights__panel-head--compact {
  align-items: center;
}

.menu-insights__panel-head--tight {
  margin-bottom: -8px;
}

.menu-insights__panel-stat {
  display: grid;
  gap: 4px;
  text-align: right;
  min-width: 140px;
  color: var(--color-text-secondary);
}

.menu-insights__panel-value {
  font-size: 30px;
  font-weight: 600;
  color: var(--accent, var(--color-primary));
}

.menu-insights__panel-caption {
  font-size: 12px;
}

.menu-insights__panel-trend {
  font-size: 12px;
  font-weight: 600;
}

.menu-insights__panel-sub {
  font-size: 12px;
}

.menu-insights__tablist {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 24, 46, 0.72);
  border-radius: 9999px;
  padding: 4px;
  width: fit-content;
  border: 1px solid rgba(124, 169, 255, 0.12);
}

.menu-insights__tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border: none;
  background: transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-insights__tab:hover {
  background: rgba(76, 141, 255, 0.12);
}

.menu-insights__tab--active {
  background: var(--color-bg-surface);
  color: var(--tab-color, var(--color-primary));
  box-shadow: inset 0 0 0 1px rgba(124, 169, 255, 0.28);
}

.menu-insights__tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.menu-insights__chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-insights__chart-stage {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: stretch;
  gap: 12px;
}

.menu-insights__chart-yaxis {
  list-style: none;
  margin: 0;
  padding: 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-secondary);
  min-width: 64px;
}

.menu-insights__chart-svg {
  width: 100%;
  height: 220px;
  border-radius: var(--radius-md);
  background: rgba(14, 24, 46, 0.7);
}

.menu-insights__chart-grid line {
  stroke: var(--color-border-subtle);
  stroke-width: 0.6;
  stroke-dasharray: 4 4;
}

.menu-insights__chart-area {
  fill-opacity: 1;
}

.menu-insights__chart-line {
  stroke-width: 2;
}

.menu-insights__chart-xaxis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0 0 0 64px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.menu-insights__chart-xaxis li {
  text-align: center;
}

.menu-insights__panel--menus {
  gap: 20px;
}

.menu-insights__menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.menu-card {
  width: 100%;
  border: none;
  background: rgba(14, 24, 46, 0.6);
  border-radius: var(--radius-md);
  padding: 16px;
  color: inherit;
  text-align: left;
  display: grid;
  gap: 12px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-card:hover {
  border-color: rgba(124, 169, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.menu-card--active {
  border-color: rgba(124, 169, 255, 0.46);
  background: rgba(14, 24, 46, 0.85);
  box-shadow: 0 0 0 1px rgba(124, 169, 255, 0.46), 0 18px 32px rgba(13, 37, 92, 0.38);
}

.menu-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.menu-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.menu-card__description {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  opacity: 0.9;
  line-height: 1.5;
}

.menu-card__metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.menu-card__metric-value {
  font-size: 16px;
  font-weight: 600;
}

.menu-card__metric-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.menu-card__sparkline {
  width: 100%;
  height: 40px;
}

.menu-card__sparkline svg {
  width: 100%;
  height: 100%;
}

.menu-card__sparkline-area {
  fill-opacity: 1;
}

.menu-card__sparkline-line {
  fill: none;
  stroke: #4c8dff;
  stroke-width: 2;
  stroke-linecap: round;
}

.menu-card__facts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
}

.menu-card__facts div {
  display: grid;
  gap: 4px;
}

.menu-card__facts dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
}

.menu-card__facts dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.menu-insights__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(76, 141, 255, 0.16);
  border: 1px solid rgba(124, 169, 255, 0.22);
}

.menu-insights__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.menu-insights__table thead th {
  text-align: left;
  padding: 12px 24px;
  background: rgba(14, 24, 46, 0.7);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.menu-insights__table td {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
}

.menu-insights__table tr:first-of-type td {
  border-top: none;
}

.menu-insights__code {
  padding: 2px 8px;
  background: rgba(14, 24, 46, 0.7);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(124, 169, 255, 0.12);
  font-size: 12px;
  color: var(--color-primary);
}

.menu-insights__table-empty {
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
  padding: 24px 0;
}

.menu-insights__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.menu-insights__issue-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.menu-insights__issue {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
  padding: 16px;
  border-radius: var(--radius-md);
  background: rgba(14, 24, 46, 0.6);
  border: 1px solid rgba(124, 169, 255, 0.12);
}

.menu-insights__issue-impact {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.menu-insights__issue-impact--high {
  background: rgba(255, 107, 129, 0.18);
  color: var(--color-danger);
}

.menu-insights__issue-impact--medium {
  background: rgba(255, 209, 102, 0.18);
  color: var(--color-warning);
}

.menu-insights__issue-impact--low {
  background: rgba(74, 217, 145, 0.18);
  color: var(--color-success);
}

.menu-insights__issue-body h4 {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--color-text-primary);
}

.menu-insights__issue-body p {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.menu-insights__issue-affected {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.menu-insights__issue-empty {
  padding: 24px;
  text-align: center;
  color: var(--color-text-secondary);
  background: rgba(14, 24, 46, 0.6);
  border-radius: var(--radius-md);
}

.menu-insights__highlight-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.menu-insights__highlight {
  background: rgba(14, 24, 46, 0.6);
  border-radius: var(--radius-md);
  border: 1px solid rgba(124, 169, 255, 0.12);
  padding: 16px;
  display: grid;
  gap: 8px;
}

.menu-insights__highlight-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.menu-insights__highlight-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.menu-insights__highlight-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
}

.menu-insights__highlight-description {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.menu-insights__highlight-delta {
  font-size: 12px;
  font-weight: 600;
}

.menu-insights__highlight-empty {
  padding: 24px;
  text-align: center;
  color: var(--color-text-secondary);
  background: rgba(14, 24, 46, 0.6);
  border-radius: var(--radius-md);
}

@media (max-width: 1180px) {
  .menu-insights__split {
    grid-template-columns: 1fr;
  }

  .menu-insights__chart-xaxis {
    padding-left: 0;
  }
}

@media (max-width: 900px) {
  .menu-insights {
    padding: 0 20px 40px;
  }
}

@media (max-width: 720px) {
  .menu-insights__metrics {
    grid-template-columns: 1fr;
  }

  .menu-insights__panel {
    padding: 20px;
  }

  .menu-insights__chart-svg {
    height: 190px;
  }

  .menu-card__metrics {
    flex-direction: column;
    align-items: flex-start;
  }

  .menu-card__facts {
    flex-direction: column;
    align-items: flex-start;
  }

  .menu-insights__panel-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .menu-insights {
    padding: 0 16px 32px;
  }

  .menu-insights__chart-stage {
    grid-template-columns: 1fr;
  }

  .menu-insights__chart-yaxis {
    flex-direction: row;
    justify-content: space-between;
    min-width: unset;
    padding: 0 6px;
  }

  .menu-insights__chart-xaxis {
    padding-left: 0;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
}
</style>
