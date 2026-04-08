<template>
  <div class="fc-container">
    <FullCalendar :options="calendarOptions" />

    <!-- Modal édition (responsable uniquement) -->
    <div v-if="showModal && canEdit" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? 'Ajouter' : 'Modifier' }} intervention</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Titre</label>
            <input v-model="formData.title" type="text" class="input" />
          </div>
          <div class="form-group">
            <label>Date/Heure début</label>
            <input v-model="formData.startDate" type="datetime-local" class="input" />
          </div>
          <div class="form-group">
            <label>Fin (auto +2h)</label>
            <input type="datetime-local" :value="formData.endDate" class="input" disabled />
          </div>
          <div class="form-group">
            <label>Couleur</label>
            <div class="colors">
              <button
                v-for="color in ['#8b1e2c', '#4CAF50', '#2196F3', '#FF9800']"
                :key="color"
                class="color-btn"
                :style="{ backgroundColor: color }"
                :class="{ active: formData.color === color }"
                @click="formData.color = color"
              ></button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Annuler</button>
          <button v-if="modalMode === 'edit'" class="btn-danger" @click="deleteEvent">Supprimer</button>
          <button class="btn-success" @click="saveEvent">{{ modalMode === 'create' ? 'Créer' : 'Modifier' }}</button>
        </div>
      </div>
    </div>

    <p v-if="!canEdit" class="info-text">Mode lecture seule</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  events: { type: Array, default: () => [] },
  mode: { type: String, default: 'responsable' } // 'responsable' | 'tech' | 'client'
})

const emit = defineEmits(['event-create', 'event-update', 'event-delete', 'event-select'])

const showModal = ref(false)
const modalMode = ref('create')
const selectedEvent = ref(null)
const formData = ref({
  title: '',
  startDate: '',
  endDate: '',
  color: '#8b1e2c'
})
const eventsList = ref(props.events)

const canEdit = computed(() => props.mode === 'responsable')

// Calcul auto endDate (+2h)
watch(
  () => formData.value.startDate,
  (newStart) => {
    if (newStart) {
      const start = new Date(newStart)
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
      formData.value.endDate = end.toISOString().slice(0, 16)
    }
  }
)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  slotLabelInterval: '01:00',
  slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
  editable: canEdit.value,
  selectable: canEdit.value,
  eventClick: handleEventClick,
  select: handleSelectTime,
  events: eventsList.value,
  nowIndicator: true,
  locale: 'fr'
}))

function handleEventClick(info) {
  if (!canEdit.value) {
    emit('event-select', info.event)
    return
  }
  selectedEvent.value = info.event
  modalMode.value = 'edit'
  formData.value = {
    title: info.event.title,
    startDate: info.event.start.toISOString().slice(0, 16),
    endDate: info.event.end.toISOString().slice(0, 16),
    color: info.event.backgroundColor || '#8b1e2c'
  }
  showModal.value = true
}

function handleSelectTime(info) {
  if (!canEdit.value) return
  modalMode.value = 'create'
  formData.value = {
    title: '',
    startDate: info.start.toISOString().slice(0, 16),
    endDate: new Date(info.start.getTime() + 2 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    color: '#8b1e2c'
  }
  showModal.value = true
}

function saveEvent() {
  if (!formData.value.title) return
  const data = {
    title: formData.value.title,
    start: formData.value.startDate,
    end: formData.value.endDate,
    backgroundColor: formData.value.color,
    borderColor: formData.value.color
  }
  
  if (modalMode.value === 'create') {
    const newEvent = { id: `event-${Date.now()}`, ...data }
    eventsList.value.push(newEvent)
    emit('event-create', newEvent)
  } else {
    const idx = eventsList.value.findIndex(e => e.id === selectedEvent.value.id)
    if (idx !== -1) {
      eventsList.value[idx] = { id: selectedEvent.value.id, ...data }
    }
    emit('event-update', selectedEvent.value.id)
  }
  closeModal()
}

function deleteEvent() {
  eventsList.value = eventsList.value.filter(e => e.id !== selectedEvent.value.id)
  emit('event-delete', selectedEvent.value.id)
  closeModal()
}

function closeModal() {
  showModal.value = false
  selectedEvent.value = null
}
</script>

<style scoped>
.fc-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.fc-container :deep(.fc) {
  font-family: inherit;
}

.fc-container :deep(.fc-button-primary) {
  background-color: #8b1e2c !important;
  border-color: #8b1e2c !important;
}

.fc-container :deep(.fc-button-primary:hover) {
  background-color: #6b1620 !important;
}

.fc-container :deep(.fc-daygrid-day:hover) {
  background-color: #f5f5f5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.input:focus {
  outline: none;
  border-color: #8b1e2c;
}

.input:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.colors {
  display: flex;
  gap: 10px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
}

.color-btn.active {
  border-color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.btn-success,
.btn-cancel,
.btn-danger {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-success {
  background-color: #8b1e2c;
  color: white;
}

.btn-success:hover {
  background-color: #6b1620;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.info-text {
  margin-top: 20px;
  padding: 12px;
  background-color: #e3f2fd;
  color: #1565c0;
  border-radius: 4px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .fc-container {
    padding: 12px;
  }

  .modal {
    width: 95%;
  }
}
</style>
