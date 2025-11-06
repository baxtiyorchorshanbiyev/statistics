<script setup lang="ts">
import AdminSidebar from './components/AdminSidebar.vue'
import AdminTopBar from './components/AdminTopBar.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'
</script>

<template>
  <div class="app-shell">
    <AdminSidebar />
    <div class="app-shell__main">
      <AdminTopBar />
      <StatisticsPanel />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  color: #202124;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

@media (max-width: 920px) {
  .app-shell {
    flex-direction: column;
  }

  .app-shell__main {
    min-height: calc(100vh - 320px);
  }
}
</style>
