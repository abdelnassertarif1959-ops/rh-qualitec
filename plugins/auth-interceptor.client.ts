/**
 * Plugin para interceptar requisições e adicionar token JWT
 * Também renova tokens automaticamente quando necessário
 */

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Interceptar requisições $fetch
  globalThis.$fetch = $fetch.create({
    async onRequest({ options }) {
      // Obter token do cookie
      const accessToken = useCookie('accessToken').value
      
      if (accessToken) {
        // Adicionar token ao header Authorization
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
      }
    },
    
    async onResponseError({ response }) {
      // Se receber 401, tentar renovar token
      if (response.status === 401) {
        const refreshToken = useCookie('refreshToken').value
        
        if (refreshToken) {
          try {
            // Tentar renovar token
            const result = await $fetch('/api/auth/refresh', {
              method: 'POST',
              body: { refreshToken }
            })
            
            if (result.success && result.tokens) {
              // Atualizar cookies
              useCookie('accessToken').value = result.tokens.accessToken
              useCookie('refreshToken').value = result.tokens.refreshToken
              
              console.log('🔄 Token renovado automaticamente')
              
              // Recarregar página para aplicar novo token
              window.location.reload()
            }
          } catch (error) {
            console.error('Erro ao renovar token:', error)
            
            // Limpar tokens e redirecionar para login
            useCookie('accessToken').value = null
            useCookie('refreshToken').value = null
            
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          }
        } else {
          // Sem refresh token, redirecionar para login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      }
    }
  })
  
  console.log('🔐 [AUTH-INTERCEPTOR] Plugin de autenticação JWT carregado')
})
