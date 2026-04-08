<template>
  <div class="page">
    <h1>📅 Planning Global</h1>

    <button class="btn-add" @click="showTechPanel = !showTechPanel">👥 {{ showTechPanel ? 'Masquer' : 'Voir' }} techs</button>

    <CalendriereFullCalendar
      mode="responsable"
      :events="interventions"
      @event-create="addEvent"
      @event-update="updateEvent"
      @event-delete="deleteEvent"
    />

    <div v-if="showTechPanel" class="techs-panel">
      <h3>Techniciens disponibles</h3>
      <div class="techs-list">
        <div v-for="tech in techs" :key="tech.id" class="tech-card">
          <strong>{{ tech.name }}</strong>
          <p>{{ tech.phone }}</p>
          <small>Missions: {{ tech.missions }}</small>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="number">{{ interventions.length }}</span>
        <span class="label">Interventions</span>
      </div>
      <div class="stat">
        <span class="number">{{ unassignedCount }}</span>
        <span class="label">À assigner</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CalendriereFullCalendar from '@/components/calendrier-fullcalendar.vue'

const showTechPanel = ref(false)
const interventions = ref([
  {
    id: 'int-1',
    title: 'Nettoyage - Client A',
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    backgroundColor: '#8b1e2c',
    techId: 1
  },
  {
    id: 'int-2',
    title: 'Peinture - Client B',
    start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    backgroundColor: '#ffc107'
  }
])

const techs = ref([
  { id: 1, name: 'Jean Dupont', phone: '06 12 34 56 78', missions: 2 },
  { id: 2, name: 'Marie Martin', phone: '06 98 76 54 32', missions: 1 },
  { id: 3, name: 'Pierre Bernard', phone: '06 11 22 33 44', missions: 0 }
])

const unassignedCount = computed(() => interventions.value.filter(e => !e.techId).length)

function addEvent(event) {
  interventions.value.push({
    id: `int-${Date.now()}`,
    ...event
  })
}

function updateEvent(id) {
  console.log('Intervention mise à jour:', id)
}

function deleteEvent(id) {
  interventions.value = interventions.value.filter(e => e.id !== id)
}
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.btn-add {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #8b1e2c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-add:hover {
  background-color: #6b1620;
}

.techs-panel {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.techs-panel h3 {
  color: #333;
  margin-bottom: 16px;
}

.techs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tech-card {
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.tech-card strong {
  display: block;
  color: #333;
  margin-bottom: 4px;
}

.tech-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.tech-card small {
  display: block;
  color: #999;
  margin-top: 8px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.stat {
  padding: 20px;
  background: linear-gradient(135deg, #8b1e2c, #a82d3b);
  color: white;
  border-radius: 8px;
  text-align: center;
  flex: 1;
}

.number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.label {
  display: block;
  font-size: 0.95rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .techs-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats {
    flex-direction: column;
  }
}
</style>
