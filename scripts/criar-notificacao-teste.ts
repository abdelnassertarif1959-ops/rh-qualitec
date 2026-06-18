/**
 * Script para criar uma notificação de teste
 */

const config = useRuntimeConfig()

async function criarNotificacaoTeste() {
  console.log('🧪 [CRIAR-TESTE] Criando notificação de teste...')
  
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    const notificacaoTeste = {
      titulo: '🧪 Teste de Notificação - ' + new Date().toLocaleTimeString('pt-BR'),
      mensagem: 'Esta é uma notificação de teste criada em ' + new Date().toLocaleString('pt-BR') + ' para verificar se o sistema está funcionando corretamente.',
      tipo: 'info',
      origem: 'teste',
      importante: false,
      lida: false
    }

    console.log('📝 [CRIAR-TESTE] Dados da notificação:', notificacaoTeste)

    const response = await fetch(`${supabaseUrl}/rest/v1/notificacoes`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(notificacaoTeste)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ [CRIAR-TESTE] Notificação criada com sucesso!')
      console.log('📋 [CRIAR-TESTE] ID:', result[0]?.id)
      console.log('📋 [CRIAR-TESTE] Created_at:', result[0]?.created_at)
      
      // Aguardar um pouco e verificar se aparece na API
      console.log('⏳ [CRIAR-TESTE] Aguardando 2 segundos...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Testar busca via API
      console.log('🔍 [CRIAR-TESTE] Testando busca via API...')
      const testResponse = await fetch(
        `${supabaseUrl}/rest/v1/notificacoes?select=*&order=created_at.desc&limit=3`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (testResponse.ok) {
        const notificacoes = await testResponse.json()
        console.log(`📋 [CRIAR-TESTE] Últimas notificações encontradas: ${notificacoes.length}`)
        
        const notifTeste = notificacoes.find((n: any) => n.origem === 'teste')
        if (notifTeste) {
          console.log('✅ [CRIAR-TESTE] Notificação de teste encontrada na busca!')
        } else {
          console.log('❌ [CRIAR-TESTE] Notificação de teste NÃO encontrada na busca')
        }
      }
      
    } else {
      const errorText = await response.text()
      console.error('❌ [CRIAR-TESTE] Erro ao criar notificação:', errorText)
    }

  } catch (error: any) {
    console.error('❌ [CRIAR-TESTE] Erro:', error.message)
  }
}

// Executar criação
criarNotificacaoTeste()