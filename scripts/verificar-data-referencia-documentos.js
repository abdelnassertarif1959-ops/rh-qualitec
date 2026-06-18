// Script para verificar se data_referencia está sendo salva corretamente
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verificar() {
  console.log('🔍 Verificando data_referencia nos documentos...\n')

  // Buscar últimos 5 documentos
  const { data: docs, error } = await supabase
    .from('funcionario_documentos')
    .select('id, nome_original, criado_em, data_referencia')
    .order('criado_em', { ascending: false })
    .limit(5)

  if (error) {
    console.log('❌ Erro:', error.message)
    return
  }

  console.log(`📄 Últimos ${docs.length} documentos:\n`)
  
  docs.forEach((doc, i) => {
    console.log(`${i + 1}. ${doc.nome_original}`)
    console.log(`   ID: ${doc.id}`)
    console.log(`   Criado em: ${new Date(doc.criado_em).toLocaleString('pt-BR')}`)
    console.log(`   Data referência: ${doc.data_referencia ? new Date(doc.data_referencia).toLocaleDateString('pt-BR') : '(NULL)'}`)
    console.log(`   ${doc.data_referencia === null ? '⚠️ SEM DATA DE REFERÊNCIA' : '✅ Com data de referência'}`)
    console.log('')
  })

  // Verificar se a coluna existe
  const { data: colunas } = await supabase.rpc('exec_sql', {
    query: `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'funcionario_documentos'
      AND column_name = 'data_referencia';
    `
  }).single()

  if (colunas) {
    console.log('✅ Coluna data_referencia existe na tabela')
    console.log('   Tipo:', colunas)
  } else {
    console.log('❌ Coluna data_referencia NÃO existe na tabela!')
    console.log('   Execute a migration: database/48-adicionar-data-referencia-documentos.sql')
  }
}

verificar().catch(console.error)
