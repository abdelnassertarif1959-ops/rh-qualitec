/**
 * Script para testar o período exibido no email do holerite
 * 
 * REGRA:
 * - Holerite Mensal de Fevereiro (período no banco: 01/02 a 28/02)
 *   → Email deve mostrar: 01/01/2026 a 31/01/2026 (mês anterior)
 * 
 * - Adiantamento de Fevereiro (período no banco: 15/02 a 28/02)
 *   → Email deve mostrar: 15/02/2026 a 28/02/2026 (mesmo período)
 */

console.log('\n🧪 TESTE: Período no Email do Holerite\n')
console.log('=' .repeat(60))

// Simular a função de cálculo
function calcularReferenciaCorreta(periodoInicio, periodoFim) {
  // Verificar se é adiantamento (período inicia no dia 15)
  const isAdiantamento = periodoInicio.getDate() === 15
  
  if (isAdiantamento) {
    // Adiantamento: mês vigente (mesmo mês do período)
    const mesReferencia = periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return {
      mesReferencia,
      periodoInicio,
      periodoFim
    }
  } else {
    // Folha Mensal: mês anterior ao período
    const mesAnterior = new Date(periodoInicio)
    mesAnterior.setMonth(mesAnterior.getMonth() - 1)
    
    // Calcular primeiro e último dia do mês anterior
    const primeiroDiaMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1)
    const ultimoDiaMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0)
    
    const mesReferencia = mesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    
    return {
      mesReferencia,
      periodoInicio: primeiroDiaMesAnterior,
      periodoFim: ultimoDiaMesAnterior
    }
  }
}

// Cenários de teste
const cenarios = [
  {
    nome: 'Folha Mensal de Fevereiro/2026',
    periodoInicioBanco: new Date(2026, 1, 1), // 01/02/2026
    periodoFimBanco: new Date(2026, 1, 28),   // 28/02/2026
    esperadoInicio: '01/01/2026',
    esperadoFim: '31/01/2026',
    esperadoMes: 'janeiro de 2026'
  },
  {
    nome: 'Adiantamento de Fevereiro/2026',
    periodoInicioBanco: new Date(2026, 1, 15), // 15/02/2026
    periodoFimBanco: new Date(2026, 1, 28),    // 28/02/2026
    esperadoInicio: '15/02/2026',
    esperadoFim: '28/02/2026',
    esperadoMes: 'fevereiro de 2026'
  },
  {
    nome: 'Folha Mensal de Março/2026',
    periodoInicioBanco: new Date(2026, 2, 1), // 01/03/2026
    periodoFimBanco: new Date(2026, 2, 31),   // 31/03/2026
    esperadoInicio: '01/02/2026',
    esperadoFim: '28/02/2026',
    esperadoMes: 'fevereiro de 2026'
  },
  {
    nome: 'Adiantamento de Março/2026',
    periodoInicioBanco: new Date(2026, 2, 15), // 15/03/2026
    periodoFimBanco: new Date(2026, 2, 31),    // 31/03/2026
    esperadoInicio: '15/03/2026',
    esperadoFim: '31/03/2026',
    esperadoMes: 'março de 2026'
  }
]

console.log('\n📋 CENÁRIOS DE TESTE:\n')

cenarios.forEach((cenario, index) => {
  console.log(`${index + 1}. ${cenario.nome}`)
  console.log(`   Período no Banco: ${cenario.periodoInicioBanco.toLocaleDateString('pt-BR')} a ${cenario.periodoFimBanco.toLocaleDateString('pt-BR')}`)
  
  const resultado = calcularReferenciaCorreta(cenario.periodoInicioBanco, cenario.periodoFimBanco)
  
  const inicioObtido = resultado.periodoInicio.toLocaleDateString('pt-BR')
  const fimObtido = resultado.periodoFim.toLocaleDateString('pt-BR')
  const mesObtido = resultado.mesReferencia
  
  console.log(`   Período no Email: ${inicioObtido} a ${fimObtido}`)
  console.log(`   Mês de Referência: ${mesObtido}`)
  
  const periodoCorreto = inicioObtido === cenario.esperadoInicio && fimObtido === cenario.esperadoFim
  const mesCorreto = mesObtido === cenario.esperadoMes
  
  if (periodoCorreto && mesCorreto) {
    console.log(`   ✅ CORRETO!`)
  } else {
    console.log(`   ❌ INCORRETO!`)
    if (!periodoCorreto) {
      console.log(`      Esperado: ${cenario.esperadoInicio} a ${cenario.esperadoFim}`)
    }
    if (!mesCorreto) {
      console.log(`      Mês esperado: ${cenario.esperadoMes}`)
    }
  }
  console.log('')
})

console.log('=' .repeat(60))
console.log('\n📊 RESUMO DA LÓGICA:\n')
console.log('✅ Folha Mensal:')
console.log('   - Período no banco: 01/02/2026 a 28/02/2026')
console.log('   - Período no email: 01/01/2026 a 31/01/2026 (mês anterior)')
console.log('   - Referência: Janeiro de 2026')
console.log('')
console.log('✅ Adiantamento:')
console.log('   - Período no banco: 15/02/2026 a 28/02/2026')
console.log('   - Período no email: 15/02/2026 a 28/02/2026 (mesmo período)')
console.log('   - Referência: Fevereiro de 2026')
console.log('')
