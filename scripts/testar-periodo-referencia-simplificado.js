/**
 * Script para testar a exibição simplificada do período de referência
 * Valida que está mostrando apenas o mês (ex: "Fevereiro") ao invés do período completo
 */

console.log('🧪 Testando exibição simplificada do período de referência\n')

// Parse seguro de datas
function parseDateOnly(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Simular a função do HoleriteCard
function formatarPeriodoReferencia(periodo_inicio, periodo_fim) {
  if (!periodo_inicio || !periodo_fim) {
    return 'Período não definido'
  }
  
  const dataInicio = parseDateOnly(periodo_inicio)
  const dataFim = parseDateOnly(periodo_fim)
  
  // Determinar se é adiantamento
  const diaInicio = dataInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  // Calcular data de referência
  let dataReferencia
  if (isAdiantamento) {
    // Adiantamento: usar periodo_inicio (mesmo mês)
    dataReferencia = dataInicio
  } else {
    // Folha Mensal: subtrair 1 mês do periodo_fim para obter o mês trabalhado
    dataReferencia = new Date(dataFim)
    dataReferencia.setMonth(dataReferencia.getMonth() - 1)
  }
  
  // Retornar apenas o nome do mês (capitalizado)
  const mesNome = dataReferencia.toLocaleDateString('pt-BR', { month: 'long' })
  return mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
}

// Casos de teste
const casos = [
  {
    nome: 'Adiantamento de Janeiro 2026',
    periodo_inicio: '2026-01-15',
    periodo_fim: '2026-01-31',
    esperado: 'Janeiro'
  },
  {
    nome: 'Folha Mensal de Janeiro 2026 (paga em Fevereiro)',
    periodo_inicio: '2026-02-05',
    periodo_fim: '2026-02-05',
    esperado: 'Janeiro'
  },
  {
    nome: 'Adiantamento de Fevereiro 2026',
    periodo_inicio: '2026-02-15',
    periodo_fim: '2026-02-28',
    esperado: 'Fevereiro'
  },
  {
    nome: 'Folha Mensal de Fevereiro 2026 (paga em Março)',
    periodo_inicio: '2026-03-05',
    periodo_fim: '2026-03-05',
    esperado: 'Fevereiro'
  },
  {
    nome: 'Adiantamento de Dezembro 2025',
    periodo_inicio: '2025-12-15',
    periodo_fim: '2025-12-31',
    esperado: 'Dezembro'
  },
  {
    nome: 'Folha Mensal de Dezembro 2025 (paga em Janeiro 2026)',
    periodo_inicio: '2026-01-05',
    periodo_fim: '2026-01-05',
    esperado: 'Dezembro'
  }
]

// Executar testes
let passou = 0
let falhou = 0

console.log('📋 TESTES DE EXIBIÇÃO SIMPLIFICADA\n')
console.log('=' .repeat(70))

casos.forEach((caso, index) => {
  console.log(`\n${index + 1}. ${caso.nome}`)
  console.log(`   Período: ${caso.periodo_inicio} a ${caso.periodo_fim}`)
  
  const resultado = formatarPeriodoReferencia(caso.periodo_inicio, caso.periodo_fim)
  const testePassed = resultado === caso.esperado
  
  if (testePassed) {
    console.log(`   ✅ PASSOU - Exibindo: "${resultado}"`)
    passou++
  } else {
    console.log(`   ❌ FALHOU`)
    console.log(`   Esperado: "${caso.esperado}"`)
    console.log(`   Obtido: "${resultado}"`)
    falhou++
  }
})

// Resumo
console.log('\n' + '='.repeat(70))
console.log('\n📊 RESUMO DOS TESTES')
console.log(`✅ Passou: ${passou}/${casos.length}`)
console.log(`❌ Falhou: ${falhou}/${casos.length}`)

if (falhou === 0) {
  console.log('\n🎉 Todos os testes passaram!')
  console.log('✨ O período de referência está sendo exibido de forma simplificada.')
  console.log('📝 Exemplo: "Fevereiro" ao invés de "14/02/2026 até 27/02/2026"')
} else {
  console.log('\n⚠️ Alguns testes falharam. Verifique a implementação.')
}

console.log('\n' + '='.repeat(70))
