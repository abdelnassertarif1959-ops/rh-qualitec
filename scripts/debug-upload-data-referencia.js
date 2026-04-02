// Script para debugar o upload com data_referencia
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarUpload() {
  console.log('🧪 Teste de Upload com Data de Referência\n')

  // Simular dados de upload
  const testData = {
    funcionario_id: 1, // Ajuste conforme necessário
    nome_original: 'teste-data-referencia.txt',
    tipo_arquivo: 'text/plain',
    tamanho_bytes: 100,
    conteudo: '\\x74657374', // "test" em hex
    titulo: 'Teste Data Referência',
    descricao: 'Documento de teste',
    tipo_id: null,
    data_referencia: '2024-01-15' // Data específica de teste
  }

  console.log('📤 Dados que serão inseridos:')
  console.log(JSON.stringify(testData, null, 2))
  console.log('')

  // Inserir documento de teste
  console.log('💾 Inserindo no banco...')
  const { data: inserted, error: insertError } = await supabase
    .from('funcionario_documentos')
    .insert(testData)
    .select('id, nome_original, criado_em, data_referencia')
    .single()

  if (insertError) {
    console.log('❌ Erro ao inserir:', insertError.message)
    return
  }

  console.log('✅ Documento inserido com sucesso!')
  console.log(`   ID: ${inserted.id}`)
  console.log(`   Nome: ${inserted.nome_original}`)
  console.log(`   Criado em: ${new Date(inserted.criado_em).toLocaleString('pt-BR')}`)
  console.log(`   Data referência: ${inserted.data_referencia}`)
  console.log('')

  // Buscar de volta para confirmar
  console.log('🔍 Buscando documento inserido...')
  const { data: fetched, error: fetchError } = await supabase
    .from('funcionario_documentos')
    .select('*')
    .eq('id', inserted.id)
    .single()

  if (fetchError) {
    console.log('❌ Erro ao buscar:', fetchError.message)
    return
  }

  console.log('✅ Documento encontrado!')
  console.log(`   Data referência no banco: ${fetched.data_referencia}`)
  console.log(`   ${fetched.data_referencia === '2024-01-15' ? '✅ Data salva corretamente!' : '❌ Data diferente da esperada!'}`)
  console.log('')

  // Limpar teste
  console.log('🧹 Removendo documento de teste...')
  await supabase
    .from('funcionario_documentos')
    .delete()
    .eq('id', inserted.id)
  
  console.log('✅ Teste concluído!')
}

testarUpload().catch(console.error)
