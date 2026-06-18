import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function corrigirDatasHoleritesAbril() {
  console.log('🔍 Buscando holerites de abril/2026 com datas incorretas...\n')

  // Buscar holerites mensais de abril/2026
  const { data: holerites, error } = await supabase
    .from('holerites')
    .select('*')
    .eq('ano_referencia', 2026)
    .eq('mes_referencia', 4)
    .eq('tipo', 'mensal')
    .order('funcionario_id')

  if (error) {
    console.error('❌ Erro ao buscar holerites:', error)
    return
  }

  if (!holerites || holerites.length === 0) {
    console.log('ℹ️  Nenhum holerite de abril/2026 encontrado')
    return
  }

  console.log(`📋 Encontrados ${holerites.length} holerites de abril/2026\n`)

  // Filtrar apenas os que têm data_inicio ou data_fim incorretas
  const holeritesComErro = holerites.filter(h => {
    const dataInicio = h.data_inicio ? new Date(h.data_inicio) : null
    const dataFim = h.data_fim ? new Date(h.data_fim) : null
    
    // Verificar se as datas estão em março ao invés de abril
    const inicioErrada = dataInicio && dataInicio.getMonth() === 2 // março = 2
    const fimErrada = dataFim && dataFim.getMonth() === 2
    
    return inicioErrada || fimErrada
  })

  if (holeritesComErro.length === 0) {
    console.log('✅ Todos os holerites de abril já estão com as datas corretas!')
    return
  }

  console.log(`⚠️  ${holeritesComErro.length} holerites com datas incorretas:\n`)

  for (const holerite of holeritesComErro) {
    console.log(`ID: ${holerite.id}`)
    console.log(`  Funcionário ID: ${holerite.funcionario_id}`)
    console.log(`  Data início atual: ${holerite.data_inicio}`)
    console.log(`  Data fim atual: ${holerite.data_fim}`)
    console.log(`  Data pagamento: ${holerite.data_pagamento}`)
    console.log('')
  }

  // Confirmar correção
  console.log('🔧 Corrigindo datas para abril/2026...\n')

  let corrigidos = 0
  let erros = 0

  for (const holerite of holeritesComErro) {
    const { error: updateError } = await supabase
      .from('holerites')
      .update({
        data_inicio: '2026-04-01',
        data_fim: '2026-04-30'
      })
      .eq('id', holerite.id)

    if (updateError) {
      console.error(`❌ Erro ao corrigir holerite ${holerite.id}:`, updateError)
      erros++
    } else {
      console.log(`✅ Holerite ${holerite.id} corrigido: 01/04/2026 - 30/04/2026`)
      corrigidos++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Correção concluída!`)
  console.log(`   Corrigidos: ${corrigidos}`)
  console.log(`   Erros: ${erros}`)
  console.log('='.repeat(50))
}

corrigirDatasHoleritesAbril()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })
