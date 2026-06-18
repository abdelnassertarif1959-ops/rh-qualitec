/**
 * Script para testar o cálculo do dia de disponibilização de adiantamentos
 * Regra: Dia 20, ou último dia útil anterior se cair em feriado/fim de semana
 */

console.log('🧪 Testando cálculo do dia de disponibilização de adiantamentos\n')

/**
 * Verifica se a data é fim de semana ou feriado
 */
function isFimDeSemanaOuFeriado(data) {
  const diaSemana = data.getDay()
  
  // Fim de semana (0 = domingo, 6 = sábado)
  if (diaSemana === 0 || diaSemana === 6) {
    return true
  }
  
  // Verificar feriados nacionais fixos
  const dia = data.getDate()
  const mes = data.getMonth() + 1
  
  const feriadosFixos = [
    { dia: 1, mes: 1 },   // Ano Novo
    { dia: 21, mes: 4 },  // Tiradentes
    { dia: 1, mes: 5 },   // Dia do Trabalho
    { dia: 7, mes: 9 },   // Independência
    { dia: 12, mes: 10 }, // Nossa Senhora Aparecida
    { dia: 2, mes: 11 },  // Finados
    { dia: 15, mes: 11 }, // Proclamação da República
    { dia: 25, mes: 12 }  // Natal
  ]
  
  return feriadosFixos.some(f => f.dia === dia && f.mes === mes)
}

/**
 * Calcula o dia de disponibilização dos adiantamentos
 */
function calcularDiaDisponibilizacao(data) {
  const ano = data.getFullYear()
  const mes = data.getMonth()
  
  // Começar pelo dia 20
  let diaDisponibilizacao = new Date(ano, mes, 20)
  
  // Verificar se é fim de semana ou feriado
  while (isFimDeSemanaOuFeriado(diaDisponibilizacao)) {
    // Voltar um dia
    diaDisponibilizacao.setDate(diaDisponibilizacao.getDate() - 1)
  }
  
  return diaDisponibilizacao.getDate()
}

/**
 * Retorna o nome do dia da semana
 */
function getDiaSemana(data) {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return dias[data.getDay()]
}

// Cenários de teste
const cenarios = [
  { mes: 2, ano: 2026, descricao: 'Fevereiro 2026 (dia 20 é sexta-feira)' },
  { mes: 3, ano: 2026, descricao: 'Março 2026 (dia 20 é sexta-feira)' },
  { mes: 4, ano: 2026, descricao: 'Abril 2026 (dia 20 é segunda-feira)' },
  { mes: 5, ano: 2026, descricao: 'Maio 2026 (dia 20 é quarta-feira)' },
  { mes: 6, ano: 2026, descricao: 'Junho 2026 (dia 20 é sábado - deve antecipar)' },
  { mes: 7, ano: 2026, descricao: 'Julho 2026 (dia 20 é segunda-feira)' },
  { mes: 9, ano: 2026, descricao: 'Setembro 2026 (dia 20 é domingo - deve antecipar)' },
  { mes: 12, ano: 2026, descricao: 'Dezembro 2026 (dia 20 é domingo - deve antecipar)' }
]

console.log('📅 Testando diferentes meses:\n')

cenarios.forEach((cenario, index) => {
  const data = new Date(cenario.ano, cenario.mes - 1, 1)
  const dia20 = new Date(cenario.ano, cenario.mes - 1, 20)
  const diaDisponibilizacao = calcularDiaDisponibilizacao(data)
  const dataDisponibilizacao = new Date(cenario.ano, cenario.mes - 1, diaDisponibilizacao)
  
  console.log(`${index + 1}. ${cenario.descricao}`)
  console.log(`   Dia 20: ${getDiaSemana(dia20)}`)
  console.log(`   Dia de disponibilização: ${diaDisponibilizacao} (${getDiaSemana(dataDisponibilizacao)})`)
  
  if (diaDisponibilizacao !== 20) {
    console.log(`   ⚠️  Antecipado de 20 para ${diaDisponibilizacao}`)
  } else {
    console.log(`   ✅ Mantido no dia 20`)
  }
  console.log()
})

console.log('=' .repeat(60))
console.log('\n📋 Regras de Disponibilização:')
console.log('   • Dia padrão: 20 de cada mês')
console.log('   • Se dia 20 cair em sábado: antecipa para sexta (dia 19)')
console.log('   • Se dia 20 cair em domingo: antecipa para sexta (dia 18)')
console.log('   • Se dia 20 cair em feriado: antecipa para o último dia útil anterior')
console.log('\n✅ Lógica implementada e testada!')
