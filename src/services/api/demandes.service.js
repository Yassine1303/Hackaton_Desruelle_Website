// SERVICE: demandes.service.js
// Endpoints: CRUD demandes_devis + respondreDevis

import axios from 'axios'

export const demandesService = {
  createDemande(data) {
    // TODO: POST /demandes_devis
  },
  getAllDemandes() {
    // TODO: GET /demandes_devis (respo)
  },
  getMyDemandes() {
    // TODO: GET /demandes_devis?client_id=me
  },
  getDemande(id) {
    // TODO: GET /demandes_devis/:id
  },
  respondreDevis(id, data) {
    // TODO: POST /demandes_devis/:id/devis
  },
  refuserDevis(id, reason) {
    // TODO: PUT /demandes_devis/:id/refuse
  },
}
