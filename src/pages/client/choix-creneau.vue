<template>
  <div class="page">
    <h1>📅 Choisir un créneau</h1>

    <div class="info">Sélectionnez une date et un créneau de 2 heures</div>

    <CalendriereFullCalendar mode="client" :events="availableEvents" @event-select="selectDate" />

    <div v-if="selectedDate" class="slots-picker">
      <h3>Créneaux disponibles le {{ formatDate(selectedDate) }}</h3>
      <div class="slots-grid">
        <button
          v-for="slot in slots"
          :key="slot.time"
          class="slot-btn"
          :class="{ active: selectedSlot === slot.time, disabled: !slot.free }"
          :disabled="!slot.free"
          @click="selectedSlot = slot.time"
        >
          {{ slot.time }} - {{ slot.end }}
          <span class="status">{{ slot.free ? 'Libre' : 'Pris' }}</span>
        </button>
      </div>
    </div>

    <div v-if="selectedSlot" class="actions">
      <button class="btn-confirm" @click="confirmSlot">✓ Confirmer ce créneau</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CalendriereFullCalendar from '@/components/calendrier-fullcalendar.vue'

const selectedDate = ref(null)
const selectedSlot = ref(null)
const availableEvents = ref([
  {
    id: 'free-1',
    title: 'Créneau libre',
    start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    backgroundColor: '#4CAF50'
  },
  {
    id: 'busy-1',
    title: 'Occupé',
    start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    backgroundColor: '#999'
  }
])

const slots = ref([
  { time: '08:00', end: '10:00', free: true },
  { time: '10:00', end: '12:00', free: false },
  { time: '12:00', end: '14:00', free: true },
  { time: '14:00', end: '16:00', free: true },
  { time: '16:00', end: '18:00', free: false }
])

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function selectDate(event) {
  selectedDate.value = event.start
  selectedSlot.value = null
}

function confirmSlot() {
  console.log('Confirmé:', selectedDate.value, selectedSlot.value)
  // Rediriger ou émettre l'événement
}
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.info {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.slots-picker {
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.slots-picker h3 {
  color: #333;
  margin-bottom: 16px;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.slot-btn {
  padding: 16px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s;
}

.slot-btn:hover:not(.disabled) {
  border-color: #8b1e2c;
  background-color: #f5f5f5;
}

.slot-btn.active {
  background-color: #8b1e2c;
  color: white;
  border-color: #8b1e2c;
}

.slot-btn.disabled {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

.status {
  display: block;
  font-size: 0.8rem;
  margin-top: 4px;
  opacity: 0.8;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-confirm {
  padding: 10px 24px;
  background-color: #8b1e2c;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm:hover {
  background-color: #6b1620;
}

@media (max-width: 768px) {
  .slots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
