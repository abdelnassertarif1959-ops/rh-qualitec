/**
 * Script para testar a correção da referência de holerites
 * 
 * REGRA CORRETA:
 * - ADIANTAMENTO: Referência é do MESMO mês (período 15-31 = mês atual)
 * - FOLHA MENSAL: Referência é do mês ANTERIOR (pagamento em fev = trabalho em jan)
 */

// Simular dados de holerites
const holeritesTeste = [
  {
    id: 1,
    tipo: 'Adiantamento',
    periodo_inicio: '2026-02-15', // 15 de fevereiro
    periodo_fim: '2026-02-28',    // 28 de fevereiro
    referencia_esperada: 'Adiantamento Salarial fevereiro de 2026'
  },
  {
    id: 2,
    tipo: 'Folha Mensal',
    periodo_inicio: '2026-02-01', // 1 de fevereiro
    periodo_fim: '2026-02-28',    // 28 de fevereiro
    referencia_esperada: 'Holerite janeiro de 2026' // Mês ANTERIOR
  },
  {
    id: 3,
    tipo: 'Adiantamento',
    periodo_inicio: '2026-01-15', // 15 de janeiro
    periodo_fim: '2026-01-31',    // 31 de janeiro
    referencia_esperada: 'Adiantamento Salarial janeiro de 2026'
  },
  {
    id: 4,
    tipo: 'Folha Mensal',
    periodo_inicio: '2026-01-01', // 1 de janeiro
    periodo_fim: '2026-01-31',    // 31 de janeiro
    referencia_esperada: 'Holerite dezembro de 2025' // Mês ANTERIOR
  }
]

console.log('🧪 TESTE DE REFERÊNCIA DE HOLERITES\n')
console.log('=' .repeat(80))

// Função que simula a lógica corrigida (igual ao código da página)
function calcularReferencia(holerite) {
  // Parse seguro de datas
  const parseDateOnly = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  const periodoInicio = parseDateOnly(holerite.periodo_inicio)
  const periodoFim = parseDateOnly(holerite.periodo_fim)
  
  // Determinar se é adiantamento baseado no dia de início
  const diaInicio = periodoInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  // REGRA CORRETA:
  // - ADIANTAMENTO: Referência é do MESMO mês (período 15-31 = mês atual)
  // - FOLHA MENSAL: Referência é do mês ANTERIOR (pagamento em fev = trabalho em jan)
  let dataReferencia
  
  if (isAdiantamento) {
    // Adiantamento: usar periodo_inicio (mesmo mês)
    dataReferencia = periodoInicio
  } else {
    // Folha Mensal: subtrair 1 mês do periodo_fim para obter o mês trabalhado
    dataReferencia = new Date(periodoFim)
    dataReferencia.setMonth(dataReferencia.getMonth() - 1)
  }
  
  const mesAno = dataReferencia.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })
  
  if (isAdiantamento) {
    return `Adiantamento Salarial ${mesAno}`
  } else {
    return `Holerite ${mesAno}`
  }
}

// Testar cada holerite
let sucessos = 0
let falhas = 0

holeritesTeste.forEach((holerite, index) => {
  console.log(`\n📋 Teste ${index + 1}: ${holerite.tipo}`)
  console.log('-'.repeat(80))
  console.log(`Período: ${holerite.periodo_inicio} até ${holerite.periodo_fim}`)
  
  const referenciaCalculada = calcularReferencia(holerite)
  const sucesso = referenciaCalculada === holerite.referencia_esperada
  
  console.log(`Referência Esperada: ${holerite.referencia_esperada}`)
  console.log(`Referência Calculada: ${referenciaCalculada}`)
  console.log(`Status: ${sucesso ? '✅ PASSOU' : '❌ FALHOU'}`)
  
  if (sucesso) {
    sucessos++
  } else {
    falhas++
  }
})

console.log('\n' + '='.repeat(80))
console.log('\n📊 RESUMO DOS TESTES')
console.log(`✅ Sucessos: ${sucessos}/${holeritesTeste.length}`)
console.log(`❌ Falhas: ${falhas}/${holeritesTeste.length}`)

if (falhas === 0) {
  console.log('\n🎉 TODOS OS TESTES PASSARAM!')
} else {
  console.log('\n⚠️ ALGUNS TESTES FALHARAM!')
}

console.log('\n' + '='.repeat(80))
console.log('\n📝 REGRAS APLICADAS:')
console.log('1. ADIANTAMENTO (dia 15): Referência = MESMO mês')
console.log('   Exemplo: 15/02 a 28/02 = "Adiantamento Salarial fevereiro de 2026"')
console.log('\n2. FOLHA MENSAL (dia 1): Referência = MÊS ANTERIOR')
console.log('   Exemplo: 01/02 a 28/02 = "Holerite janeiro de 2026"')
console.log('   (Porque o pagamento em fevereiro é referente ao trabalho de janeiro)')
