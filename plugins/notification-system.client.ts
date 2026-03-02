/**
 * Plugin para inicializar o sistema de notificações
 * Executa apenas no cliente para evitar problemas de SSR
 */

export default defineNuxtPlugin(() => {
  // Só executar no cliente
  if (process.server) return

  console.log('🔌 [PLUGIN] Inicializando sistema de notificações...')

  // Inicializar o composable globalmente
  const { startPolling, stopPolling } = useNotificationCount()

  // Gerenciar polling baseado na visibilidade da página
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('👁️ [PLUGIN] Página oculta, pausando polling')
      stopPolling()
    } else {
      console.log('👁️ [PLUGIN] Página visível, retomando polling')
      startPolling()
    }
  }

  // Listeners para otimizar performance
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Cleanup quando a aplicação for destruída
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    stopPolling()
  })

  // Iniciar polling imediatamente
  startPolling()

  console.log('✅ [PLUGIN] Sistema de notificações inicializado')
})