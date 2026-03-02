import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarHolerites() {
  console.log('🔍 Verificando holerites...\n')

  // Buscar todos os holerites
  const { data: holerites, error } = await supabase
    .from('holerites')
    .select(`
      id,
      funcionario_id,
      periodo_inicio,
      periodo_fim,
      salario_base,
      inss,
      irrf,
      vale_transporte,
      pensao_alimenticia,
      adiantamento,
      total_descontos,
      salario_liquido,
      funcionarios (
        nome_completo
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Erro ao buscar holerites:', error)
    return
  }

  if (!holerites || holerites.length === 0) {
    console.log('⚠️  Nenhum holerite encontrado')
    return
  }

  // Filtrar holerites mensais (periodo_inicio dia 1) e adiantamentos (dia 15)
  const holeristesMensais = holerites.filter(h => {
    const data = new Date(h.periodo_inicio)
    return data.getDate() === 1
  })

  const holeritesAdiantamento = holerites.filter(h => {
    const data = new Date(h.periodo_inicio)
    return data.getDate() === 15
  })

  console.log(`📊 Total de holerites: ${holerites.length}`)
  console.log(`📊 Holerites mensais (dia 1): ${holeristesMensais.length}`)
  console.log(`📊 Holerites adiantamento (dia 15): ${holeritesAdiantamento.length}\n`)
  console.log('='.repeat(80))

  holeristesMensais.forEach((h, index) => {
    console.log(`\n${index + 1}. HOLERITE MENSAL ID: ${h.id}`)
    console.log(`   👤 Funcionário: ${h.funcionarios?.nome_completo || 'N/A'}`)
    console.log(`   📅 Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
    console.log(`   💰 Salário Base: R$ ${(h.salario_base || 0).toFixed(2)}`)
    console.log(`   📉 INSS: R$ ${(h.inss || 0).toFixed(2)}`)
    console.log(`   📉 IRRF: R$ ${(h.irrf || 0).toFixed(2)}`)
    console.log(`   📉 Vale Transporte: R$ ${(h.vale_transporte || 0).toFixed(2)}`)
    console.log(`   📉 Pensão Alimentícia: R$ ${(h.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`   💸 Adiantamento Atual: R$ ${(h.adiantamento || 0).toFixed(2)}`)
    
    const adiantamento40 = (h.salario_base || 0) * 0.40
    console.log(`   💸 Adiantamento 40% (será): R$ ${adiantamento40.toFixed(2)}`)
    
    console.log(`   📊 Total Descontos Atual: R$ ${(h.total_descontos || 0).toFixed(2)}`)
    
    const novoTotalDescontos = (h.inss || 0) + (h.irrf || 0) + (h.vale_transporte || 0) + 
                               (h.pensao_alimenticia || 0) + adiantamento40
    console.log(`   📊 Total Descontos Novo: R$ ${novoTotalDescontos.toFixed(2)}`)
    
    console.log(`   💵 Salário Líquido Atual: R$ ${(h.salario_liquido || 0).toFixed(2)}`)
    
    const novoSalarioLiquido = (h.salario_base || 0) - novoTotalDescontos
    console.log(`   💵 Salário Líquido Novo: R$ ${novoSalarioLiquido.toFixed(2)}`)
    
    console.log('   ' + '-'.repeat(76))
  })

  console.log('\n' + '='.repeat(80))
  console.log('📊 RESUMO')
  console.log('='.repeat(80))
  console.log(`Total de holerites mensais: ${holeristesMensais.length}`)
  console.log(`Holerites SEM adiantamento: ${holeristesMensais.filter(h => !h.adiantamento || h.adiantamento === 0).length}`)
  console.log(`Holerites COM adiantamento: ${holeristesMensais.filter(h => h.adiantamento && h.adiantamento > 0).length}`)
  console.log('='.repeat(80))
}

// Executar
verificarHolerites()
  .then(() => {
    console.log('\n✅ Verificação concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })
