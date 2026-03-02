/**
 * Plugin para inicializar proteção CSRF
 * Obtém o token CSRF automaticamente quando a aplicação carrega
 */

export default defineNuxtPlugin(async () => {
  const { initCsrf } = useCsrf()

  // Inicializar CSRF apenas no cliente
  if (process.client) {
    console.log('[CSRF-PLUGIN] Inicializando proteção CSRF...')
    
    try {
      await initCsrf()
      console.log('[CSRF-PLUGIN] ✅ Proteção CSRF inicializada')
    } catch (error) {
      console.error('[CSRF-PLUGIN] ⚠️ Erro ao inicializar CSRF:', error)
    }
  }
})
