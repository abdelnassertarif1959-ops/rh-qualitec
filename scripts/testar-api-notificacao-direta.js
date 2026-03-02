/**
 * Script para testar as configurações em produção
 * Execute no console do navegador no site de produção
 */

console.log('🧪 [TESTE-PRODUCAO] Iniciando teste de configurações...')

// Função para testar as configurações
async function testarConfiguracoes() {
  try {
    console.log('🔍 [TESTE-PRODUCAO] Testando API de debug...')
    
    // Testar API de debug (só funciona com token)
    const debugResponse = await fetch('/api/debug/variaveis?token=qualitec-debug-2026-secure')
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json()
      console.log('✅ [TESTE-PRODUCAO] Configurações:', debugData)
      
      if (!debugData.data.configuracaoOK) {
        console.error('❌ [TESTE-PRODUCAO] Variáveis faltando:', debugData.data.variavelsCriticas.faltando)
      }
    } else {
      console.error('❌ [TESTE-PRODUCAO] Erro na API de debug:', debugResponse.status)
    }
    
  } catch (error) {
    console.error('💥 [TESTE-PRODUCAO] Erro no teste:', error)
  }
}

// Função para testar a API de holerites diretamente
async function testarAPIHolerites() {
  try {
    // Pegar o usuário logado
    const authData = localStorage.getItem('sb-rqryspxfvfzfghrfqtbm-auth-token')
    if (!authData) {
      console.error('❌ [TESTE-PRODUCAO] Usuário não logado')
      return
    }
    
    const user = JSON.parse(authData)
    const userId = user?.user?.id
    
    if (!userId) {
      console.error('❌ [TESTE-PRODUCAO] ID do usuário não encontrado')
      return
    }
    
    console.log('👤 [TESTE-PRODUCAO] Testando com usuário:', userId)
    
    // Testar API de holerites
    const holeriteResponse = await fetch(`/api/holerites/meus-holerites?funcionarioId=${userId}`)
    
    console.log('📊 [TESTE-PRODUCAO] Status da API de holerites:', holeriteResponse.status)
    
    if (holeriteResponse.ok) {
      const holerites = await holeriteResponse.json()
      console.log('✅ [TESTE-PRODUCAO] Holerites recebidos:', holerites?.length || 0)
      
      if (holerites && holerites.length > 0) {
        console.log('📋 [TESTE-PRODUCAO] Primeiro holerite:', holerites[0])
      }
    } else {
      const errorText = await holeriteResponse.text()
      console.error('❌ [TESTE-PRODUCAO] Erro na API de holerites:', errorText)
    }
    
  } catch (error) {
    console.error('💥 [TESTE-PRODUCAO] Erro no teste de holerites:', error)
  }
}

// Executar testes
console.log('🚀 [TESTE-PRODUCAO] Executando testes...')
testarConfiguracoes()
testarAPIHolerites()

// Informações do ambiente
console.log('🌍 [TESTE-PRODUCAO] URL atual:', window.location.href)
console.log('🌍 [TESTE-PRODUCAO] Hostname:', window.location.hostname)
console.log('🌍 [TESTE-PRODUCAO] É produção?', window.location.hostname.includes('vercel.app'))