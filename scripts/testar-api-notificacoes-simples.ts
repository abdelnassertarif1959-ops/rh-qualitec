/**
 * Script simples para testar a API de notificações
 */

const config = useRuntimeConfig()

async function testarAPINotificacoes() {
  console.log('🧪 [TESTE-API] Testando API de notificações...')
  
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    // 1. Testar busca direta no banco
    console.log('📋 [TESTE-API] Testando busca direta no banco...')
    const directResponse = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*&order=importante.desc,created_at.desc&limit=5`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (directResponse.ok) {
      const notificacoesDiretas = await directResponse.json()
      console.log(`✅ [TESTE-API] Busca direta: ${notificacoesDiretas.length} notificações encontradas`)
      
      if (notificacoesDiretas.length > 0) {
        console.log('📋 [TESTE-API] Primeiras notificações:')
        notificacoesDiretas.slice(0, 3).forEach((notif: any, index: number) => {
          console.log(`   ${index + 1}. ${notif.titulo}`)
          console.log(`      Data: ${new Date(notif.created_at).toLocaleString('pt-BR')}`)
          console.log(`      Importante: ${notif.importante ? 'Sim' : 'Não'}`)
        })
      }
    } else {
      console.error('❌ [TESTE-API] Erro na busca direta:', await directResponse.text())
    }

    // 2. Testar via API interna
    console.log('🔍 [TESTE-API] Testando via API interna...')
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001/api/notificacoes' 
      : `${supabaseUrl.replace('/rest/v1', '')}/api/notificacoes`
    
    console.log('📋 [TESTE-API] URL da API:', apiUrl)
    
    // Simular requisição como se fosse do frontend
    const apiResponse = await fetch(`${apiUrl}?limite=5`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (apiResponse.ok) {
      const apiResult = await apiResponse.json()
      console.log(`✅ [TESTE-API] API interna: ${apiResult.notificacoes?.length || 0} notificações`)
      console.log('📊 [TESTE-API] Resposta da API:', JSON.stringify(apiResult, null, 2))
    } else {
      console.error('❌ [TESTE-API] Erro na API interna:', await apiResponse.text())
    }

  } catch (error: any) {
    console.error('❌ [TESTE-API] Erro durante o teste:', error.message)
  }
}

// Executar o teste
testarAPINotificacoes()