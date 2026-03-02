/**
 * DIAGNÓSTICO ESPECÍFICO PARA HOLERITES - PRODUÇÃO
 * Execute este script no console do navegador na URL de produção
 * Foque apenas no problema dos holerites
 */

console.log('💰 [DIAGNÓSTICO-HOLERITES] === INICIANDO DIAGNÓSTICO ESPECÍFICO ===')
console.log('💰 [DIAGNÓSTICO-HOLERITES] Timestamp:', new Date().toISOString())
console.log('💰 [DIAGNÓSTICO-HOLERITES] URL:', window.location.href)

// 1. VERIFICAR AUTENTICAÇÃO (deve estar OK se consegue fazer login)
console.log('\n🔐 [AUTH] === VERIFICAÇÃO DE AUTENTICAÇÃO ===')
const authKey = 'sb-rqryspxfvfzfghrfqtbm-auth-token'
const authData = localStorage.getItem(authKey)

if (!authData) {
  console.error('❌ [AUTH] Token de autenticação não encontrado!')
  console.log('💡 [AUTH] Faça login primeiro e execute o script novamente')
  throw new Error('Autenticação necessária')
}

let userId = null
let userEmail = null
let userName = null

try {
  const parsed = JSON.parse(authData)
  userId = parsed?.user?.id
  userEmail = parsed?.user?.email
  userName = parsed?.user?.user_metadata?.nome || parsed?.user?.user_metadata?.name
  
  console.log('✅ [AUTH] Token presente e válido')
  console.log('👤 [AUTH] Usuário ID:', userId)
  console.log('👤 [AUTH] Email:', userEmail)
  console.log('👤 [AUTH] Nome:', userName)
  console.log('🕐 [AUTH] Token expira em:', parsed?.expires_at ? new Date(parsed.expires_at * 1000) : 'N/A')
  
} catch (e) {
  console.error('❌ [AUTH] Erro ao parsear token:', e)
  throw new Error('Token inválido')
}

// 2. TESTAR API DE HOLERITES PASSO A PASSO
console.log('\n💰 [API-HOLERITES] === TESTE DETALHADO DA API ===')

