<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-xl" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <div class="text-h5">Registrar</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="register">
          <q-input v-model="name" label="Nome" outlined dense />
          <q-input v-model="email" label="E-mail" type="email" outlined dense class="q-mt-md" />
          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            dense
            class="q-mt-md"
          />
          <q-btn label="Criar Conta" type="submit" color="primary" class="full-width q-mt-md" />
        </q-form>

        <q-banner v-if="error" class="bg-red-2 text-red q-mt-md">
          {{ error }}
        </q-banner>

        <q-btn flat label="Já tem conta? Entrar" @click="goToLogin" class="q-mt-sm full-width" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_ENDPOINTS } from 'src/config/api'
import { useAuthStore } from 'src/stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function register() {
  error.value = ''
  try {
    // Primeiro faz o registro
    await axios.post(API_ENDPOINTS.register, {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    // Após o registro, faz o login
    const loginResponse = await axios.post(API_ENDPOINTS.login, {
      email: email.value,
      password: password.value,
    })

    auth.setToken(loginResponse.data.token)
    await auth.fetchUser()

    router.push('/dashboard')
  } catch (err) {
    error.value = 'Erro ao registrar. Tente novamente.'
    console.error('Erro:', err)
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
