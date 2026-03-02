<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 text-sm">🔔</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Notificações</h3>
          <p class="text-xs text-gray-600">
            {{ totalNaoLidas > 0 ? `${totalNaoLidas} não lida(s)` : 'Tudo em dia' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Badge de não lidas -->
        <span 
          v-if="totalNaoLidas > 0"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
        >
          {{ totalNaoLidas }}
        </span>
        
        <!-- Botão de atualizar -->
        <UiButton 
          variant="ghost" 
          size="sm"
          @click="carregarNotificacoes"
          :disabled="loading"
        >
          <span v-if="loading">🔄</span>
          <span v-else>↻</span>
        </UiButton>
        
        <!-- Botão de verificar aniversariantes -->
        <UiButton 
          variant="ghost" 
          size="sm"
          @click="verificarAniversariantes"
          :disabled="loading"
          title="Verificar aniversariantes de hoje"
        >
          🎂
        </UiButton>
      </div>
    </div>

    <!-- Lista de Notificações -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="loading && notificacoes.length === 0" class="p-4 text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600">Carregando notificações...</p>
      </div>
      
      <div v-else-if="notificacoes.length === 0" class="p-6 text-center">
        <div class="text-4xl mb-2">📭</div>
        <p class="text-gray-600 font-medium">Nenhuma notificação</p>
        <p class="text-sm text-gray-500">Você está em dia com tudo!</p>
      </div>
      
      <div v-else class="divide-y divide-gray-100">
        <div 
          v-for="notificacao in notificacoes" 
          :key="notificacao.id"
          :class="[
            'group p-4 hover:bg-gray-50 transition-colors cursor-pointer',
            !notificacao.lida ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          ]"
          @click="marcarComoLida(notificacao)"
        >
          <div class="flex items-start gap-3">
            <!-- Ícone por tipo -->
            <div class="flex-shrink-0 mt-1">
              <span class="text-lg">{{ getIconePorTipo(notificacao.tipo) }}</span>
            </div>
            
            <!-- Conteúdo -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 :class="[
                    'text-sm font-medium',
                    !notificacao.lida ? 'text-gray-900' : 'text-gray-700'
                  ]">
                    {{ notificacao.titulo }}
                  </h4>
                  <p :class="[
                    'text-sm mt-1',
                    !notificacao.lida ? 'text-gray-700' : 'text-gray-600'
                  ]">
                    {{ notificacao.mensagem }}
                  </p>
                  
                  <!-- Dados específicos para aniversários -->
                  <div v-if="notificacao.tipo === 'aniversario' && notificacao.dados" class="mt-2">
                    <div class="inline-flex items-center gap-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      🎂 {{ notificacao.dados.funcionario_nome }}
                      <span v-if="notificacao.dados.idade">({{ notificacao.dados.idade }} anos)</span>
                    </div>
                  </div>
                </div>
                
                <!-- Status, data e ações -->
                <div class="flex-shrink-0 ml-3 text-right">
                  <div class="flex items-center gap-2 mb-1">
                    <!-- Botão de excluir -->
                    <button
                      @click.stop="excluirNotificacao(notificacao)"
                      class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-800"
                      title="Excluir notificação"
                    >
                      <span class="text-xs">🗑️</span>
                    </button>
                    
                    <!-- Badge importante -->
                    <div v-if="notificacao.importante">
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ⚠️ Importante
                      </span>
                    </div>
                  </div>
                  
                  <p class="text-xs text-gray-500">
                    {{ formatarDataRelativa(notificacao.data_criacao) }}
                  </p>
                  <div v-if="!notificacao.lida" class="mt-1">
                    <div class="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
              
              <!-- Ação (se houver) -->
              <div v-if="notificacao.acao_url" class="mt-2">
                <a 
                  :href="notificacao.acao_url"
                  class="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                  @click.stop
                >
                  Ver detalhes →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer com ações -->
    <div v-if="notificacoes.length > 0" class="p-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between text-xs text-gray-600">
        <span>{{ notificacoes.length }} notificação(ões)</span>
        <div class="flex gap-2">
          <button 
            v-if="totalNaoLidas > 0"
            @click="marcarTodasComoLidas"
            class="text-blue-600 hover:text-blue-800"
          >
            Marcar todas como lidas
          </button>
          <button 
            v-if="notificacoes.some(n => n.lida)"
            @click="limparNotificacoesLidas"
            class="text-red-600 hover:text-red-800"
          >
            Limpar lidas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: string
  origem: string
  dados: any
  lida: boolean
  importante: boolean
  data_criacao: string
  acao_url?: string
}

