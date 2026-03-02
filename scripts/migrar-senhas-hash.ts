// Script para migrar senhas em texto plano para hash seguro
// Execute: npx tsx scripts/migrar-senhas-hash.ts

import { hashPassword } from '../server/utils/auth'

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

async function migrarSenhas() {
  try {
    console.log('🔄 Iniciando migração de senhas...')
    
    // 1. Buscar funcionários com senhas que precisam ser migradas
    const response = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?senha_hash=like.MIGRAR_*&select=id,senha_hash`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const funcionarios = await response.json()
    console.log(`📊 Encontrados ${funcionarios.length} funcionários para migrar`)

    // 2. Migrar cada funcionário
    for (const funcionario of funcionarios) {
      const senhaOriginal = funcionario.senha_hash.replace('MIGRAR_', '')
      const senhaHash = await hashPassword(senhaOriginal)
      
      // Atualizar com hash real
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?id=eq.${funcionario.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          senha_hash: senhaHash
        })
      })

      if (updateResponse.ok) {
        console.log(`✅ Funcionário ${funcionario.id} migrado com sucesso`)
      } else {
        console.error(`❌ Erro ao migrar funcionário ${funcionario.id}`)
      }
    }

    console.log('🎉 Migração concluída!')
    
  } catch (error) {
    console.error('💥 Erro na migração:', error)
  }
}

migrarSenhas()