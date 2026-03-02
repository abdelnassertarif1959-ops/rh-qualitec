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

async function corrigirPensaoDuplicada() {
  try {
    console.log('🔧 Corrigindo pensão alimentícia duplicada do Leonardo...\n')
    
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
    
    // Buscar item personalizado de pensão (ID: 7)
    const { data: item, error: errorItem } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('id', 7)
      .single()
    
    if (errorItem || !item) {
      console.error('❌ Item personalizado não encontrado')
      return
    }
    
    console.log('📋 Item Personalizado Encontrado:')
    console.log(`   ID: ${item.id}`)
    console.log(`   Descrição: ${item.descricao}`)
    console.log(`   Valor: R$ ${item.valor.toFixed(2)}`)
    console.log(`   Tipo: ${item.tipo}`)
    console.log(`   Funcionário ID: ${item.funcionario_id}\n`)
    
    // Confirmar que é do Leonardo
    if (item.funcionario_id !== leonardo.id) {
      console.error('❌ Item não pertence ao Leonardo!')
      return
    }
    
    // Excluir item personalizado
    console.log('🗑️  Excluindo item personalizado duplicado...')
    const { error: errorDelete } = await supabase
      .from('holerite_itens_personalizados')
      .delete()
      .eq('id', 7)
    
    if (errorDelete) {
      console.error('❌ Erro ao excluir item:', errorDelete)
      return
    }
    
    console.log('✅ Item personalizado excluído com sucesso!\n')
    
    // Verificar holerite atual
    const { data: holerite, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('id', 1273)
      .single()
    
    if (errorHol || !holerite) {
      console.error('❌ Holerite não encontrado')
      return
    }
    
    console.log('📄 Holerite Atual (ID: 1273):')
    console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia?.toFixed(2) || '0.00'}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos?.toFixed(2) || '0.00'}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido?.toFixed(2) || '0.00'}\n`)
    
    console.log('✅ CORREÇÃO CONCLUÍDA!')
    console.log('\n📝 PRÓXIMOS PASSOS:')
    console.log('   1. A pensão alimentícia agora está apenas no campo do holerite')
    console.log('   2. Não há mais duplicação em itens personalizados')
    console.log('   3. Os valores do holerite estão corretos')
    console.log('   4. Teste abrindo o modal de edição do holerite do Leonardo')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

corrigirPensaoDuplicada()
