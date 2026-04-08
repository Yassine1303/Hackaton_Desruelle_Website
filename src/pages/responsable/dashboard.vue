<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Tableau de Bord - Direction</h1>
      <p class="text-gray-500">Vue d'ensemble de l'activité de la Conciergerie Desruelle</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-[#800020]">
        <h3 class="text-sm font-medium text-gray-500">Devis en attente</h3>
        <p class="text-3xl font-bold text-[#800020]">{{ stats.devisEnAttente }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-sm font-medium text-gray-500">RDV du jour</h3>
        <p class="text-3xl font-bold text-gray-800">{{ stats.rdvJour }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-orange-500">
        <h3 class="text-sm font-medium text-gray-500">Incidents signalés</h3>
        <p class="text-3xl font-bold text-orange-500">{{ stats.incidents }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-sm font-medium text-gray-500">Techniciens actifs</h3>
        <p class="text-3xl font-bold text-gray-800">{{ stats.techniciensActifs }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Derniers devis en attente</h2>
          <button class="text-sm text-[#800020] hover:underline font-medium">Voir tout</button>
        </div>
        <div class="space-y-4 flex-1">
          <div v-for="devis in listeDevis" :key="devis.id" class="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md border border-gray-100 transition-colors">
            <div>
              <p class="font-medium text-gray-800">{{ devis.client }}</p>
              <p class="text-sm text-gray-500">{{ devis.service }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold bg-red-50 text-[#800020] rounded-full border border-red-100">En attente</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Prochains RDV</h2>
          <button class="text-sm text-[#800020] hover:underline font-medium">Ouvrir le planning</button>
        </div>
        <div class="space-y-4 flex-1">
          <div v-for="rdv in listeRdv" :key="rdv.id" class="flex items-center p-3 hover:bg-gray-50 rounded-md border border-gray-100 transition-colors">
            <div class="bg-gray-50 p-2 rounded-md border border-gray-200 mr-4 text-center min-w-[60px]">
              <p class="text-xs text-gray-500 uppercase">{{ rdv.mois }}</p>
              <p class="text-lg font-bold text-[#800020]">{{ rdv.jour }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ rdv.service }}</p>
              <p class="text-sm text-gray-500">{{ rdv.client }} • {{ rdv.heure }} • Tech: <span class="font-medium">{{ rdv.technicien }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
         <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Incidents & Remontées Terrain</h2>
        </div>
        <div v-if="listeIncidents.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
          🎉 Aucun incident signalé aujourd'hui. Tout roule !
        </div>
        <div v-else class="space-y-3">
           <div v-for="incident in listeIncidents" :key="incident.id" class="flex justify-between items-center p-4 bg-orange-50 border border-orange-200 rounded-md">
             <div>
               <p class="font-medium text-orange-800">{{ incident.titre }}</p>
               <p class="text-sm text-orange-700">{{ incident.description }} <span class="text-orange-500 ml-2">— Signalé par {{ incident.technicien }}</span></p>
             </div>
             <button class="px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-100 transition-colors shadow-sm">
               Prendre en charge
             </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Ces données sont "en dur" pour que l'interface s'affiche directement.
// Vos devs Back-end pourront remplacer ça par des appels API (ex: Axios ou Fetch) plus tard !

const stats = ref({
  devisEnAttente: 5,
  rdvJour: 8,
  incidents: 2,
  techniciensActifs: 3
})

const listeDevis = ref([
  { id: 1, client: 'Sébastien L.', service: 'Nettoyage après travaux' },
  { id: 2, client: 'Entreprise ABC', service: 'Ménage régulier (Bureaux)' },
  { id: 3, client: 'Sophie M.', service: 'Vitrerie' }
])

const listeRdv = ref([
  { id: 101, client: 'M. Dubois', service: 'Nettoyage terrasse', technicien: 'Luc', jour: '08', mois: 'Avr', heure: '14:00' },
  { id: 102, client: 'Famille Martin', service: 'Petite plomberie', technicien: 'Sarah', jour: '08', mois: 'Avr', heure: '15:30' }
])

const listeIncidents = ref([
  { id: 201, titre: 'Accès impossible', description: 'Le client a oublié de laisser les clés.', technicien: 'Marc' },
  { id: 202, titre: 'Matériel manquant', description: 'Besoin d\'un escabeau plus grand.', technicien: 'Julie' }
])
</script>

<style scoped>
/* Les classes Tailwind suffisent, mais tu peux ajouter du CSS personnalisé ici si besoin */
</style>