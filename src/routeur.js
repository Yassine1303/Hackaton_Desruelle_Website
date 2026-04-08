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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router