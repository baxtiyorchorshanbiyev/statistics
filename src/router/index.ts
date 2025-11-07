import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Statistika' }
  },
  {
    path: '/api-monitoring',
    name: 'ApiMonitoring',
    component: () => import('../views/ApiMonitoringView.vue'),
    meta: { title: 'API monitoringi' }
  },
  {
    path: '/response-times',
    name: 'ResponseTimes',
    component: () => import('../views/ResponseTimesView.vue'),
    meta: { title: 'Javob vaqtlari' }
  },
  {
    path: '/error-tracking',
    name: 'ErrorTracking',
    component: () => import('../views/ErrorTrackingView.vue'),
    meta: { title: 'Xatoliklarni kuzatuv' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

