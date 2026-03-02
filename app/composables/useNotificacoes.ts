export const useNotificacoes = () => {
  // Estado global das notificações
  const notificacoes = ref<any[]>([])
  const totalNaoLidas = ref(0)
  const loading = ref(false)

  // Carregar notificações
  const carregarNotificacoes = async (filtros: any = {}) => {
    loading.value = true
    try {
      const params = {
        limite: filtros.limite || 50,
        apenas_nao_lidas: filtros.apenas_nao_lidas || false,
        tipo: filtros.tipo || '',
        origem: filtros.origem || ''
      }

      const data = await $fetch('/api/notificacoes', { params })
      
      notificacoes.value = data.notificacoes || []
      totalNaoLidas.value = data.total_nao_lidas || 0
      
      return data
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Criar nova notificação
  const criarNotificacao = async (dados: {
    titulo: string
    mensagem: string
    tipo?: string
    origem?: string
    dados?: any
    importante?: boolean
    acao_url?: string
    data_expiracao?: string
  }) => {
    try {
      const resultado = await $fetch('/api/notificacoes/criar', {
        method: 'POST',
        body: dados
      })
      
      // Recarregar notificações
      await carregarNotificacoes()
      
      return resultado
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      throw error
    }
  }

  // Marcar como lida
  const marcarComoLida = async (id: string) => {
    try {
      await $fetch(`/api/notificacoes/${id}/marcar-lida`, {
        method: 'PATCH'
      })
      
      // Atualizar localmente
      const notificacao = notificacoes.value.find(n => n.id === id)
      if (notificacao && !notificacao.lida) {
        notificacao.lida = true
        totalNaoLidas.value = Math.max(0, totalNaoLidas.value - 1)
      }
      
      return true
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      throw error
    }
  }

  // Verificar aniversariantes
  const verificarAniversariantes = async () => {
    try {
      const resultado = await $fetch('/api/notificacoes/verificar-aniversariantes', {
        method: 'POST'
      })
      
      // Recarregar notificações se houver aniversariantes
      if (resultado.aniversariantes?.length > 0) {
        await carregarNotificacoes()
      }
      
      return resultado
    } catch (error) {
      console.error('Erro ao verificar aniversariantes:', error)
      throw error
    }
  }

  // Utilitários
  const getIconePorTipo = (tipo: string): string => {
    const icones: Record<string, string> = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'aniversario': '🎂',
      'holerite': '📄',
      'sistema': '⚙️'
    }
    return icones[tipo] || 'ℹ️'
  }

  const getCorPorTipo = (tipo: string): string => {
    const cores: Record<string, string> = {
      'info': 'blue',
      'success': 'green',
      'warning': 'yellow',
      'error': 'red',
      'aniversario': 'purple',
      'holerite': 'indigo',
      'sistema': 'gray'
    }
    return cores[tipo] || 'blue'
  }

  const formatarDataRelativa = (data: string): string => {
    const agora = new Date()
    const dataNotificacao = new Date(data)
    const diffMs = agora.getTime() - dataNotificacao.getTime()
    const diffMinutos = Math.floor(diffMs / (1000 * 60))
    const diffHoras = Math.floor(diffMinutos / 60)
    const diffDias = Math.floor(diffHoras / 24)
    
    if (diffMinutos < 1) return 'Agora'
    if (diffMinutos < 60) return `${diffMinutos}min`
    if (diffHoras < 24) return `${diffHoras}h`
    if (diffDias < 7) return `${diffDias}d`
    
    return dataNotificacao.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  // Notificações pré-definidas
  const criarNotificacaoAniversario = async (funcionario: any) => {
    const idade = new Date().getFullYear() - new Date(funcionario.data_nascimento).getFullYear()
    
    return await criarNotificacao({
      titulo: '🎂 Aniversariante do Dia',
      mensagem: `${funcionario.nome_completo} faz aniversário hoje! ${idade > 0 ? `Completando ${idade} anos.` : 'Deseje parabéns!'}`,
      tipo: 'aniversario',
      origem: 'aniversarios',
      importante: true,
      dados: {
        funcionario_id: funcionario.id,
        funcionario_nome: funcionario.nome_completo,
        idade: idade
      },
      data_expiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
    })
  }

  const criarNotificacaoHolerite = async (tipo: 'gerado' | 'disponibilizado', quantidade: number) => {
    const titulo = tipo === 'gerado' ? '📄 Holerites Gerados' : '✅ Holerites Disponibilizados'
    const mensagem = tipo === 'gerado' 
      ? `${quantidade} holerite(s) foram gerados e estão prontos para revisão.`
      : `${quantidade} holerite(s) foram disponibilizados no perfil dos funcionários.`
    
    return await criarNotificacao({
      titulo,
      mensagem,
      tipo: tipo === 'gerado' ? 'info' : 'success',
      origem: 'holerites',
      importante: false,
      acao_url: '/admin/holerites',
      dados: {
        quantidade,
        tipo_operacao: tipo
      }
    })
  }

  const criarNotificacaoSistema = async (titulo: string, mensagem: string, importante = false) => {
    return await criarNotificacao({
      titulo: `⚙️ ${titulo}`,
      mensagem,
      tipo: importante ? 'warning' : 'info',
      origem: 'sistema',
      importante
    })
  }

  return {
    // Estado
    notificacoes: readonly(notificacoes),
    totalNaoLidas: readonly(totalNaoLidas),
    loading: readonly(loading),
    
    // Funções principais
    carregarNotificacoes,
    criarNotificacao,
    marcarComoLida,
    verificarAniversariantes,
    
    // Utilitários
    getIconePorTipo,
    getCorPorTipo,
    formatarDataRelativa,
    
    // Notificações pré-definidas
    criarNotificacaoAniversario,
    criarNotificacaoHolerite,
    criarNotificacaoSistema
  }
}