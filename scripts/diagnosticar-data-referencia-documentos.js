// Script para diagnosticar implementação do campo data_referencia em documentos
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO: Campo data_referencia em documentos\n')

  // 1. Verificar estrutura da tabela
  console.log('1️⃣ Verificando estrutura da tabela funcionario_documentos...')
  const { data: colunas, error: erroColunas } = await supabase
    .rpc('exec_sql', {
      query: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'funcionario_documentos'
        ORDER BY ordinal_position;
      `
    })
    .single()

  if (erroColunas) {
    console.log('❌ Erro ao verificar colunas:', erroColunas.message)
  } else {
    console.log('✅ Colunas da tabela:')
    console.log(colunas)
  }

  // 2. Buscar documentos existentes
  console.log('\n2️⃣ Buscando documentos existentes...')
  const { data: docs, error: erroDocs } = await supabase
    .from('funcionario_documentos')
    .select('id, nome_original, titulo, descricao, criado_em, data_referencia, tipo_id, documento_tipos(nome)')
    .order('criado_em', { ascending: false })
    .limit(10)

  if (erroDocs) {
    console.log('❌ Erro ao buscar documentos:', erroDocs.message)
  } else {
    console.log(`✅ Encontrados ${docs.length} documentos (últimos 10):`)
    docs.forEach(doc => {
      console.log(`\n📄 ${doc.nome_original}`)
      console.log(`   Título: ${doc.titulo || '(sem título)'}`)
      console.log(`   Tipo: ${doc.documento_tipos?.nome || '(sem tipo)'}`)
      console.log(`   Descrição: ${doc.descricao || '(sem descrição)'}`)
      console.log(`   Criado em: ${new Date(doc.criado_em).toLocaleDateString('pt-BR')}`)
      console.log(`   Data referência: ${doc.data_referencia ? new Date(doc.data_referencia).toLocaleDateString('pt-BR') : '(não definida)'}`)
    })
  }

  // 3. Verificar documentos sem data_referencia
  console.log('\n3️⃣ Verificando documentos sem data_referencia...')
  const { data: semData, error: erroSemData } = await supabase
    .from('funcionario_documentos')
    .select('id, nome_original, criado_em')
    .is('data_referencia', null)

  if (erroSemData) {
    console.log('❌ Erro:', erroSemData.message)
  } else {
    console.log(`${semData.length === 0 ? '✅' : '⚠️'} ${semData.length} documento(s) sem data_referencia`)
    if (semData.length > 0) {
      console.log('   Sugestão: Execute a migration 48 para preencher com fallback (data de criação)')
    }
  }

  // 4. Verificar tipos de documento
  console.log('\n4️⃣ Verificando tipos de documento cadastrados...')
  const { data: tipos, error: erroTipos } = await supabase
    .from('documento_tipos')
    .select('id, nome, descricao_padrao')
    .order('nome')

  if (erroTipos) {
    console.log('❌ Erro:', erroTipos.message)
  } else {
    console.log(`✅ ${tipos.length} tipo(s) cadastrado(s):`)
    tipos.forEach(tipo => {
      console.log(`   • ${tipo.nome} ${tipo.descricao_padrao ? `(${tipo.descricao_padrao})` : ''}`)
    })
  }

  console.log('\n✅ Diagnóstico concluído!')
}

diagnosticar().catch(console.error)
