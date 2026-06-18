/**
 * Script para testar se as notificações estão sendo criadas no banco
 * Execute no console do navegador
 */

console.log('🧪 [TESTE-CRIACAO] Testando criação de notificações...')

async function testarCriacaoNotificacao() {
  try {
    console.log('📡 [TESTE-CRIACAO] Fazendo uma alteração de dados para gerar notificação...')
    
    // Simular uma alteração de dados (alterar telefone)
    const response = await fetch('/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1, // ID do usuário admin
        telefone: '(11) 99999-' + Math.floor(Math.random() * 9000 + 1000) // Número aleatório
      })
    })
    
    const result = await response.json()
    console.log('📊 [TESTE-CRIACAO] Resposta da alteração:', result)
    
    if (result.success) {
      console.log('✅ [TESTE-CRIACAO] Alteração realizada com sucesso!')
      
      // Aguardar um pouco e verificar se a notificação foi criada
      setTimeout(async () => {
        console.log('🔍 [TESTE-CRIACAO] Verificando se notificação foi criada...')
        
        const notifResponse = await fetch('/api/notificacoes?limite=5')
        const notifData = await notifResponse.json()
        
        if (notifData.success && notifData.notificacoes.length > 0) {
          console.log('📬 [TESTE-CRIACAO] Últimas notificações:')
          notifData.notificacoes.slice(0, 3).forEach((notif, index) => {
            console.log(`   ${index + 1}. ${notif.titulo} - ${notif.mensagem}`)
            console.log(`      Criada em: ${notif.created_at}`)
            console.log(`      Origem: ${notif.origem}`)
          })
          
          // Verificar se há uma notificação recente de alteração de dados
          const notifRecente = notifData.notificacoes.find(n => 
            n.origem === 'alteracao_dados' && 
            new Date(n.created_at) > new Date(Date.now() - 60000) // Últimos 60 segundos
          )
          
          if (notifRecente) {
            console.log('✅ [TESTE-CRIACAO] Notificação de alteração encontrada!')
            console.log('📋 Detalhes:', notifRecente)
          } else {
            console.log('❌ [TESTE-CRIACAO] Notificação de alteração NÃO encontrada')
            console.log('⚠️ [TESTE-CRIACAO] Possível problema no sistema de notificações')
          }
        } else {
          console.log('❌ [TESTE-CRIACAO] Nenhuma notificação encontrada')
        }
      }, 2000)
      
    } else {
      console.error('❌ [TESTE-CRIACAO] Erro na alteração:', result)
    }
    
  } catch (error) {
    console.error('💥 [TESTE-CRIACAO] Erro no teste:', error)
  }
}

// Executar teste
testarCriacaoNotificacao()

console.log('🔍 [TESTE-CRIACAO] Para testar novamente, execute: testarCriacaoNotificacao()')