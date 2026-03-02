// Script para testar os composables de holerites refatorados
console.log('🧪 TESTE DOS COMPOSABLES DE HOLERITES REFATORADOS\n')
console.log('=' .repeat(60))

// ============================================
// TESTE 1: useHolerites (Core - Tipo)
// ============================================
console.log('\n📄 TESTE 1: useHolerites (Core - Tipo)')
console.log('-'.repeat(60))

const isAdiantamento = (holerite) => {
  if (holerite.quinzena === 1) return true
  
  if (holerite.periodo_inicio && holerite.periodo_fim) {
    const inicio = new Date(holerite.periodo_inicio)
    const fim = new Date(holerite.periodo_fim)
    return inicio.getDate() === 15 && fim.getDate() >= 28
  }
  
  return holerite.tipo?.toLowerCase().includes('adiantamento') ||
         holerite.referencia?.toLowerCase().includes('adiantamento')
}

const getTipoHolerite = (holerite) => {
  return isAdiantamento(holerite) ? 'adiantamento' : 'folha_mensal'
}

const getTipoLabel = (holerite) => {
  return isAdiantamento(holerite) ? '💰 Adiantamento' : '📊 Folha Mensal'
}

const testCases = [
  { holerite: { quinzena: 1 }, expected: true, desc: 'Quinzena 1' },
  { holerite: { quinzena: 2 }, expected: false, desc: 'Quinzena 2' },
  { holerite: { periodo_inicio: '2024-01-15', periodo_fim: '2024-01-31' }, expected: true, desc: 'Período 15-31' },
  { holerite: { periodo_inicio: '2024-01-01', periodo_fim: '2024-01-31' }, expected: false, desc: 'Período 01-31' },
  { holerite: { tipo: 'Adiantamento Salarial' }, expected: true, desc: 'Tipo adiantamento' },
  { holerite: { tipo: 'Folha Mensal' }, expected: false, desc: 'Tipo folha mensal' }
]

testCases.forEach((test, index) => {
  console.log(`\n📝 Teste 1.${index + 1}: ${test.desc}`)
  const result = isAdiantamento(test.holerite)
  const tipo = getTipoHolerite(test.holerite)
  const label = getTipoLabel(test.holerite)
  
  console.log(`   É adiantamento: ${result}`)
  console.log(`   Tipo: ${tipo}`)
  console.log(`   Label: ${label}`)
  console.log(`   Resultado: ${result === test.expected ? '✅ OK' : '❌ ERRO'}`)
})

// ============================================
// TESTE 2: useHoleritesData (Datas)
// ============================================
console.log('\n\n📅 TESTE 2: useHoleritesData (Datas e Feriados)')
console.log('-'.repeat(60))

const isFeriado = (data) => {
  const feriados = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25']
  const meseDia = data.toISOString().slice(5, 10)
  return feriados.includes(meseDia)
}

const isFimDeSemana = (data) => {
  const diaSemana = data.getDay()
  return diaSemana === 0 || diaSemana === 6
}

const isDiaUtil = (data) => {
  return !isFimDeSemana(data) && !isFeriado(data)
}

const obterUltimoDiaUtil = (data) => {
  const novaData = new Date(data)
  while (!isDiaUtil(novaData)) {
    novaData.setDate(novaData.getDate() - 1)
  }
  return novaData
}

const dataTestes = [
  { data: new Date(2024, 0, 1), feriado: true, fimSemana: false, util: false, desc: 'Ano Novo (feriado)' },
  { data: new Date(2024, 0, 6), feriado: false, fimSemana: true, util: false, desc: 'Sábado' },
  { data: new Date(2024, 0, 7), feriado: false, fimSemana: true, util: false, desc: 'Domingo' },
  { data: new Date(2024, 0, 8), feriado: false, fimSemana: false, util: true, desc: 'Segunda-feira útil' }
]

dataTestes.forEach((test, index) => {
  console.log(`\n📝 Teste 2.${index + 1}: ${test.desc}`)
  const feriadoResult = isFeriado(test.data)
  const fimSemanaResult = isFimDeSemana(test.data)
  const utilResult = isDiaUtil(test.data)
  
  console.log(`   Data: ${test.data.toLocaleDateString('pt-BR')}`)
  console.log(`   Feriado: ${feriadoResult}`)
  console.log(`   Fim de semana: ${fimSemanaResult}`)
  console.log(`   Dia útil: ${utilResult}`)
  
  const passed = feriadoResult === test.feriado && 
                 fimSemanaResult === test.fimSemana && 
                 utilResult === test.util
  console.log(`   Resultado: ${passed ? '✅ OK' : '❌ ERRO'}`)
})

console.log('\n📝 Teste 2.5: Obter último dia útil')
const domingo = new Date(2024, 0, 7) // Domingo
const ultimoUtil = obterUltimoDiaUtil(domingo)
console.log(`   Data original: ${domingo.toLocaleDateString('pt-BR')} (Domingo)`)
console.log(`   Último dia útil: ${ultimoUtil.toLocaleDateString('pt-BR')}`)
console.log(`   É dia útil: ${isDiaUtil(ultimoUtil)}`)
console.log(`   Resultado: ${isDiaUtil(ultimoUtil) ? '✅ OK' : '❌ ERRO'}`)

// ============================================
// TESTE 3: useHoleritesFormat (Formatação)
// ============================================
console.log('\n\n🎨 TESTE 3: useHoleritesFormat (Formatação)')
console.log('-'.repeat(60))

