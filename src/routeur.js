// FILE: routeur.js
// Configuration des routes et route guards
// Routes publiques, client, tech, responsable
// beforeEach guard vérifie auth + permissions

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Dashboard - Tech
  { path: '/tech/dashboard', component: () => import('@/pages/tech/dashboard.vue'), name: 'tech-dashboard' },
  // Calendrier - Tech
  { path: '/tech/calendrier', component: () => import('@/pages/tech/calendrier.vue'), name: 'tech-calendrier' },
  // Calendrier - Client
  { path: '/client/choix-creneau', component: () => import('@/pages/client/choix-creneau.vue'), name: 'client-creneau' },
  // Calendrier - Responsable
  { path: '/responsable/calendrier', component: () => import('@/pages/responsable/calendrier.vue'), name: 'responsable-calendrier' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// TODO: beforeEach guard
// - Vérifier auth (requiresAuth)
// - Vérifier rôle (role)
// - Redirect /connexion ou /erreur/403

export default router
