<!-- COMPOSANT: calendrier.vue
Calendrier interactif (mensuel/semaine/jour) avec events, créneaux disponibles -->
<template>
  <div class="calendrier-container">
    <!-- Contrôles de vue -->
    <div class="controls">
      <div class="view-toggles">
        <button
          v-for="mode in ['month', 'week', 'day']"
          :key="mode"
          :class="['toggle-btn', { active: viewMode === mode }]"
          @click="viewMode = mode"
        >
          {{ mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour' }}
        </button>
      </div>
      <div class="navigation">
        <button class="nav-btn" @click="previousPeriod">←</button>
        <span class="current-period">{{ currentPeriodLabel }}</span>
        <button class="nav-btn" @click="nextPeriod">→</button>
      </div>
    </div>

    <!-- Vue Calendrier Mensuelle -->
    <div v-if="viewMode === 'month'" class="calendar-month">
      <div class="weekdays">
        <div v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>
      <div class="days">
        <div
          v-for="day in calendarDays"
          :key="`${day.year}-${day.month}-${day.date}`"
          :class="['day', { 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'selected': day.isSelected }]"
          @click="selectDate(day)"
        >
          <div class="day-number">{{ day.date }}</div>
          <div class="day-events">
            <div
              v-for="event in getEventsForDate(day)"
              :key="event.id"
              :class="['event', `color-${event.color}`]"
              :title="event.title"
              @click.stop="selectEvent(event)"
            >
              {{ event.title.substring(0, 8) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Semaine -->
    <div v-if="viewMode === 'week'" class="calendar-week">
      <div class="week-header">
        <div v-for="day in weekDays" :key="day.toISOString()" class="week-day-header">
          <div class="day-label">{{ formatDateShort(day) }}</div>
        </div>
      </div>
      <div class="week-grid">
        <div
          v-for="(day, idx) in weekDays"
          :key="`week-${idx}`"
          :class="['week-day-column', { 'today': isToday(day) }]"
        >
          <div
            v-for="event in getEventsForDate({ year: day.getFullYear(), month: day.getMonth(), date: day.getDate() })"
            :key="event.id"
            :class="['event-card', `color-${event.color}`]"
            @click="selectEvent(event)"
          >
            <div class="event-time">{{ event.time || '' }}</div>
            <div class="event-title">{{ event.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Jour -->
    <div v-if="viewMode === 'day'" class="calendar-day">
      <div class="day-full-date">{{ formatDateFull(currentDate) }}</div>
      <div class="day-events-list">
        <div v-if="selectedDayEvents.length === 0" class="no-events">
          Aucun événement pour ce jour
        </div>
        <div
          v-for="event in selectedDayEvents"
          :key="event.id"
          :class="['event-detail', `color-${event.color}`]"
          @click="selectEvent(event)"
        >
          <div class="event-header">
            <h4>{{ event.title }}</h4>
            <span v-if="event.time" class="event-time">{{ event.time }}</span>
          </div>
          <p v-if="event.description" class="event-desc">{{ event.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  events: { type: Array, default: () => [] },
  selectedDate: { type: [Date, String], default: null },
  viewMode: { type: String, default: 'month', validator: (v) => ['month', 'week', 'day'].includes(v) }
})

const emit = defineEmits(['selectDate', 'selectEvent', 'update:viewMode'])

const currentDate = ref(new Date(props.selectedDate || new Date()))
let viewModeLocal = ref(props.viewMode)

const viewMode = computed({
  get: () => viewModeLocal.value,
  set: (val) => {
    viewModeLocal.value = val
    emit('update:viewMode', val)
  }
})

// Générer les jours du calendrier mensuel
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  const days = []

  // Jours du mois précédent
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  // Jours du mois actuel
  const today = new Date()
  for (let date = 1; date <= daysInMonth; date++) {
    const isToday =
      date === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday,
      isSelected:
        currentDate.value.getDate() === date &&
        currentDate.value.getMonth() === month &&
        currentDate.value.getFullYear() === year
    })
  }

  // Jours du mois suivant
  const remainingDays = 42 - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  
  for (let date = 1; date <= remainingDays; date++) {
    days.push({
      date,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  return days
})

// Jours de la semaine actuelle
const weekDays = computed(() => {
  const start = new Date(currentDate.value)
  const day = start.getDay() === 0 ? 6 : start.getDay() - 1
  start.setDate(start.getDate() - day)

  const days = []
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start))
    start.setDate(start.getDate() + 1)
  }
  return days
})

// Événements du jour sélectionné
const selectedDayEvents = computed(() => {
  const date = currentDate.value
  return getEventsForDate({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate()
  })
})

// Label de la période actuelle
const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'month') {
    return currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  } else if (viewMode.value === 'week') {
    const start = weekDays.value[0]
    const end = weekDays.value[6]
    return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`
  } else {
    return currentDate.value.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
})

// Fonctions
function getEventsForDate(day) {
  return props.events.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === day.year &&
      eventDate.getMonth() === day.month &&
      eventDate.getDate() === day.date
    )
  })
}

function selectDate(day) {
  currentDate.value = new Date(day.year, day.month, day.date)
  emit('selectDate', {
    date: currentDate.value,
    events: getEventsForDate(day)
  })
}

function selectEvent(event) {
  emit('selectEvent', event)
}

function previousPeriod() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
  } else if (viewMode.value === 'week') {
    currentDate.value.setDate(currentDate.value.getDate() - 7)
    currentDate.value = new Date(currentDate.value)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() - 1)
    currentDate.value = new Date(currentDate.value)
  }
}

function nextPeriod() {
  if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  } else if (viewMode.value === 'week') {
    currentDate.value.setDate(currentDate.value.getDate() + 7)
    currentDate.value = new Date(currentDate.value)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() + 1)
    currentDate.value = new Date(currentDate.value)
  }
}

function formatDateShort(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

function formatDateFull(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function isToday(date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
</script>

<style scoped>
.calendrier-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Contrôles */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.view-toggles {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #8b1e2c;
}

.toggle-btn.active {
  background: #8b1e2c;
  color: white;
  border-color: #8b1e2c;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f5f5f5;
  border-color: #8b1e2c;
}

.current-period {
  font-weight: 600;
  min-width: 150px;
  text-align: center;
}

/* Calendrier Mensuel */
.calendar-month {
  display: grid;
  gap: 12px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #8b1e2c;
  padding: 8px 0;
  font-size: 0.85rem;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  background: white;
  min-height: 80px;
}

.day:hover {
  border-color: #8b1e2c;
  background: #f9f9f9;
}

.day.other-month {
  background: #fafafa;
  color: #999;
}

.day.today {
  background: #fef3f4;
  border-color: #8b1e2c;
  font-weight: bold;
}

.day.selected {
  background: #ffe0e5;
  border-color: #8b1e2c;
}

.day-number {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
}

.event {
  font-size: 0.65rem;
  padding: 2px 4px;
  border-radius: 2px;
  color: white;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.2s;
}

.event:hover {
  opacity: 0.8;
}

.event.color-bordeaux {
  background: #8b1e2c;
}

.event.color-vert {
  background: #4CAF50;
}

.event.color-bleu {
  background: #2196F3;
}

.event.color-orange {
  background: #FF9800;
}

.event.color-gris {
  background: #666666;
}

/* Calendrier Semaine */
.calendar-week {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.week-day-header {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.week-day-column {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.week-day-column.today {
  background: #fef3f4;
  border-color: #8b1e2c;
}

.event-card {
  padding: 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.event-time {
  font-weight: 600;
  font-size: 0.7rem;
}

.event-title {
  font-weight: 500;
}

/* Calendrier Jour */
.calendar-day {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.day-full-date {
  font-size: 1.2rem;
  font-weight: 600;
  color: #8b1e2c;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.day-events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-events {
  padding: 24px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.event-detail {
  padding: 12px;
  border-left: 4px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.event-detail:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.event-detail.color-bordeaux {
  border-color: #8b1e2c;
  background: #fef3f4;
}

.event-detail.color-vert {
  border-color: #4CAF50;
  background: #f1f8f4;
}

.event-detail.color-bleu {
  border-color: #2196F3;
  background: #f1f7fd;
}

.event-detail.color-orange {
  border-color: #FF9800;
  background: #fff8f1;
}

.event-detail.color-gris {
  border-color: #666666;
  background: #f5f5f5;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.event-time {
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b1e2c;
}

.event-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .calendrier-container {
    padding: 12px;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .view-toggles,
  .navigation {
    justify-content: space-between;
  }

  .weekdays,
  .days {
    gap: 2px;
  }

  .day {
    min-height: 60px;
    padding: 4px;
  }

  .day-number {
    font-size: 0.8rem;
  }

  .event {
    font-size: 0.6rem;
  }

  .week-day-column {
    min-height: 200px;
  }

  .current-period {
    min-width: auto;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .day {
    aspect-ratio: auto;
    min-height: 50px;
  }

  .weekday {
    font-size: 0.7rem;
  }

  .event-detail {
    padding: 8px;
  }
}
</style>
