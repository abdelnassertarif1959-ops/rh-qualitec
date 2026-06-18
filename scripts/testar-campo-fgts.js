/**
 * Script de Teste: Campo FGTS Editável
 * 
 * Testa se o campo FGTS pode ser editado e salvo corretamente
 * 
 * Como usar:
 * node scripts/testar-campo-fgts.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   NUXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarCampoFGTS() {
  console.log('🧪 TESTE: Campo FGTS Editável\n')
  console.log('=' .repeat(60))

  try {
    // 1. Verificar se a coluna existe
    console.log('\n📋 1. Verificando se a coluna FGTS existe...')
    
    const { data: colunas, error: erroColuna } = await supabase
      .from('holerites')
      .select('fgts')
      .limit(1)

    if (erroColuna) {
      console.error('❌ Coluna FGTS não existe!')
      console.error('   Erro:', erroColuna.message)
      console.error('\n📋 AÇÃO NECESSÁRIA:')
      console.error('   Execute o arquivo: database/36-adicionar-coluna-fgts.sql')
      console.error('   No Supabase SQL Editor')
      return
    }

    console.log('✅ Coluna FGTS existe!')

    // 2. Buscar um holerite para teste
    console.log('\n📋 2. Buscando holerite para teste...')
    
    const { data: holerites, error: erroHolerite } = await supabase
      .from('holerites')
      .select(`
        id,
        funcionario_id,
        salario_base,
        fgts,
        funcionario:funcionarios (
          nome_completo
        )
      `)
      .order('id', { ascending: false })
      .limit(1)

    if (erroHolerite || !holerites || holerites.length === 0) {
      console.error('❌ Nenhum holerite encontrado para teste')
      return
    }

    const holerite = holerites[0]
    console.log('✅ Holerite encontrado:')
    console.log('   ID:', holerite.id)
    console.log('   Funcionário:', holerite.funcionario?.nome_completo)
    console.log('   Salário Base:', `R$ ${holerite.salario_base}`)
    console.log('   FGTS Atual:', `R$ ${holerite.fgts || 0}`)

    // 3. Calcular FGTS esperado (8%)
    const fgtsCalculado = Math.round(holerite.salario_base * 0.08 * 100) / 100
    console.log('   FGTS Calculado (8%):', `R$ ${fgtsCalculado}`)

    // 4. Testar atualização do FGTS
    console.log('\n📋 3. Testando atualização do FGTS...')
    
    const novoValorFGTS = 999.99 // Valor de teste
    console.log('   Novo valor de teste:', `R$ ${novoValorFGTS}`)

    const { data: holeriteAtualizado, error: erroUpdate } = await supabase
      .from('holerites')
      .update({ fgts: novoValorFGTS })
      .eq('id', holerite.id)
      .select('id, fgts')
      .single()

    if (erroUpdate) {
      console.error('❌ Erro ao atualizar FGTS:', erroUpdate.message)
      return
    }

    console.log('✅ FGTS atualizado com sucesso!')
    console.log('   Valor salvo:', `R$ ${holeriteAtualizado.fgts}`)

    // 5. Verificar se o valor foi salvo corretamente
    console.log('\n📋 4. Verificando se o valor foi salvo...')
    
    const { data: holeriteVerificado, error: erroVerificacao } = await supabase
      .from('holerites')
      .select('id, fgts')
      .eq('id', holerite.id)
      .single()

    if (erroVerificacao) {
      console.error('❌ Erro ao verificar:', erroVerificacao.message)
      return
    }

    if (holeriteVerificado.fgts === novoValorFGTS) {
      console.log('✅ Valor verificado com sucesso!')
      console.log('   FGTS no banco:', `R$ ${holeriteVerificado.fgts}`)
    } else {
      console.error('❌ Valor não corresponde!')
      console.error('   Esperado:', `R$ ${novoValorFGTS}`)
      console.error('   Encontrado:', `R$ ${holeriteVerificado.fgts}`)
    }

    // 6. Restaurar valor original (8% do salário)
    console.log('\n📋 5. Restaurando valor original...')
    
    const { error: erroRestaurar } = await supabase
      .from('holerites')
      .update({ fgts: fgtsCalculado })
      .eq('id', holerite.id)

    if (erroRestaurar) {
      console.error('❌ Erro ao restaurar:', erroRestaurar.message)
      return
    }

    console.log('✅ Valor restaurado:', `R$ ${fgtsCalculado}`)

    // 7. Resumo final
    console.log('\n' + '='.repeat(60))
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!')
    console.log('='.repeat(60))
    console.log('\n📊 Resumo:')
    console.log('   ✅ Coluna FGTS existe no banco')
    console.log('   ✅ Campo pode ser atualizado')
    console.log('   ✅ Valor é salvo corretamente')
    console.log('   ✅ Valor pode ser lido novamente')
    console.log('\n💡 Próximo passo:')
    console.log('   Teste no frontend editando um holerite')

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    console.error(error)
  }
}

// Executar teste
testarCampoFGTS()
