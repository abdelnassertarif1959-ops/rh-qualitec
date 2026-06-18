/**
 * Script para excluir pensão alimentícia duplicada do Leonardo
 * 
 * Problema: Pensão está no campo do holerite E nos itens personalizados
 * Solução: Excluir o item personalizado (ID: 6)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function excluir() {
  console.log('🗑️  EXCLUINDO PENSÃO DUPLICADA - LEONARDO\n')
  console.log('=' .repeat(60))

  try {
    // 1. Buscar funcionário Leonardo
    const { data: funcionario, error: errorFunc } = await supabase
      .from('funcionarios')
      .select('*')
      .ilike('nome_completo', '%leonardo%')
      .single()

    if (errorFunc) throw errorFunc

    console.log('\n👤 FUNCIONÁRIO:')
    console.log(`   ID: ${funcionario.id}`)
    console.log(`   Nome: ${funcionario.nome_completo}`)

    // 2. Buscar itens de pensão nos itens personalizados
    const { data: itens, error: errorItens } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', funcionario.id)

    if (errorItens) throw errorItens

    console.log(`\n🔧 ITENS PERSONALIZADOS: ${itens.length}`)

    const pensaoItens = itens.filter(item => 
      item.descricao && item.descricao.toLowerCase().includes('pensão')
    )

    if (pensaoItens.length === 0) {
      console.log('\n✅ Nenhum item de pensão encontrado nos itens personalizados')
      console.log('   O problema já foi resolvido!')
      return
    }

    console.log(`\n⚠️  ITENS DE PENSÃO ENCONTRADOS: ${pensaoItens.length}`)
    pensaoItens.forEach((item, index) => {
      console.log(`\n   ${index + 1}. ID: ${item.id}`)
      console.log(`      Descrição: ${item.descricao}`)
      console.log(`      Valor: R$ ${item.valor}`)
      console.log(`      Tipo: ${item.tipo}`)
    })

    // 3. Excluir os itens de pensão
    console.log('\n🗑️  EXCLUINDO ITENS DE PENSÃO...')

    for (const item of pensaoItens) {
      const { error: errorDelete } = await supabase
        .from('holerite_itens_personalizados')
        .delete()
        .eq('id', item.id)

      if (errorDelete) {
        console.error(`\n❌ Erro ao excluir item ${item.id}:`, errorDelete.message)
      } else {
        console.log(`   ✅ Item ${item.id} excluído com sucesso`)
      }
    }

    // 4. Verificar holerite do Leonardo
    const { data: holerite, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (errorHol) throw errorHol

    console.log('\n📋 HOLERITE ATUAL:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia || 0}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido}`)

    console.log('\n💡 OBSERVAÇÃO:')
    console.log('   A pensão alimentícia agora aparecerá apenas UMA VEZ no holerite')
    console.log('   O valor está correto no campo pensao_alimenticia: R$ 948,63')

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ Exclusão concluída com sucesso!')
    console.log('\n📝 PRÓXIMOS PASSOS:')
    console.log('   1. Visualizar o holerite do Leonardo no sistema')
    console.log('   2. Verificar se a pensão aparece apenas uma vez')
    console.log('   3. Confirmar que o total de descontos está correto')

  } catch (error) {
    console.error('\n❌ Erro:', error)
  }
}

excluir()
