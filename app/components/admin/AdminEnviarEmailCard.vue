<template>
  <UiCard id="admin-enviar-email-card">
    <template #header>
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <span class="font-semibold text-gray-900">Enviar Email para Funcionário</span>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Select funcionário -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
        <select
          v-model="form.funcionario_id"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loadingFuncionarios || loading"
        >
          <option value="">
            {{ loadingFuncionarios ? 'Carregando...' : 'Selecione um funcionário' }}
          </option>
          <option
            v-for="f in funcionarios"
            :key="f.id"
            :value="f.id"
          >
            {{ f.nome_completo }} — {{ f.email_login || f.email_pessoal || 'sem email' }}
          </option>
        </select>
      </div>

      <!-- Assunto -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
        <input
          v-model="form.assunto"
          type="text"
          placeholder="Ex: Informações sobre benefícios"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        />
      </div>

      <!-- Mensagem -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
        <textarea
          v-model="form.mensagem"
          rows="5"
          placeholder="Digite a mensagem que será enviada ao funcionário..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          :disabled="loading"
        />
      </div>

      <!-- Feedback -->
      <div v-if="sucesso" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ sucesso }}
      </div>

      <div v-if="erro" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ erro }}
      </div>

      <!-- Botão -->
      <div class="flex justify-end">
        <button
          :disabled="!podaEnviar || loading"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="enviar"
        >
          <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ loading ? 'Enviando...' : 'Enviar Email' }}
        </button>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { useEmailIndividual } from '~/composables/useEmailIndividual'

interface Funcionario {
  id: number
  nome_completo: string
  email_login: string | null
  email_pessoal: string | null
}

const { loading, erro, sucesso, enviarEmailIndividual, resetar } = useEmailIndividual()

const funcionarios = ref<Funcionario[]>([])
const loadingFuncionarios = ref(false)

const form = ref({
  funcionario_id: '' as number | '',
  assunto: '',
  mensagem: ''
})

const podaEnviar = computed(() =>
  form.value.funcionario_id !== '' &&
  form.value.assunto.trim().length > 0 &&
  form.value.mensagem.trim().length > 0
)

const carregarFuncionarios = async () => {
  loadingFuncionarios.value = true
  try {
    const data = await $fetch<Funcionario[]>('/api/funcionarios')
    funcionarios.value = data || []
  } catch (e) {
    console.error('Erro ao carregar funcionários:', e)
  } finally {
    loadingFuncionarios.value = false
  }
}

const enviar = async () => {
  if (!podaEnviar.value) return
  resetar()

  const ok = await enviarEmailIndividual({
    funcionario_id: form.value.funcionario_id as number,
    assunto: form.value.assunto,
    mensagem: form.value.mensagem
  })

  if (ok) {
    form.value.assunto = ''
    form.value.mensagem = ''
    form.value.funcionario_id = ''
  }
}

onMounted(() => {
  carregarFuncionarios()
})
</script>
