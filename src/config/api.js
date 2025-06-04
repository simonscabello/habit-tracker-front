export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_ENDPOINTS = {
  habits: `${API_BASE_URL}/habits`,
  weeklyProgress: `${API_BASE_URL}/progress/weekly`,
  dailyProgress: `${API_BASE_URL}/progress/daily`,
  habitLog: (id) => `${API_BASE_URL}/habits/${id}/log`,
  habitById: (id) => `${API_BASE_URL}/habits/${id}`,
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  me: `${API_BASE_URL}/me`,
}
