<!-- PAGE: tech/dashboard.vue
Dashboard technicien - Vue du jour et semaine
SPEC: "Bienvenue {firstname}!" + interventions du jour en tableau + semaine en 2 colonnes -->
<template>
  <div class="dashboard">
    <!-- HEADER: Bienvenue + date du jour -->
    <header class="dashboard-header">
      <div class="welcome-section">
        <h1>Bienvenue, {{ userFirstName }}! 👋</h1>
        <p class="today-date">{{ formatDate(new Date()) }}</p>
      </div>
    </header>

  <!-- SECTION 1: INTERVENTIONS DU JOUR (Tableau) -->
    <section class="section-today">
      <h2>📋 Interventions du jour</h2>
      
      <div v-if="error" class="error-banner">
        ⚠️ {{ error }} - Assurez-vous que le backend est en cours d'exécution sur http://localhost:3001
      </div>
      
      <div v-if="loading" class="loading">Chargement des interventions...</div>
      
      <div v-else-if="interventionsAujourdhui.length" class="table-wrapper">
        <table class="interventions-table">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Service</th>
              <th>Client</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="intervention in interventionsAujourdhui" :key="intervention.id">
              <!-- Heure -->
              <td class="heure">
                <strong>{{ formatHeure(intervention.date_heure_rdv) }}</strong>
              </td>
              
              <!-- Service -->
              <td class="service">{{ intervention.service }}</td>
              
              <!-- Client -->
              <td class="client">{{ intervention.client_nom }}</td>
              
              <!-- Adresse -->
              <td class="adresse">{{ intervention.adresse }}</td>
              
              <!-- Statut -->
              <td class="statut">
                <span :class="['badge', `status-${intervention.statut_travail}`]">
                  {{ getStatusLabel(intervention.statut_travail) }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="actions">
                <button 
                  v-if="intervention.statut_travail === 'programmé'"
                  @click="demarrerIntervention(intervention.id)"
                  class="btn btn-primary btn-sm"
                >
                  Démarrer
                </button>
                <button 
                  v-else-if="intervention.statut_travail === 'en_cours'"
                  @click="terminerIntervention(intervention.id)"
                  class="btn btn-danger btn-sm"
                >
                  Terminer
                </button>
                <button 
                  @click="voirDetails(intervention.id)"
                  class="btn btn-secondary btn-sm"
                >
                  Détails
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <p>Aucune intervention programmée aujourd'hui</p>
      </div>
    </section>

    <!-- SECTION 2: DEMAIN + RESTE SEMAINE (2 colonnes) -->
    <section class="section-week">
      <h2>📅 Demain + reste de la semaine</h2>
      
      <div v-if="interventionsSemaine.length" class="week-grid">
        <div v-for="intervention in interventionsSemaine" :key="intervention.id" class="week-card">
          <div class="card-date">
            {{ formatDateLong(intervention.date_heure_rdv) }}
          </div>
          <div class="card-service">
            <strong>{{ intervention.service }}</strong>
          </div>
          <div class="card-client">
            {{ intervention.client_nom }}
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Aucune intervention prévue la semaine prochaine</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// User & interventions data
const userFirstName = ref('Technicien')
const loading = ref(true)
const error = ref(null)
const interventions = ref([])

// ID du tech (en production, viendrait du store auth)
const techId = ref(1) // À remplacer par le vrai ID depuis l'authentification

// Fetch data from API
async function fetchInterventions() {
  try {
    loading.value = true
    error.value = null
    
    // Fetch toutes les prestations (pour test)
    const response = await fetch(`http://localhost:3001/api/prestations`)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      interventions.value = result.data
      console.log('✅ Interventions loaded:', interventions.value.length)
    } else {
      throw new Error(result.error || 'Erreur inconnue')
    }
  } catch (err) {
    console.error('❌ Erreur fetch interventions:', err)
    error.value = err.message
    // Fallback pour démo
    interventions.value = []
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchInterventions()
  // Update user name (en production, depuis le store auth)
  userFirstName.value = 'Marc'
})

