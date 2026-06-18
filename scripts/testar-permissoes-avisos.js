// Script para testar permissões de avisos e comentários
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTANDO')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'OK' : 'FALTANDO')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarPermissoes() {
  console.log('🔍 TESTANDO PERMISSÕES DO SISTEMA DE AVISOS\n')

  // 1. Buscar avisos (deve funcionar para todos)
  console.log('📋 1. Testando busca de avisos...')
  const { data: avisos, error: errorAvisos } = await supabase
    .from('avisos')
    .select('*')
    .eq('ativo', true)

  if (errorAvisos) {
    console.error('❌ Erro ao buscar avisos:', errorAvisos)
  } else {
    console.log(`✅ Avisos encontrados: ${avisos?.length || 0}`)
    if (avisos && avisos.length > 0) {
      console.log('   Primeiro aviso:', {
        id: avisos[0].id,
        titulo: avisos[0].titulo,
        criado_por: avisos[0].criado_por
      })
    }
  }

  // 2. Buscar funcionários para teste
  console.log('\n📋 2. Buscando funcionários para teste...')
  const { data: funcionarios, error: errorFunc } = await supabase
    .from('funcionarios')
    .select('id, nome_completo, tipo_acesso')
    .limit(5)

  if (errorFunc) {
    console.error('❌ Erro ao buscar funcionários:', errorFunc)
    return
  }

  console.log(`✅ Funcionários encontrados: ${funcionarios?.length || 0}`)
  funcionarios?.forEach(f => {
    console.log(`   - ${f.nome_completo} (ID: ${f.id}, Tipo: ${f.tipo_acesso})`)
  })

  // 3. Testar criação de comentário (como service role)
  if (avisos && avisos.length > 0 && funcionarios && funcionarios.length > 0) {
    const avisoTeste = avisos[0]
    const funcionarioTeste = funcionarios.find(f => f.tipo_acesso === 'funcionario') || funcionarios[0]

    console.log(`\n📋 3. Testando criação de comentário...`)
    console.log(`   Aviso: ${avisoTeste.titulo}`)
    console.log(`   Funcionário: ${funcionarioTeste.nome_completo}`)

    const { data: comentario, error: errorComentario } = await supabase
      .from('avisos_comentarios')
      .insert({
        aviso_id: avisoTeste.id,
        funcionario_id: funcionarioTeste.id,
        comentario: '🧪 Teste de permissão - ' + new Date().toISOString()
      })
      .select()
      .single()

    if (errorComentario) {
      console.error('❌ Erro ao criar comentário:', errorComentario)
      console.error('   Detalhes:', JSON.stringify(errorComentario, null, 2))
    } else {
      console.log('✅ Comentário criado com sucesso!')
      console.log('   ID:', comentario.id)

      // Limpar teste
      await supabase
        .from('avisos_comentarios')
        .delete()
        .eq('id', comentario.id)
      console.log('   ✅ Comentário de teste removido')
    }
  }

  // 4. Buscar comentários existentes
  if (avisos && avisos.length > 0) {
    console.log('\n📋 4. Buscando comentários existentes...')
    const { data: comentarios, error: errorComentarios } = await supabase
      .from('avisos_comentarios')
      .select('*')
      .eq('aviso_id', avisos[0].id)

    if (errorComentarios) {
      console.error('❌ Erro ao buscar comentários:', errorComentarios)
    } else {
      console.log(`✅ Comentários encontrados: ${comentarios?.length || 0}`)
    }
  }

  console.log('\n✅ TESTE CONCLUÍDO!')
}

testarPermissoes().catch(console.error)
