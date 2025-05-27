<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-xl" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <div class="text-h5">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="login">
          <q-input v-model="email" label="E-mail" type="email" outlined dense />
          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            dense
            class="q-mt-md"
          />
          <q-btn label="Entrar" type="submit" color="primary" class="full-width q-mt-md" />
        </q-form>

        <q-banner v-if="error" class="bg-red-2 text-red q-mt-md">
          {{ error }}
        </q-banner>

        <q-btn
          flat
          label="Não tem conta? Registrar"
          @click="goToRegister"
          class="q-mt-sm full-width"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function login() {
  error.value = ''
  try {
    const response = await axios.post('http://localhost:8000/login', {
      email: email.value,
      password: password.value,
    })

    auth.setToken(response.data.token)
    await auth.fetchUser()

    router.push('/dashboard')
  } catch (error) {
    error.value = 'Credenciais inválidas'
  }
}

function goToRegister() {
  router.push('/register')
}
</script>
