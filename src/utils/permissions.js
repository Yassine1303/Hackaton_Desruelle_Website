// UTILS: permissions.js
// Vérification permissions par rôle

export const permissions = {
  canAccess(userRole, requiredRole) {
    // TODO: vérifier si userRole a accès
  },
  canCreateDemande(role) {
    // TODO: role === 'user'
  },
  canRepondreDevis(role) {
    // TODO: role === 'responsable'
  },
  canAssignTech(role) {
    // TODO: role === 'responsable'
  },
  canCompleterPrestation(role) {
    // TODO: role === 'tech'
  },
  canValiderPaiement(role) {
    // TODO: role === 'responsable'
  },
  canLeaveAvis(role) {
    // TODO: role === 'user'
  },
  canSeeAllPrestations(role) {
    // TODO: role === 'responsable'
  },
}
