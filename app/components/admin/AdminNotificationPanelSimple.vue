<template>
  <div class="space-y-1">
    <!-- Loading State -->
    <div v-if="pending" class="p-4 text-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-sm text-gray-500 mt-2">Carregando notificações...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!notificacoes || notificacoes.length === 0" class="p-8 text-center">
      <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <span class="text-gray-400 text-lg">🔔</span>
      </div>
      <p class="text-sm text-gray-500">Nenhuma notificação no momento</p>
    </div>

    <!-- Notificações -->
    <div v-else>
      <div 
        v-for="notificacao in notificacoes" 
        :key="notificacao.id"
        class="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
        :class="{ 'bg-blue-50': !notificacao.lida }"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
               :class="getNotificationStyle(notificacao.tipo).bg">
            <span :class="getNotificationStyle(notificacao.tipo).text" class="text-sm">
              {{ getNotificationIcon(notificacao.tipo) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ notificacao.titulo }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ notificacao.mensagem }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatarTempo(notificacao.created_at) }}</p>
          </div>
          <div v-if="!notificacao.lida" 
               class="w-2 h-2 rounded-full flex-shrink-0"
               :class="getNotificationStyle(notificacao.tipo).dot">
          </div>
        </div>
      </div>

      <!-- Botão Ver Todas -->
      <div class="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <button 
          @click="refresh()"
          class="w-full text-sm text-gray-600 hover:text-gray-700 font-medium mb-2"
        >
          🔄 Atualizar Notificações
        </button>
        <button 
          @click="verTodasNotificacoes"
          class="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver todas as notificações
        </button>
      </div>
    </div>
    
    <!-- Modal de Todas as Notificações -->
    <AdminNotificationModal 
      :is-open="showModal" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup lang="ts">
// Buscar notificações reais da API
const { data: response, pending, refresh } = await useLazyFetch('/api/notificacoes', {
  query: { limite: 5, admin: true },
  default: () => ({ notificacoes: [], success: false }),
  server: false, // Forçar execução no cliente
  key: 'admin-notifications' // Chave única para cache
})

const notificacoes = computed(() => {
  return response.value?.success ? response.value.notificacoes : []
})

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
    erro_sistema: '💥'
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
    erro_sistema: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' }
  }
  return styles[tipo as keyof typeof styles] || styles.info
}

const formatarTempo = (data: string) => {
  const agora = new Date()
  const dataNotificacao = new Date(data)
  const diffMs = agora.getTime() - dataNotificacao.getTime()
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDias = Math.floor(diffHoras / 24)
  
  if (diffDias > 0) {
    return `Há ${diffDias} dia${diffDias > 1 ? 's' : ''}`
  } else if (diffHoras > 0) {
    return `Há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
  } else {
    return 'Agora mesmo'
  }
}

const verTodasNotificacoes = () => {
  // Abrir modal de notificações
  showModal.value = true
}

// Estado do modal
const showModal = ref(false)

const closeModal = () => {
  showModal.value = false
}

// Auto-refresh a cada 30 segundos
onMounted(() => {
  const interval = setInterval(() => {
    refresh()
  }, 30000) // 30 segundos
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>