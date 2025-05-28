export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
  habits: `${API_BASE_URL}/habits`,
  progress: `${API_BASE_URL}/progress`,
  habitLog: (id) => `${API_BASE_URL}/habits/${id}/log`,
  habitById: (id) => `${API_BASE_URL}/habits/${id}`,
}
