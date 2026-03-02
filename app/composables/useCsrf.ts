/**
 * Composable para gerenciar proteção CSRF
 * Obtém e gerencia o token CSRF para requisições
 */

export const useCsrf = () => {
  const csrfToken = useState<string | null>('csrf-token', () => null)
  const isLoading = useState<boolean>('csrf-loading', () => false)

  /**
   * Obter token CSRF do servidor
   */
  const fetchCsrfToken = async (): Promise<string | null> => {
    if (isLoading.value) {
      console.log('[CSRF] Já está carregando token, aguardando...')
      return csrfToken.value
    }

    try {
      isLoading.value = true
      console.log('[CSRF] Obtendo token CSRF do servidor...')

      const response = await $fetch<{ success: boolean; csrfToken: string }>('/api/csrf-token', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.success && response.csrfToken) {
        csrfToken.value = response.csrfToken
        console.log('[CSRF] ✅ Token CSRF obtido com sucesso')
        return response.csrfToken
      }

      console.error('[CSRF] Resposta inválida do servidor')
      return null

    } catch (error) {
      console.error('[CSRF] 💥 Erro ao obter token:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obter token CSRF (busca se necessário)
   */
  const getCsrfToken = async (): Promise<string | null> => {
    if (csrfToken.value) {
      return csrfToken.value
    }

    return await fetchCsrfToken()
  }

  /**
   * Adicionar token CSRF aos headers de uma requisição
   */
  const addCsrfHeader = async (headers: Record<string, string> = {}): Promise<Record<string, string>> => {
    const token = await getCsrfToken()

    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token
      }
    }

    return headers
  }

  /**
   * Fazer requisição com proteção CSRF
   */
  const fetchWithCsrf = async <T = any>(url: string, options: any = {}): Promise<T> => {
    const method = options.method?.toUpperCase() || 'GET'
    
    // Apenas adicionar CSRF para métodos que modificam dados
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const token = await getCsrfToken()
      
      if (!token) {
        throw new Error('Token CSRF não disponível')
      }

      options.headers = {
        ...options.headers,
        'X-CSRF-Token': token
      }
    }

    return $fetch<T>(url, {
      ...options,
      credentials: 'include'
    })
  }

  /**
   * Limpar token CSRF (útil no logout)
   */
  const clearCsrfToken = () => {
    csrfToken.value = null
    console.log('[CSRF] Token CSRF limpo')
  }

  /**
   * Inicializar CSRF (obter token na montagem)
   */
  const initCsrf = async () => {
    if (!csrfToken.value) {
      await fetchCsrfToken()
    }
  }

  return {
    csrfToken: readonly(csrfToken),
    isLoading: readonly(isLoading),
    fetchCsrfToken,
    getCsrfToken,
    addCsrfHeader,
    fetchWithCsrf,
    clearCsrfToken,
    initCsrf
  }
}
