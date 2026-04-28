<template>
  <aside class="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
      <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </div>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-gray-800">Sistema RH</h1>
        <p class="text-sm text-gray-500">Gestão de Pessoas</p>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <LayoutNavLink to="/dashboard" icon="home">Início</LayoutNavLink>
      <LayoutNavLink v-if="!isAdmin" to="/holerites" icon="document">Meus Holerites</LayoutNavLink>
      <LayoutNavLink to="/meus-dados" icon="user">Meus Dados</LayoutNavLink>
      <LayoutNavLink v-if="!isAdmin" to="/arquivos" icon="document">Arquivos</LayoutNavLink>
      <LayoutNavLink v-if="!isAdmin" to="/codigo-etica" icon="document">Código de Ética</LayoutNavLink>

      <template v-if="isAdmin">
        <div class="pt-4 mt-4 border-t border-gray-200">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Administração
          </p>
        </div>
        
        <!-- Botão de Notificações (Desktop) -->
        <UiNotificationBadge 
          :count="unreadCount" 
          :pulse="hasUnreadNotifications"
          size="md"
          color="red"
        >
          <button 
            @click.stop="toggleNotifications"
            class="w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors relative"
            :class="[
              showNotifications 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :aria-label="notificationAriaLabel"
            :aria-expanded="showNotifications"
            aria-haspopup="true"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span>Notificações</span>
          </button>
        </UiNotificationBadge>
        
        <LayoutNavLink to="/admin/funcionarios" icon="users">Funcionários</LayoutNavLink>
        <LayoutNavLink to="/admin/empresas" icon="office">Empresas</LayoutNavLink>
        <LayoutNavLink to="/admin/departamentos" icon="building">Departamentos</LayoutNavLink>
        <LayoutNavLink to="/admin/cargos" icon="briefcase">Cargos</LayoutNavLink>
        <LayoutNavLink to="/admin/holerites" icon="money">Holerites</LayoutNavLink>
        <LayoutNavLink to="/admin/avisos" icon="megaphone">Avisos</LayoutNavLink>
        <LayoutNavLink to="/admin/documentos" icon="document">Documentos</LayoutNavLink>
        <LayoutNavLink to="/admin/codigo-etica" icon="document">Código de Ética</LayoutNavLink>
      </template>
    </nav>

    <!-- Painel de Notificações (Desktop) - REMOVIDO -->
    <!-- Agora usa o NotificationsDrawer com Teleport -->

    <!-- Overlay para fechar notificações ao clicar fora - REMOVIDO -->
    <!-- Gerenciado pelo NotificationsDrawer -->

    <!-- Usuário Logado -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <UiAvatar :name="user?.nome || ''" :avatar-type="user?.avatar" />
        <div class="flex-1 min-w-0">
          <p class="text-base font-semibold text-gray-800 truncate">{{ user?.nome }}</p>
          <p class="text-sm text-gray-500 truncate">{{ obterNomeCargo(user?.cargo) }}</p>
        </div>
      </div>
      <button 
        @click="logout"
        class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Sair do Sistema
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: any
  isAdmin: boolean
}>()

const emit = defineEmits<{
  logout: []
}>()

// Debug: Verificar props
console.log('🔔 [SIDEBAR] Props recebidas:', { user: props.user?.nome, isAdmin: props.isAdmin })

const { logout } = useAuth()

// Sistema de notificações
const {
  unreadCount,
  hasUnreadNotifications,
  ariaLabel: notificationAriaLabel,
  startPolling,
  stopPolling,
  refresh: refreshNotifications
} = useNotificationCount()

// Estado das notificações (compartilhado globalmente)
const showNotifications = useState('notifications-open', () => false)

const toggleNotifications = async () => {
  console.log('🔔 [SIDEBAR] === INÍCIO DO TOGGLE ===')
  console.log('🔔 [SIDEBAR] Estado ANTES:', showNotifications.value)
  console.log('🔔 [SIDEBAR] Contagem ANTES:', unreadCount.value)
  console.log('🔔 [SIDEBAR] isAdmin:', props.isAdmin)
  
  const oldValue = showNotifications.value
  showNotifications.value = !showNotifications.value
  
  console.log('🔔 [SIDEBAR] Estado DEPOIS:', showNotifications.value)
  console.log('🔔 [SIDEBAR] Mudança:', oldValue, '->', showNotifications.value)
  console.log('🔔 [SIDEBAR] Condição drawer:', showNotifications.value && props.isAdmin)
  
  // SEMPRE atualizar contagem quando abrir o painel
  if (showNotifications.value) {
    console.log('🔄 [SIDEBAR] Atualizando contagem de notificações...')
    await refreshNotifications()
    console.log('🔔 [SIDEBAR] Contagem APÓS refresh:', unreadCount.value)
  }
  
  console.log('🔔 [SIDEBAR] === FIM DO TOGGLE ===')
}

// Métodos removidos - agora gerenciados pelo layout pai

// Mapa para conversão de IDs para nomes de cargos
const cargosMap = ref<Record<string, string>>({})

// Função para obter nome do cargo
const obterNomeCargo = (id: string | number) => {
  if (!id) return 'Não informado'
  const idStr = id?.toString()
  return cargosMap.value[idStr] || 'Carregando...'
}

// Carregar mapa de cargos
const carregarCargos = async () => {
  try {
    const cargosRes: any = await $fetch('/api/cargos')
    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach((c: any) => {
        cargosMap.value[c.id.toString()] = c.nome
      })
    }
  } catch (error) {
    console.error('Erro ao carregar cargos:', error)
  }
}

// Carregar dados ao montar
onMounted(async () => {
  await carregarCargos()
  
  // Iniciar polling de notificações apenas para admins
  if (props.isAdmin) {
    console.log('🔔 [SIDEBAR] Iniciando polling para admin')
    startPolling()
  } else {
    console.log('🔔 [SIDEBAR] Usuário não é admin, não iniciando polling')
  }
})

// Watcher para debug - rastrear mudanças externas
watch(() => showNotifications.value, (newValue, oldValue) => {
  console.log('🔔 [SIDEBAR] WATCHER: showNotifications mudou:', oldValue, '->', newValue)
  console.log('🔔 [SIDEBAR] WATCHER: isAdmin:', props.isAdmin)
  console.log('🔔 [SIDEBAR] WATCHER: Condição drawer:', newValue && props.isAdmin)
  
  // Stack trace para ver quem está mudando o valor
  console.trace('🔔 [SIDEBAR] WATCHER: Stack trace da mudança')
})

// Watcher para monitorar mudanças na contagem de notificações
watch(() => unreadCount.value, (newValue, oldValue) => {
  console.log('🔔 [SIDEBAR] WATCHER: unreadCount mudou:', oldValue, '->', newValue)
  console.log('🔔 [SIDEBAR] WATCHER: hasUnreadNotifications:', hasUnreadNotifications.value)
})

// Parar polling ao desmontar
onUnmounted(() => {
  stopPolling()
})
</script>
