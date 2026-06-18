/**
 * Script simples para verificar notificações no banco
 */

import { config } from 'dotenv'
config()

async function verificarNotificacoes() {
  console.log('🔍 [VERIFICAR] Verificando notificações no banco...')
  
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ [VERIFICAR] Variáveis de ambiente não encontradas')
    console.log('NUXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'OK' : 'MISSING')
    return
  }

  try {
    // Buscar últimas 5 notificações
    const response = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*&order=created_at.desc&limit=5`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('📊 [VERIFICAR] Status da resposta:', response.status)

    if (response.ok) {
      const notificacoes = await response.json()
      console.log(`📋 [VERIFICAR] Notificações encontradas: ${notificacoes.length}`)
      
      if (notificacoes.length > 0) {
        console.log('📋 [VERIFICAR] Últimas notificações:')
        notificacoes.forEach((notif, index) => {
          const data = new Date(notif.created_at).toLocaleString('pt-BR')
          const importante = notif.importante ? ' ⭐' : ''
          const lida = notif.lida ? ' ✓' : ' ●'
          
          console.log(`   ${index + 1}. ${notif.titulo}${importante}${lida}`)
          console.log(`      Data: ${data}`)
          console.log(`      Tipo: ${notif.tipo} | Origem: ${notif.origem || 'N/A'}`)
          console.log('')
        })
      } else {
        console.log('📋 [VERIFICAR] Nenhuma notificação encontrada no banco')
      }

    } else {
      const errorText = await response.text()
      console.error('❌ [VERIFICAR] Erro ao buscar notificações:', errorText)
    }

  } catch (error) {
    console.error('❌ [VERIFICAR] Erro:', error.message)
  }
}

// Executar verificação
verificarNotificacoes()