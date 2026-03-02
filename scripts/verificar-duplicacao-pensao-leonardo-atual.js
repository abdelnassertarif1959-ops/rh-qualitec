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

    // 2. Buscar todos os holerites do Leonardo
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (errorHol) throw errorHol

    console.log(`\n📄 HOLERITES ENCONTRADOS: ${holerites.length}`)

    for (const holerite of holerites) {
      console.log('\n' + '='.repeat(60))
      console.log(`\n📋 HOLERITE ID: ${holerite.id}`)
      console.log(`   Tipo: ${holerite.tipo_folha}`)
      console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      console.log(`   Criado em: ${new Date(holerite.created_at).toLocaleString('pt-BR')}`)

      console.log('\n💰 VALORES:')
      console.log(`   Salário Base: R$ ${holerite.salario_base}`)
      console.log(`   Total Vencimentos: R$ ${holerite.total_vencimentos}`)
      console.log(`   Total Descontos: R$ ${holerite.total_descontos}`)
      console.log(`   Salário Líquido: R$ ${holerite.salario_liquido}`)

      console.log('\n📊 DESCONTOS:')
      console.log(`   INSS: R$ ${holerite.inss || 0}`)
      console.log(`   Adiantamento: R$ ${holerite.adiantamento_salarial || 0}`)
      console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia || 0}`)

      // 3. Buscar itens personalizados do funcionário
      const { data: itens, error: errorItens } = await supabase
        .from('holerite_itens_personalizados')
        .select('*')
        .eq('funcionario_id', funcionario.id)

      if (errorItens) {
        console.log('\n⚠️  Erro ao buscar itens personalizados:', errorItens.message)
      } else {
        console.log(`\n🔧 ITENS PERSONALIZADOS: ${itens.length}`)
        
        if (itens.length > 0) {
          itens.forEach((item, index) => {
            console.log(`\n   ${index + 1}. ${item.descricao}`)
            console.log(`      Código: ${item.codigo}`)
            console.log(`      Tipo: ${item.tipo}`)
            console.log(`      Valor: R$ ${item.valor}`)
            console.log(`      Referência: ${item.referencia || 'N/A'}`)
          })

          // Verificar duplicação de pensão
          const pensaoItens = itens.filter(item => 
            item.descricao && item.descricao.toLowerCase().includes('pensão')
          )

          if (pensaoItens.length > 0) {
            console.log('\n⚠️  PENSÃO ALIMENTÍCIA NOS ITENS PERSONALIZADOS:')
            pensaoItens.forEach((item, index) => {
              console.log(`   ${index + 1}. ID: ${item.id}`)
              console.log(`      Descrição: ${item.descricao}`)
              console.log(`      Valor: R$ ${item.valor}`)
              console.log(`      Código: ${item.codigo}`)
            })

            if (pensaoItens.length > 1) {
              console.log('\n❌ DUPLICAÇÃO DETECTADA!')
              console.log(`   Existem ${pensaoItens.length} itens de pensão alimentícia`)
              console.log('\n💡 AÇÃO NECESSÁRIA:')
              console.log('   Excluir os itens duplicados dos itens personalizados')
            }
          }
        }
      }

      // Verificar se pensão está no campo E nos itens
      if (holerite.pensao_alimenticia > 0 && itens && itens.some(i => i.descricao && i.descricao.toLowerCase().includes('pensão'))) {
        console.log('\n❌ DUPLICAÇÃO DETECTADA!')
        console.log('   Pensão está no campo do holerite E nos itens personalizados')
        console.log(`   Campo holerite: R$ ${holerite.pensao_alimenticia}`)
        console.log('\n💡 AÇÃO NECESSÁRIA:')
        console.log('   Excluir os itens de pensão dos itens personalizados')
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ Verificação concluída!')

  } catch (error) {
    console.error('\n❌ Erro:', error)
  }
}

verificar()
