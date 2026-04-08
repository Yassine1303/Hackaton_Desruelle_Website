// STORE: prestations.js
// Gère: prestations (commandes confirmées), status updates, paiement, annulation

import { defineStore } from 'pinia'

export const usePrestatationsStore = defineStore('prestations', {
  state: () => ({
    // TODO: prestations array, loading, currentPrestation
  }),
  getters: {
    // TODO: getters (prestationsEnCours, prestationsTerminees, prestatationsAttentePaiement)
  },
  actions: {
    // TODO: actions (fetch, updateStatus, completerPrestation, annulerPrestation, validerpaiement)
  },
})
