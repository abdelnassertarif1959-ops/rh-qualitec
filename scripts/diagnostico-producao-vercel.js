/**
 * DIAGNÓSTICO COMPLETO PARA PRODUÇÃO VERCEL
 * Execute este script no console do navegador na URL de produção
 */

console.log('🔍 [DIAGNÓSTICO-VERCEL] === INICIANDO DIAGNÓSTICO COMPLETO ===')
console.log('🔍 [DIAGNÓSTICO-VERCEL] Timestamp:', new Date().toISOString())

// 1. VERIFICAR AMBIENTE
console.log('🌍 [AMBIENTE] Hostname:', window.location.hostname)
console.log('🌍 [AMBIENTE] URL completa:', window.location.href)
console.log('🌍 [AMBIENTE] Protocol:', window.location.protocol)
console.log('🌍 [AMBIENTE] É produção?', !window.location.hostname.includes('localhost'))

// 2. VERIFICAR AUTENTICAÇÃO
console.log('🔐 [AUTH] Verificando autenticação...')
const authKey = 'sb-rqryspxfvfzfghrfqtbm-auth-token'
const authData = localStorage.getItem(authKey)
console.log('🔐 [AUTH] Token presente:', !!authData)

let userId = null
if (authData) {
  try {
    const parsed = JSON.parse(authData)
    userId = parsed?.user?.id
    console.log('👤 [AUTH] Usuário ID:', userId)
    console.log('👤 [AUTH] Email:', parsed?.user?.email)
    console.log('👤 [AUTH] Token válido:', !!parsed?.access_token)
    console.log('👤 [AUTH] Expires at:', parsed?.expires_at ? new Date(parsed.expires_at * 1000) : 'N/A')
  } catch (e) {
    console.error('❌ [AUTH] Erro ao parsear token:', e)
  }
} else {
  console.error('❌ [AUTH] Nenhum token de autenticação encontrado')
}

// 3. VERIFICAR COOKIES
console.log('🍪 [COOKIES] Cookies disponíveis:', document.cookie || 'Nenhum')

// 4. VERIFICAR NETWORK
console.log('🌐 [NETWORK] Verificando conectividade...')
console.log('🌐 [NETWORK] Navigator online:', navigator.onLine)
console.log('🌐 [NETWORK] User Agent:', navigator.userAgent)

// 5. TESTAR API DE HOLERITES
async function testarAPIHolerites() {
  if (!userId) {
    console.error('❌ [API-TEST] Não é possível testar sem ID do usuário')
    return
  }
  
  console.log('📡 [API-TEST] === TESTANDO API DE HOLERITES ===')
  console.log('📡 [API-TEST] Usuário ID:', userId)
  
  const apiUrl = `/api/holerites/meus-holerites?funcionarioId=${userId}`
  console.log('📡 [API-TEST] URL da API:', apiUrl)
  
  try {
    console.log('📡 [API-TEST] Iniciando requisição...')
    const startTime = Date.now()
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    const endTime = Date.now()
    console.log('⏱️ [API-TEST] Tempo de resposta:', `${endTime - startTime}ms`)
    console.log('📊 [API-TEST] Status:', response.status)
    console.log('📊 [API-TEST] Status Text:', response.statusText)
    console.log('📊 [API-TEST] Headers da resposta:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ [API-TEST] Resposta recebida com sucesso!')
      console.log('✅ [API-TEST] Tipo dos dados:', typeof data)
      console.log('✅ [API-TEST] É array?', Array.isArray(data))
      console.log('✅ [API-TEST] Quantidade de holerites:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('📋 [API-TEST] Primeiro holerite:', data[0])
      } else {
        console.log('📋 [API-TEST] Nenhum holerite retornado')
      }
      
      return data
    } else {
      const errorText = await response.text()
      console.error('❌ [API-TEST] Erro na API:')
      console.error('   Status:', response.status)
      console.error('   Status Text:', response.statusText)
      console.error('   Error Body:', errorText)
      
      // Tentar parsear como JSON se possível
      try {
        const errorJson = JSON.parse(errorText)
        console.error('   Error JSON:', errorJson)
      } catch (e) {
        console.error('   Error Text (não é JSON):', errorText)
      }
    }
    
  } catch (error) {
    console.error('💥 [API-TEST] Erro na requisição:', error)
    console.error('💥 [API-TEST] Tipo do erro:', typeof error)
    console.error('💥 [API-TEST] Nome do erro:', error.name)
    console.error('💥 [API-TEST] Mensagem:', error.message)
    console.error('💥 [API-TEST] Stack:', error.stack)
  }
}

