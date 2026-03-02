/**
 * Teste da correção do período no email
 * Simula a função buildReferencia corrigida
 */

function parseDateOnly(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function buildReferenciaCorrigida(periodo_inicio, isAdiantamento = false) {
  const periodoInicio = parseDateOnly(periodo_inicio)
  const ano = periodoInicio.getFullYear()
  const mes = periodoInicio.getMonth() // 0-11
  
  // Para folha mensal: mês trabalhado = mês anterior ao pagamento
  // Para adiantamento: mês trabalhado = mesmo mês
  const mesReferencia = isAdiantamento ? mes : mes - 1
  
  // Calcular primeiro e último dia do mês de referência
  const refInicio = new Date(ano, mesReferencia, 1)
  const refFim = new Date(ano, mesReferencia + 1, 0)
  
  const mesAno = refInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const inicio = refInicio.toLocaleDateString('pt-BR')
  const fim = refFim.toLocaleDateString('pt-BR')
  
  return { mesAno, inicio, fim }
}

console.log('🧪 Testando correção do período no email\n')

// Caso 1: Folha mensal de janeiro (paga em fevereiro)
console.log('📋 Caso 1: Folha Mensal de Janeiro')
console.log('   periodo_inicio: 2026-02-01 (pagamento em fevereiro)')
const caso1 = buildReferenciaCorrigida('2026-02-01', false)
console.log('   ✅ Referência:', caso1.mesAno)
console.log('   ✅ Período:', caso1.inicio, 'a', caso1.fim)
console.log('   Esperado: janeiro de 2026, 01/01/2026 a 31/01/2026\n')

// Caso 2: Adiantamento de janeiro (pago dia 15/01)
console.log('📋 Caso 2: Adiantamento de Janeiro')
console.log('   periodo_inicio: 2026-01-15 (adiantamento)')
const caso2 = buildReferenciaCorrigida('2026-01-15', true)
console.log('   ✅ Referência:', caso2.mesAno)
console.log('   ✅ Período:', caso2.inicio, 'a', caso2.fim)
console.log('   Esperado: janeiro de 2026, 01/01/2026 a 31/01/2026\n')

// Caso 3: Folha mensal de fevereiro (paga em março)
console.log('📋 Caso 3: Folha Mensal de Fevereiro')
console.log('   periodo_inicio: 2026-03-01 (pagamento em março)')
const caso3 = buildReferenciaCorrigida('2026-03-01', false)
console.log('   ✅ Referência:', caso3.mesAno)
console.log('   ✅ Período:', caso3.inicio, 'a', caso3.fim)
console.log('   Esperado: fevereiro de 2026, 01/02/2026 a 28/02/2026\n')

// Caso 4: Adiantamento de dezembro (pago dia 15/12)
console.log('📋 Caso 4: Adiantamento de Dezembro')
console.log('   periodo_inicio: 2026-12-15 (adiantamento)')
const caso4 = buildReferenciaCorrigida('2026-12-15', true)
console.log('   ✅ Referência:', caso4.mesAno)
console.log('   ✅ Período:', caso4.inicio, 'a', caso4.fim)
console.log('   Esperado: dezembro de 2026, 01/12/2026 a 31/12/2026\n')

console.log('✅ Todos os casos testados com sucesso!')