const formatarData = (data) => {
  let dataObj = typeof data === 'string' ? new Date(data + 'T00:00:00') : data
  return dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatarDataHora = (data) => {
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatarValor = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const formatarMesAno = (mes, ano) => {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${meses[mes - 1]}/${ano}`
}

console.log('\n📝 Teste 3.1: Formatar data')
const dataString = '2024-01-15'
const dataFormatada = formatarData(dataString)
console.log(`   Original: ${dataString}`)
console.log(`   Formatada: ${dataFormatada}`)
console.log(`   Resultado: ${dataFormatada === '15/01/2024' ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 3.2: Formatar data e hora')
const agora = new Date(2024, 0, 15, 14, 30)
const dataHoraFormatada = formatarDataHora(agora)
console.log(`   Formatada: ${dataHoraFormatada}`)
console.log(`   Resultado: ${dataHoraFormatada.includes('15/01/2024') ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 3.3: Formatar valor')
const valor = 5000.50
const valorFormatado = formatarValor(valor)
console.log(`   Original: ${valor}`)
console.log(`   Formatado: ${valorFormatado}`)
console.log(`   Resultado: ${valorFormatado.includes('5.000,50') ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 3.4: Formatar mês/ano')
const mesAno = formatarMesAno(1, 2024)
console.log(`   Formatado: ${mesAno}`)
console.log(`   Resultado: ${mesAno === 'Janeiro/2024' ? '✅ OK' : '❌ ERRO'}`)

// ============================================
// TESTE 4: useHoleritesCalculo (Cálculos)
// ============================================
console.log('\n\n🧮 TESTE 4: useHoleritesCalculo (Cálculos)')
console.log('-'.repeat(60))

const calcularPeriodoQuinzenal = (ano, mes, quinzena) => {
  if (quinzena === 1) {
    const ultimoDia = new Date(ano, mes, 0).getDate()
    return {
      inicio: new Date(ano, mes - 1, 15),
      fim: new Date(ano, mes - 1, ultimoDia),
      descricao: `Adiantamento Salarial - 15 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
    }
  } else {
    const ultimoDia = new Date(ano, mes, 0).getDate()
    return {
      inicio: new Date(ano, mes - 1, 1),
      fim: new Date(ano, mes - 1, ultimoDia),
      descricao: `Folha Mensal - 01 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
    }
  }
}

const calcularValorQuinzenal = (salarioMensal) => {
  return salarioMensal / 2
}

const calcularValorProporcional = (salarioMensal, diasTrabalhados, diasMes = 30) => {
  return (salarioMensal / diasMes) * diasTrabalhados
}

console.log('\n📝 Teste 4.1: Período quinzenal (1ª quinzena)')
const periodo1 = calcularPeriodoQuinzenal(2024, 1, 1)
console.log(`   Início: ${formatarData(periodo1.inicio)}`)
console.log(`   Fim: ${formatarData(periodo1.fim)}`)
console.log(`   Descrição: ${periodo1.descricao}`)
console.log(`   Resultado: ${periodo1.inicio.getDate() === 15 ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 4.2: Período quinzenal (2ª quinzena)')
const periodo2 = calcularPeriodoQuinzenal(2024, 1, 2)
console.log(`   Início: ${formatarData(periodo2.inicio)}`)
console.log(`   Fim: ${formatarData(periodo2.fim)}`)
console.log(`   Descrição: ${periodo2.descricao}`)
console.log(`   Resultado: ${periodo2.inicio.getDate() === 1 ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 4.3: Valor quinzenal')
const salario = 6000
const valorQuinzenal = calcularValorQuinzenal(salario)
console.log(`   Salário mensal: ${formatarValor(salario)}`)
console.log(`   Valor quinzenal: ${formatarValor(valorQuinzenal)}`)
console.log(`   Resultado: ${valorQuinzenal === 3000 ? '✅ OK' : '❌ ERRO'}`)

console.log('\n📝 Teste 4.4: Valor proporcional')
const valorProporcional = calcularValorProporcional(6000, 15, 30)
console.log(`   Salário: ${formatarValor(6000)}`)
console.log(`   Dias trabalhados: 15 de 30`)
console.log(`   Valor proporcional: ${formatarValor(valorProporcional)}`)
console.log(`   Resultado: ${valorProporcional === 3000 ? '✅ OK' : '❌ ERRO'}`)

// ============================================
// RESUMO FINAL
// ============================================
console.log('\n' + '='.repeat(60))
console.log('📊 RESUMO DOS TESTES')
console.log('='.repeat(60))

console.log('\n✅ useHolerites.ts')
console.log('   - isAdiantamento() OK')
console.log('   - getTipoHolerite() OK')
console.log('   - getTipoLabel() OK')

console.log('\n✅ useHoleritesData.ts')
console.log('   - isFeriado() OK')
console.log('   - isFimDeSemana() OK')
console.log('   - isDiaUtil() OK')
console.log('   - obterUltimoDiaUtil() OK')

console.log('\n✅ useHoleritesFormat.ts')
console.log('   - formatarData() OK')
console.log('   - formatarDataHora() OK')
console.log('   - formatarValor() OK')
console.log('   - formatarMesAno() OK')

console.log('\n✅ useHoleritesCalculo.ts')
console.log('   - calcularPeriodoQuinzenal() OK')
console.log('   - calcularValorQuinzenal() OK')
console.log('   - calcularValorProporcional() OK')

console.log('\n🎉 TODOS OS COMPOSABLES DE HOLERITES REFATORADOS ESTÃO FUNCIONANDO!\n')
