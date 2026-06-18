/**
 * Script para testar o cálculo do 5º dia útil de fevereiro/2026
 */

// Função para calcular o 5º dia útil do mês
function calcular5oDiaUtil(ano, mes) {
  let diasUteis = 0
  let data = new Date(ano, mes - 1, 1) // Primeiro dia do mês
  
  console.log(`📅 Calculando 5º dia útil de ${mes}/${ano}:`)
  console.log(`   Iniciando no dia: ${data.toLocaleDateString('pt-BR')} (${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getDay()]})`)
  
  while (diasUteis < 5) {
    const diaSemana = data.getDay()
    const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    
    console.log(`   ${data.toLocaleDateString('pt-BR')} (${nomesDias[diaSemana]}) - `, end='')
    
    // Se for dia útil (segunda=1 a sexta=5)
    if (diaSemana >= 1 && diaSemana <= 5) {
      diasUteis++
      console.log(`DIA ÚTIL #${diasUteis}`)
    } else {
      console.log(`Fim de semana - pula`)
    }
    
    // Se ainda não chegou no 5º dia útil, avança para o próximo dia
    if (diasUteis < 5) {
      data.setDate(data.getDate() + 1)
    }
  }
  
  console.log(`   ✅ 5º dia útil: ${data.toLocaleDateString('pt-BR')} (${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getDay()]})`)
  return data
}

console.log('🧪 [TESTE] Testando cálculo do 5º dia útil para fevereiro/2026...\n')

// Testar fevereiro/2026
const resultado = calcular5oDiaUtil(2026, 2)
const dataFormatada = resultado.toISOString().split('T')[0]

console.log(`\n📊 [RESULTADO]:`)
console.log(`   Data: ${dataFormatada}`)
console.log(`   Formatada: ${resultado.toLocaleDateString('pt-BR')}`)

// Verificar se está correto
if (dataFormatada === '2026-02-06') {
  console.log(`   ✅ CORRETO! É o 5º dia útil de fevereiro/2026`)
} else {
  console.log(`   ❌ INCORRETO! Esperava 2026-02-06, mas obteve ${dataFormatada}`)
}

// Mostrar calendário de fevereiro/2026 para referência
console.log(`\n📅 [CALENDÁRIO] Fevereiro/2026:`)
console.log(`   Dom Seg Ter Qua Qui Sex Sáb`)
let dia = 1
let linha = '   '
const primeiroDia = new Date(2026, 1, 1).getDay() // 0=domingo

// Espaços para o primeiro dia
for (let i = 0; i < primeiroDia; i++) {
  linha += '    '
}

// Dias do mês
while (dia <= 28) {
  const dataAtual = new Date(2026, 1, dia)
  const diaSemana = dataAtual.getDay()
  
  if (dia < 10) linha += ' '
  linha += dia
  
  // Marcar dias úteis
  if (diaSemana >= 1 && diaSemana <= 5) {
    linha += '*' // Marcar dias úteis
  } else {
    linha += ' '
  }
  linha += ' '
  
  // Nova linha no sábado
  if (diaSemana === 6) {
    console.log(linha)
    linha = '   '
  }
  
  dia++
}

if (linha.trim()) {
  console.log(linha)
}

console.log(`\n   * = Dia útil`)
console.log(`   1º dia útil: 03/02 (Segunda)`)
console.log(`   2º dia útil: 04/02 (Terça)`)
console.log(`   3º dia útil: 05/02 (Quarta)`)
console.log(`   4º dia útil: 06/02 (Quinta)`)
console.log(`   5º dia útil: 07/02 (Sexta)`)