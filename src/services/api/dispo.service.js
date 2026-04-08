// SERVICE: dispo.service.js
// Endpoints: CRUD disponibilites + getTechsLibres

import axios from 'axios'

export const dispoService = {
  getMyDisponibilites() {
    // TODO: GET /disponibilites?user_id=me
  },
  addDisponibilite(data) {
    // TODO: POST /disponibilites
  },
  deleteDisponibilite(id) {
    // TODO: DELETE /disponibilites/:id
  },
  getTechsLibres(date, duration) {
    // TODO: GET /techs/available?date=X&duration=Y
  },
}
