// Gerenciamento de datas, feriados e dias úteis para holerites
export const useHoleritesData = () => {
  // Função para verificar se uma data é feriado
  const isFeriado = (data: Date): boolean => {
    const feriados = [
      // Feriados fixos
      '01-01', // Ano Novo
      '04-21', // Tiradentes
      '05-01', // Dia do Trabalhador
      '09-07', // Independência do Brasil
      '10-12', // Nossa Senhora Aparecida
      '11-02', // Finados
      '11-15', // Proclamação da República
      '12-25', // Natal
      
      // Adicione outros feriados fixos conforme necessário
    ]
    
    const meseDia = data.toISOString().slice(5, 10)
    return feriados.includes(meseDia)
  }

  // Função para verificar se é fim de semana
  const isFimDeSemana = (data: Date): boolean => {
    const diaSemana = data.getDay()
    return diaSemana === 0 || diaSemana === 6 // Domingo ou Sábado
  }

  // Função para verificar se é dia útil
  const isDiaUtil = (data: Date): boolean => {
    return !isFimDeSemana(data) && !isFeriado(data)
  }

  // Função para encontrar o último dia útil anterior a uma data
  const obterUltimoDiaUtil = (data: Date): Date => {
    const novaData = new Date(data)
    
    // Volta um dia até encontrar um dia útil
    while (!isDiaUtil(novaData)) {
      novaData.setDate(novaData.getDate() - 1)
    }
    
    return novaData
  }

  // Função para calcular a data de disponibilização do holerite do dia 20
  const calcularDataDisponibilizacaoHolerite20 = (ano: number, mes: number): Date => {
    // Data do dia 20 do mês
    const dia20 = new Date(ano, mes - 1, 20)
    
    // Se o dia 20 cair em dia útil, disponibiliza 2 dias antes
    if (isDiaUtil(dia20)) {
      const dataDisponibilizacao = new Date(dia20)
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2)
      
      // Se 2 dias antes não for dia útil, encontra o último dia útil anterior
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao)
      }
      
      return dataDisponibilizacao
    } else {
      // Se o dia 20 não for dia útil, encontra o último dia útil anterior
      const ultimoDiaUtil = obterUltimoDiaUtil(dia20)
      
      // Disponibiliza 2 dias antes do último dia útil
      const dataDisponibilizacao = new Date(ultimoDiaUtil)
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2)
      
      // Se 2 dias antes não for dia útil, encontra o último dia útil anterior
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao)
      }
      
      return dataDisponibilizacao
    }
  }

  // Função para verificar se o holerite do dia 20 deve estar disponível hoje
  const deveEstarDisponivelHolerite20 = (ano: number, mes: number): boolean => {
    const hoje = new Date()
    const dataDisponibilizacao = calcularDataDisponibilizacaoHolerite20(ano, mes)
    
    return hoje >= dataDisponibilizacao
  }

  // Função para calcular próximas datas de disponibilização
  const calcularProximasDisponibilizacoes = (): Array<{
    tipo: 'inicio_mes' | 'dia_20'
    mes: number
    ano: number
    dataDisponibilizacao: Date
    descricao: string
  }> => {
    const hoje = new Date()
    const proximasDisponibilizacoes = []
    
    // Calcular para os próximos 6 meses
    for (let i = 0; i < 6; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1)
      const ano = data.getFullYear()
      const mes = data.getMonth() + 1
      
      // Holerite do início do mês (manual)
      proximasDisponibilizacoes.push({
        tipo: 'inicio_mes' as const,
        mes,
        ano,
        dataDisponibilizacao: new Date(ano, mes - 1, 1), // Placeholder - será manual
        descricao: `Holerite ${mes.toString().padStart(2, '0')}/${ano} - 1ª Quinzena (Manual)`
      })
      
      // Holerite do dia 20 (automático)
      const dataHolerite20 = calcularDataDisponibilizacaoHolerite20(ano, mes)
      proximasDisponibilizacoes.push({
        tipo: 'dia_20' as const,
        mes,
        ano,
        dataDisponibilizacao: dataHolerite20,
        descricao: `Holerite ${mes.toString().padStart(2, '0')}/${ano} - 2ª Quinzena (Automático)`
      })
    }
    
    return proximasDisponibilizacoes.sort((a, b) => 
      a.dataDisponibilizacao.getTime() - b.dataDisponibilizacao.getTime()
    )
  }

  return {
    isFeriado,
    isFimDeSemana,
    isDiaUtil,
    obterUltimoDiaUtil,
    calcularDataDisponibilizacaoHolerite20,
    deveEstarDisponivelHolerite20,
    calcularProximasDisponibilizacoes
  }
}
