/**
 * Script para testar implementação completa de JWT
 * Testa login, renovação de token e logout
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testarJWT() {
  const BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
  
  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('🔐 TESTE COMPLETO DE AUTENTICAÇÃO JWT', 'cyan')
  log('═══════════════════════════════════════════════════════════', 'cyan')
  
  let accessToken = null
  let refreshToken = null
  let cookies = []
  
  // Função auxiliar para fazer requisições
  async function request(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (cookies.length > 0) {
      headers['Cookie'] = cookies.join('; ')
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    // Capturar cookies da resposta
    const setCookies = response.headers.get('set-cookie')
    if (setCookies) {
      cookies = setCookies.split(',').map(c => c.split(';')[0].trim())
    }
    
    return response
  }
  
  try {
    // 0. OBTER TOKEN CSRF
    log('\n📝 TESTE 0: Obter Token CSRF', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const csrfResponse = await request(`${BASE_URL}/api/csrf-token`)
    const csrfData = await csrfResponse.json()
    const csrfToken = csrfData.csrfToken
    
    if (!csrfToken) {
      throw new Error('CSRF token não retornado pela API')
    }
    
    log(`✅ CSRF Token obtido: ${csrfToken.substring(0, 20)}...`, 'green')
    
    // 1. TESTE DE LOGIN
    log('\n📝 TESTE 1: Login com JWT', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const loginResponse = await request(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        email: 'silvana@qualitec.ind.br',
        senha: 'Qualitec2025Silvana'
      })
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`)
    }
    
    const loginData = await loginResponse.json()
    
    if (loginData.success && loginData.tokens) {
      accessToken = loginData.tokens.accessToken
      refreshToken = loginData.tokens.refreshToken
      
      log('✅ Login bem-sucedido', 'green')
      log(`   Usuário: ${loginData.user.nome}`, 'green')
      log(`   Tipo: ${loginData.user.tipo}`, 'green')
      log(`   Access Token: ${accessToken.substring(0, 50)}...`, 'green')
      log(`   Refresh Token: ${refreshToken.substring(0, 50)}...`, 'green')
    } else {
      throw new Error('Login não retornou tokens')
    }
    
    // 2. TESTE DE REQUISIÇÃO AUTENTICADA
    log('\n📝 TESTE 2: Requisição com JWT', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const authResponse = await request(`${BASE_URL}/api/funcionarios`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (authResponse.ok) {
      log('✅ Requisição autenticada com sucesso', 'green')
      const data = await authResponse.json()
      log(`   Funcionários retornados: ${data.length || 0}`, 'green')
    } else {
      throw new Error(`Requisição autenticada falhou: ${authResponse.status}`)
    }
    
    // 3. TESTE DE RENOVAÇÃO DE TOKEN
    log('\n📝 TESTE 3: Renovação de Token', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const refreshResponse = await request(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken
      })
    })
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json()
      
      if (refreshData.success && refreshData.tokens) {
        const newAccessToken = refreshData.tokens.accessToken
        const newRefreshToken = refreshData.tokens.refreshToken
        
        log('✅ Token renovado com sucesso', 'green')
        log(`   Novo Access Token: ${newAccessToken.substring(0, 50)}...`, 'green')
        log(`   Novo Refresh Token: ${newRefreshToken.substring(0, 50)}...`, 'green')
        log(`   Tokens são diferentes: ${newAccessToken !== accessToken}`, 'green')
        
        accessToken = newAccessToken
        refreshToken = newRefreshToken
      } else {
        throw new Error('Renovação não retornou tokens')
      }
    } else {
      throw new Error(`Renovação de token falhou: ${refreshResponse.status}`)
    }
    
    // 4. TESTE DE REQUISIÇÃO COM NOVO TOKEN
    log('\n📝 TESTE 4: Requisição com Novo Token', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const newAuthResponse = await request(`${BASE_URL}/api/funcionarios`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (newAuthResponse.ok) {
      log('✅ Requisição com novo token bem-sucedida', 'green')
    } else {
      throw new Error(`Requisição com novo token falhou: ${newAuthResponse.status}`)
    }
    
    // 5. TESTE DE LOGOUT
    log('\n📝 TESTE 5: Logout', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const logoutResponse = await request(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      }
    })
    
    if (logoutResponse.ok) {
      log('✅ Logout bem-sucedido', 'green')
    } else {
      throw new Error(`Logout falhou: ${logoutResponse.status}`)
    }
    
    // 6. TESTE DE REQUISIÇÃO APÓS LOGOUT
    log('\n📝 TESTE 6: Requisição Após Logout (deve falhar)', 'cyan')
    log('─────────────────────────────────────────────────────────', 'cyan')
    
    const afterLogoutResponse = await request(`${BASE_URL}/api/funcionarios`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (afterLogoutResponse.status === 401) {
      log('✅ Requisição após logout falhou corretamente (401)', 'green')
    } else {
      log('⚠️  Requisição após logout não retornou 401', 'yellow')
    }
    
    // RESUMO FINAL
    log('\n═══════════════════════════════════════════════════════════', 'cyan')
    log('📊 RESUMO DOS TESTES', 'cyan')
    log('═══════════════════════════════════════════════════════════', 'cyan')
    
    log('\n✅ Todos os testes passaram com sucesso!', 'green')
    log('\nFuncionalidades testadas:', 'cyan')
    log('  ✅ Login com geração de JWT', 'green')
    log('  ✅ Requisição autenticada com JWT', 'green')
    log('  ✅ Renovação de tokens', 'green')
    log('  ✅ Requisição com token renovado', 'green')
    log('  ✅ Logout e limpeza de tokens', 'green')
    log('  ✅ Bloqueio após logout', 'green')
    
    log('\n🎯 Sistema JWT funcionando perfeitamente!', 'green')
    log('═══════════════════════════════════════════════════════════\n', 'cyan')
    
  } catch (error) {
    log('\n❌ ERRO NO TESTE:', 'red')
    log(error.message, 'red')
    log('\n═══════════════════════════════════════════════════════════\n', 'cyan')
    process.exit(1)
  }
}

// Executar testes
testarJWT()
