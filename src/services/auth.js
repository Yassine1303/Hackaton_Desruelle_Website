// SERVICE: auth.js
// Gestion token JWT (localStorage interaction)

export const authService = {
  getToken() {
    // TODO: return localStorage.getItem('token')
  },
  setToken(token) {
    // TODO: localStorage.setItem('token', token)
  },
  clearToken() {
    // TODO: localStorage.removeItem('token')
  },
  getAuthHeader() {
    // TODO: return {Authorization: `Bearer ${token}`}
  },
  isAuthenticated() {
    // TODO: return !!getToken()
  },
}
