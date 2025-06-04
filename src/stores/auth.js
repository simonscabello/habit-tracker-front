import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { API_ENDPOINTS } from 'src/config/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clear() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    try {
      const response = await axios.get(API_ENDPOINTS.me, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      user.value = response.data
    } catch (err) {
      console.error('Failed to fetch user:', err)
      clear()
    }
  }

  return {
    token,
    user,
    setToken,
    clear,
    fetchUser,
  }
})
