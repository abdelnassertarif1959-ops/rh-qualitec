/**
 * Script para testar a lógica de referência dos holerites
 * Valida se adiantamentos mostram o mês atual e folhas mensais mostram o mês anterior
 */

console.log('🧪 Testando lógica de referência de holerites\n')

// Função para parse seguro de data (evita problemas de timezone)
function parseDateOnly(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Simular a lógica do código
function calcularReferencia(periodo_inicio, periodo_fim) {
  const periodoInicio = parseDateOnly(periodo_inicio)
  const periodoFim = parseDateOnly(periodo_fim)
  
  const diaInicio = periodoInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  let dataReferencia
  if (isAdiantamento) {
    // Adiantamento: usar periodo_inicio (mesmo mês)
    dataReferencia = periodoInicio
  } else {
    // Folha Mensal: subtrair 1 mês do periodo_fim para obter o mês trabalhado
    dataReferencia = new Date(periodoFim)
    dataReferencia.setMonth(dataReferencia.getMonth() - 1)
  }
  
  const mes = String(dataReferencia.getMonth() + 1).padStart(2, '0')
  const ano = String(dataReferencia.getFullYear())
  const mesAno = dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  return {
    tipo: isAdiantamento ? 'Adiantamento' : 'Folha Mensal',
    mes,
    ano,
    mesAno,
    periodo_inicio,
    periodo_fim
  }
}

// Casos de teste
const casos = [
  {
    nome: 'Adiantamento de Janeiro 2026',
    periodo_inicio: '2026-01-15',
    periodo_fim: '2026-01-31',
    esperado: {
      tipo: 'Adiantamento',
      mes: '01',
      ano: '2026',
      mesAno: 'janeiro de 2026'
    }
  },
  {
    nome: 'Folha Mensal de Janeiro 2026 (paga em Fevereiro)',
    periodo_inicio: '2026-02-05',
    periodo_fim: '2026-02-05',
    esperado: {
      tipo: 'Folha Mensal',
      mes: '01',
      ano: '2026',
      mesAno: 'janeiro de 2026'
    }
  },
  {
    nome: 'Adiantamento de Fevereiro 2026',
    periodo_inicio: '2026-02-15',
    periodo_fim: '2026-02-28',
    esperado: {
      tipo: 'Adiantamento',
      mes: '02',
      ano: '2026',
      mesAno: 'fevereiro de 2026'
    }
  },
  {
    nome: 'Folha Mensal de Fevereiro 2026 (paga em Março)',
    periodo_inicio: '2026-03-05',
    periodo_fim: '2026-03-05',
    esperado: {
      tipo: 'Folha Mensal',
      mes: '02',
      ano: '2026',
      mesAno: 'fevereiro de 2026'
    }
  },
  {
    nome: 'Adiantamento de Dezembro 2025',
    periodo_inicio: '2025-12-15',
    periodo_fim: '2025-12-31',
    esperado: {
      tipo: 'Adiantamento',
      mes: '12',
      ano: '2025',
      mesAno: 'dezembro de 2025'
    }
  },
  {
    nome: 'Folha Mensal de Dezembro 2025 (paga em Janeiro 2026)',
    periodo_inicio: '2026-01-05',
    periodo_fim: '2026-01-05',
    esperado: {
      tipo: 'Folha Mensal',
      mes: '12',
      ano: '2025',
      mesAno: 'dezembro de 2025'
    }
  }
]

// Executar testes
let passou = 0
let falhou = 0

casos.forEach((caso, index) => {
  console.log(`\n📋 Teste ${index + 1}: ${caso.nome}`)
  console.log(`   Período: ${caso.periodo_inicio} a ${caso.periodo_fim}`)
  
  const resultado = calcularReferencia(caso.periodo_inicio, caso.periodo_fim)
  
  const tipoOk = resultado.tipo === caso.esperado.tipo
  const mesOk = resultado.mes === caso.esperado.mes
  const anoOk = resultado.ano === caso.esperado.ano
  const mesAnoOk = resultado.mesAno === caso.esperado.mesAno
  
  const testePassed = tipoOk && mesOk && anoOk && mesAnoOk
  
  if (testePassed) {
    console.log(`   ✅ PASSOU`)
    console.log(`   Tipo: ${resultado.tipo}`)
    console.log(`   Referência: ${resultado.mesAno}`)
    passou++
  } else {
    console.log(`   ❌ FALHOU`)
    console.log(`   Esperado:`)
    console.log(`     - Tipo: ${caso.esperado.tipo}`)
    console.log(`     - Mês/Ano: ${caso.esperado.mesAno}`)
    console.log(`   Obtido:`)
    console.log(`     - Tipo: ${resultado.tipo} ${tipoOk ? '✅' : '❌'}`)
    console.log(`     - Mês: ${resultado.mes} (esperado: ${caso.esperado.mes}) ${mesOk ? '✅' : '❌'}`)
    console.log(`     - Ano: ${resultado.ano} (esperado: ${caso.esperado.ano}) ${anoOk ? '✅' : '❌'}`)
    console.log(`     - Mês/Ano: ${resultado.mesAno} (esperado: ${caso.esperado.mesAno}) ${mesAnoOk ? '✅' : '❌'}`)
    falhou++
  }
})

// Resumo
console.log('\n' + '='.repeat(60))
console.log('📊 RESUMO DOS TESTES')
console.log('='.repeat(60))
console.log(`✅ Passou: ${passou}/${casos.length}`)
console.log(`❌ Falhou: ${falhou}/${casos.length}`)

if (falhou === 0) {
  console.log('\n🎉 Todos os testes passaram! A lógica está correta.')
} else {
  console.log('\n⚠️ Alguns testes falharam. Verifique a lógica.')
}
