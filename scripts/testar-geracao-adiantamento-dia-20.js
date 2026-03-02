/**
 * Script para testar a lógica de geração automática de adiantamentos no dia 20
 * Testa diferentes cenários: dia 20 em dia útil, sábado, domingo
 */

console.log('🧪 Testando lógica de geração automática de adiantamentos no dia 20\n')

// Função para verificar se é dia útil
const isDiaUtil = (diaSemana) => {
  // Não é sábado (6) nem domingo (0)
  return diaSemana !== 0 && diaSemana !== 6
}

// Função para calcular o dia de execução
const calcularDiaExecucao = (mes, ano) => {
  const dia20 = new Date(ano, mes, 20)
  const diaSemana20 = dia20.getDay()
  
  console.log(`   Dia 20: ${dia20.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`)
  console.log(`   Dia da semana: ${diaSemana20} (0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb)`)
  
  // Se dia 20 é dia útil, executar no dia 20
  if (isDiaUtil(diaSemana20)) {
    console.log(`   ✅ Dia 20 é dia útil`)
    return 20
  }
  
  // Se dia 20 é sábado, executar na sexta (dia 19)
  if (diaSemana20 === 6) {
    console.log(`   ⚠️ Dia 20 é sábado, executar na sexta (dia 19)`)
    return 19
  }
  
  // Se dia 20 é domingo, executar na sexta (dia 18)
  if (diaSemana20 === 0) {
    console.log(`   ⚠️ Dia 20 é domingo, executar na sexta (dia 18)`)
    return 18
  }
  
  return 20
}

// Cenários de teste para 2026
const cenarios = [
  { mes: 0, ano: 2026, nome: 'Janeiro 2026' },
  { mes: 1, ano: 2026, nome: 'Fevereiro 2026' },
  { mes: 2, ano: 2026, nome: 'Março 2026' },
  { mes: 3, ano: 2026, nome: 'Abril 2026' },
  { mes: 4, ano: 2026, nome: 'Maio 2026' },
  { mes: 5, ano: 2026, nome: 'Junho 2026' },
  { mes: 6, ano: 2026, nome: 'Julho 2026' },
  { mes: 7, ano: 2026, nome: 'Agosto 2026' },
  { mes: 8, ano: 2026, nome: 'Setembro 2026' },
  { mes: 9, ano: 2026, nome: 'Outubro 2026' },
  { mes: 10, ano: 2026, nome: 'Novembro 2026' },
  { mes: 11, ano: 2026, nome: 'Dezembro 2026' }
]

console.log('📅 Testando todos os meses de 2026:\n')

cenarios.forEach((cenario, index) => {
  console.log(`\n${index + 1}. ${cenario.nome}`)
  const diaExecucao = calcularDiaExecucao(cenario.mes, cenario.ano)
  console.log(`   🎯 Dia de execução: ${diaExecucao}`)
})

console.log(`\n${'='.repeat(70)}`)
console.log(`\n📋 Resumo da Lógica:`)
console.log(`   • Se dia 20 é dia útil (seg-sex): executar no dia 20`)
console.log(`   • Se dia 20 é sábado: executar no dia 19 (sexta-feira)`)
console.log(`   • Se dia 20 é domingo: executar no dia 18 (sexta-feira)`)
console.log(`\n🤖 O cron job deve executar DIARIAMENTE`)
console.log(`   A API verifica se é o dia correto e executa apenas quando necessário`)

console.log(`\n✅ Teste concluído!`)
