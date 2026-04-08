// FILE: main.js
// Initialisation application Vue
// Configure: Pinia, Vue Router, Axios intercepteurs

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routeur'

const app = createApp(App)

// TODO: Setup Pinia
// TODO: Setup Axios intercepteurs (request - add token, response - handle 401)
// TODO: Setup Vue Router

app.use(createPinia())
app.use(router)
app.mount('#app')
