<script setup lang="ts">
import { computed, ref } from 'vue'

interface StatCard {
  title: string
  value: string
  trend: number
  description: string
}

const cards = ref<StatCard[]>([
  { title: 'Umumiy so‘rovlar', value: '0', trend: 0, description: 'Tanlangan davr davomida qidiruvdan kelgan so‘rovlar soni' },
  { title: 'API qo‘ng‘iroqlari', value: '0', trend: 0, description: 'API gateway orqali qabul qilingan chaqiriqlar' },
  { title: 'O‘rtacha kutish vaqti', value: '—', trend: 0, description: 'Chaqiriqlar bo‘yicha qayta ishlashga ketgan o‘rtacha vaqt' },
  { title: 'Xatolik ulushi', value: '0%', trend: 0, description: '4xx va 5xx holatlarining umumiy chaqiriqlarga nisbati' }
])

const hasTraffic = computed(() => cards.value.some((card) => card.value !== '0' && card.value !== '—'))
</script>

<template>
  <section class="statistics">
    <div class="statistics__banner">
      <span class="statistics__badge">Yangilik</span>
      <div>
        Predstavlyaem yangi «Statistika» hisoboti. U avvalgi Search Console Insights hisobotini almashtiradi.
        <a href="#">Ko&#39;proq o&#39;qish</a>
      </div>
    </div>

    <div class="statistics__cards">
      <article v-for="card in cards" :key="card.title" class="statistics__card">
        <header>
          <h3>{{ card.title }}</h3>
          <span class="statistics__value">{{ card.value }}</span>
        </header>
        <footer>
          <span class="statistics__trend" :class="{ 'statistics__trend--negative': card.trend < 0, 'statistics__trend--positive': card.trend > 0 }">
            <span class="statistics__trend-indicator">{{ card.trend === 0 ? '—' : card.trend > 0 ? `+${card.trend}%` : `${card.trend}%` }}</span>
            o‘tgan davr bilan solishtirganda
          </span>
          <p>{{ card.description }}</p>
        </footer>
      </article>
    </div>

    <div v-if="!hasTraffic" class="statistics__empty">
      <div class="statistics__empty-icon">—</div>
      <h2>Tanlangan davrda trafik topilmadi</h2>
      <p>
        foydali ma&#39;lumotlar hozircha mavjud emas. Trafik paydo bo&#39;lishi bilan bu yerda asosiy metrikalar aks etadi.
        <a href="#">Optimallashtirish bo&#39;yicha qo&#39;llanma</a>
      </p>
    </div>

    <div class="statistics__table">
      <header>
        <h3>Eng ko&#39;p ishlatilgan API endpointlar</h3>
        <button type="button">Detallar</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Chaqiriqlar</th>
            <th>O&#39;rtacha kutish (ms)</th>
            <th>Xatoliklar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4" class="statistics__table-empty">
              Hali ma&#39;lumot yo&#39;q. Integratsiyadan so&#39;ng statistikalar bu yerda paydo bo&#39;ladi.
            </td>
          </tr>
        </tbody>
      </table>
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.statistics__card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.15);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.statistics__card h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #3c4043;
}

.statistics__value {
  font-size: 28px;
  font-weight: 600;
  color: #202124;
}

.statistics__trend {
  font-size: 12px;
  color: #5f6368;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.statistics__trend-indicator {
  font-weight: 600;
  color: #188038;
}

.statistics__trend--negative .statistics__trend-indicator {
  color: #d93025;
}

.statistics__card footer p {
  margin: 12px 0 0;
  font-size: 13px;
  color: #5f6368;
  line-height: 1.4;
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

.statistics__table {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.1);
}

.statistics__table header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e3e7;
}

.statistics__table header h3 {
  margin: 0;
  font-size: 16px;
  color: #202124;
}

.statistics__table header button {
  border: none;
  background: none;
  color: #1a73e8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.statistics__table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.statistics__table th {
  text-align: left;
  padding: 12px 24px;
  background: #f8f9fa;
  color: #5f6368;
  font-weight: 500;
  border-bottom: 1px solid #e0e3e7;
}

.statistics__table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f3f4;
}

.statistics__table-empty {
  text-align: center;
  color: #5f6368;
  font-style: italic;
}

@media (max-width: 1024px) {
  .statistics__cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 720px) {
  .statistics__banner {
    flex-direction: column;
  }

  .statistics__table header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .statistics__table table,
  .statistics__table thead,
  .statistics__table tbody,
  .statistics__table th,
  .statistics__table td,
  .statistics__table tr {
    display: block;
  }

  .statistics__table tr {
    padding: 12px 0;
  }

  .statistics__table th {
    padding: 8px 16px;
  }

  .statistics__table td {
    padding: 8px 16px;
  }

  .statistics__table th {
    display: none;
  }

  .statistics__table td::before {
    content: attr(data-label);
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #5f6368;
  }

  .statistics__table tbody tr {
    border-bottom: 1px solid #f1f3f4;
  }
}
</style>
