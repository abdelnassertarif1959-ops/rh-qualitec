import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function diagnosticar() {
  console.log('🔍 Diagnóstico completo do holerite do Leonardo...\n')
  
  // 1. Buscar funcionário
  const { data: funcionario } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('nome_completo', 'LEONARDO RAMOS DA SILVA')
    .single()
  
  if (!funcionario) {
    console.log('❌ Funcionário não encontrado')
    return
  }
  
  console.log('👤 Funcionário:', funcionario.nome_completo)
  console.log('📋 ID:', funcionario.id)
  console.log('💰 Salário:', funcionario.salario)
  console.log('💸 Pensão Alimentícia:', funcionario.pensao_alimenticia)
  console.log('📝 Descontos Personalizados:', JSON.stringify(funcionario.descontos_personalizados, null, 2))
  console.log('')
  
  // 2. Buscar holerite
  const { data: holerite } = await supabase
    .from('holerites')
    .select('*')
    .eq('funcionario_id', funcionario.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (!holerite) {
    console.log('❌ Holerite não encontrado')
    return
  }
  
  console.log('📄 Holerite ID:', holerite.id)
  console.log('📅 Período:', holerite.periodo_inicio, '-', holerite.periodo_fim)
  console.log('💵 Total Proventos:', holerite.total_proventos)
  console.log('💸 Total Descontos:', holerite.total_descontos)
  console.log('💰 Salário Líquido:', holerite.salario_liquido)
  console.log('📝 Descontos Personalizados no Holerite:', JSON.stringify(holerite.descontos_personalizados, null, 2))
  console.log('')
  
  // 3. Buscar itens personalizados da tabela
  const { data: itens } = await supabase
    .from('itens_personalizados_holerite')
    .select('*')
    .eq('funcionario_id', funcionario.id)
  
  console.log('📋 Itens Personalizados na Tabela:', itens?.length || 0)
  if (itens && itens.length > 0) {
    itens.forEach(item => {
      console.log(`   - ${item.descricao}: R$ ${item.valor} (${item.tipo})`)
      console.log(`     Período: ${item.data_inicio} até ${item.data_fim || 'indeterminado'}`)
    })
  }
  console.log('')
  
  // 4. Análise do problema
  console.log('🔍 ANÁLISE DO PROBLEMA:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  const descontosNoHolerite = holerite.descontos_personalizados || []
  const descontosNaTabela = itens || []
  
  console.log(`\n1️⃣ Descontos no campo 'descontos_personalizados' do holerite:`)
  if (descontosNoHolerite.length > 0) {
    descontosNoHolerite.forEach(d => {
      console.log(`   - ${d.tipo}: R$ ${d.valor}`)
    })
  } else {
    console.log('   (vazio)')
  }
  
  console.log(`\n2️⃣ Descontos na tabela 'itens_personalizados_holerite':`)
  if (descontosNaTabela.length > 0) {
    descontosNaTabela.forEach(d => {
      console.log(`   - ${d.descricao}: R$ ${d.valor}`)
    })
  } else {
    console.log('   (vazio)')
  }
  
  console.log(`\n3️⃣ Total de descontos no banco: R$ ${holerite.total_descontos}`)
  
  // Calcular o que deveria ser
  const inss = holerite.inss || 0
  const irrf = holerite.irrf || 0
  const valeTransporte = holerite.vale_transporte || 0
  const adiantamento = holerite.adiantamento || 0
  
  const somaDescontosBase = inss + irrf + valeTransporte + adiantamento
  
  console.log(`\n4️⃣ Soma dos descontos base:`)
  console.log(`   INSS: R$ ${inss}`)
  console.log(`   IRRF: R$ ${irrf}`)
  console.log(`   Vale Transporte: R$ ${valeTransporte}`)
  console.log(`   Adiantamento: R$ ${adiantamento}`)
  console.log(`   Total Base: R$ ${somaDescontosBase}`)
  
  const totalEsperado = holerite.total_descontos
  const diferenca = totalEsperado - somaDescontosBase
  
  console.log(`\n5️⃣ Diferença (descontos personalizados): R$ ${diferenca}`)
  
  console.log(`\n6️⃣ PROBLEMA IDENTIFICADO:`)
  console.log(`   O modal está somando:`)
  console.log(`   - total_descontos do banco: R$ ${holerite.total_descontos}`)
  console.log(`   - + itens da tabela novamente: R$ ${descontosNaTabela.reduce((sum, item) => sum + item.valor, 0)}`)
  console.log(`   = Total ERRADO mostrado no frontend`)
  console.log(`\n   Mas o total_descontos JÁ INCLUI os itens personalizados!`)
  console.log(`   Por isso está duplicando os valores.`)
}

diagnosticar().catch(console.error)
