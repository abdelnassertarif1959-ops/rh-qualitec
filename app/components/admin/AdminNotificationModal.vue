<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 text-lg">🔔</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Todas as Notificações</h2>
              <p class="text-sm text-gray-500">Últimos 30 dias</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Filtros -->
            <select 
              v-model="filtroTipo" 
              @change="aplicarFiltros"
              class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="info">Informações</option>
              <option value="success">Sucessos</option>
              <option value="warning">Avisos</option>
              <option value="error">Erros</option>
            </select>
            
            <select 
              v-model="filtroOrigem" 
              @change="aplicarFiltros"
              class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as origens</option>
              <option value="login">Login</option>
              <option value="alteracao_dados">Alteração de Dados</option>
              <option value="geracao_holerites">Holerites</option>
              <option value="visualizacao_holerite">Visualização Holerites</option>
              <option value="download_holerite">Download Holerites</option>
              <option value="novo_funcionario">Novos Funcionários</option>
              <option value="login_falhado">Login Falhado</option>
            </select>
            
            <button 
              @click="marcarTodasComoLidas"
              class="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Marcar todas como lidas
            </button>
            
            <button 
              @click="excluirTodasLidas"
              class="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir todas lidas
            </button>
            
            <button 
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="overflow-y-auto" style="max-height: calc(90vh - 140px);">
          <!-- Loading State -->
          <div v-if="pending" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-sm text-gray-500 mt-3">Carregando notificações...</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!notificacoesFiltradas || notificacoesFiltradas.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-gray-400 text-2xl">🔔</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
            <p class="text-sm text-gray-500">
              {{ filtroTipo || filtroOrigem ? 'Tente ajustar os filtros acima' : 'Não há notificações nos últimos 30 dias' }}
            </p>
          </div>
          
          <!-- Notificações -->
          <div v-else class="divide-y divide-gray-100">
            <div 
              v-for="notificacao in notificacoesFiltradas" 
              :key="notificacao.id"
              class="p-6 hover:bg-gray-50 transition-colors group"
              :class="{ 'bg-blue-50': !notificacao.lida }"
            >
              <div class="flex items-start gap-4">
                <!-- Ícone -->
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getNotificationStyle(notificacao.tipo).bg"
                >
                  <span :class="getNotificationStyle(notificacao.tipo).text" class="text-lg">
                    {{ getNotificationIcon(notificacao.tipo) }}
                  </span>
                </div>
                
                <!-- Conteúdo -->
                <div class="flex-1 min-w-0" @click="marcarComoLida(notificacao)" class="cursor-pointer">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="text-base font-semibold text-gray-900 mb-1">
                        {{ notificacao.titulo }}
                      </h4>
                      <p class="text-sm text-gray-700 mb-2 leading-relaxed">
                        {{ notificacao.mensagem }}
                      </p>
                      
                      <!-- Detalhes das alterações (se disponível) -->
                      <div v-if="notificacao.dados?.alteracoes_detalhadas" class="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h5 class="text-xs font-semibold text-gray-700 mb-2">Detalhes das Alterações:</h5>
                        <ul class="text-xs text-gray-600 space-y-1">
                          <li v-for="alteracao in notificacao.dados.alteracoes_detalhadas" :key="alteracao" class="flex items-start gap-2">
                            <span class="text-blue-500 mt-0.5">•</span>
                            <span>{{ alteracao }}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <!-- Metadados -->
                      <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {{ formatarDataCompleta(notificacao.created_at) }}
                        </span>
                        
                        <span v-if="notificacao.origem" class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                          </svg>
                          {{ formatarOrigem(notificacao.origem) }}
                        </span>
                        
                        <span v-if="notificacao.importante" class="flex items-center gap-1 text-red-600">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                          </svg>
                          Importante
                        </span>
                      </div>
                    </div>
                    
                    <!-- Status e Ações -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <div v-if="!notificacao.lida" 
                           class="w-3 h-3 rounded-full"
                           :class="getNotificationStyle(notificacao.tipo).dot">
                      </div>
                      
                      <button 
                        v-if="notificacao.acao_url"
                        @click.stop="navegarPara(notificacao.acao_url)"
                        class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        Ver detalhes
                      </button>
                      
                      <button
                        @click.stop="excluirNotificacao(notificacao.id)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir notificação"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p class="text-sm text-gray-500">
            Mostrando {{ notificacoesFiltradas?.length || 0 }} de {{ todasNotificacoes?.length || 0 }} notificações
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estados
const filtroTipo = ref('')
const filtroOrigem = ref('')
const todasNotificacoes = ref([])
const notificacoesFiltradas = ref([])
const pending = ref(false)

// Buscar todas as notificações dos últimos 30 dias
const { data: response, pending: loadingNotifications, refresh } = await useLazyFetch('/api/notificacoes', {
  query: { limite: 100 }, // Buscar mais notificações
  default: () => ({ notificacoes: [], success: false }),
  server: false
})

// Watchers
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    carregarNotificacoes()
  }
})