// 6. TESTAR OUTRAS APIs
async function testarOutrasAPIs() {
  console.log('🧪 [OTHER-APIS] === TESTANDO OUTRAS APIs ===')
  
  // Testar API de health
  try {
    console.log('🧪 [OTHER-APIS] Testando /api/health...')
    const healthResponse = await fetch('/api/health')
    console.log('🧪 [OTHER-APIS] Health status:', healthResponse.status)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text()
      console.log('🧪 [OTHER-APIS] Health data:', healthData)
    }
  } catch (error) {
    console.error('❌ [OTHER-APIS] Erro no health check:', error)
  }
  
  // Testar API de notificações
  try {
    console.log('🧪 [OTHER-APIS] Testando /api/notifications/unread-count...')
    const notifResponse = await fetch('/api/notifications/unread-count')
    console.log('🧪 [OTHER-APIS] Notifications status:', notifResponse.status)
    
    if (notifResponse.ok) {
      const notifData = await notifResponse.json()
      console.log('🧪 [OTHER-APIS] Notifications data:', notifData)
    }
  } catch (error) {
    console.error('❌ [OTHER-APIS] Erro nas notificações:', error)
  }
}

// 7. VERIFICAR ESTADO DA PÁGINA
function verificarEstadoPagina() {
  console.log('📄 [PAGE-STATE] === VERIFICANDO ESTADO DA PÁGINA ===')
  
  // Verificar se estamos na página correta
  const isHoleritesPage = window.location.pathname.includes('/holerites')
  console.log('📄 [PAGE-STATE] Está na página de holerites?', isHoleritesPage)
  
  // Verificar elementos na página
  const loadingElements = document.querySelectorAll('.animate-spin, [class*="loading"]')
  console.log('📄 [PAGE-STATE] Elementos de loading:', loadingElements.length)
  
  const emptyStateElements = document.querySelectorAll('[class*="empty"], [class*="nenhum"]')
  console.log('📄 [PAGE-STATE] Elementos de estado vazio:', emptyStateElements.length)
  
  const holeriteElements = document.querySelectorAll('[class*="holerite"], [data-testid*="holerite"]')
  console.log('📄 [PAGE-STATE] Elementos de holerite:', holeriteElements.length)
  
  // Verificar console errors
  console.log('📄 [PAGE-STATE] Verificar console para erros JavaScript')
}

// EXECUTAR TODOS OS TESTES
async function executarDiagnosticoCompleto() {
  console.log('🚀 [DIAGNÓSTICO-VERCEL] === EXECUTANDO TODOS OS TESTES ===')
  
  // Verificar estado da página
  verificarEstadoPagina()
  
  // Aguardar um pouco
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Testar APIs
  await testarOutrasAPIs()
  
  // Aguardar um pouco
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Testar API principal
  await testarAPIHolerites()
  
  console.log('🏁 [DIAGNÓSTICO-VERCEL] === DIAGNÓSTICO COMPLETO FINALIZADO ===')
  console.log('🏁 [DIAGNÓSTICO-VERCEL] Verifique os logs acima para identificar problemas')
}

// EXECUTAR AUTOMATICAMENTE
executarDiagnosticoCompleto()

// DISPONIBILIZAR FUNÇÕES GLOBALMENTE PARA TESTE MANUAL
window.diagnosticoVercel = {
  testarAPIHolerites,
  testarOutrasAPIs,
  verificarEstadoPagina,
  executarDiagnosticoCompleto
}

console.log('💡 [DIAGNÓSTICO-VERCEL] Funções disponíveis em window.diagnosticoVercel')
console.log('💡 [DIAGNÓSTICO-VERCEL] Execute window.diagnosticoVercel.executarDiagnosticoCompleto() para repetir')