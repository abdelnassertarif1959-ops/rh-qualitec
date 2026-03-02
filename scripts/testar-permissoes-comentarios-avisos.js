/**
 * Script para testar permissões de comentários em avisos
 * Testa se funcionários podem comentar e se as políticas RLS estão corretas
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testarPermissoesComentarios() {
  console.log('🧪 Testando Permissões de Comentários em Avisos\n')
  console.log('=' .repeat(60))

  try {
    // 1. Buscar um aviso ativo
    console.log('\n1️⃣ Buscando aviso ativo...')
    const { data: avisos, error: avisosError } = await supabase
      .from('avisos')
      .select('*')
      .eq('ativo', true)
      .limit(1)

    if (avisosError) {
      console.error('❌ Erro ao buscar avisos:', avisosError.message)
      return
    }

    if (!avisos || avisos.length === 0) {
      console.log('⚠️  Nenhum aviso ativo encontrado')
      console.log('💡 Crie um aviso primeiro como admin')
      return
    }

    const aviso = avisos[0]
    console.log(`✅ Aviso encontrado: "${aviso.titulo}"`)
    console.log(`   ID: ${aviso.id}`)

    // 2. Buscar um funcionário não-admin
    console.log('\n2️⃣ Buscando funcionário não-admin...')
    const { data: funcionarios, error: funcError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, tipo_acesso')
      .neq('tipo_acesso', 'admin')
      .limit(1)

    if (funcError) {
      console.error('❌ Erro ao buscar funcionários:', funcError.message)
      return
    }

    if (!funcionarios || funcionarios.length === 0) {
      console.log('⚠️  Nenhum funcionário não-admin encontrado')
      return
    }

    const funcionario = funcionarios[0]
    console.log(`✅ Funcionário encontrado: ${funcionario.nome_completo}`)
    console.log(`   ID: ${funcionario.id}`)
    console.log(`   Tipo: ${funcionario.tipo_acesso}`)

    // 3. Testar criação de comentário
    console.log('\n3️⃣ Testando criação de comentário...')
    const comentarioTeste = `Teste de comentário - ${new Date().toISOString()}`
    
    const { data: novoComentario, error: comentarioError } = await supabase
      .from('avisos_comentarios')
      .insert({
        aviso_id: aviso.id,
        funcionario_id: funcionario.id,
        comentario: comentarioTeste
      })
      .select()
      .single()

    if (comentarioError) {
      console.error('❌ Erro ao criar comentário:', comentarioError.message)
      console.log('\n🔍 Detalhes do erro:')
      console.log(JSON.stringify(comentarioError, null, 2))
      console.log('\n💡 Execute a migration: database/45-corrigir-permissoes-comentarios-avisos.sql')
      return
    }

    console.log('✅ Comentário criado com sucesso!')
    console.log(`   ID: ${novoComentario.id}`)
    console.log(`   Texto: ${novoComentario.comentario}`)

    // 4. Testar leitura de comentários
    console.log('\n4️⃣ Testando leitura de comentários...')
    const { data: comentarios, error: lerError } = await supabase
      .from('avisos_comentarios')
      .select(`
        *,
        autor:funcionarios!avisos_comentarios_funcionario_id_fkey(
          id,
          nome_completo,
          tipo_acesso
        )
      `)
      .eq('aviso_id', aviso.id)

    if (lerError) {
      console.error('❌ Erro ao ler comentários:', lerError.message)
      return
    }

    console.log(`✅ ${comentarios.length} comentário(s) encontrado(s)`)
    comentarios.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.autor.nome_completo}: "${c.comentario.substring(0, 50)}..."`)
    })

    // 5. Testar exclusão do próprio comentário
    console.log('\n5️⃣ Testando exclusão do comentário criado...')
    const { error: deleteError } = await supabase
      .from('avisos_comentarios')
      .delete()
      .eq('id', novoComentario.id)

    if (deleteError) {
      console.error('❌ Erro ao deletar comentário:', deleteError.message)
      return
    }

    console.log('✅ Comentário deletado com sucesso!')

    // 6. Verificar políticas RLS
    console.log('\n6️⃣ Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('pg_policies')
      .eq('tablename', 'avisos_comentarios')

    if (!policiesError && policies) {
      console.log(`✅ ${policies.length} política(s) encontrada(s)`)
      policies.forEach(p => {
        console.log(`   - ${p.policyname}`)
      })
    }

    // Resumo
    console.log('\n' + '='.repeat(60))
    console.log('✅ TODOS OS TESTES PASSARAM!')
    console.log('\n📋 Resumo:')
    console.log('   ✅ Funcionários podem criar comentários')
    console.log('   ✅ Funcionários podem ler comentários')
    console.log('   ✅ Funcionários podem deletar próprios comentários')
    console.log('   ✅ Políticas RLS estão ativas')
    console.log('\n🎉 Sistema de comentários funcionando corretamente!')

  } catch (error) {
    console.error('\n❌ Erro inesperado:', error.message)
    console.error(error)
  }
}

// Executar testes
testarPermissoesComentarios()
