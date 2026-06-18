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

async function verificarItensPersonalizadosLeonardo() {
  try {
    console.log('🔍 Verificando itens personalizados do Leonardo...\n')
    
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
    
    // Buscar TODOS os itens personalizados do Leonardo
    const { data: itens, error: errorItens } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', leonardo.id)
      .order('created_at', { ascending: false })
    
    if (errorItens) {
      console.error('❌ Erro ao buscar itens:', errorItens)
      return
    }
    
    if (!itens || itens.length === 0) {
      console.log('✅ Nenhum item personalizado encontrado')
      return
    }
    
    console.log(`📋 Total de itens personalizados: ${itens.length}\n`)
    
    // Agrupar por descrição para detectar duplicações
    const itensPorDescricao = {}
    
    itens.forEach((item) => {
      const descricao = item.descricao.toUpperCase()
      if (!itensPorDescricao[descricao]) {
        itensPorDescricao[descricao] = []
      }
      itensPorDescricao[descricao].push(item)
    })
    
    // Verificar duplicações
    let duplicacoesEncontradas = false
    
    Object.keys(itensPorDescricao).forEach((descricao) => {
      const itensComMesmaDescricao = itensPorDescricao[descricao]
      
      if (itensComMesmaDescricao.length > 1) {
        duplicacoesEncontradas = true
        console.log(`⚠️  DUPLICAÇÃO ENCONTRADA: ${descricao}`)
        console.log(`   Total de registros: ${itensComMesmaDescricao.length}\n`)
        
        itensComMesmaDescricao.forEach((item, index) => {
          console.log(`   ${index + 1}. ID: ${item.id}`)
          console.log(`      Valor: R$ ${item.valor?.toFixed(2)}`)
          console.log(`      Tipo: ${item.tipo}`)
          console.log(`      Vigência: ${item.vigencia_tipo}`)
          console.log(`      Data Início: ${item.data_inicio}`)
          console.log(`      Data Fim: ${item.data_fim || 'sem data fim'}`)
          console.log(`      Criado em: ${item.created_at}`)
          console.log(`      Atualizado em: ${item.updated_at}`)
          console.log()
        })
      } else {
        console.log(`✅ ${descricao}: 1 registro (OK)`)
        const item = itensComMesmaDescricao[0]
        console.log(`   ID: ${item.id} | Valor: R$ ${item.valor?.toFixed(2)} | Tipo: ${item.tipo}`)
        console.log()
      }
    })
    
    if (!duplicacoesEncontradas) {
      console.log('\n✅ Nenhuma duplicação encontrada!')
    } else {
      console.log('\n⚠️  AÇÃO NECESSÁRIA: Remover itens duplicados')
      console.log('   Use o script de exclusão para remover os registros duplicados')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarItensPersonalizadosLeonardo()
