/**
 * Script para testar a API de notificações diretamente
 */

import { config } from 'dotenv'
config()

async function testarAPIDireta() {
  console.log('🧪 [TESTE-API] Testando API de notificações diretamente...')
  
  try {
    // Testar via localhost (servidor de desenvolvimento)
    const apiUrl = 'http://localhost:3001/api/notificacoes?limite=5'
    console.log('📋 [TESTE-API] URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('📊 [TESTE-API] Status:', response.status)
    console.log('📊 [TESTE-API] Headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const result = await response.json()
      console.log('✅ [TESTE-API] Resposta da API:')
      console.log(JSON.stringify(result, null, 2))
    } else {
      const errorText = await response.text()
      console.error('❌ [TESTE-API] Erro na API:', errorText)
    }

  } catch (error) {
    console.error('❌ [TESTE-API] Erro de conexão:', error.message)
  }
}

// Executar teste
testarAPIDireta()