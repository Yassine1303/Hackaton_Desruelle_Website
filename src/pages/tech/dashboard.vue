<!-- PAGE: tech/dashboard.vue
Dashboard technicien avec calendrier -->
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>📅 Mon Planning</h1>
      <p>Visualisez vos interventions assignées</p>
    </header>

    <div class="dashboard-content">
      <CalendriereFullCalendar mode="tech" :events="myEvents" />
    </div>

    <section class="interventions-list">
      <h2>Prochaines interventions</h2>
      <div v-if="todayInterventions.length" class="interventions-grid">
        <div v-for="intervention in todayInterventions" :key="intervention.id" class="intervention-card">
          <div class="time">{{ formatTime(intervention.start) }}</div>
          <div class="details">
            <strong>{{ intervention.title }}</strong>
            <p>{{ intervention.client }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty">Aucune intervention programmée aujourd'hui</div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CalendriereFullCalendar from '@/components/calendrier-fullcalendar.vue'

const myEvents = ref([
  { id: 1, title: 'Nettoyage - Client A', start: new Date().toISOString(), end: new Date(Date.now() + 2*60*60*1000).toISOString(), backgroundColor: '#4CAF50', client: 'Jean Dupont' },
  { id: 2, title: 'Peinture - Client B', start: new Date(Date.now() + 24*60*60*1000).toISOString(), end: new Date(Date.now() + 24*60*60*1000 + 2*60*60*1000).toISOString(), backgroundColor: '#2196F3', client: 'Marie Martin' }
])

const todayInterventions = computed(() =>
  myEvents.value.filter(e => {
    const eventDate = new Date(e.start).toDateString()
    const today = new Date().toDateString()
    return eventDate === today
  })
)

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 8px;
}

.dashboard-header p {
  color: #999;
  font-size: 0.95rem;
}

.dashboard-content {
  margin-bottom: 40px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.interventions-list {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.interventions-list h2 {
  color: #333;
  margin-bottom: 16px;
}

.interventions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.intervention-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border-left: 4px solid #8b1e2c;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.time {
  font-weight: 700;
  color: #8b1e2c;
  min-width: 50px;
}

.details strong {
  display: block;
  color: #333;
  margin-bottom: 4px;
}

.details p {
  margin: 0;
  font-size: 0.85rem;
  color: #999;
}

.empty {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>

<style scoped>
/* Styles tech dashboard */
</style>
