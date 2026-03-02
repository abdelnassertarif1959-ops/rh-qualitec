// Composable para holerites - Core (Tipo de Holerite)
export const useHolerites = () => {
  // Função para determinar se um holerite é adiantamento
  const isAdiantamento = (holerite: any): boolean => {
    // Verifica se é quinzena 1 ou se o período vai do dia 15 ao último dia do mês
    if (holerite.quinzena === 1) return true
    
    if (holerite.periodo_inicio && holerite.periodo_fim) {
      const inicio = new Date(holerite.periodo_inicio)
      const fim = new Date(holerite.periodo_fim)
      // Adiantamento: período do dia 15 ao último dia do mês
      return inicio.getDate() === 15 && fim.getDate() >= 28
    }
    
    // Verifica pelo tipo ou referência
    return holerite.tipo?.toLowerCase().includes('adiantamento') ||
           holerite.referencia?.toLowerCase().includes('adiantamento')
  }

  // Função para obter o tipo do holerite
  const getTipoHolerite = (holerite: any): 'adiantamento' | 'folha_mensal' => {
    return isAdiantamento(holerite) ? 'adiantamento' : 'folha_mensal'
  }

  // Função para obter label do tipo
  const getTipoLabel = (holerite: any): string => {
    return isAdiantamento(holerite) ? '💰 Adiantamento' : '📊 Folha Mensal'
  }

  // Função para formatar período de referência
  // REGRA: Holerites mensais mostram o mês ANTERIOR completo
  // Exemplo: Holerite gerado em 09/02/2026 mostra "01/01/2026 - 31/01/2026" ou "Janeiro de 2026"
  const formatarPeriodoReferencia = (
    periodoInicio: string, 
    periodoFim: string, 
    formato: 'completo' | 'mes' = 'mes'
  ): string => {
    try {
      // Adicionar 'T00:00:00' para evitar problemas de timezone
      const dataInicio = new Date(periodoInicio + 'T00:00:00')
      const dataFim = new Date(periodoFim + 'T00:00:00')
      
      // Verificar se é adiantamento (período do dia 15 ao último dia do mês)
      const diaInicio = dataInicio.getDate()
      const isAdiantamentoTemp = diaInicio === 15
      
      if (isAdiantamentoTemp) {
        // Para adiantamentos, sempre mostrar o período completo
        const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR')
        const dataFimFormatada = dataFim.toLocaleDateString('pt-BR')
        return `${dataInicioFormatada} - ${dataFimFormatada}`
      } else {
        // Para folha mensal, mostrar o mês ANTERIOR
        const mesAnterior = new Date(dataInicio)
        mesAnterior.setMonth(mesAnterior.getMonth() - 1)
        
        if (formato === 'completo') {
          // Formato completo: "01/01/2026 - 31/01/2026"
          const primeiroDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1)
          const ultimoDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0)
          
          const primeiroDiaFormatado = primeiroDia.toLocaleDateString('pt-BR')
          const ultimoDiaFormatado = ultimoDia.toLocaleDateString('pt-BR')
          
          return `${primeiroDiaFormatado} - ${ultimoDiaFormatado}`
        } else {
          // Formato mês: "Janeiro de 2026"
          const mesNome = mesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          return mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
        }
      }
    } catch (error) {
      return 'Período inválido'
    }
  }

  return {
    isAdiantamento,
    getTipoHolerite,
    getTipoLabel,
    formatarPeriodoReferencia
  }
}