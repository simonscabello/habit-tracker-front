import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

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
      const response = await axios.get('http://localhost:8000/me', {
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
