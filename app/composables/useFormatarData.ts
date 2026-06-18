export const useFormatarData = () => {
  const formatarData = (data: string) => {
    if (!data) return 'Data não disponível'
    
    try {
      const date = new Date(data)
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }
      
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      })
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return 'Data inválida'
    }
  }

  const formatarDataRelativa = (data: string) => {
    if (!data) return 'Data não disponível'
    
    try {
      const date = new Date(data)
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }
      
      const agora = new Date()
      const diff = agora.getTime() - date.getTime()
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (dias === 0) return 'Hoje'
      if (dias === 1) return 'Ontem'
      if (dias < 7) return `${dias} dias atrás`
      
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short',
        timeZone: 'America/Sao_Paulo'
      })
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return 'Data inválida'
    }
  }

  const formatarDataComentario = (data: string) => {
    if (!data) return 'Data não disponível'
    
    try {
      const date = new Date(data)
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }
      
      const agora = new Date()
      const diff = agora.getTime() - date.getTime()
      const minutos = Math.floor(diff / (1000 * 60))
      const horas = Math.floor(diff / (1000 * 60 * 60))
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutos < 1) return 'Agora'
      if (minutos < 60) return `${minutos}min atrás`
      if (horas < 24) return `${horas}h atrás`
      if (dias === 1) return 'Ontem'
      if (dias < 7) return `${dias} dias atrás`
      
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short',
        timeZone: 'America/Sao_Paulo'
      })
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return 'Data inválida'
    }
  }

  return {
    formatarData,
    formatarDataRelativa,
    formatarDataComentario
  }
}
