/**
 * Script para verificar duplicação de pensão alimentícia no holerite do Leonardo
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verificar() {
  console.log('🔍 VERIFICANDO DUPLICAÇÃO DE PENSÃO - LEONARDO\n')
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
    console.log(`   Pensão Alimentícia: R$ ${funcionario.pensao_alimenticia || 0}`)
    console.log(`   Pensão Percentual: ${funcionario.pensao_percentual || 0}%`)

    // 2. Buscar holerite mais recente
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (errorHol) throw errorHol

    if (!holerites || holerites.length === 0) {
      console.log('\n❌ Nenhum holerite encontrado')
      return
    }

    const holerite = holerites[0]

    console.log('\n📄 HOLERITE MAIS RECENTE:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Tipo: ${holerite.tipo_folha}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)

    // 3. Verificar itens personalizados
    const { data: itens, error: errorItens } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .eq('ativo', true)
      .order('created_at', { ascending: false })

    if (errorItens) throw errorItens

    console.log('\n📋 ITENS PERSONALIZADOS:')
    if (itens && itens.length > 0) {
      itens.forEach(item => {
        console.log(`\n   ID: ${item.id}`)
        console.log(`   Descrição: ${item.descricao}`)
        console.log(`   Tipo: ${item.tipo}`)
        console.log(`   Valor: R$ ${item.valor}`)
        console.log(`   Vigência: ${item.vigencia_tipo}`)
        console.log(`   Período: ${item.data_inicio} até ${item.data_fim || 'indefinido'}`)
        console.log(`   Ativo: ${item.ativo}`)
      })

      // Verificar duplicação de pensão
      const pensoes = itens.filter(item => 
        item.descricao && item.descricao.toLowerCase().includes('pensão')
      )

      if (pensoes.length > 1) {
        console.log('\n⚠️  DUPLICAÇÃO DETECTADA!')
        console.log(`   Encontradas ${pensoes.length} entradas de pensão alimentícia`)
        console.log('\n   Detalhes das duplicações:')
        pensoes.forEach((p, index) => {
          console.log(`\n   ${index + 1}. ID: ${p.id}`)
          console.log(`      Descrição: ${p.descricao}`)
          console.log(`      Valor: R$ ${p.valor}`)
          console.log(`      Vigência: ${p.vigencia_tipo}`)
          console.log(`      Período: ${p.data_inicio} até ${p.data_fim || 'indefinido'}`)
        })

        // Identificar qual deve ser mantido e qual deve ser excluído
        console.log('\n💡 AÇÃO RECOMENDADA:')
        if (pensoes.length === 2 && pensoes[0].valor === pensoes[1].valor) {
          console.log(`   Excluir um dos registros duplicados (mesmo valor)`)
          console.log(`   Manter apenas: ID ${pensoes[0].id}`)
          console.log(`   Excluir: ID ${pensoes[1].id}`)
        }
      } else if (pensoes.length === 1) {
        console.log('\n✅ Apenas uma entrada de pensão encontrada (correto)')
      } else {
        console.log('\n⚠️  Nenhuma entrada de pensão encontrada')
      }
    } else {
      console.log('   Nenhum item personalizado encontrado')
    }

    // 4. Verificar campos do holerite
    console.log('\n💰 VALORES DO HOLERITE:')
    console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia || 0}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido}`)

    // 5. Calcular o que deveria ser
    const pensaoCorreta = funcionario.pensao_alimenticia || 0
    const descontosEsperados = (holerite.inss || 0) + 
                               (holerite.irrf || 0) + 
                               pensaoCorreta +
                               (holerite.vale_transporte || 0) +
                               (holerite.vale_refeicao || 0) +
                               (holerite.plano_saude || 0) +
                               (holerite.plano_odontologico || 0)

    console.log('\n🧮 CÁLCULO ESPERADO:')
    console.log(`   Pensão correta: R$ ${pensaoCorreta}`)
    console.log(`   Total descontos esperado: R$ ${descontosEsperados.toFixed(2)}`)
    console.log(`   Total descontos atual: R$ ${holerite.total_descontos}`)
    console.log(`   Diferença: R$ ${(holerite.total_descontos - descontosEsperados).toFixed(2)}`)

    console.log('\n' + '=' .repeat(60))
    console.log('\n✅ Verificação concluída!')

  } catch (error) {
    console.error('\n❌ Erro:', error)
  }
}

verificar()
