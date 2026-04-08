import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'Accueil', 
    // 👇 Le chemin pointe maintenant vers ton dossier "pages" !
    component: () => import('./pages/accueil.vue') 
  },
  // On décommentera la suite quand on créera ces pages :
  /*
  { path: '/prestations', name: 'Prestations', component: () => import('./pages/prestations.vue') },
  { path: '/contact', name: 'Contact', component: () => import('./pages/contact.vue') },
  */
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

export default router