// Estado
const notificacoes = ref<Notificacao[]>([])
const totalNaoLidas = ref(0)
const loading = ref(false)

// Carregar notificações ao montar
onMounted(() => {
  carregarNotificacoes()
  
  // Atualizar a cada 5 minutos
  setInterval(carregarNotificacoes, 5 * 60 * 1000)
})

// Funções
const carregarNotificacoes = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/notificacoes', {
      params: { limite: 20 }
    })
    
    notificacoes.value = data.notificacoes || []
    totalNaoLidas.value = data.total_nao_lidas || 0
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  } finally {
    loading.value = false
  }
}

const marcarComoLida = async (notificacao: Notificacao) => {
  if (notificacao.lida) return
  
  try {
    await $fetch(`/api/notificacoes/${notificacao.id}/marcar-lida`, {
      method: 'PATCH'
    })
    
    // Atualizar localmente
    notificacao.lida = true
    totalNaoLidas.value = Math.max(0, totalNaoLidas.value - 1)
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
  }
}

const marcarTodasComoLidas = async () => {
  const naoLidas = notificacoes.value.filter(n => !n.lida)
  
  for (const notificacao of naoLidas) {
    await marcarComoLida(notificacao)
  }
}

const verificarAniversariantes = async () => {
  loading.value = true
  try {
    const resultado = await $fetch('/api/notificacoes/verificar-aniversariantes', {
      method: 'POST'
    })
    
    console.log('Verificação de aniversariantes:', resultado)
    
    // Recarregar notificações
    await carregarNotificacoes()
    
    // Mostrar resultado
    if (resultado.aniversariantes?.length > 0) {
      // Notificação de sucesso seria mostrada aqui
      console.log(`${resultado.aniversariantes.length} aniversariante(s) encontrado(s)!`)
    }
  } catch (error) {
    console.error('Erro ao verificar aniversariantes:', error)
  } finally {
    loading.value = false
  }
}

const limparNotificacoesLidas = async () => {
  const notificacoesLidas = notificacoes.value.filter(n => n.lida)
  
  if (notificacoesLidas.length === 0) return
  
  if (!confirm(`Tem certeza que deseja excluir ${notificacoesLidas.length} notificação(ões) lida(s)?`)) {
    return
  }
  
  try {
    // Excluir todas as notificações lidas
    for (const notificacao of notificacoesLidas) {
      await $fetch(`/api/notificacoes/${notificacao.id}`, {
        method: 'DELETE'
      })
    }
    
    // Remover da lista local
    notificacoes.value = notificacoes.value.filter(n => !n.lida)
    
    console.log(`${notificacoesLidas.length} notificação(ões) lida(s) excluída(s)`)
  } catch (error) {
    console.error('Erro ao limpar notificações lidas:', error)
    alert('Erro ao limpar notificações. Tente novamente.')
  }
}

const excluirNotificacao = async (notificacao: Notificacao) => {
  if (!confirm(`Tem certeza que deseja excluir a notificação "${notificacao.titulo}"?`)) {
    return
  }
  
  try {
    await $fetch(`/api/notificacoes/${notificacao.id}`, {
      method: 'DELETE'
    })
    
    // Remover da lista local
    const index = notificacoes.value.findIndex(n => n.id === notificacao.id)
    if (index > -1) {
      notificacoes.value.splice(index, 1)
      
      // Atualizar contador se era não lida
      if (!notificacao.lida) {
        totalNaoLidas.value = Math.max(0, totalNaoLidas.value - 1)
      }
    }
    
    console.log('Notificação excluída com sucesso')
  } catch (error) {
    console.error('Erro ao excluir notificação:', error)
    alert('Erro ao excluir notificação. Tente novamente.')
  }
}

const getIconePorTipo = (tipo: string): string => {
  const icones: Record<string, string> = {
    'info': 'ℹ️',
    'success': '✅',
    'warning': '⚠️',
    'error': '❌',
    'aniversario': '🎂'
  }
  return icones[tipo] || 'ℹ️'
}

const formatarDataRelativa = (data: string): string => {
  const agora = new Date()
  const dataNotificacao = new Date(data)
  const diffMs = agora.getTime() - dataNotificacao.getTime()
  const diffMinutos = Math.floor(diffMs / (1000 * 60))
  const diffHoras = Math.floor(diffMinutos / 60)
  const diffDias = Math.floor(diffHoras / 24)
  
  if (diffMinutos < 1) return 'Agora'
  if (diffMinutos < 60) return `${diffMinutos}min`
  if (diffHoras < 24) return `${diffHoras}h`
  if (diffDias < 7) return `${diffDias}d`
  
  return dataNotificacao.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  })
}
</script>