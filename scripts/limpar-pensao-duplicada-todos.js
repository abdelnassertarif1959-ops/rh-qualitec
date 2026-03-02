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

async function limparPensaoDuplicada() {
  try {
    console.log('🧹 Limpando itens personalizados de pensão alimentícia duplicados...\n')
    
    // Buscar TODOS os itens personalizados de pensão
    const { data: itens, error: errorItens } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .ilike('descricao', '%pensão%')
      .order('created_at', { ascending: true })
    
    if (errorItens) {
      console.error('❌ Erro ao buscar itens:', errorItens)
      return
    }
    
    if (!itens || itens.length === 0) {
      console.log('✅ Nenhum item de pensão encontrado')
      return
    }
    
    console.log(`📋 Encontrados ${itens.length} itens de pensão alimentícia:\n`)
    
    // Agrupar por funcionário
    const itensPorFuncionario = {}
    itens.forEach(item => {
      if (!itensPorFuncionario[item.funcionario_id]) {
        itensPorFuncionario[item.funcionario_id] = []
      }
      itensPorFuncionario[item.funcionario_id].push(item)
    })
    
    let totalExcluidos = 0
    
    // Para cada funcionário, excluir TODOS os itens de pensão
    for (const [funcId, itensFunc] of Object.entries(itensPorFuncionario)) {
      console.log(`\n👤 Funcionário ID: ${funcId}`)
      console.log(`   Itens de pensão encontrados: ${itensFunc.length}`)
      
      // Buscar nome do funcionário
      const { data: func } = await supabase
        .from('funcionarios')
        .select('nome_completo')
        .eq('id', funcId)
        .single()
      
      if (func) {
        console.log(`   Nome: ${func.nome_completo}`)
      }
      
      // Excluir TODOS os itens de pensão deste funcionário
      for (const item of itensFunc) {
        console.log(`\n   🗑️  Excluindo item ID ${item.id}:`)
        console.log(`      Descrição: ${item.descricao}`)
        console.log(`      Valor: R$ ${item.valor.toFixed(2)}`)
        console.log(`      Tipo: ${item.tipo}`)
        console.log(`      Vigência: ${item.vigencia_tipo}`)
        
        const { error: errorDelete } = await supabase
          .from('holerite_itens_personalizados')
          .delete()
          .eq('id', item.id)
        
        if (errorDelete) {
          console.error(`      ❌ Erro ao excluir: ${errorDelete.message}`)
        } else {
          console.log(`      ✅ Excluído com sucesso`)
          totalExcluidos++
        }
      }
    }
    
    console.log(`\n\n✅ LIMPEZA CONCLUÍDA!`)
    console.log(`   Total de itens excluídos: ${totalExcluidos}`)
    console.log(`\n📝 IMPORTANTE:`)
    console.log(`   - A pensão alimentícia deve ser gerenciada APENAS pelo campo do holerite`)
    console.log(`   - NÃO criar itens personalizados de pensão`)
    console.log(`   - O sistema já tem campo específico para pensão na aba "Descontos"`)
    console.log(`   - Itens personalizados são para benefícios/descontos não previstos`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

limparPensaoDuplicada()
