/**
 * Script de teste para geração automática de adiantamentos no dia 20
 * Testa a lógica de cálculo de dia útil e validações
 */

console.log('🧪 Testando geração automática de adiantamentos - Dia 20\n')

// Função para calcular dia de disponibilização (copiada da API)
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

function isFimDeSemanaOuFeriado(data) {
  const diaSemana = data.getDay()
  
  // Fim de semana
  if (diaSemana === 0 || diaSemana === 6) {
    return true
  }
  
  // Feriados nacionais fixos
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

// Testes para 2026
const meses2026 = [
  { nome: 'Janeiro', mes: 0, esperado: 20, motivo: 'dia útil' },
  { nome: 'Fevereiro', mes: 1, esperado: 20, motivo: 'dia útil' },
  { nome: 'Março', mes: 2, esperado: 20, motivo: 'dia útil' },
  { nome: 'Abril', mes: 3, esperado: 20, motivo: 'dia útil' },
  { nome: 'Maio', mes: 4, esperado: 20, motivo: 'dia útil' },
  { nome: 'Junho', mes: 5, esperado: 19, motivo: 'sábado' },
  { nome: 'Julho', mes: 6, esperado: 20, motivo: 'dia útil' },
  { nome: 'Agosto', mes: 7, esperado: 20, motivo: 'dia útil' },
  { nome: 'Setembro', mes: 8, esperado: 18, motivo: 'domingo' },
  { nome: 'Outubro', mes: 9, esperado: 20, motivo: 'dia útil' },
  { nome: 'Novembro', mes: 10, esperado: 20, motivo: 'dia útil' },
  { nome: 'Dezembro', mes: 11, esperado: 18, motivo: 'domingo' }
]

let todosPassaram = true

meses2026.forEach(teste => {
  const data = new Date(2026, teste.mes, 20)
  const diaCalculado = calcularDiaDisponibilizacao(data)
  const passou = diaCalculado === teste.esperado
  
  const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getDay()]
  
  console.log(`📅 ${teste.nome} 2026:`)
  console.log(`   Dia 20 cai em: ${diaSemana}`)
  console.log(`   ${passou ? '✅' : '❌'} Dia de disponibilização: ${diaCalculado} (esperado: ${teste.esperado})`)
  console.log(`   Motivo: ${teste.motivo}`)
  console.log()
  
  if (!passou) todosPassaram = false
})

if (todosPassaram) {
  console.log('✅ Todos os testes passaram!')
} else {
  console.log('❌ Alguns testes falharam')
  process.exit(1)
}
