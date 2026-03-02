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
 * Calcula as datas corretas para geração de holerites baseado na data atual
 */
export function calcularDatasHolerite(tipo: 'adiantamento' | 'mensal') {
  const hoje = new Date()
  const diaAtual = hoje.getDate()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()
  
  if (tipo === 'adiantamento') {
    // REGRA: Adiantamento salarial é do dia 15 ao último dia do mês vigente
    // Data de pagamento: dia 20 do mês vigente
    
    if (diaAtual >= 15) {
      // Gerar adiantamento do mês atual (15 ao último dia)
      const periodoInicio = new Date(anoAtual, mesAtual - 1, 15)
      const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
      const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)
      const dataPagamento = new Date(anoAtual, mesAtual - 1, 20)
      
      return {
        periodo_inicio: periodoInicio.toISOString().split('T')[0],
        periodo_fim: periodoFim.toISOString().split('T')[0],
        data_pagamento: dataPagamento.toISOString().split('T')[0],
        mes_referencia: `${anoAtual}-${String(mesAtual).padStart(2, '0')}`
      }
    } else {
      // Antes do dia 15, gerar adiantamento do mês anterior (15 ao último dia)
      const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1
      const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual
      
      const periodoInicio = new Date(anoAnterior, mesAnterior - 1, 15)
      const ultimoDiaMes = new Date(anoAnterior, mesAnterior, 0).getDate()
      const periodoFim = new Date(anoAnterior, mesAnterior - 1, ultimoDiaMes)
      const dataPagamento = new Date(anoAnterior, mesAnterior - 1, 20)
      
      return {
        periodo_inicio: periodoInicio.toISOString().split('T')[0],
        periodo_fim: periodoFim.toISOString().split('T')[0],
        data_pagamento: dataPagamento.toISOString().split('T')[0],
        mes_referencia: `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}`
      }
    }
  } else {
    // REGRA: Folha mensal sempre do mês vigente (atual)
    // Data de pagamento: 5º dia útil do mês de referência
    
    // Sempre gerar folha mensal do mês atual
    const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
    const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)
    
    // CORREÇÃO: Data de pagamento deve ser 5º dia útil do mês de referência (mesmo mês)
    const dataPagamento = calcular5oDiaUtil(anoAtual, mesAtual)
    
    // Log detalhado para debug
    console.log(`📅 FOLHA MENSAL - Cálculo de Datas (dateUtils):`)
    console.log(`   Data Atual: ${hoje.toISOString().split('T')[0]}`)
    console.log(`   Mês Atual: ${mesAtual}/${anoAtual}`)
    console.log(`   Período: ${periodoInicio.toISOString().split('T')[0]} a ${periodoFim.toISOString().split('T')[0]}`)
    console.log(`   Data Pagamento: ${dataPagamento.toISOString().split('T')[0]} (5º dia útil do mês de referência)`)
    console.log(`   Mês Referência: ${anoAtual}-${String(mesAtual).padStart(2, '0')}`)
    console.log(`   ✅ Competência: ${mesAtual}/${anoAtual} (MÊS VIGENTE)`)
    
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