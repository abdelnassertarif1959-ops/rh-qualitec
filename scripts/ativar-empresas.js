// Script para ativar todas as empresas no banco de dados
import 'dotenv/config'

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NUXT_PUBLIC_SUPABASE_KEY

async function ativarEmpresas() {
  console.log('🔧 Ativando todas as empresas...\n')
  
  try {
    // 1. Buscar todas as empresas
    const responseGet = await fetch(
      `${SUPABASE_URL}/rest/v1/empresas?select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!responseGet.ok) {
      throw new Error(`Erro ao buscar empresas: ${responseGet.status}`)
    }

    const empresas = await responseGet.json()
    
    if (empresas.length === 0) {
      console.log('⚠️ Nenhuma empresa encontrada no banco!')
      return
    }
    
    console.log(`📊 Encontradas ${empresas.length} empresas\n`)
    
    // 2. Ativar cada empresa
    for (const empresa of empresas) {
      console.log(`🔄 Ativando: ${empresa.nome}...`)
      
      const responseUpdate = await fetch(
        `${SUPABASE_URL}/rest/v1/empresas?id=eq.${empresa.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            ativo: true
          })
        }
      )

      if (!responseUpdate.ok) {
        console.error(`   ❌ Erro ao ativar empresa ${empresa.id}`)
        continue
      }

      console.log(`   ✅ Ativada com sucesso!`)
    }
    
    console.log('\n✅ Todas as empresas foram ativadas!')
    console.log('\n💡 Agora você pode:')
    console.log('   1. Recarregar a página de funcionários')
    console.log('   2. O select de empresas deve mostrar as opções')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

ativarEmpresas()
