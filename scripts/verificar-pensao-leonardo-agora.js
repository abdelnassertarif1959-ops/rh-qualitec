import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarPensaoLeonardo() {
  try {
    console.log('🔍 Verificando pensão alimentícia do Leonardo...\n')
    
    // Buscar funcionário Leonardo
    const { data: funcionarios, error: errorFunc } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .ilike('nome_completo', '%leonardo%')
    
    if (errorFunc || !funcionarios || funcionarios.length === 0) {
      console.error('❌ Leonardo não encontrado')
      return
    }
    
    const leonardo = funcionarios[0]
    console.log(`👤 Funcionário: ${leonardo.nome_completo} (ID: ${leonardo.id})\n`)
    
    // Buscar holerite mais recente do Leonardo
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', leonardo.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (errorHol || !holerites || holerites.length === 0) {
      console.error('❌ Nenhum holerite encontrado para Leonardo')
      return
    }
    
    const holerite = holerites[0]
    
    console.log('📄 Holerite mais recente:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base?.toFixed(2) || '0.00'}`)
    console.log(`   Total Proventos: R$ ${holerite.total_proventos?.toFixed(2) || '0.00'}`)
    console.log(`   INSS: R$ ${holerite.inss?.toFixed(2) || '0.00'}`)
    console.log(`   IRRF: R$ ${holerite.irrf?.toFixed(2) || '0.00'}`)
    console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia?.toFixed(2) || '0.00'}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos?.toFixed(2) || '0.00'}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido?.toFixed(2) || '0.00'}`)
    
    // Verificar se há itens personalizados de pensão
    const { data: itens, error: errorItens } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', leonardo.id)
      .ilike('descricao', '%pensão%')
    
    if (itens && itens.length > 0) {
      console.log(`\n⚠️  ITENS PERSONALIZADOS DE PENSÃO ENCONTRADOS: ${itens.length}`)
      itens.forEach((item, index) => {
        console.log(`\n   ${index + 1}. Item ID: ${item.id}`)
        console.log(`      Descrição: ${item.descricao}`)
        console.log(`      Valor: R$ ${item.valor?.toFixed(2)}`)
        console.log(`      Tipo: ${item.tipo}`)
        console.log(`      Vigência: ${item.vigencia_tipo}`)
        console.log(`      Data Início: ${item.data_inicio}`)
        console.log(`      Data Fim: ${item.data_fim || 'sem data fim'}`)
      })
    } else {
      console.log('\n✅ Nenhum item personalizado de pensão encontrado')
    }
    
    // Calcular total de descontos manualmente
    const totalDescontosCalculado = 
      (holerite.inss || 0) +
      (holerite.irrf || 0) +
      (holerite.vale_transporte || 0) +
      (holerite.vale_refeicao_desconto || 0) +
      (holerite.plano_saude || 0) +
      (holerite.plano_odontologico || 0) +
      (holerite.adiantamento || 0) +
      (holerite.faltas || 0) +
      (holerite.pensao_alimenticia || 0)
    
    console.log(`\n📊 Análise de Descontos:`)
    console.log(`   Total Descontos (banco): R$ ${holerite.total_descontos?.toFixed(2) || '0.00'}`)
    console.log(`   Total Descontos (calculado): R$ ${totalDescontosCalculado.toFixed(2)}`)
    console.log(`   Diferença: R$ ${Math.abs((holerite.total_descontos || 0) - totalDescontosCalculado).toFixed(2)}`)
    
    if (Math.abs((holerite.total_descontos || 0) - totalDescontosCalculado) > 0.01) {
      console.log(`\n⚠️  POSSÍVEL DUPLICAÇÃO DETECTADA!`)
      console.log(`   A diferença sugere que a pensão pode estar sendo contada 2 vezes`)
      
      // Se a diferença for aproximadamente igual à pensão, confirma duplicação
      if (Math.abs((holerite.total_descontos || 0) - totalDescontosCalculado - (holerite.pensao_alimenticia || 0)) < 0.01) {
        console.log(`   ✅ CONFIRMADO: Pensão está duplicada!`)
        console.log(`   Valor duplicado: R$ ${holerite.pensao_alimenticia?.toFixed(2)}`)
      }
    } else {
      console.log(`\n✅ Descontos estão corretos (sem duplicação)`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarPensaoLeonardo()
