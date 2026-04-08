<template>
  <div class="page">
    <h1>📅 Mon Calendrier</h1>

    <button class="btn-add" @click="showForm = true">+ Ajouter disponibilité</button>

    <div v-if="showForm" class="quick-add">
      <input v-model="newSlot.date" type="datetime-local" class="input" />
      <button class="btn-save" @click="addSlot">Ajouter</button>
      <button class="btn-cancel" @click="showForm = false">Annuler</button>
    </div>

    <CalendriereFullCalendar mode="tech" :events="techEvents" />

    <div v-if="slots.length" class="slots-list">
      <h3>Mes créneaux</h3>
      <table>
        <tr v-for="slot in slots" :key="slot.id">
          <td>{{ formatDate(slot.date_debut) }}</td>
          <td>{{ formatDate(slot.date_fin) }}</td>
          <td>{{ slot.est_disponible ? '✓ Libre' : '✗ Pris' }}</td>
          <td><button class="btn-delete" @click="deleteSlot(slot.id)">Supprimer</button></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CalendriereFullCalendar from '@/components/calendrier-fullcalendar.vue'

const slots = ref([
  {
    id: 1,
    date_debut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    date_fin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    est_disponible: true
  }
])

const showForm = ref(false)
const newSlot = ref({ date: '' })
const techEvents = ref([
  {
    id: 'slot-1',
    title: 'Disponibilité',
    start: slots.value[0].date_debut,
    end: slots.value[0].date_fin,
    backgroundColor: '#4CAF50'
  }
])

function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function addSlot() {
  if (!newSlot.value.date) return
  const start = new Date(newSlot.value.date)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const slot = {
    id: Date.now(),
    date_debut: start.toISOString(),
    date_fin: end.toISOString(),
    est_disponible: true
  }
  slots.value.push(slot)
  techEvents.value.push({
    id: `slot-${slot.id}`,
    title: 'Disponibilité',
    start: slot.date_debut,
    end: slot.date_fin,
    backgroundColor: '#4CAF50'
  })
  showForm.value = false
  newSlot.value = { date: '' }
}

function deleteSlot(id) {
  slots.value = slots.value.filter(s => s.id !== id)
  techEvents.value = techEvents.value.filter(e => e.id !== `slot-${id}`)
}
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 1000px;
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

.quick-add {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-save,
.btn-delete,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  font-size: 0.9rem;
}

.slots-list {
  margin-top: 40px;
}

.slots-list h3 {
  color: #333;
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
