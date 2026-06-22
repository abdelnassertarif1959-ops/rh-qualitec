/**
 * Utilitários para cálculo de datas de holerites
 * Baseado nas regras de negócio da empresa
 */

/**
 * Calcula o 5º dia útil do mês
 * Considera apenas segunda a sexta como dias úteis
 */
function calcular5oDiaUtil(ano: number, mes: number): Date {
  let diasUteis = 0
  let data = new Date(ano, mes - 1, 1) // Primeiro dia do mês
  
  while (diasUteis < 5) {
    const diaSemana = data.getDay()
    
    // Se for dia útil (segunda=1 a sexta=5)
    if (diaSemana >= 1 && diaSemana <= 5) {
      diasUteis++
    }
    
    // Se ainda não chegou no 5º dia útil, avança para o próximo dia
    if (diasUteis < 5) {
      data.setDate(data.getDate() + 1)
    }
  }
  
  return data
}

/**
 * Calcula a data de pagamento do adiantamento (dia 20 ou dia útil anterior)
 * Se o dia 20 cair em fim de semana, antecipa para o dia útil anterior
 */
function calcularDiaPagamentoAdiantamento(ano: number, mes: number): Date {
  const data = new Date(ano, mes - 1, 20) // Dia 20 do mês
  const diaSemana = data.getDay()
  
  // Se cair no sábado (6), volta para sexta (dia 19)
  if (diaSemana === 6) {
    data.setDate(19)
  }
  // Se cair no domingo (0), volta para sexta (dia 18)
  else if (diaSemana === 0) {
    data.setDate(18)
  }
  
  return data
}

/**
 * Calcula as datas corretas para geração de holerites baseado na data atual
 */
export function calcularDatasHolerite(tipo: 'adiantamento' | 'mensal') {
  const hoje = new Date()
  const diaAtual = hoje.getDate()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()
  
  if (tipo === 'adiantamento') {
    // REGRA: Adiantamento salarial é do mês vigente
    // Período: dia 1 ao último dia do mês (mesma referência que a folha mensal)
    // Data de pagamento: dia 20 do mês vigente (ou dia útil anterior se cair em fim de semana)
    
    if (diaAtual >= 15) {
      // Gerar adiantamento do mês atual (dia 1 ao último dia)
      const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
      const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
      const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)
      const dataPagamento = calcularDiaPagamentoAdiantamento(anoAtual, mesAtual)
      
      return {
        periodo_inicio: periodoInicio.toISOString().split('T')[0],
        periodo_fim: periodoFim.toISOString().split('T')[0],
        data_pagamento: dataPagamento.toISOString().split('T')[0],
        mes_referencia: `${anoAtual}-${String(mesAtual).padStart(2, '0')}`
      }
    } else {
      // Antes do dia 15, gerar adiantamento do mês anterior
      const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1
      const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual
      
      const periodoInicio = new Date(anoAnterior, mesAnterior - 1, 1)
      const ultimoDiaMes = new Date(anoAnterior, mesAnterior, 0).getDate()
      const periodoFim = new Date(anoAnterior, mesAnterior - 1, ultimoDiaMes)
      const dataPagamento = calcularDiaPagamentoAdiantamento(anoAnterior, mesAnterior)
      
      return {
        periodo_inicio: periodoInicio.toISOString().split('T')[0],
        periodo_fim: periodoFim.toISOString().split('T')[0],
        data_pagamento: dataPagamento.toISOString().split('T')[0],
        mes_referencia: `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}`
      }
    }
  } else {
    // REGRA: Folha mensal sempre do mês vigente (competência)
    // Data de pagamento: 5º dia útil do mês SEGUINTE
    
    const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
    const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)
    
    const mesPagamento = mesAtual === 12 ? 1 : mesAtual + 1
    const anoPagamento = mesAtual === 12 ? anoAtual + 1 : anoAtual
    const dataPagamento = calcular5oDiaUtil(anoPagamento, mesPagamento)
    
    // Log detalhado para debug
    console.log(`📅 FOLHA MENSAL - Cálculo de Datas (dateUtils):`)
    console.log(`   Data Atual: ${hoje.toISOString().split('T')[0]}`)
    console.log(`   Mês Atual: ${mesAtual}/${anoAtual}`)
    console.log(`   Período: ${periodoInicio.toISOString().split('T')[0]} a ${periodoFim.toISOString().split('T')[0]}`)
    console.log(`   Data Pagamento: ${dataPagamento.toISOString().split('T')[0]} (5º dia útil do mês SEGUINTE)`)
    console.log(`   Mês Referência: ${anoAtual}-${String(mesAtual).padStart(2, '0')}`)
    
    return {
      periodo_inicio: periodoInicio.toISOString().split('T')[0],
      periodo_fim: periodoFim.toISOString().split('T')[0],
      data_pagamento: dataPagamento.toISOString().split('T')[0],
      mes_referencia: `${anoAtual}-${String(mesAtual).padStart(2, '0')}`
    }
  }
}

/**
 * Formata data para exibição
 */
export function formatarData(data: string): string {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

/**
 * Verifica se uma data é dia útil (segunda a sexta)
 */
export function isDiaUtil(data: Date): boolean {
  const diaSemana = data.getDay()
  return diaSemana >= 1 && diaSemana <= 5
}