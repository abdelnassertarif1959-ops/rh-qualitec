/**
 * Script para testar a ordem das notificações
 * Verifica se as notificações estão ordenadas corretamente (mais recentes primeiro)
 */

const config = useRuntimeConfig()

async function testarOrdemNotificacoes() {
  console.log('🧪 [TESTE-ORDEM] Testando ordem das notificações...')
  
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    // 1. Criar algumas notificações de teste com intervalos de tempo
    console.log('📝 [TESTE-ORDEM] Criando notificações de teste...')
    
    const notificacoesTest = [
      {
        titulo: '🧪 Teste 1 - Mais Antiga',
        mensagem: 'Esta é a notificação mais antiga do teste',
        tipo: 'info',
        origem: 'teste'
      },
      {
        titulo: '🧪 Teste 2 - Meio',
        mensagem: 'Esta é a notificação do meio do teste',
        tipo: 'warning',
        origem: 'teste'
      },
      {
        titulo: '🧪 Teste 3 - Mais Recente',
        mensagem: 'Esta é a notificação mais recente do teste',
        tipo: 'success',
        origem: 'teste'
      }
    ]

    // Criar notificações com pequenos intervalos
    for (let i = 0; i < notificacoesTest.length; i++) {
      const notif = notificacoesTest[i]
      
      const response = await fetch(`${supabaseUrl}/rest/v1/notificacoes`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(notif)
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ [TESTE-ORDEM] Criada: ${notif.titulo}`)
      }
      
      // Aguardar 1 segundo entre criações para garantir timestamps diferentes
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // 2. Buscar notificações via API para verificar ordem
    console.log('🔍 [TESTE-ORDEM] Buscando notificações via API...')
    
    const apiResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/get_notifications_ordered`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ limite_param: 10 })
    })

    // Se a função RPC não existir, usar query direta
    let notificacoes = []
    if (!apiResponse.ok) {
      console.log('📋 [TESTE-ORDEM] Usando query direta...')
      const directResponse = await fetch(
        `${supabaseUrl}/rest/v1/notificacoes?select=*&order=importante.desc,created_at.desc&limit=10`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (directResponse.ok) {
        notificacoes = await directResponse.json()
      }
    } else {
      notificacoes = await apiResponse.json()
    }

    // 3. Verificar ordem das notificações
    console.log('📊 [TESTE-ORDEM] Verificando ordem das notificações...')
    console.log(`📋 [TESTE-ORDEM] Total encontradas: ${notificacoes.length}`)
    
    if (notificacoes.length > 0) {
      console.log('📅 [TESTE-ORDEM] Ordem das notificações (deve ser mais recente → mais antiga):')
      
      notificacoes.slice(0, 10).forEach((notif: any, index: number) => {
        const data = new Date(notif.created_at).toLocaleString('pt-BR')
        const importante = notif.importante ? ' ⭐ IMPORTANTE' : ''
        console.log(`   ${index + 1}. ${notif.titulo}${importante}`)
        console.log(`      Data: ${data}`)
        console.log(`      Tipo: ${notif.tipo} | Origem: ${notif.origem}`)
        console.log('')
      })

      // Verificar se está ordenado corretamente
      let ordemCorreta = true
      for (let i = 1; i < Math.min(notificacoes.length, 5); i++) {
        const anterior = new Date(notificacoes[i-1].created_at)
        const atual = new Date(notificacoes[i].created_at)
        
        // Se não for importante vs importante, verificar data
        if (notificacoes[i-1].importante === notificacoes[i].importante) {
          if (anterior < atual) {
            ordemCorreta = false
            console.log(`❌ [TESTE-ORDEM] Ordem incorreta entre posições ${i} e ${i+1}`)
            break
          }
        }
      }

      if (ordemCorreta) {
        console.log('✅ [TESTE-ORDEM] Ordem das notificações está CORRETA!')
        console.log('   → Importantes primeiro, depois por data (mais recente → mais antiga)')
      } else {
        console.log('❌ [TESTE-ORDEM] Ordem das notificações está INCORRETA!')
      }
    }

    // 4. Limpar notificações de teste
    console.log('🧹 [TESTE-ORDEM] Limpando notificações de teste...')
    const deleteResponse = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?origem=eq.teste`,
      {
        method: 'DELETE',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (deleteResponse.ok) {
      console.log('✅ [TESTE-ORDEM] Notificações de teste removidas')
    }

    console.log('🎯 [TESTE-ORDEM] Teste concluído!')

  } catch (error: any) {
    console.error('❌ [TESTE-ORDEM] Erro durante o teste:', error.message)
    console.error('📋 [TESTE-ORDEM] Stack trace:', error.stack)
  }
}

// Executar o teste
testarOrdemNotificacoes()