/**
 * Script para verificar notificações diretamente no banco
 */

const config = useRuntimeConfig()

async function verificarNotificacoesBanco() {
  console.log('🔍 [VERIFICAR] Verificando notificações no banco...')
  
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    // 1. Contar total de notificações
    const countResponse = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    )

    if (countResponse.ok) {
      const countHeader = countResponse.headers.get('content-range')
      const total = countHeader ? countHeader.split('/')[1] : 'unknown'
      console.log(`📊 [VERIFICAR] Total de notificações no banco: ${total}`)
    }

    // 2. Buscar últimas 10 notificações
    const response = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*&order=created_at.desc&limit=10`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      const notificacoes = await response.json()
      console.log(`📋 [VERIFICAR] Últimas ${notificacoes.length} notificações:`)
      
      notificacoes.forEach((notif: any, index: number) => {
        const data = new Date(notif.created_at).toLocaleString('pt-BR')
        const importante = notif.importante ? ' ⭐ IMPORTANTE' : ''
        const lida = notif.lida ? ' ✓ LIDA' : ' ● NÃO LIDA'
        
        console.log(`   ${index + 1}. ${notif.titulo}${importante}${lida}`)
        console.log(`      Data: ${data}`)
        console.log(`      Tipo: ${notif.tipo} | Origem: ${notif.origem || 'N/A'}`)
        console.log(`      Mensagem: ${notif.mensagem.substring(0, 100)}...`)
        console.log('')
      })

      // 3. Verificar campos de data
      console.log('📅 [VERIFICAR] Verificando campos de data:')
      const primeiraNotif = notificacoes[0]
      if (primeiraNotif) {
        console.log(`   created_at: ${primeiraNotif.created_at}`)
        console.log(`   data_criacao: ${primeiraNotif.data_criacao}`)
        console.log(`   updated_at: ${primeiraNotif.updated_at}`)
      }

    } else {
      console.error('❌ [VERIFICAR] Erro ao buscar notificações:', await response.text())
    }

    // 4. Verificar notificações não lidas
    const naoLidasResponse = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*&lida=eq.false&order=created_at.desc`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (naoLidasResponse.ok) {
      const naoLidas = await naoLidasResponse.json()
      console.log(`📬 [VERIFICAR] Notificações não lidas: ${naoLidas.length}`)
    }

  } catch (error: any) {
    console.error('❌ [VERIFICAR] Erro:', error.message)
  }
}

// Executar verificação
verificarNotificacoesBanco()