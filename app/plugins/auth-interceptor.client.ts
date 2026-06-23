/**
 * Plugin para interceptar requisições e gerenciar renovação de tokens JWT
 * Executa apenas no cliente
 */

export default defineNuxtPlugin(() => {
  if (process.server) return

  // Interceptar requisições $fetch
  globalThis.$fetch = $fetch.create({
    async onRequest({ options }) {
      // Como os tokens estão em cookies httpOnly, o navegador os envia automaticamente
      // para requisições no mesmo domínio. Não precisamos ler do JS nem adicionar
      // o header Authorization manualmente se a chamada for para o mesmo domínio.
      
      // Caso queira garantir o envio de cookies em requisições de API,
      // configuramos credentials como 'include' por padrão.
      options.credentials = options.credentials || 'include'
    },
    
    async onResponseError({ request, response, options }) {
      const isAuthRoute = request.toString().includes('/api/auth/')
      
      // Se receber 401 e não for rota de autenticação, tentar renovar token
      if (response.status === 401 && !isAuthRoute) {
        try {
          console.log('🔄 [AUTH-INTERCEPTOR] Token expirado (401). Tentando renovar...')
          
          // O navegador enviará o cookie httpOnly refreshToken automaticamente
          const result = await $fetch('/api/auth/refresh', {
            method: 'POST'
          })
          
          if (result && result.success) {
            console.log('🔄 [AUTH-INTERCEPTOR] Token renovado com sucesso. Recarregando página...')
            // Recarregar a página para aplicar os novos cookies
            window.location.reload()
          } else {
            throw new Error('Falha ao renovar token')
          }
        } catch (error) {
          console.error('❌ [AUTH-INTERCEPTOR] Erro ao renovar token:', error)
          
          // Redirecionar para login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      }
    }
  })
  
  console.log('🔐 [AUTH-INTERCEPTOR] Plugin de interceptação de requisições carregado')
})