watch(response, (newResponse) => {
  if (newResponse?.success) {
    todasNotificacoes.value = newResponse.notificacoes || []
    aplicarFiltros()
  }
}, { immediate: true })

// Métodos
const carregarNotificacoes = async () => {
  await refresh()
}

const aplicarFiltros = () => {
  let filtradas = [...todasNotificacoes.value]
  
  if (filtroTipo.value) {
    filtradas = filtradas.filter(n => n.tipo === filtroTipo.value)
  }
  
  if (filtroOrigem.value) {
    filtradas = filtradas.filter(n => n.origem === filtroOrigem.value)
  }
  
  notificacoesFiltradas.value = filtradas
}

const marcarComoLida = async (notificacao: any) => {
  if (notificacao.lida) return
  
  try {
    await $fetch(`/api/notificacoes/${notificacao.id}/marcar-lida`, {
      method: 'PATCH'
    })
    
    // Atualizar localmente
    notificacao.lida = true
    notificacao.data_leitura = new Date().toISOString()
    
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
  }
}

const marcarTodasComoLidas = async () => {
  const naoLidas = notificacoesFiltradas.value.filter(n => !n.lida)
  
  if (naoLidas.length === 0) return
  
  try {
    pending.value = true
    
    // Marcar todas as não lidas
    await Promise.all(
      naoLidas.map(notificacao => 
        $fetch(`/api/notificacoes/${notificacao.id}/marcar-lida`, {
          method: 'PATCH'
        })
      )
    )
    
    // Atualizar localmente
    naoLidas.forEach(notificacao => {
      notificacao.lida = true
      notificacao.data_leitura = new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error)
  } finally {
    pending.value = false
  }
}

const excluirNotificacao = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
    return
  }
  
  try {
    await $fetch(`/api/notificacoes/${id}/excluir`, {
      method: 'DELETE'
    })
    
    // Remover da lista local
    const index = todasNotificacoes.value.findIndex((n: any) => n.id === id)
    if (index > -1) {
      todasNotificacoes.value.splice(index, 1)
    }
    
    // Reaplicar filtros
    aplicarFiltros()
    
  } catch (error) {
    console.error('Erro ao excluir notificação:', error)
    alert('Erro ao excluir notificação. Tente novamente.')
  }
}

const excluirTodasLidas = async () => {
  const lidas = todasNotificacoes.value.filter((n: any) => n.lida)
  
  if (lidas.length === 0) {
    alert('Não há notificações lidas para excluir.')
    return
  }
  
  if (!confirm(`Tem certeza que deseja excluir ${lidas.length} notificação(ões) lida(s)?`)) {
    return
  }
  
  try {
    pending.value = true
    
    // Excluir todas as lidas
    await Promise.all(
      lidas.map((notificacao: any) => 
        $fetch(`/api/notificacoes/${notificacao.id}/excluir`, {
          method: 'DELETE'
        })
      )
    )
    
    // Remover da lista local
    todasNotificacoes.value = todasNotificacoes.value.filter((n: any) => !n.lida)
    
    // Reaplicar filtros
    aplicarFiltros()
    
  } catch (error) {
    console.error('Erro ao excluir notificações:', error)
    alert('Erro ao excluir notificações. Tente novamente.')
  } finally {
    pending.value = false
  }
}

const navegarPara = (url: string) => {
  closeModal()
  navigateTo(url)
}

const closeModal = () => {
  emit('close')
}

// Funções auxiliares
const getNotificationIcon = (tipo: string) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '🚨',
    sistema: '⚙️',
    login: '🔐',
    alteracao_dados: '✏️',
    novo_funcionario: '👤',
    geracao_holerites: '💰',
    envio_email: '📧',
    login_falhado: '🚨',
    erro_sistema: '💥',
    visualizacao_holerite: '👁️',
    download_holerite: '📥'
  }
  return icons[tipo as keyof typeof icons] || 'ℹ️'
}

const getNotificationStyle = (tipo: string) => {
  const styles = {
    info: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    success: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
    error: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    sistema: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' },
    login: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    alteracao_dados: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
    novo_funcionario: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    geracao_holerites: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    envio_email: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    login_falhado: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    erro_sistema: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    visualizacao_holerite: { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' },
    download_holerite: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' }
  }
  return styles[tipo as keyof typeof styles] || styles.info
}

const formatarDataCompleta = (data: string) => {
  const dataObj = new Date(data)
  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatarOrigem = (origem: string) => {
  const origens = {
    login: 'Login',
    alteracao_dados: 'Alteração de Dados',
    novo_funcionario: 'Novo Funcionário',
    geracao_holerites: 'Geração de Holerites',
    envio_email: 'Envio de Email',
    login_falhado: 'Login Falhado',
    erro_sistema: 'Erro do Sistema',
    sistema: 'Sistema',
    visualizacao_holerite: 'Visualização de Holerite',
    download_holerite: 'Download de Holerite'
  }
  return origens[origem as keyof typeof origens] || origem
}

// Fechar modal com ESC
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEsc)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>