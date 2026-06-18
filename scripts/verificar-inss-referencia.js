import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarInssReferencia() {
  try {
    console.log('🔍 Verificando campo inss_referencia nos holerites...\n')
    
    // Buscar todos os holerites com INSS fixo
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('id, funcionario_id, inss, inss_percentual, inss_referencia')
      .gt('inss', 0)
      .order('id', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('❌ Erro ao buscar holerites:', error)
      return
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('⚠️  Nenhum holerite encontrado com INSS')
      return
    }
    
    console.log(`📊 Encontrados ${holerites.length} holerites com INSS:\n`)
    
    holerites.forEach((h, index) => {
      console.log(`${index + 1}. Holerite ID: ${h.id}`)
      console.log(`   Funcionário ID: ${h.funcionario_id}`)
      console.log(`   INSS Valor: R$ ${h.inss?.toFixed(2) || '0.00'}`)
      console.log(`   INSS Percentual: ${h.inss_percentual || 'null'}%`)
      console.log(`   INSS Referência: "${h.inss_referencia || 'null'}"`)
      console.log(`   ✅ Campo existe: ${h.inss_referencia ? 'SIM' : 'NÃO'}`)
      console.log('')
    })
    
    // Verificar se a coluna existe na tabela
    console.log('\n🔍 Verificando estrutura da tabela holerites...')
    const { data: colunas, error: erroEstrutura } = await supabase
      .from('holerites')
      .select('*')
      .limit(1)
    
    if (erroEstrutura) {
      console.error('❌ Erro ao verificar estrutura:', erroEstrutura)
      return
    }
    
    if (colunas && colunas.length > 0) {
      const colunasDisponiveis = Object.keys(colunas[0])
      const temInssReferencia = colunasDisponiveis.includes('inss_referencia')
      
      console.log(`\n📋 Colunas relacionadas ao INSS:`)
      colunasDisponiveis
        .filter(col => col.toLowerCase().includes('inss'))
        .forEach(col => console.log(`   - ${col}`))
      
      console.log(`\n${temInssReferencia ? '✅' : '❌'} Campo inss_referencia ${temInssReferencia ? 'EXISTE' : 'NÃO EXISTE'} na tabela`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarInssReferencia()
