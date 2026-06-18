// Tratamento de erros de consulta CNPJ
export const useCNPJErrors = () => {
  // Tratar erros da API
  const handleCNPJError = (err: any): string => {
    console.error('❌ Erro na consulta CNPJ:', err)
    
    // Tratar diferentes tipos de erro
    if (err.statusCode === 404) {
      return 'CNPJ não encontrado na Receita Federal'
    }
    
    if (err.statusCode === 400) {
      return err.data?.message || err.message || 'CNPJ inválido'
    }
    
    if (err.statusCode === 429) {
      return 'Muitas consultas realizadas. Aguarde alguns minutos e tente novamente.'
    }
    
    if (err.statusCode === 503) {
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
    }
    
    if (err.name === 'FetchError') {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    
    return err.data?.message || err.message || 'Erro interno do servidor'
  }

  // Verificar se erro é recuperável
  const isRecoverableError = (statusCode: number): boolean => {
    return statusCode === 429 || statusCode === 503
  }

  // Obter tempo de espera sugerido
  const getRetryDelay = (statusCode: number): number => {
    if (statusCode === 429) return 60000 // 1 minuto
    if (statusCode === 503) return 30000 // 30 segundos
    return 5000 // 5 segundos padrão
  }

  return {
    handleCNPJError,
    isRecoverableError,
    getRetryDelay
  }
}
