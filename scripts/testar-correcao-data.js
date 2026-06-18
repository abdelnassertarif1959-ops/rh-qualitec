/**
 * Script para testar se a correção da data de disponibilização funcionou
 */

// Importar a função corrigida
import { calcularDatasHolerite } from '../server/utils/dateUtils.js'

console.log('🧪 [TESTE] Testando correção da data de disponibilização...')

try {
  // Testar cálculo para folha mensal
  const resultado = calcularDatasHolerite('mensal')
  
  console.log('📊 [TESTE] Resultado do cálculo:')
  console.log('   Período início:', resultado.periodo_inicio)
  console.log('   Período fim:', resultado.periodo_fim)
  console.log('   Data pagamento:', resultado.data_pagamento)
  console.log('   Mês referência:', resultado.mes_referencia)
  
  // Verificar se a data de pagamento está no mês correto
  const [anoPagamento, mesPagamento] = resultado.data_pagamento.split('-')
  const [anoReferencia, mesReferencia] = resultado.mes_referencia.split('-')
  
  console.log('\n🔍 [TESTE] Análise:')
  console.log('   Mês de referência:', mesReferencia)
  console.log('   Mês de pagamento:', mesPagamento)
  
  if (mesPagamento === mesReferencia) {
    console.log('   ✅ CORREÇÃO FUNCIONOU! Data de pagamento está no mês de referência')
  } else {
    console.log('   ❌ CORREÇÃO NÃO FUNCIONOU! Data de pagamento está em mês diferente')
  }
  
  // Verificar especificamente para fevereiro/2026
  if (mesReferencia === '02' && anoReferencia === '2026') {
    const dataEsperada = '2026-02-06' // 5º dia útil de fevereiro/2026
    if (resultado.data_pagamento === dataEsperada) {
      console.log('   ✅ PERFEITO! Para fevereiro/2026, a data é 06/02/2026 (5º dia útil)')
    } else {
      console.log(`   ⚠️ Para fevereiro/2026, esperava ${dataEsperada}, mas obteve ${resultado.data_pagamento}`)
    }
  }
  
} catch (error) {
  console.error('💥 [TESTE] Erro:', error)
}