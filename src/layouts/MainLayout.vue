<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Bem-vindo, {{ auth.user?.name || 'Usuário' }} </q-toolbar-title>

        <q-btn flat icon="logout" label="Sair" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <!-- Adicione outros links internos aqui -->
        <q-item clickable v-ripple to="/habits">
          <q-item-section avatar>
            <q-icon name="checklist" />
          </q-item-section>
          <q-item-section>Hábitos</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- CONTEÚDO DA PÁGINA -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const leftDrawerOpen = ref(false)
const router = useRouter()
const auth = useAuthStore()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  auth.clear()
  router.push('/login')
}

onMounted(() => {
  if (auth.token && !auth.user) {
    auth.fetchUser()
  }
})
</script>
