<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Dashboard</div>

    <div class="row q-col-gutter-md">
      <q-card class="col-12 col-md-4" bordered>
        <q-card-section>
          <div class="text-subtitle1">Total de Hábitos</div>
          <div class="text-h6">{{ totalHabits }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4" bordered>
        <q-card-section>
          <div class="text-subtitle1">Hábitos Concluídos Hoje</div>
          <div class="text-h6">0</div>
          <!-- futuro: progresso -->
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4" bordered>
        <q-card-section>
          <div class="text-subtitle1">Dias Seguidos</div>
          <div class="text-h6">0</div>
          <!-- futuro: streak -->
        </q-card-section>
      </q-card>
    </div>

    <q-separator class="q-my-lg" />

    <div class="q-mb-md text-subtitle1">Progresso da Semana</div>
    <HabitProgressChart :weeklyProgress="weeklyProgress" />
  </q-page>
</template>

<script setup>
import HabitProgressChart from 'components/HabitProgressChart.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { API_ENDPOINTS } from 'src/config/api'

const totalHabits = ref(0)
const auth = useAuthStore()
const weeklyProgress = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.habits, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    totalHabits.value = response.data.length
  } catch (e) {
    console.error('Erro ao carregar hábitos:', e)
  }

  const response = await axios.get(API_ENDPOINTS.progress, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  })

  weeklyProgress.value = response.data
  console.log('progress', weeklyProgress.value)
})
</script>
