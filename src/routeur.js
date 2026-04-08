// FILE: routeur.js
// Configuration des routes et route guards
// Routes publiques, client, tech, responsable
// beforeEach guard vérifie auth + permissions

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // TODO: Routes publiques (/, prestations, apropos, contact, connexion)
  // TODO: Routes client (client/*, /suivi-commande, /paiement, etc.)
  // TODO: Routes tech (tech/*, /tech/dashboard, /tech/calendrier, etc.)
  // TODO: Routes responsable (responsable/*, /dashboard, /demandes, /calendrier, etc.)
  // TODO: Routes universelles (profil, notifications, erreur)
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
