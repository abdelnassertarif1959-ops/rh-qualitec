/**
 * Script para testar o mês de referência nos holerites
 * 
 * REGRA:
 * - Holerite Mensal: mês ANTERIOR (ex: em fevereiro, mostra "Janeiro/2026")
 * - Adiantamento: mês VIGENTE (ex: em fevereiro, mostra "Fevereiro/2026")
 */

console.log('\n🧪 TESTE: Mês de Referência nos Holerites\n')
console.log('=' .repeat(60))

// Simular diferentes cenários
const cenarios = [
  {
    nome: 'Folha Mensal de Fevereiro/2026',
    periodo_inicio: '2026-02-01',
    periodo_fim: '2026-02-28',
    esperado: 'janeiro de 2026',
    tipo: 'mensal'
  },
  {
    nome: 'Adiantamento de Fevereiro/2026',
    periodo_inicio: '2026-02-15',
    periodo_fim: '2026-02-28',
    esperado: 'fevereiro de 2026',
    tipo: 'adiantamento'
  },
  {
    nome: 'Folha Mensal de Janeiro/2026',
    periodo_inicio: '2026-01-01',
    periodo_fim: '2026-01-31',
    esperado: 'dezembro de 2025',
    tipo: 'mensal'
  },
  {
    nome: 'Adiantamento de Janeiro/2026',
    periodo_inicio: '2026-01-15',
    periodo_fim: '2026-01-31',
    esperado: 'janeiro de 2026',
    tipo: 'adiantamento'
  }
]

console.log('\n📋 CENÁRIOS DE TESTE:\n')

cenarios.forEach((cenario, index) => {
  console.log(`${index + 1}. ${cenario.nome}`)
  console.log(`   Período: ${cenario.periodo_inicio} até ${cenario.periodo_fim}`)
  console.log(`   Tipo: ${cenario.tipo}`)
  console.log(`   Mês Esperado: ${cenario.esperado}`)
  
  // Simular a lógica do código
  const [anoInicio, mesInicio, diaInicioData] = cenario.periodo_inicio.split('-').map(Number)
  const [anoFim, mesFim, diaFimData] = cenario.periodo_fim.split('-').map(Number)
  const periodoInicio = new Date(anoInicio, mesInicio - 1, diaInicioData)
  const periodoFim = new Date(anoFim, mesFim - 1, diaFimData)
  
  const diaInicio = periodoInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  let mesReferencia
  if (isAdiantamento) {
    // Adiantamento: usar o mês do período_inicio (mês vigente)
    mesReferencia = periodoInicio
  } else {
    // Folha Mensal: usar o mês anterior ao período_fim
    mesReferencia = new Date(anoFim, mesFim - 2, 1)
  }
  
  const mesAno = mesReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  if (mesAno === cenario.esperado) {
    console.log(`   ✅ CORRETO: ${mesAno}`)
  } else {
    console.log(`   ❌ INCORRETO: ${mesAno} (esperado: ${cenario.esperado})`)
  }
  console.log('')
})

console.log('=' .repeat(60))
console.log('\n📊 RESUMO DA LÓGICA:\n')
console.log('✅ Folha Mensal: Mostra o mês ANTERIOR')
console.log('   Exemplo: Pagamento em 05/02/2026 → Referência: Janeiro/2026')
console.log('')
console.log('✅ Adiantamento: Mostra o mês VIGENTE')
console.log('   Exemplo: Pagamento em 20/02/2026 → Referência: Fevereiro/2026')
console.log('')
console.log('💡 Isso está correto porque:')
console.log('   - O pagamento mensal (5º dia útil) é referente ao trabalho do mês anterior')
console.log('   - O adiantamento (dia 20) é referente ao trabalho do mês atual')
console.log('')
