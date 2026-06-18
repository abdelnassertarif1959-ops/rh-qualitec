/**
 * TESTE DIRETO DA API EM PRODUÇÃO
 * Execute este script no console do navegador na URL de produção
 * 
 * IMPORTANTE: As variáveis já estão configuradas no Vercel
 * Vamos testar se o problema é na lógica da API
 */

console.log('🔍 [TESTE-PRODUÇÃO] === INICIANDO TESTE DIRETO ===')
console.log('🔍 [TESTE-PRODUÇÃO] Timestamp:', new Date().toISOString())

// Função para testar a API diretamente
async function testarAPIDireta() {
  console.log('📡 [API-DIRETA] === TESTANDO API DIRETAMENTE ===')
  
  // 1. Verificar autenticação
  const authKey = 'sb-rqryspxfvfzfghrfqtbm-auth-token'
  const authData = localStorage.getItem(authKey)
  
  if (!authData) {
    console.error('❌ [API-DIRETA] Token de autenticação não encontrado')
    return
  }
  
  let userId
  try {
    const parsed = JSON.parse(authData)
    userId = parsed?.user?.id
    console.log('👤 [API-DIRETA] Usuário ID:', userId)
    console.log('👤 [API-DIRETA] Email:', parsed?.user?.email)
  } catch (e) {
    console.error('❌ [API-DIRETA] Erro ao parsear token:', e)
    return
  }
  
  if (!userId) {
    console.error('❌ [API-DIRETA] ID do usuário não encontrado')
    return
  }
  
  // 2. Testar diferentes URLs da API
  const baseUrl = window.location.origin
  const urls = [
    `${baseUrl}/api/holerites/meus-holerites?funcionarioId=${userId}`,
    `${baseUrl}/api/debug/holerites-funcionario?funcionarioId=${userId}`,
    `${baseUrl}/api/debug/variaveis`
  ]
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`📡 [API-DIRETA] Testando ${i + 1}/3: ${url}`)
    
    try {
      const startTime = Date.now()
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      const endTime = Date.now()
      console.log(`⏱️ [API-DIRETA] Tempo: ${endTime - startTime}ms`)
      console.log(`📊 [API-DIRETA] Status: ${response.status}`)
      console.log(`📊 [API-DIRETA] Status Text: ${response.statusText}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ [API-DIRETA] Sucesso!`)
        console.log(`📦 [API-DIRETA] Tipo: ${typeof data}`)
        console.log(`📦 [API-DIRETA] É array: ${Array.isArray(data)}`)
        console.log(`📦 [API-DIRETA] Dados:`, data)
        
        if (Array.isArray(data)) {
          console.log(`📦 [API-DIRETA] Quantidade: ${data.length}`)
        }
      } else {
        const errorText = await response.text()
        console.error(`❌ [API-DIRETA] Erro:`)
        console.error(`   Status: ${response.status}`)
        console.error(`   Body: ${errorText}`)
        
        // Tentar parsear como JSON
        try {
          const errorJson = JSON.parse(errorText)
          console.error(`   JSON:`, errorJson)
        } catch (e) {
          console.error(`   Texto puro: ${errorText}`)
        }
      }
      
      console.log('─'.repeat(50))
      
    } catch (error) {
      console.error(`💥 [API-DIRETA] Erro na requisição:`, error)
      console.error(`💥 [API-DIRETA] Mensagem: ${error.message}`)
      console.error(`💥 [API-DIRETA] Stack:`, error.stack)
    }
  }
}

// Função para verificar o estado da página
function verificarEstadoPagina() {
  console.log('📄 [PÁGINA] === VERIFICANDO ESTADO DA PÁGINA ===')
  
  const url = window.location.href
  const isHoleritesPage = url.includes('/holerites')
  
  console.log('📄 [PÁGINA] URL atual:', url)
  console.log('📄 [PÁGINA] É página de holerites:', isHoleritesPage)
  
  // Verificar elementos na página
  const loadingElements = document.querySelectorAll('[class*="loading"], .animate-spin')
  const emptyElements = document.querySelectorAll('[class*="empty"], [class*="vazio"]')
  const holeriteElements = document.querySelectorAll('[class*="holerite"], [data-testid*="holerite"]')
  
  console.log('📄 [PÁGINA] Elementos de loading:', loadingElements.length)
  console.log('📄 [PÁGINA] Elementos vazios:', emptyElements.length)
  console.log('📄 [PÁGINA] Elementos de holerite:', holeriteElements.length)
  
  // Verificar se há erros no console
  console.log('📄 [PÁGINA] Verificar console para erros JavaScript')
}

// Função para testar conectividade básica
async function testarConectividade() {
  console.log('🌐 [CONECTIVIDADE] === TESTANDO CONECTIVIDADE ===')
  
  const baseUrl = window.location.origin
  const testUrls = [
    `${baseUrl}/api/health`,
    `${baseUrl}/api/notifications/unread-count`
  ]
  
  for (const url of testUrls) {
    try {
      console.log(`🌐 [CONECTIVIDADE] Testando: ${url}`)
      const response = await fetch(url)
      console.log(`🌐 [CONECTIVIDADE] Status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.text()
        console.log(`🌐 [CONECTIVIDADE] Resposta: ${data.substring(0, 100)}...`)
      }
    } catch (error) {
      console.error(`🌐 [CONECTIVIDADE] Erro: ${error.message}`)
    }
  }
}

// Executar todos os testes
async function executarTodosTestes() {
  console.log('🚀 [TESTE-PRODUÇÃO] === EXECUTANDO TODOS OS TESTES ===')
  
  // Verificar página
  verificarEstadoPagina()
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Testar conectividade
  await testarConectividade()
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Testar API principal
  await testarAPIDireta()
  
  console.log('🏁 [TESTE-PRODUÇÃO] === TESTES FINALIZADOS ===')
  console.log('🏁 [TESTE-PRODUÇÃO] Verifique os logs acima para identificar o problema')
}

// Executar automaticamente
executarTodosTestes()

// Disponibilizar globalmente
window.testeProdução = {
  testarAPIDireta,
  verificarEstadoPagina,
  testarConectividade,
  executarTodosTestes
}

console.log('💡 [TESTE-PRODUÇÃO] Funções disponíveis em window.testeProdução')
console.log('💡 [TESTE-PRODUÇÃO] Execute window.testeProdução.executarTodosTestes() para repetir')