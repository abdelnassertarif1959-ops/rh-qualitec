<template>
  <div>
    <UiPageHeader 
      title="Jornadas de Trabalho" 
      description="Gerencie as jornadas e cargas horárias dos funcionários"
    >
      <UiButton size="lg" icon="➕" @click="abrirModal()">
        Nova Jornada
      </UiButton>
    </UiPageHeader>

    <!-- Lista de Jornadas -->
    <div class="space-y-4">
      <UiCard v-for="jornada in jornadas" :key="jornada.id" padding="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Ícone -->
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <span class="text-blue-700 font-bold text-2xl">🕐</span>
            </div>
            
            <!-- Informações -->
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-gray-800">{{ jornada.nome }}</h3>
                <UiBadge v-if="jornada.padrao" variant="primary">Padrão</UiBadge>
                <UiBadge :variant="jornada.ativa ? 'success' : 'gray'">
                  {{ jornada.ativa ? 'Ativa' : 'Inativa' }}
                </UiBadge>
              </div>
              
              <p class="text-gray-600 mt-1">{{ jornada.descricao }}</p>
              
              <div class="flex gap-4 mt-2 text-sm text-gray-500">
                <span>📅 {{ formatarHorasDecimais(jornada.horas_semanais) }} semanais</span>
                <span>📊 {{ formatarHorasDecimais(jornada.horas_mensais) }} mensais</span>
                <span>👥 {{ contarFuncionarios(jornada.id) }} funcionários</span>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex gap-2">
            <UiButton variant="ghost" @click="visualizarJornada(jornada)">
              👁️ Visualizar
            </UiButton>
            
            <UiButton variant="ghost" @click="editarJornada(jornada)">
              ✏️ Editar
            </UiButton>
            
            <UiButton 
              :variant="jornada.ativa ? 'danger' : 'success'"
              @click="toggleStatus(jornada)"
            >
              {{ jornada.ativa ? '🚫 Inativar' : '✓ Ativar' }}
            </UiButton>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Modal de Visualização -->
    <UiModal 
      v-model="modalVisualizacao" 
      :title="`Jornada: ${jornadaSelecionada?.nome || ''}`"
      max-width="max-w-4xl"
    >
      <JornadaVisualizacao 
        v-if="jornadaSelecionada" 
        :jornada="jornadaSelecionada"
      />
    </UiModal>

    <!-- Modal de Cadastro/Edição -->
    <UiModal 
      v-model="modalEdicao" 
      :title="jornadaEditando ? 'Editar Jornada' : 'Nova Jornada'"
      max-width="max-w-5xl"
    >
      <JornadaForm 
        :jornada="jornadaEditando"
        @salvar="salvarJornada"
        @cancelar="modalEdicao = false"
      />
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
import JornadaVisualizacao from '~/components/jornadas/JornadaVisualizacao.vue'
import JornadaForm from '~/components/jornadas/JornadaForm.vue'
import type { JornadaTrabalho } from '~/composables/useJornadas'

definePageMeta({ middleware: ['auth', 'admin'] })

const { 
  jornadas, 
  loading, 
  carregarJornadas,
  salvarJornada: salvarJornadaComposable
} = useJornadas()

// Funções de formatação
const { formatarHorasDecimais } = useJornadasFormat()

// Estado dos modais
const modalVisualizacao = ref(false)
const modalEdicao = ref(false)
const jornadaSelecionada = ref<JornadaTrabalho | null>(null)
const jornadaEditando = ref<JornadaTrabalho | null>(null)

// Notificações
const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error' | 'warning' | 'info'
})

// Carregar jornadas ao montar
onMounted(() => {
  carregarJornadas()
})

// Visualizar jornada
const visualizarJornada = (jornada: JornadaTrabalho) => {
  jornadaSelecionada.value = jornada
  modalVisualizacao.value = true
}

// Abrir modal de nova jornada
const abrirModal = () => {
  jornadaEditando.value = null
  modalEdicao.value = true
}

// Editar jornada
const editarJornada = (jornada: JornadaTrabalho) => {
  jornadaEditando.value = jornada
  modalEdicao.value = true
}

// Salvar jornada
const salvarJornada = async (dadosJornada: any) => {
  const resultado = await salvarJornadaComposable(dadosJornada)
  
  notificacao.value = {
    title: resultado.success ? 'Sucesso!' : 'Erro!',
    message: resultado.message,
    variant: resultado.success ? 'success' : 'error'
  }
  mostrarNotificacao.value = true
  
  if (resultado.success) {
    modalEdicao.value = false
  }
}

// Toggle status da jornada
const toggleStatus = async (jornada: JornadaTrabalho) => {
  try {
    // Aqui seria a integração com Supabase
    jornada.ativa = !jornada.ativa
    
    notificacao.value = {
      title: 'Status Atualizado!',
      message: `Jornada ${jornada.nome} ${jornada.ativa ? 'ativada' : 'inativada'} com sucesso!`,
      variant: 'success'
    }
    mostrarNotificacao.value = true
    
  } catch (error) {
    notificacao.value = {
      title: 'Erro!',
      message: 'Erro ao atualizar status da jornada.',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  }
}

// Contar funcionários usando esta jornada (mock)
const contarFuncionarios = (jornadaId: string): number => {
  // Aqui seria uma consulta real ao banco
  const mock = {
    '1': 15, // Jornada 42h45min
    '2': 8,  // Jornada 44h
    '3': 3   // Jornada 40h
  }
  return mock[jornadaId as keyof typeof mock] || 0
}
</script>