// Computed: Interventions d'aujourd'hui
const interventionsAujourdhui = computed(() => {
  const today = new Date().toDateString()
  return interventions.value.filter(i => {
    const interventionDate = new Date(i.date_heure_rdv).toDateString()
    return interventionDate === today
  }).sort((a, b) => new Date(a.date_heure_rdv) - new Date(b.date_heure_rdv))
})

// Computed: Interventions semaine (demain + reste)
const interventionsSemaine = computed(() => {
  const today = new Date().toDateString()
  return interventions.value.filter(i => {
    const interventionDate = new Date(i.date_heure_rdv).toDateString()
    return interventionDate !== today
  }).sort((a, b) => new Date(a.date_heure_rdv) - new Date(b.date_heure_rdv))
})

// Formatage date longue (ex: "Demain à 14:30" ou "Vendredi 12 avril à 10:00")
function formatDateLong(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const demain = new Date(today)
  demain.setDate(demain.getDate() + 1)
  
  const dateFormatted = date.toDateString()
  const tomorrowFormatted = demain.toDateString()
  
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  
  if (dateFormatted === tomorrowFormatted) {
    return `Demain à ${time}`
  }
  
  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return `${dayName} à ${time}`
}

// Formatage heure simple (08:30)
function formatHeure(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Formatage date (15 avril 2026)
function formatDate(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

// Mapping status labels
function getStatusLabel(status) {
  const labels = {
    'programmé': 'Programmée',
    'en_cours': 'En cours',
    'terminé': 'Terminée',
    'incident': 'Incident',
    'annulé': 'Annulée'
  }
  return labels[status] || status
}

// Actions
function demarrerIntervention(id) {
  // TODO: Appel API PUT /prestations/:id/status
  const intervention = interventions.value.find(i => i.id === id)
  if (intervention) {
    intervention.statut_travail = 'en_cours'
    console.log(`✅ Intervention ${id} démarrée`)
  }
}

function terminerIntervention(id) {
  // TODO: Ouvrir modal-retour-tech
  console.log(`Modal "Terminer intervention" pour ${id}`)
  // router.push(`/tech/completer/${id}`)
}

function voirDetails(id) {
  router.push(`/tech/fiche/${id}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;
}

/* === HEADER === */
.dashboard-header {
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.today-date {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  text-transform: capitalize;
}

/* === SECTION TODAY === */
.section-today {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.section-today h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.error-banner {
  background: #ffebee;
  border: 1px solid #f44336;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.loading {
  padding: 24px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border-radius: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

.interventions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.interventions-table thead {
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
}

.interventions-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.interventions-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.interventions-table tbody tr:hover {
  background-color: #fafafa;
}

.interventions-table td {
  padding: 12px;
  color: #333;
}

.interventions-table .heure {
  font-weight: 600;
  color: #8b1e2c;
  font-size: 1rem;
}

.interventions-table .service {
  font-weight: 500;
}

.interventions-table .client {
  color: #555;
}

.interventions-table .adresse {
  color: #888;
  font-size: 0.9rem;
}

.interventions-table .statut {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge.status-programmé {
  background: #e0e0e0;
  color: #666;
}

.badge.status-en_cours {
  background: #e3f2fd;
  color: #2196F3;
}

.badge.status-terminé {
  background: #e8f5e9;
  color: #4CAF50;
}

.badge.status-incident {
  background: #ffebee;
  color: #f44336;
}

.interventions-table .actions {
  text-align: right;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border-radius: 4px;
}

/* === SECTION WEEK === */
.section-week {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.section-week h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.week-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-left: 4px solid #8b1e2c;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.week-card:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left-color: #FF9800;
}

.week-card .card-date {
  font-weight: 600;
  color: #8b1e2c;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.week-card .card-service {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.week-card .card-client {
  color: #666;
  font-size: 0.9rem;
}

/* === BUTTONS === */
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.8rem;
}

.btn-primary {
  background: #8b1e2c;
  color: white;
}

.btn-primary:hover {
  background: #6b1620;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .welcome-section h1 {
    font-size: 1.5rem;
  }

  .interventions-table {
    font-size: 0.8rem;
  }

  .interventions-table th,
  .interventions-table td {
    padding: 8px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .week-grid {
    grid-template-columns: 1fr;
  }
}
</style>
