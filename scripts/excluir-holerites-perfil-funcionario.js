// Script para excluir holerites gerados no perfil do funcionário
// Mantém apenas os holerites gerados pelo admin

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function excluirHoleritesPerfil() {
  console.log('🗑️  Excluindo holerites gerados no perfil do funcionário...\n')
  
  try {
    // 1. Buscar todos os holerites
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (errorHol) {
      console.error('❌ Erro ao buscar holerites:', errorHol)
      return
    }
    
    console.log(`📊 Total de holerites no banco: ${holerites.length}\n`)
    
    // 2. Identificar holerites gerados no perfil
    // Critério: holerites sem responsavel_cadastro ou com responsavel_cadastro = funcionario_id
    const holeritesPerfil = holerites.filter(h => {
      // Se não tem responsavel_cadastro, foi gerado automaticamente (perfil)
      if (!h.responsavel_cadastro) return true
      
      // Se responsavel_cadastro = funcionario_id, foi o próprio funcionário que gerou
      if (h.responsavel_cadastro === h.funcionario_id) return true
      
      return false
    })
    
    const holeritesAdmin = holerites.filter(h => {
      // Se tem responsavel_cadastro diferente do funcionario_id, foi o admin
      return h.responsavel_cadastro && h.responsavel_cadastro !== h.funcionario_id
    })
    
    console.log(`📋 Holerites gerados no perfil: ${holeritesPerfil.length}`)
    console.log(`👤 Holerites gerados pelo admin: ${holeritesAdmin.length}\n`)
    
    if (holeritesPerfil.length === 0) {
      console.log('✅ Nenhum holerite de perfil encontrado para excluir.')
      return
    }
    
    // 3. Confirmar exclusão
    console.log('⚠️  ATENÇÃO: Os seguintes holerites serão EXCLUÍDOS:\n')
    
    for (const h of holeritesPerfil) {
      const { data: func } = await supabase
        .from('funcionarios')
        .select('nome_completo')
        .eq('id', h.funcionario_id)
        .single()
      
      console.log(`   ID ${h.id}: ${func?.nome_completo || 'Funcionário'} - ${h.periodo_inicio} a ${h.periodo_fim}`)
    }
    
    console.log('\n⚠️  Os holerites gerados pelo ADMIN serão MANTIDOS:\n')
    
    for (const h of holeritesAdmin.slice(0, 5)) {
      const { data: func } = await supabase
        .from('funcionarios')
        .select('nome_completo')
        .eq('id', h.funcionario_id)
        .single()
      
      console.log(`   ID ${h.id}: ${func?.nome_completo || 'Funcionário'} - ${h.periodo_inicio} a ${h.periodo_fim}`)
    }
    
    if (holeritesAdmin.length > 5) {
      console.log(`   ... e mais ${holeritesAdmin.length - 5} holerites`)
    }
    
    console.log('\n❓ Deseja continuar com a exclusão?')
    console.log('   Execute novamente com --confirm para confirmar\n')
    
    // Verificar se tem flag --confirm
    const confirmar = process.argv.includes('--confirm')
    
    if (!confirmar) {
      console.log('ℹ️  Nenhuma exclusão foi realizada.')
      console.log('   Para confirmar, execute: node scripts/excluir-holerites-perfil-funcionario.js --confirm')
      return
    }
    
    // 4. Excluir holerites do perfil
    console.log('\n🗑️  Excluindo holerites do perfil...\n')
    
    let excluidos = 0
    let erros = 0
    
    for (const h of holeritesPerfil) {
      const { error: deleteError } = await supabase
        .from('holerites')
        .delete()
        .eq('id', h.id)
      
      if (deleteError) {
        console.log(`   ❌ Erro ao excluir holerite ${h.id}:`, deleteError.message)
        erros++
      } else {
        console.log(`   ✅ Holerite ${h.id} excluído`)
        excluidos++
      }
    }
    
    console.log(`\n📊 Resumo:`)
    console.log(`   ✅ Excluídos: ${excluidos}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log(`   👤 Mantidos (admin): ${holeritesAdmin.length}`)
    
    console.log('\n✅ Processo concluído!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

excluirHoleritesPerfil()
