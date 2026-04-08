// UTILS: constantes.js
// Constantes globales (rôles, statuts, couleurs, etc.)

export const ROLES = {
  USER: 'user',
  TECH: 'tech',
  RESPONSABLE: 'responsable',
}

export const STATUTS_DEVIS = {
  EN_ATTENTE: 'en_attente',
  ENVOYE: 'envoyé',
  ACCEPTE: 'accepté',
  REFUSE: 'refusé',
}

export const STATUTS_PAIEMENT = {
  ATTENTE: 'attente',
  BLOQUE: 'bloqué',
  LIBERE: 'libéré',
}

export const STATUTS_TRAVAIL = {
  PROGRAMME: 'programmé',
  EN_COURS: 'en_cours',
  TERMINE: 'terminé',
  INCIDENT: 'incident',
  ANNULE: 'annulé',
}

export const CATEGORIES = {
  PROPRETE: 'propreté',
  MULTISERVICES: 'multiservices',
}

export const COULEURS_DA = {
  BORDEAUX: '#8b1e2c',
  GRIS: '#666666',
  BLANC: '#ffffff',
  VERT: '#4CAF50',
  ROUGE: '#f44336',
  ORANGE: '#FF9800',
}

export const HORAIRES_STANDARD = [
  // TODO: 08:00, 09:00, ..., 17:00 (sans 12-13h)
]

export const MESSAGES_STATUTS = {
  // TODO: messages utilisateurs pour chaque statut
}
