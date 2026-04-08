import axios from 'axios'

const API_BASE = 'http://localhost:3001/api'

export const creneauxService = {
  getAll: () => axios.get(`${API_BASE}/creneaux`),
  getById: (id) => axios.get(`${API_BASE}/creneaux/${id}`),
  create: (creneaux) => axios.post(`${API_BASE}/creneaux`, creneaux),
  update: (id, creneaux) => axios.put(`${API_BASE}/creneaux/${id}`, creneaux),
  delete: (id) => axios.delete(`${API_BASE}/creneaux/${id}`),
  getByTech: (techId) => axios.get(`${API_BASE}/creneaux/tech/${techId}`),
  getAvailable: (date) => axios.get(`${API_BASE}/creneaux/available?date=${date}`)
}

export const interventionsService = {
  getAll: () => axios.get(`${API_BASE}/interventions`),
  getById: (id) => axios.get(`${API_BASE}/interventions/${id}`),
  create: (intervention) => axios.post(`${API_BASE}/interventions`, intervention),
  update: (id, intervention) => axios.put(`${API_BASE}/interventions/${id}`, intervention),
  delete: (id) => axios.delete(`${API_BASE}/interventions/${id}`),
  assignTech: (id, techId) => axios.patch(`${API_BASE}/interventions/${id}/assign`, { techId })
}

export const technicienService = {
  getAll: () => axios.get(`${API_BASE}/techniciens`),
  getAvailability: (id) => axios.get(`${API_BASE}/techniciens/${id}/availability`)
}
