<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Meus Hábitos</div>
      <q-btn label="Novo Hábito" color="primary" @click="openCreateDialog" />
    </div>

    <div v-if="loading" class="row justify-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <template v-else>
      <!-- Feitos hoje -->
      <div class="q-mb-lg">
        <div class="text-subtitle1 q-mb-sm">✅ Feitos Hoje</div>
        <q-list bordered separator v-if="habitsDoneToday.length">
          <q-item v-for="habit in habitsDoneToday" :key="habit.id">
            <q-item-section>{{ habit.name }}</q-item-section>
            <q-item-section side>
              <q-icon name="check" color="green" />
              <q-btn flat icon="edit" @click.stop="editHabit(habit)" />
              <q-btn flat icon="delete" color="red" @click.stop="deleteHabit(habit.id)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-banner v-else class="bg-grey-2 text-grey-7">Nenhum hábito feito ainda.</q-banner>
      </div>

      <!-- Pendentes -->
      <div>
        <div class="text-subtitle1 q-mb-sm">⏳ Pendentes</div>
        <q-list bordered separator v-if="habitsPending.length">
          <q-item v-for="habit in habitsPending" :key="habit.id">
            <q-item-section>{{ habit.name }}</q-item-section>
            <q-item-section side>
              <q-btn flat icon="done" color="primary" @click.stop="markAsDone(habit.id)" />
              <q-btn flat icon="edit" @click.stop="editHabit(habit)" />
              <q-btn flat icon="delete" color="red" @click.stop="deleteHabit(habit.id)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-banner v-else class="bg-grey-2 text-grey-7"
          >Todos os hábitos foram feitos hoje 🎉</q-banner
        >
      </div>
    </template>

    <!-- Diálogo de criar/editar hábito -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ editingHabit ? 'Editar' : 'Novo' }} Hábito</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="habitTitle" label="Título do hábito" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" @click="saveHabit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { API_ENDPOINTS } from 'src/config/api'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const auth = useAuthStore()
const habits = ref([])
const showDialog = ref(false)
const habitTitle = ref('')
const editingHabit = ref(null)

const habitsDoneToday = ref([])
const habitsPending = ref([])

function showNotification(message, type = 'positive') {
  $q.notify({
    type,
    message,
    position: 'top',
  })
}

async function loadHabits() {
  try {
    const response = await axios.get(API_ENDPOINTS.habits, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })

    habits.value = response.data

    // Separar hábitos por status de done_today
    habitsDoneToday.value = habits.value.filter((h) => h.done_today)
    habitsPending.value = habits.value.filter((h) => !h.done_today)
  } catch (e) {
    console.error('Erro ao carregar hábitos:', e)
    showNotification('Erro ao carregar hábitos', 'negative')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingHabit.value = null
  habitTitle.value = ''
  showDialog.value = true
}

function editHabit(habit) {
  editingHabit.value = habit
  habitTitle.value = habit.Title
  showDialog.value = true
}

async function saveHabit() {
  try {
    const payload = { name: habitTitle.value }

    if (editingHabit.value) {
      await axios.put(API_ENDPOINTS.habitById(editingHabit.value.id), payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      showNotification('Hábito atualizado com sucesso!')
    } else {
      await axios.post(API_ENDPOINTS.habits, payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      showNotification('Hábito criado com sucesso!')
    }

    showDialog.value = false
    await loadHabits()
  } catch (e) {
    console.error('Erro ao salvar hábito:', e)
    showNotification('Erro ao salvar hábito', 'negative')
  }
}

async function deleteHabit(id) {
  try {
    await axios.delete(API_ENDPOINTS.habitById(id), {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    showNotification('Hábito excluído com sucesso!')
    await loadHabits()
  } catch (e) {
    console.error('Erro ao excluir hábito:', e)
    showNotification('Erro ao excluir hábito', 'negative')
  }
}

async function markAsDone(habitId) {
  try {
    await axios.post(
      API_ENDPOINTS.habitLog(habitId),
      {},
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      },
    )
    showNotification('Hábito marcado como concluído!')
    await loadHabits()
  } catch (e) {
    console.error('Erro ao marcar hábito como concluído:', e)
    showNotification('Erro ao marcar hábito como concluído', 'negative')
  }
}

onMounted(() => {
  loadHabits()
})
</script>
