import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarPensaoLeonardo() {
  console.log('🔍 Verificando pensão alimentícia do Leonardo no banco...\n')

  try {
    // Buscar funcionário Leonardo
    const { data: funcionario, error: errorFunc } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .ilike('nome_completo', '%leonardo%')
      .single()

    if (errorFunc || !funcionario) {
      console.error('❌ Erro ao buscar funcionário Leonardo:', errorFunc)
      return
    }

    console.log('👤 Funcionário encontrado:')
    console.log('   ID:', funcionario.id)
    console.log('   Nome:', funcionario.nome_completo)
    console.log()

    // Buscar holerites do Leonardo
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .order('periodo_inicio', { ascending: false })

    if (errorHol) {
      console.error('❌ Erro ao buscar holerites:', errorHol)
      return
    }

    if (!holerites || holerites.length === 0) {
      console.log('⚠️ Nenhum holerite encontrado para Leonardo')
      return
    }

    console.log(`📋 Holerites encontrados: ${holerites.length}\n`)

    // Analisar cada holerite
    holerites.forEach((holerite, index) => {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`HOLERITE #${index + 1} - ID: ${holerite.id}`)
      console.log('='.repeat(60))
      
      const periodoInicio = new Date(holerite.periodo_inicio + 'T00:00:00')
      const periodoFim = new Date(holerite.periodo_fim + 'T00:00:00')
      
      console.log(`📅 Período: ${periodoInicio.toLocaleDateString('pt-BR')} - ${periodoFim.toLocaleDateString('pt-BR')}`)
      console.log(`📊 Status: ${holerite.status}`)
      console.log()
      
      // Valores principais
      console.log('💰 VALORES:')
      console.log(`   Salário Base: R$ ${Number(holerite.salario_base || 0).toFixed(2)}`)
      console.log(`   Dias Trabalhados: ${holerite.dias_trabalhados || 30} dias`)
      console.log(`   Total Proventos: R$ ${Number(holerite.total_proventos || 0).toFixed(2)}`)
      console.log(`   Total Descontos: R$ ${Number(holerite.total_descontos || 0).toFixed(2)}`)
      console.log(`   Salário Líquido: R$ ${Number(holerite.salario_liquido || 0).toFixed(2)}`)
      console.log()
      
      // Descontos detalhados
      console.log('📉 DESCONTOS:')
      console.log(`   INSS: R$ ${Number(holerite.inss || 0).toFixed(2)}`)
      console.log(`   IRRF: R$ ${Number(holerite.irrf || 0).toFixed(2)}`)
      console.log(`   Vale Transporte: R$ ${Number(holerite.vale_transporte || 0).toFixed(2)}`)
      console.log(`   Adiantamento: R$ ${Number(holerite.adiantamento || 0).toFixed(2)}`)
      
      // PENSÃO ALIMENTÍCIA - DESTAQUE
      const pensao = Number(holerite.pensao_alimenticia || 0)
      if (pensao > 0) {
        console.log(`   💜 PENSÃO ALIMENTÍCIA: R$ ${pensao.toFixed(2)} ✅`)
      } else {
        console.log(`   💜 PENSÃO ALIMENTÍCIA: R$ 0,00 ❌ (ZERO OU NULL)`)
      }
      console.log()
      
      // Verificar se apareceria no modal
      console.log('🔍 VERIFICAÇÃO MODAL:')
      if (pensao > 0) {
        console.log('   ✅ A pensão DEVERIA aparecer no modal')
        console.log(`   ✅ Condição: pensao_alimenticia (${pensao}) > 0`)
      } else {
        console.log('   ❌ A pensão NÃO aparecerá no modal')
        console.log('   ❌ Motivo: valor é 0 ou null')
        console.log('   💡 Solução: Editar o holerite e salvar novamente')
      }
    })

    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMO')
    console.log('='.repeat(60))
    
    const comPensao = holerites.filter(h => Number(h.pensao_alimenticia || 0) > 0)
    const semPensao = holerites.filter(h => Number(h.pensao_alimenticia || 0) === 0)
    
    console.log(`✅ Holerites COM pensão: ${comPensao.length}`)
    console.log(`❌ Holerites SEM pensão: ${semPensao.length}`)
    console.log()
    
    if (semPensao.length > 0) {
      console.log('💡 AÇÃO NECESSÁRIA:')
      console.log('   1. Acesse o sistema: https://rhqualitec.vercel.app')
      console.log('   2. Vá em Admin > Holerites')
      console.log('   3. Edite cada holerite do Leonardo')
      console.log('   4. Configure a pensão (modo percentual ou fixo)')
      console.log('   5. Salve o holerite')
      console.log('   6. A pensão aparecerá no modal após salvar')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

// Executar
verificarPensaoLeonardo()
