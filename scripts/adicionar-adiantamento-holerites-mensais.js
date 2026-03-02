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

async function adicionarAdiantamentoHolerites() {
  console.log('🔍 Buscando holerites mensais...\n')

  // Buscar todos os holerites
  const { data: holerites, error } = await supabase
    .from('holerites')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Erro ao buscar holerites:', error)
    return
  }

  if (!holerites || holerites.length === 0) {
    console.log('⚠️  Nenhum holerite encontrado')
    return
  }

  // Filtrar apenas holerites mensais (periodo_inicio dia 1)
  const holeristesMensais = holerites.filter(h => {
    const data = new Date(h.periodo_inicio)
    return data.getDate() === 1
  })

  console.log(`📊 Total de holerites: ${holerites.length}`)
  console.log(`📊 Holerites mensais encontrados: ${holeristesMensais.length}\n`)

  if (holeristesMensais.length === 0) {
    console.log('⚠️  Nenhum holerite mensal encontrado')
    return
  }

  let atualizados = 0
  let erros = 0

  for (const holerite of holeristesMensais) {
    console.log(`\n📄 Processando holerite ID: ${holerite.id}`)
    console.log(`   Funcionário ID: ${holerite.funcionario_id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base?.toFixed(2) || '0.00'}`)

    // Calcular 40% do salário base como adiantamento
    const salarioBase = parseFloat(holerite.salario_base) || 0
    const adiantamento = salarioBase * 0.40

    console.log(`   💰 Adiantamento (40%): R$ ${adiantamento.toFixed(2)}`)

    // Recalcular total de descontos
    const inss = parseFloat(holerite.inss) || 0
    const irrf = parseFloat(holerite.irrf) || 0
    const valeTransporte = parseFloat(holerite.vale_transporte) || 0
    const pensaoAlimenticia = parseFloat(holerite.pensao_alimenticia) || 0

    const totalDescontos = inss + irrf + valeTransporte + pensaoAlimenticia + adiantamento

    console.log(`   📉 Total Descontos Anterior: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
    console.log(`   📉 Total Descontos Novo: R$ ${totalDescontos.toFixed(2)}`)

    // Recalcular salário líquido
    const salarioLiquido = salarioBase - totalDescontos

    console.log(`   💵 Salário Líquido Anterior: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    console.log(`   💵 Salário Líquido Novo: R$ ${salarioLiquido.toFixed(2)}`)

    // Atualizar holerite
    const { error: updateError } = await supabase
      .from('holerites')
      .update({
        adiantamento: adiantamento,
        total_descontos: totalDescontos,
        salario_liquido: salarioLiquido,
        updated_at: new Date().toISOString()
      })
      .eq('id', holerite.id)

    if (updateError) {
      console.error(`   ❌ Erro ao atualizar holerite ${holerite.id}:`, updateError)
      erros++
    } else {
      console.log(`   ✅ Holerite atualizado com sucesso!`)
      atualizados++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO DA ATUALIZAÇÃO')
  console.log('='.repeat(60))
  console.log(`✅ Holerites atualizados: ${atualizados}`)
  console.log(`❌ Erros: ${erros}`)
  console.log(`📋 Total processados: ${holeristesMensais.length}`)
  console.log('='.repeat(60))
}

// Executar
adicionarAdiantamentoHolerites()
  .then(() => {
    console.log('\n✅ Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })
