/**
 * Script para testar a correção de campos numéricos vazios no PATCH de holerites
 * 
 * Testa se strings vazias são convertidas corretamente em 0 para campos numéricos
 */

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

async function testarCorrecaoCamposVazios() {
  console.log('🧪 Testando correção de campos numéricos vazios...\n')

  try {
    // 1. Buscar um holerite para testar
    const { data: holerites, error: erroHolerites } = await supabase
      .from('holerites')
      .select('*')
      .limit(1)
      .single()

    if (erroHolerites || !holerites) {
      console.error('❌ Erro ao buscar holerite:', erroHolerites)
      return
    }

    console.log('✅ Holerite encontrado:', holerites.id)
    console.log('   Funcionário ID:', holerites.funcionario_id)
    console.log('   Salário Base:', holerites.salario_base)
    console.log('')

    // 2. Simular atualização com campos vazios (como vem do formulário)
    const dadosComCamposVazios = {
      bonus: '', // String vazia
      horas_extras: '', // String vazia
      adicional_noturno: '', // String vazia
      observacoes: '', // String vazia
      vale_transporte: '0', // String com zero
      plano_saude: null, // Null
      faltas: undefined // Undefined
    }

    console.log('📝 Dados de teste (simulando formulário):')
    console.log(JSON.stringify(dadosComCamposVazios, null, 2))
    console.log('')

    // 3. Testar a API local
    console.log('🔄 Testando API PATCH /api/holerites/[id]...')
    
    const response = await fetch(`http://localhost:3000/api/holerites/${holerites.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosComCamposVazios)
    })

    if (!response.ok) {
      const erro = await response.json()
      console.error('❌ Erro na API:', erro)
      console.error('   Status:', response.status)
      console.error('   Mensagem:', erro.message || erro.statusMessage)
      return
    }

    const resultado = await response.json()
    console.log('✅ API respondeu com sucesso!')
    console.log('')

    // 4. Verificar se os dados foram salvos corretamente
    const { data: holeriteAtualizado, error: erroVerificacao } = await supabase
      .from('holerites')
      .select('*')
      .eq('id', holerites.id)
      .single()

    if (erroVerificacao || !holeriteAtualizado) {
      console.error('❌ Erro ao verificar holerite:', erroVerificacao)
      return
    }

    console.log('📊 Valores salvos no banco:')
    console.log('   bonus:', holeriteAtualizado.bonus, '(esperado: 0)')
    console.log('   horas_extras:', holeriteAtualizado.horas_extras, '(esperado: 0)')
    console.log('   adicional_noturno:', holeriteAtualizado.adicional_noturno, '(esperado: 0)')
    console.log('   vale_transporte:', holeriteAtualizado.vale_transporte, '(esperado: 0)')
    console.log('   observacoes:', holeriteAtualizado.observacoes, '(esperado: null)')
    console.log('')

    // 5. Validar resultados
    const validacoes = [
      { campo: 'bonus', valor: holeriteAtualizado.bonus, esperado: 0 },
      { campo: 'horas_extras', valor: holeriteAtualizado.horas_extras, esperado: 0 },
      { campo: 'adicional_noturno', valor: holeriteAtualizado.adicional_noturno, esperado: 0 },
      { campo: 'vale_transporte', valor: holeriteAtualizado.vale_transporte, esperado: 0 }
    ]

    let todosCorretos = true
    for (const validacao of validacoes) {
      if (validacao.valor !== validacao.esperado) {
        console.error(`❌ ${validacao.campo}: ${validacao.valor} (esperado: ${validacao.esperado})`)
        todosCorretos = false
      } else {
        console.log(`✅ ${validacao.campo}: ${validacao.valor}`)
      }
    }

    console.log('')
    if (todosCorretos) {
      console.log('🎉 TESTE PASSOU! Todos os campos foram convertidos corretamente.')
    } else {
      console.log('❌ TESTE FALHOU! Alguns campos não foram convertidos corretamente.')
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarCorrecaoCamposVazios()
