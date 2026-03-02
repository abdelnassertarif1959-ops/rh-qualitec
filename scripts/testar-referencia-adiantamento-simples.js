/**
 * Script para testar a referência simplificada de adiantamento
 * Deve mostrar apenas o mês (ex: "fevereiro 2026")
 */

console.log('🧪 Testando referência simplificada de adiantamento\n')

// Função auxiliar para parse seguro de datas
const parseDateOnly = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Cenários de teste
const cenarios = [
  {
    nome: 'Adiantamento de Fevereiro 2026',
    periodo_inicio: '2026-02-15',
    periodo_fim: '2026-02-28',
    esperado: 'fevereiro de 2026'
  },
  {
    nome: 'Adiantamento de Janeiro 2026',
    periodo_inicio: '2026-01-15',
    periodo_fim: '2026-01-31',
    esperado: 'janeiro de 2026'
  },
  {
    nome: 'Folha Mensal de Janeiro (paga em fevereiro)',
    periodo_inicio: '2026-02-01',
    periodo_fim: '2026-02-14',
    esperado: 'Holerite janeiro de 2026'
  }
]

let passou = 0
let falhou = 0

cenarios.forEach((cenario, index) => {
  console.log(`\n📋 Teste ${index + 1}: ${cenario.nome}`)
  console.log(`   Período: ${cenario.periodo_inicio} até ${cenario.periodo_fim}`)
  
  const periodoInicio = parseDateOnly(cenario.periodo_inicio)
  const periodoFim = parseDateOnly(cenario.periodo_fim)
  
  const diaInicio = periodoInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  let dataReferencia
  if (isAdiantamento) {
    dataReferencia = periodoInicio
  } else {
    dataReferencia = new Date(periodoFim)
    dataReferencia.setMonth(dataReferencia.getMonth() - 1)
  }
  
  let referencia
  if (isAdiantamento) {
    // Mostrar apenas o mês para adiantamento
    referencia = dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  } else {
    // Folha mensal mantém "Holerite"
    referencia = `Holerite ${dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
  }
  
  console.log(`   Resultado: "${referencia}"`)
  console.log(`   Esperado: "${cenario.esperado}"`)
  
  if (referencia === cenario.esperado) {
    console.log(`   ✅ PASSOU`)
    passou++
  } else {
    console.log(`   ❌ FALHOU`)
    falhou++
  }
})

console.log(`\n${'='.repeat(50)}`)
console.log(`📊 Resumo dos Testes:`)
console.log(`   ✅ Passou: ${passou}`)
console.log(`   ❌ Falhou: ${falhou}`)
console.log(`   📈 Total: ${cenarios.length}`)

if (falhou === 0) {
  console.log(`\n🎉 Todos os testes passaram!`)
  console.log(`✅ Adiantamentos mostram apenas o mês`)
  console.log(`✅ Folhas mensais mantêm "Holerite" no nome`)
} else {
  console.log(`\n⚠️  Alguns testes falharam. Verifique a implementação.`)
}
