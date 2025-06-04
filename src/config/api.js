export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
  habits: `${API_BASE_URL}/habits`,
  weeklyProgress: `${API_BASE_URL}/progress/weekly`,
  dailyProgress: `${API_BASE_URL}/progress/daily`,
  habitLog: (id) => `${API_BASE_URL}/habits/${id}/log`,
  habitById: (id) => `${API_BASE_URL}/habits/${id}`,
}
