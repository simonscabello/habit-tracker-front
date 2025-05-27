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

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function register() {
  error.value = ''
  try {
    const response = await axios.post('http://localhost:8000/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    const token = response.data.token
    localStorage.setItem('token', token)
    router.push('/dashboard')
  } catch (error) {
    error.value = 'Erro ao registrar. Tente novamente.'
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
