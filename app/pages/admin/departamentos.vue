<template>
  <div>
    <UiPageHeader title="Departamentos" description="Organize os setores da empresa">
      <UiButton size="lg" icon="➕" @click="abrirModal()">
        Novo Departamento
      </UiButton>
    </UiPageHeader>

    <!-- Lista -->
    <div v-if="carregando" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando departamentos...</p>
      </div>
    </div>

    <div v-else-if="departamentos.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">Nenhum departamento cadastrado</p>
      <UiButton @click="abrirModal()">➕ Criar Primeiro Departamento</UiButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiCard v-for="dept in departamentos" :key="dept.id" padding="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-14 h-14 rounded-xl shadow-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="url(#dept-logo-grad)"/>
              <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
              <circle cx="10" cy="16" r="3" fill="#1e40af"/>
              <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
              <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
              <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
              <circle cx="28" cy="8" r="2" fill="#10b981"/>
              <defs>
                <linearGradient id="dept-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <UiButton variant="ghost" size="sm" @click="abrirModal(dept)">✏️ Editar</UiButton>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">{{ dept.nome }}</h3>
        <p class="text-gray-500 mb-3">{{ dept.descricao }}</p>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Responsável: {{ dept.responsavel }}
        </div>
        <div class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ dept.funcionarios_count || 0 }} funcionários</span>
            <UiButton 
              v-if="dept.funcionarios_count > 0" 
              variant="ghost" 
              size="sm" 
              @click="verFuncionarios(dept)"
            >
              👥 Ver funcionários
            </UiButton>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Modal -->
    <UiModal v-model="modalAberto" :title="editando ? 'Editar Departamento' : 'Novo Departamento'">
      <form @submit.prevent="salvar" class="space-y-4">
        <UiInput v-model="form.nome" label="Nome do Departamento" required />
        <UiTextarea v-model="form.descricao" label="Descrição" />
        <UiSelect v-model="form.responsavel" :options="responsaveisOptions" label="Responsável" placeholder="Selecione..." />
        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="modalAberto = false">Cancelar</UiButton>
          <UiButton type="submit" icon="💾" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </UiButton>
        </div>
      </form>
    </UiModal>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({ middleware: ['auth', 'admin'] })

const { nomeAdmin, buscarAdmin } = useAdmin()

const modalAberto = ref(false)
const editando = ref<any>(null)
const form = ref({ nome: '', descricao: '', responsavel: '' })
const carregando = ref(true)
const salvando = ref(false)
const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error'
})

interface Departamento {
  id: string
  nome: string
  descricao: string
  responsavel: string
  funcionarios_count: number
}

const departamentos = ref<Departamento[]>([])

const responsaveisOptions = computed(() => {
  const options = []
  
  if (nomeAdmin.value) {
    options.push({ value: nomeAdmin.value, label: `${nomeAdmin.value} (Admin) ⭐` })
  }
  
  // Outros responsáveis serão carregados da API
  return options
})

// Carregar departamentos e admin ao montar
onMounted(async () => {
  await buscarAdmin()
  await carregarDepartamentos()
})

// Carregar departamentos do banco
const carregarDepartamentos = async () => {
  carregando.value = true
  try {
    const response: any = await $fetch('/api/departamentos')
    if (response.success && response.data) {
      departamentos.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar departamentos:', error)
    mostrarMensagem('Erro!', 'Não foi possível carregar departamentos', 'error')
  } finally {
    carregando.value = false
  }
}

const abrirModal = (dept?: any) => {
  editando.value = dept || null
  // Se for novo departamento, sugerir a admin como responsável
  form.value = dept 
    ? { nome: dept.nome, descricao: dept.descricao, responsavel: dept.responsavel } 
    : { nome: '', descricao: '', responsavel: nomeAdmin.value || '' }
  modalAberto.value = true
}

const salvar = async () => {
  salvando.value = true
  try {
    const dados = editando.value 
      ? { ...form.value, id: editando.value.id }
      : form.value

    const response: any = await $fetch('/api/departamentos/criar', {
      method: 'POST',
      body: dados
    })

    if (response.success) {
      mostrarMensagem('Sucesso!', response.message, 'success')
      modalAberto.value = false
      await carregarDepartamentos() // Recarregar lista
    }
  } catch (error: any) {
    console.error('Erro ao salvar departamento:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Não foi possível salvar o departamento', 'error')
  } finally {
    salvando.value = false
  }
}

// Função auxiliar para mostrar mensagens
const mostrarMensagem = (title: string, message: string, variant: 'success' | 'error') => {
  notificacao.value = { title, message, variant }
  mostrarNotificacao.value = true
  
  setTimeout(() => {
    mostrarNotificacao.value = false
  }, 5000)
}

const verFuncionarios = (departamento: any) => {
  navigateTo(`/admin/funcionarios?departamento=${departamento.id}`)
}
</script>