async function testarAPIHolerites() {
  const apiUrl = `/api/holerites/meus-holerites?funcionarioId=${userId}`
  console.log('📡 [API-HOLERITES] URL da API:', apiUrl)
  
  try {
    console.log('📡 [API-HOLERITES] Iniciando requisição...')
    const startTime = performance.now()
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    console.log('⏱️ [API-HOLERITES] Tempo de resposta:', `${duration}ms`)
    console.log('📊 [API-HOLERITES] Status:', response.status)
    console.log('📊 [API-HOLERITES] Status Text:', response.statusText)
    console.log('📊 [API-HOLERITES] Headers da resposta:')
    
    // Mostrar todos os headers
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`)
    }
    
    if (response.ok) {
      console.log('✅ [API-HOLERITES] Resposta HTTP OK!')
      
      const contentType = response.headers.get('content-type')
      console.log('📋 [API-HOLERITES] Content-Type:', contentType)
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log('✅ [API-HOLERITES] Dados JSON recebidos!')
        console.log('📦 [API-HOLERITES] Tipo dos dados:', typeof data)
        console.log('📦 [API-HOLERITES] É array?', Array.isArray(data))
        console.log('📦 [API-HOLERITES] Quantidade de holerites:', data?.length || 0)
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('📋 [API-HOLERITES] Primeiro holerite:')
          const primeiro = data[0]
          console.log('   ID:', primeiro.id)
          console.log('   Status:', primeiro.status)
          console.log('   Período:', primeiro.periodo_inicio, 'a', primeiro.periodo_fim)
          console.log('   Salário Base:', primeiro.salario_base)
          console.log('   Funcionário ID:', primeiro.funcionario_id)
          
          console.log('📋 [API-HOLERITES] Todos os holerites:')
          data.forEach((h, i) => {
            console.log(`   ${i+1}. ID: ${h.id}, Status: ${h.status}, Período: ${h.periodo_inicio} - ${h.periodo_fim}`)
          })
          
          return { success: true, data, count: data.length }
        } else {
          console.log('⚠️ [API-HOLERITES] Array vazio ou dados inválidos')
          console.log('📦 [API-HOLERITES] Dados completos:', data)
          return { success: true, data, count: 0, empty: true }
        }
      } else {
        const text = await response.text()
        console.error('❌ [API-HOLERITES] Resposta não é JSON!')
        console.error('📄 [API-HOLERITES] Conteúdo da resposta:', text)
        return { success: false, error: 'Resposta não é JSON', content: text }
      }
    } else {
      console.error('❌ [API-HOLERITES] Erro HTTP:', response.status, response.statusText)
      
      try {
        const errorData = await response.json()
        console.error('📄 [API-HOLERITES] Erro JSON:', errorData)
        return { success: false, status: response.status, error: errorData }
      } catch (e) {
        const errorText = await response.text()
        console.error('📄 [API-HOLERITES] Erro Text:', errorText)
        return { success: false, status: response.status, error: errorText }
      }
    }
    
  } catch (error) {
    console.error('💥 [API-HOLERITES] Erro na requisição:', error)
    console.error('💥 [API-HOLERITES] Tipo do erro:', typeof error)
    console.error('💥 [API-HOLERITES] Nome do erro:', error.name)
    console.error('💥 [API-HOLERITES] Mensagem:', error.message)
    console.error('💥 [API-HOLERITES] Stack:', error.stack)
    return { success: false, error: error.message, type: error.name }
  }
}

// 3. TESTAR API DE DEBUG (se disponível)
async function testarAPIDebug() {
  console.log('\n🔍 [API-DEBUG] === TESTE DA API DE DEBUG ===')
  
  const debugUrl = `/api/debug/holerites-funcionario?funcionarioId=${userId}&token=qualitec-debug-2026-secure`
  console.log('🔍 [API-DEBUG] URL:', debugUrl)
  
  try {
    const response = await fetch(debugUrl)
    console.log('📊 [API-DEBUG] Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ [API-DEBUG] Dados de debug recebidos:')
      console.log(data)
      return data
    } else {
      const error = await response.text()
      console.log('❌ [API-DEBUG] Erro:', error)
      return null
    }
  } catch (error) {
    console.log('💥 [API-DEBUG] Erro na requisição:', error.message)
    return null
  }
}

// 4. VERIFICAR ESTADO DA PÁGINA
function verificarEstadoPagina() {
  console.log('\n📄 [PÁGINA] === VERIFICAÇÃO DO ESTADO DA PÁGINA ===')
  
  const isHoleritesPage = window.location.pathname.includes('/holerites')
  console.log('📄 [PÁGINA] Está na página de holerites?', isHoleritesPage)
  console.log('📄 [PÁGINA] Pathname:', window.location.pathname)
  
  // Verificar elementos na página
  const loadingElements = document.querySelectorAll('.animate-spin, [class*="loading"], [class*="spinner"]')
  console.log('📄 [PÁGINA] Elementos de loading:', loadingElements.length)
  
  const emptyStateElements = document.querySelectorAll('[class*="empty"], [class*="nenhum"], [class*="vazio"]')
  console.log('📄 [PÁGINA] Elementos de estado vazio:', emptyStateElements.length)
  
  const holeriteElements = document.querySelectorAll('[class*="holerite"], [data-testid*="holerite"], .card')
  console.log('📄 [PÁGINA] Elementos que podem ser holerites:', holeriteElements.length)
  
  // Verificar se há erros no console
  console.log('📄 [PÁGINA] Verifique se há erros JavaScript no console acima')
  
  // Verificar network requests
  console.log('📄 [PÁGINA] Abra a aba Network (Rede) no DevTools para ver requisições')
}

// 5. EXECUTAR TODOS OS TESTES
async function executarDiagnosticoCompleto() {
  console.log('\n🚀 [DIAGNÓSTICO-HOLERITES] === EXECUTANDO TODOS OS TESTES ===')
  
  // Verificar estado da página
  verificarEstadoPagina()
  
  // Aguardar um pouco
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Testar API principal
  console.log('\n🎯 [TESTE-PRINCIPAL] Testando API principal de holerites...')
  const resultadoPrincipal = await testarAPIHolerites()
  
  // Aguardar um pouco
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Testar API de debug
  console.log('\n🔍 [TESTE-DEBUG] Testando API de debug...')
  const resultadoDebug = await testarAPIDebug()
  
  // Resumo final
  console.log('\n📊 [RESUMO] === RESUMO DO DIAGNÓSTICO ===')
  console.log('👤 [RESUMO] Usuário:', userName, `(${userEmail})`)
  console.log('🔐 [RESUMO] Autenticação:', '✅ OK')
  
  if (resultadoPrincipal.success) {
    if (resultadoPrincipal.empty) {
      console.log('⚠️ [RESUMO] API de holerites: Responde OK mas retorna array vazio')
      console.log('💡 [RESUMO] Possíveis causas:')
      console.log('   - Funcionário não tem holerites gerados')
      console.log('   - Holerites têm status que não permite visualização')
      console.log('   - Problema na query do banco de dados')
    } else {
      console.log('✅ [RESUMO] API de holerites: OK -', resultadoPrincipal.count, 'holerites encontrados')
    }
  } else {
    console.log('❌ [RESUMO] API de holerites: ERRO -', resultadoPrincipal.error)
  }
  
  if (resultadoDebug) {
    console.log('✅ [RESUMO] API de debug: OK - dados disponíveis')
  } else {
    console.log('⚠️ [RESUMO] API de debug: Não disponível ou erro')
  }
  
  console.log('\n🏁 [DIAGNÓSTICO-HOLERITES] === DIAGNÓSTICO FINALIZADO ===')
  console.log('🏁 [DIAGNÓSTICO-HOLERITES] Timestamp:', new Date().toISOString())
  
  return {
    auth: { userId, userEmail, userName },
    api: resultadoPrincipal,
    debug: resultadoDebug,
    timestamp: new Date().toISOString()
  }
}

// EXECUTAR AUTOMATICAMENTE
executarDiagnosticoCompleto().then(resultado => {
  console.log('\n💾 [RESULTADO] Resultado completo salvo em window.diagnosticoHolerites')
  window.diagnosticoHolerites = resultado
}).catch(error => {
  console.error('💥 [ERRO-GERAL] Erro no diagnóstico:', error)
})

// DISPONIBILIZAR FUNÇÕES GLOBALMENTE
window.diagnosticoHoleritesManual = {
  testarAPI: testarAPIHolerites,
  testarDebug: testarAPIDebug,
  verificarPagina: verificarEstadoPagina,
  executarCompleto: executarDiagnosticoCompleto
}

console.log('\n💡 [INFO] Funções disponíveis:')
console.log('   window.diagnosticoHoleritesManual.testarAPI()')
console.log('   window.diagnosticoHoleritesManual.testarDebug()')
console.log('   window.diagnosticoHoleritesManual.executarCompleto()')