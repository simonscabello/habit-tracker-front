<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Dashboard</div>

    <div v-if="loading" class="row justify-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else>
      <!-- Cards de estatísticas -->
      <div class="row q-col-gutter-md q-mb-lg">
        <q-card class="col-12 col-md-3" flat bordered>
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">Total de Hábitos</div>
            <div class="text-h5">
              {{ totalHabits }}
            </div>
          </q-card-section>
        </q-card>

        <q-separator vertical color="white" />

        <q-card class="col-12 col-md-3" flat bordered>
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">Hábitos Concluídos Hoje</div>
            <div class="text-h5">
              {{ dailyProgress }}
            </div>
          </q-card-section>
        </q-card>

        <q-separator vertical color="white" />

        <q-card class="col-12 col-md-3" flat bordered>
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">Dias Seguidos</div>
            <div class="text-h5">
              {{ maxStreak }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-separator class="q-my-md" />

      <!-- Lista de hábitos -->
      <div class="q-mb-md text-subtitle1">Hábitos em Sequência</div>

      <div class="row q-col-gutter-sm">
        <q-card
          v-for="habit in sortedHabits"
          :key="habit.id"
          class="col-12 col-md-4"
          :class="{ 'bg-grey-2': habit.streak === 0 }"
          flat
          bordered
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between">
              <div class="text-subtitle2">
                {{ habit.name }}
              </div>
              <q-chip dense :color="habit.streak > 0 ? 'primary' : 'grey'" text-color="white">
                {{ habit.streak }} dias
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-separator class="q-my-md" />

      <!-- Gráfico de progresso -->
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <div class="q-mb-sm text-subtitle1">Progresso da Semana</div>

          <HabitProgressChart :weeklyProgress="weeklyProgress" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import HabitProgressChart from 'components/HabitProgressChart.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { API_ENDPOINTS } from 'src/config/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const totalHabits = ref(0)
const auth = useAuthStore()
const weeklyProgress = ref([])
const dailyProgress = ref([])
const habits = ref([])

const sortedHabits = computed(() => {
  return [...habits.value].sort((a, b) => b.streak - a.streak)
})

const maxStreak = computed(() => {
  return habits.value.reduce((max, habit) => Math.max(max, habit.streak), 0)
})

function showNotification(message, type = 'positive') {
  $q.notify({
    type,
    message,
    position: 'top',
  })
}

onMounted(async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.habits, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    habits.value = response.data
    totalHabits.value = response.data.length
  } catch (e) {
    console.error('Erro ao carregar hábitos:', e)
    showNotification('Erro ao carregar hábitos', 'negative')
  }

  try {
    const progressResponse = await axios.get(API_ENDPOINTS.weeklyProgress, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    weeklyProgress.value = progressResponse.data

    const dailyProgressResponse = await axios.get(API_ENDPOINTS.dailyProgress, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    dailyProgress.value = dailyProgressResponse.data
  } catch (e) {
    console.error('Erro ao carregar progresso:', e)
    showNotification('Erro ao carregar progresso', 'negative')
  } finally {
    loading.value = false
  }
})
</script>
