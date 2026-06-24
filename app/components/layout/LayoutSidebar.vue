<template>
  <aside class="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
      <svg class="w-12 h-12 rounded-xl shadow-sm flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="url(#sidebar-logo-grad)"/>
        <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
        <circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
        <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
        <circle cx="10" cy="16" r="3" fill="#1e40af"/>
        <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
        <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
        <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
        <circle cx="28" cy="8" r="2" fill="#10b981"/>
        <defs>
          <linearGradient id="sidebar-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-gray-800">Sistema RH</h1>
        <p class="text-sm text-gray-500">Gestão de Pessoas</p>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <LayoutNavLink to="/dashboard" icon="home">Início</LayoutNavLink>
      <LayoutNavLink v-if="!isAdmin" to="/holerites" icon="document">Meus Holerites</LayoutNavLink>
      <LayoutNavLink v-if="!isAdmin" to="/ferias" icon="calendar">Férias</LayoutNavLink>
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
        <LayoutNavLink to="/admin/ferias" icon="calendar">Férias</LayoutNavLink>
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
