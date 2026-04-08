<!-- PAGE: Planning Calendrier - Gestion des créneaux et assignations -->
<template>
  <div class="planning-container">
    <div class="planning-header">
      <h1>Planning des Interventions</h1>
      <div class="header-controls">
        <button class="btn-prev" @click="previousWeek">← Semaine précédente</button>
        <span class="current-week">{{ weekLabel }}</span>
        <button class="btn-next" @click="nextWeek">Semaine suivante →</button>
      </div>
    </div>

    <!-- Calendrier Hebdomadaire -->
    <div class="calendar-week-view">
      <!-- En-têtes des jours -->
      <div class="week-grid">
        <div class="time-column"></div>
        <div v-for="day in weekDays" :key="day.toISOString()" class="day-header">
          <div class="day-name">{{ formatDayName(day) }}</div>
          <div class="day-date">{{ formatDate(day) }}</div>
        </div>
      </div>

      <!-- Grille horaire -->
      <div class="time-grid">
        <div class="time-column">
          <div v-for="hour in hours" :key="hour" class="time-slot">
            {{ hour }}:00
          </div>
        </div>

        <!-- Créneaux par jour -->
        <div v-for="(day, dayIdx) in weekDays" :key="`day-${dayIdx}`" class="day-column">
          <div
            v-for="hour in hours"
            :key="`${dayIdx}-${hour}`"
            :class="['time-slot', getSlotClass(day, hour)]"
            @click="selectSlot(day, hour)"
          >
            <div class="slot-content">
              <div v-if="getSlotEvent(day, hour)" class="slot-event">
                <div class="event-title">{{ getSlotEvent(day, hour).title }}</div>
                <div class="event-tech">{{ getSlotEvent(day, hour).tech }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Légende -->
    <div class="legend">
      <div class="legend-item available">
        <span class="legend-box"></span>
        Créneau disponible
      </div>
      <div class="legend-item occupied">
        <span class="legend-box"></span>
        Créneau occupé
      </div>
      <div class="legend-item selected">
        <span class="legend-box"></span>
        Sélectionné
      </div>
    </div>

    <!-- Informations du créneau sélectionné -->
    <div v-if="selectedSlot" class="slot-info">
      <div class="info-panel">
        <h3>Créneau sélectionné</h3>
        <div class="info-content">
          <p><strong>Date:</strong> {{ formatDateTime(selectedSlot.dateTime) }}</p>
          <p><strong>Durée:</strong> 1 heure</p>
          <p><strong>Statut:</strong> {{ selectedSlot.available ? 'Disponible' : 'Occupé' }}</p>
        </div>

        <!-- Formulaire d'assignation -->
        <div v-if="selectedSlot.available" class="assign-form">
          <h4>Assigner un technicien</h4>
          <div class="form-group">
            <label>Technicien</label>
            <select v-model="assignForm.techId" class="input">
              <option value="">-- Sélectionner un technicien --</option>
              <option v-for="tech in availableTechs" :key="tech.id" :value="tech.id">
                {{ tech.nom }} {{ tech.prenom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Service</label>
            <select v-model="assignForm.serviceId" class="input">
              <option value="">-- Sélectionner un service --</option>
              <option v-for="service in services" :key="service.id" :value="service.id">
                {{ service.nom_service }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Client</label>
            <input v-model="assignForm.clientName" type="text" class="input" placeholder="Nom du client" />
          </div>
          <button class="btn-assign" @click="assignTech">Assigner</button>
        </div>

        <button class="btn-close" @click="selectedSlot = null">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// État
const currentWeek = ref(new Date())
const selectedSlot = ref(null)
const assignForm = ref({
  techId: '',
  serviceId: '',
  clientName: ''
})

// Données mock (à remplacer par API)
const mockEvents = [
  {
    date: new Date(2026, 3, 9), // Vendredi
    hour: 9,
    title: 'Nettoyage urgent',
    tech: 'Jean Dupont',
    id: 1
  },
  {
    date: new Date(2026, 3, 9),
    hour: 14,
    title: 'Maintenance',
    tech: 'Marie Martin',
    id: 2
  }
]

const availableTechs = [
  { id: 1, nom: 'Dupont', prenom: 'Jean' },
  { id: 2, nom: 'Martin', prenom: 'Marie' },
  { id: 3, nom: 'Bernard', prenom: 'Pierre' }
]

const services = [
  { id: 1, nom_service: 'Nettoyage' },
  { id: 2, nom_service: 'Maintenance' },
  { id: 3, nom_service: 'Réparation' }
]

// Heures de travail (8h-17h, sans 12-13h)
const hours = computed(() => {
  const result = []
  for (let i = 8; i < 17; i++) {
    if (i !== 12) result.push(i)
  }
  return result
})

// Jours de la semaine (lun-ven)
const weekDays = computed(() => {
  const start = new Date(currentWeek.value)
  const day = start.getDay() === 0 ? 6 : start.getDay() - 1
  start.setDate(start.getDate() - day)

  const days = []
  for (let i = 0; i < 5; i++) {
    days.push(new Date(start))
    start.setDate(start.getDate() + 1)
  }
  return days
})

// Label de la semaine
const weekLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[4]
  return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`
})

// Fonctions
function formatDayName(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long' })
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
}

function formatDateTime(dateTime) {
  return dateTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function previousWeek() {
  const newDate = new Date(currentWeek.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeek.value = newDate
}

function nextWeek() {
  const newDate = new Date(currentWeek.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeek.value = newDate
}

function getSlotEvent(day, hour) {
  return mockEvents.find((event) => {
    return (
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear() &&
      event.hour === hour
    )
  })
}

function getSlotClass(day, hour) {
  const hasEvent = getSlotEvent(day, hour)
  const isSelected =
    selectedSlot.value &&
    selectedSlot.value.day.getDate() === day.getDate() &&
    selectedSlot.value.day.getMonth() === day.getMonth() &&
    selectedSlot.value.day.getFullYear() === day.getFullYear() &&
    selectedSlot.value.hour === hour

  if (isSelected) return 'selected'
  if (hasEvent) return 'occupied'
  return 'available'
}

function selectSlot(day, hour) {
  const dateTime = new Date(day)
  dateTime.setHours(hour, 0, 0, 0)

  selectedSlot.value = {
    day,
    hour,
    dateTime,
    available: !getSlotEvent(day, hour)
  }

  assignForm.value = {
    techId: '',
    serviceId: '',
    clientName: ''
  }
}

function assignTech() {
  if (!assignForm.value.techId || !assignForm.value.serviceId) {
    alert('Veuillez remplir tous les champs')
    return
  }

  // Ajouter l'événement à la liste
  const techName = availableTechs.find((t) => t.id === parseInt(assignForm.value.techId))
  const service = services.find((s) => s.id === parseInt(assignForm.value.serviceId))

  mockEvents.push({
    date: selectedSlot.value.day,
    hour: selectedSlot.value.hour,
    title: service.nom_service,
    tech: `${techName.prenom} ${techName.nom}`,
    id: Math.random()
  })

  alert('Technicien assigné avec succès!')
  selectedSlot.value = null
}
</script>

<style scoped>
.planning-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.planning-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.planning-header h1 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.8rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.btn-prev,
.btn-next {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-prev:hover,
.btn-next:hover {
  background: #f5f5f5;
  border-color: #8b1e2c;
}

.current-week {
  font-weight: 600;
  color: #8b1e2c;
  min-width: 200px;
  text-align: center;
}

/* Calendrier */
.calendar-week-view {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.week-grid {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-bottom: 2px solid #8b1e2c;
}

.time-column {
  background: #f9f9f9;
  padding: 12px;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.day-header {
  background: #8b1e2c;
  color: white;
  padding: 16px 8px;
  text-align: center;
  font-weight: 600;
}

.day-name {
  font-size: 1rem;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.day-date {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Grille horaire */
.time-grid {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  gap: 1px;
  background: #e0e0e0;
}

.day-column {
  background: white;
}

.time-slot {
  padding: 16px 8px;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.time-slot:nth-child(n + 1):last-child {
  border-right: none;
}

/* États des créneaux */
.time-slot.available {
  background: #f0f8f5;
  border: 1px solid #4CAF50;
}

.time-slot.available:hover {
  background: #e8f5e9;
  border-color: #2e7d32;
}

.time-slot.occupied {
  background: #ffebee;
  border: 1px solid #f44336;
}

.time-slot.selected {
  background: #ffe0b2;
  border: 2px solid #FF9800;
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.3);
}

.slot-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-event {
  width: 100%;
  padding: 4px;
}

.event-title {
  font-weight: 600;
  color: #8b1e2c;
  font-size: 0.75rem;
  margin-bottom: 2px;
}

.event-tech {
  font-size: 0.7rem;
  color: #666;
}

/* Légende */
.legend {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.legend-box {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.legend-item.available .legend-box {
  background: #f0f8f5;
  border-color: #4CAF50;
}

.legend-item.occupied .legend-box {
  background: #ffebee;
  border-color: #f44336;
}

.legend-item.selected .legend-box {
  background: #ffe0b2;
  border-color: #FF9800;
}

/* Panneau d'information */
.slot-info {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.info-panel {
  padding: 24px;
}

.info-panel h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.2rem;
}

.info-panel h4 {
  margin: 20px 0 12px 0;
  color: #8b1e2c;
  font-size: 1rem;
}

.info-content {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.info-content p {
  margin: 8px 0;
  color: #666;
  font-size: 0.95rem;
}

/* Formulaire */
.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  font-size: 0.9rem;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.input:focus {
  outline: none;
  border-color: #8b1e2c;
}

.assign-form {
  background: #fef3f4;
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
}

.btn-assign {
  width: 100%;
  padding: 10px;
  background: #8b1e2c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.btn-assign:hover {
  background: #6b1620;
}

.btn-close {
  width: 100%;
  padding: 10px;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #d0d0d0;
}

/* Responsive */
@media (max-width: 1200px) {
  .slot-info {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .planning-container {
    padding: 12px;
  }

  .week-grid,
  .time-grid {
    grid-template-columns: 60px repeat(5, 1fr);
  }

  .slot-info {
    width: 100%;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  }

  .header-controls {
    flex-direction: column;
    gap: 8px;
  }

  .legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
