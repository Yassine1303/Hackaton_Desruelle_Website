// SERVICE: prestations.service.js
// Endpoints: CRUD prestations + status, complete, cancel, validate

import axios from 'axios'

export const prestatationsService = {
  getAllPrestations() {
    // TODO: GET /prestations
  },
  getMyPrestations() {
    // TODO: GET /prestations?user_id=me
  },
  getPrestation(id) {
    // TODO: GET /prestations/:id
  },
  updateStatus(id, status) {
    // TODO: PUT /prestations/:id/status
  },
  completerPrestation(id, data) {
    // TODO: PUT /prestations/:id/complete
  },
  annulerPrestation(id, reason) {
    // TODO: PUT /prestations/:id/cancel
  },
  validerPaiement(id) {
    // TODO: PUT /prestations/:id/validate
  },
}
