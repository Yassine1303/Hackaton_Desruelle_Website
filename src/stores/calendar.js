import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
  const creneaux = ref([])
  const interventions = ref([])
  const loading = ref(false)

  const filteredByRole = {
    tech: (techId) => creneaux.value.filter(c => c.tech_id === techId),
    client: () => creneaux.value.filter(c => c.est_disponible === true),
    responsable: () => interventions.value
  }

  function addCreneau(creneau) {
    creneaux.value.push({
      id: Date.now(),
      ...creneau
    })
  }

  function addIntervention(intervention) {
    interventions.value.push({
      id: Date.now(),
      ...intervention
    })
  }

  function updateCreneau(id, data) {
    const index = creneaux.value.findIndex(c => c.id === id)
    if (index !== -1) creneaux.value[index] = { ...creneaux.value[index], ...data }
  }

  function deleteCreneau(id) {
    creneaux.value = creneaux.value.filter(c => c.id !== id)
  }

  return {
    creneaux,
    interventions,
    loading,
    filteredByRole,
    addCreneau,
    addIntervention,
    updateCreneau,
    deleteCreneau
  }
})
