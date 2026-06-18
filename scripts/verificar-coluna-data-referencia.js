// Script simples para verificar coluna data_referencia
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verificar() {
  console.log('🔍 Verificando coluna data_referencia...\n')

  // Buscar documento mais recente com todos os campos
  const { data: doc, error } = await supabase
    .from('funcionario_documentos')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.log('❌ Erro:', error.message)
    return
  }

  console.log('📄 Documento mais recente:')
  console.log(`   Nome: ${doc.nome_original}`)
  console.log(`   ID: ${doc.id}`)
  console.log(`   Criado em: ${new Date(doc.criado_em).toLocaleString('pt-BR')}`)
  console.log(`   Data referência no banco: ${doc.data_referencia || '(NULL)'}`)
  console.log('')

  // Verificar se o campo existe no objeto retornado
  console.log('🔍 Campos retornados pela query:')
  console.log(Object.keys(doc).sort().join(', '))
  console.log('')

  if ('data_referencia' in doc) {
    console.log('✅ Campo data_referencia existe no resultado da query')
    console.log(`   Valor: ${doc.data_referencia}`)
    console.log(`   Tipo: ${typeof doc.data_referencia}`)
  } else {
    console.log('❌ Campo data_referencia NÃO existe no resultado da query')
    console.log('   A coluna pode não existir na tabela')
  }
}

verificar().catch(console.error)
