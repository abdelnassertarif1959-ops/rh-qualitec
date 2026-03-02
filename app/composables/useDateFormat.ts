/**
 * Composable para formatação de datas
 * Centraliza todas as funções de formatação de data do sistema
 */

export const useDateFormat = () => {
  /**
   * Formatar data no formato brasileiro com hora
   * Exemplo: 12/02/2026, 09:30
   */
  const formatarData = (data: string | Date) => {
    if (!data) return ''
    
    const dataObj = typeof data === 'string' ? new Date(data) : data
    
    return dataObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formatar apenas a data (sem hora)
   * Exemplo: 12/02/2026
   */
  const formatarDataSimples = (data: string | Date) => {
    if (!data) return ''
    
    const dataObj = typeof data === 'string' ? new Date(data) : data
    
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  /**
   * Formatar apenas a hora
   * Exemplo: 09:30
   */
  const formatarHora = (data: string | Date) => {
    if (!data) return ''
    
    const dataObj = typeof data === 'string' ? new Date(data) : data
    
    return dataObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formatar data por extenso
   * Exemplo: 12 de fevereiro de 2026
   */
  const formatarDataExtenso = (data: string | Date) => {
    if (!data) return ''
    
    const dataObj = typeof data === 'string' ? new Date(data) : data
    
    return dataObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  /**
   * Formatar período (data início - data fim)
   * Exemplo: 01/02/2026 - 28/02/2026
   */
  const formatarPeriodo = (dataInicio: string | Date, dataFim: string | Date) => {
    if (!dataInicio || !dataFim) return ''
    
    return `${formatarDataSimples(dataInicio)} - ${formatarDataSimples(dataFim)}`
  }

  /**
   * Formatar data relativa (há X dias, há X horas, etc)
   * Exemplo: há 2 horas, há 3 dias
   */
  const formatarDataRelativa = (data: string | Date) => {
    if (!data) return ''
    
    const dataObj = typeof data === 'string' ? new Date(data) : data
    const agora = new Date()
    const diff = agora.getTime() - dataObj.getTime()
    
    const segundos = Math.floor(diff / 1000)
    const minutos = Math.floor(segundos / 60)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)
    
    if (segundos < 60) return 'agora mesmo'
    if (minutos < 60) return `há ${minutos} minuto${minutos !== 1 ? 's' : ''}`
    if (horas < 24) return `há ${horas} hora${horas !== 1 ? 's' : ''}`
    if (dias < 7) return `há ${dias} dia${dias !== 1 ? 's' : ''}`
    
    return formatarDataSimples(dataObj)
  }

  return {
    formatarData,
    formatarDataSimples,
    formatarHora,
    formatarDataExtenso,
    formatarPeriodo,
    formatarDataRelativa
  }
}
