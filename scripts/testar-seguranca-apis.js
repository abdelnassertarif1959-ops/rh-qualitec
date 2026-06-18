/**
 * Script de Testes de Segurança de APIs
 * Testa autenticação, autorização e IDOR
 * 
 * Data: 12 de Fevereiro de 2026
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔒 TESTES DE SEGURANÇA DE APIs - AUTENTICAÇÃO E AUTORIZAÇÃO\n')
console.log('='.repeat(80))

// Configuração
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

// Credenciais de teste (devem existir no banco)
const ADMIN_CREDENTIALS = {
  email: 'admin@qualitec.com',
  senha: 'admin123'
}

const FUNCIONARIO_CREDENTIALS = {
  email: 'funcionario@qualitec.com',
  senha: 'func123'
}

// Resultados dos testes
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
}

/**
 * Fazer login e obter cookie de sessão
 */
async function login(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    const setCookieHeader = response.headers.get('set-cookie')
    
    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    const data = await response.json()
    
    return {
      success: true,
      user: data.user,
      cookie: setCookieHeader
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Fazer requisição com autenticação
 */
async function makeRequest(url, options = {}, cookie = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (cookie) {
    headers['Cookie'] = cookie
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers
    })

    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : await response.text()
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    }
  }
}

/**
 * Registrar resultado do teste
 */
function recordTest(category, testName, expected, actual, passed, details = '') {
  testResults.total++
  
  if (passed) {
    testResults.passed++
  } else {
    testResults.failed++
  }

  testResults.tests.push({
    category,
    testName,
    expected,
    actual,
    passed,
    details
  })

  const icon = passed ? '✅' : '❌'
  console.log(`  ${icon} ${testName}`)
  if (!passed && details) {
    console.log(`     Detalhes: ${details}`)
  }
}

/**
 * Pular teste
 */
function skipTest(category, testName, reason) {
  testResults.total++
  testResults.skipped++
  
  testResults.tests.push({
    category,
    testName,
    expected: 'N/A',
    actual: 'SKIPPED',
    passed: null,
    details: reason
  })

  console.log(`  ⚠️  ${testName} - PULADO: ${reason}`)
}

// ============================================================================
// TESTES DE AUTENTICAÇÃO
// ============================================================================

console.log('\n📋 1. TESTES DE AUTENTICAÇÃO\n')

// Teste 1.1: Login com credenciais válidas
console.log('1.1. Login com Credenciais Válidas')
const adminLogin = await login(ADMIN_CREDENTIALS)
recordTest(
  'Autenticação',
  'Login admin com credenciais válidas',
  'Status 200 e cookie de sessão',
  adminLogin.success ? 'Sucesso' : 'Falha',
  adminLogin.success,
  adminLogin.error || ''
)

const funcionarioLogin = await login(FUNCIONARIO_CREDENTIALS)
recordTest(
  'Autenticação',
  'Login funcionário com credenciais válidas',
  'Status 200 e cookie de sessão',
  funcionarioLogin.success ? 'Sucesso' : 'Falha',
  funcionarioLogin.success,
  funcionarioLogin.error || ''
)

// Teste 1.2: Login com credenciais inválidas
console.log('\n1.2. Login com Credenciais Inválidas')
const invalidLogin = await login({ email: 'invalido@test.com', senha: 'senha_errada' })
recordTest(
  'Autenticação',
  'Login com credenciais inválidas deve falhar',
  'Status 401',
  invalidLogin.success ? 'Sucesso (FALHA DE SEGURANÇA!)' : 'Falha (correto)',
  !invalidLogin.success
)

// ============================================================================
// TESTES DE AUTORIZAÇÃO - APIs SEM AUTENTICAÇÃO
// ============================================================================

console.log('\n\n📋 2. TESTES DE ACESSO SEM AUTENTICAÇÃO (deve retornar 401)\n')

const protectedEndpoints = [
  { method: 'GET', url: '/api/funcionarios', name: 'Listar funcionários' },
  { method: 'POST', url: '/api/funcionarios', name: 'Criar funcionário' },
  { method: 'GET', url: '/api/empresas', name: 'Listar empresas' },
  { method: 'POST', url: '/api/empresas', name: 'Criar empresa' },
  { method: 'GET', url: '/api/holerites', name: 'Listar holerites' },
  { method: 'GET', url: '/api/notificacoes', name: 'Listar notificações' },
  { method: 'GET', url: '/api/dashboard/stats', name: 'Dashboard stats' },
]

for (const endpoint of protectedEndpoints) {
  const response = await makeRequest(endpoint.url, { method: endpoint.method })
  recordTest(
    'Autorização - Sem Auth',
    `${endpoint.name} sem autenticação`,
    'Status 401',
    `Status ${response.status}`,
    response.status === 401,
    response.status !== 401 ? 'VULNERABILIDADE: Endpoint acessível sem autenticação!' : ''
  )
}

// ============================================================================
// TESTES DE AUTORIZAÇÃO - FUNCIONÁRIO TENTANDO ACESSAR DADOS DE ADMIN
// ============================================================================

console.log('\n\n📋 3. TESTES DE ESCALAÇÃO DE PRIVILÉGIOS (Funcionário → Admin)\n')

if (funcionarioLogin.success) {
  const adminOnlyEndpoints = [
    { method: 'POST', url: '/api/funcionarios', name: 'Criar funcionário (admin only)', body: { nome: 'Teste' } },
    { method: 'POST', url: '/api/empresas', name: 'Criar empresa (admin only)', body: { nome: 'Teste' } },
    { method: 'DELETE', url: '/api/funcionarios/1', name: 'Deletar funcionário (admin only)' },
    { method: 'POST', url: '/api/holerites/gerar', name: 'Gerar holerite (admin only)', body: {} },
  ]

  for (const endpoint of adminOnlyEndpoints) {
    const response = await makeRequest(
      endpoint.url,
      { 
        method: endpoint.method,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
      },
      funcionarioLogin.cookie
    )
    
    recordTest(
      'Escalação de Privilégios',
      `Funcionário tentando: ${endpoint.name}`,
      'Status 403',
      `Status ${response.status}`,
      response.status === 403,
      response.status !== 403 ? 'VULNERABILIDADE: Funcionário conseguiu acessar recurso de admin!' : ''
    )
  }
} else {
  skipTest('Escalação de Privilégios', 'Testes de escalação', 'Login de funcionário falhou')
}

// ============================================================================
// TESTES DE IDOR - ACESSO A DADOS DE OUTROS USUÁRIOS
// ============================================================================

console.log('\n\n📋 4. TESTES DE IDOR (Insecure Direct Object Reference)\n')

if (funcionarioLogin.success && adminLogin.success) {
  // IDs dos usuários de teste
  const funcionarioId = funcionarioLogin.user?.id
  const adminId = adminLogin.user?.id
  // ID de outro funcionário (qualquer ID diferente do funcionário de teste)
  const otherUserId = funcionarioId ? funcionarioId + 1 : 999

  console.log(`4.1. Funcionário (ID: ${funcionarioId}) tentando acessar dados de outro funcionário (ID: ${otherUserId})`)
  
  // Teste 4.1: Funcionário tentando acessar dados de outro funcionário
  const idorTests = [
    { 
      url: `/api/funcionarios/${otherUserId}`, 
      method: 'GET',
      name: 'Ver dados de outro funcionário'
    },
    { 
      url: `/api/funcionarios/${otherUserId}`, 
      method: 'PATCH',
      name: 'Editar dados de outro funcionário',
      body: { nome: 'Hacked' }
    },
    { 
      url: `/api/holerites?funcionario_id=${otherUserId}`, 
      method: 'GET',
      name: 'Ver holerites de outro funcionário'
    },
  ]

  for (const test of idorTests) {
    const response = await makeRequest(
      test.url,
      { 
        method: test.method,
        body: test.body ? JSON.stringify(test.body) : undefined
      },
      funcionarioLogin.cookie
    )
    
    recordTest(
      'IDOR',
      test.name,
      'Status 403',
      `Status ${response.status}`,
      response.status === 403,
      response.status !== 403 ? `VULNERABILIDADE IDOR: Funcionário acessou dados de outro usuário! (Status: ${response.status})` : ''
    )
  }

  // Teste 4.2: Funcionário tentando acessar seus próprios dados (deve funcionar)
  console.log(`\n4.2. Funcionário acessando seus próprios dados (deve funcionar)`)
  
  const ownDataResponse = await makeRequest(
    `/api/funcionarios/${funcionarioId}`,
    { method: 'GET' },
    funcionarioLogin.cookie
  )
  
  recordTest(
    'IDOR',
    'Funcionário acessando próprios dados',
    'Status 200',
    `Status ${ownDataResponse.status}`,
    ownDataResponse.status === 200,
    ownDataResponse.status !== 200 ? 'Funcionário não consegue acessar próprios dados!' : ''
  )

  // Teste 4.3: Admin tentando acessar dados de qualquer usuário (deve funcionar)
  console.log(`\n4.3. Admin acessando dados de qualquer usuário (deve funcionar)`)
  
  const adminAccessResponse = await makeRequest(
    `/api/funcionarios/${funcionarioId}`,
    { method: 'GET' },
    adminLogin.cookie
  )
  
  recordTest(
    'IDOR',
    'Admin acessando dados de funcionário',
    'Status 200',
    `Status ${adminAccessResponse.status}`,
    adminAccessResponse.status === 200,
    adminAccessResponse.status !== 200 ? 'Admin não consegue acessar dados de funcionário!' : ''
  )

} else {
  skipTest('IDOR', 'Testes de IDOR', 'Login falhou')
}

// ============================================================================
// TESTES DE MANIPULAÇÃO DE IDs
// ============================================================================

console.log('\n\n📋 5. TESTES DE MANIPULAÇÃO DE IDs NA URL\n')

if (funcionarioLogin.success) {
  const manipulationTests = [
    { url: '/api/funcionarios/-1', name: 'ID negativo' },
    { url: '/api/funcionarios/999999', name: 'ID muito alto' },
    { url: '/api/funcionarios/0', name: 'ID zero' },
    { url: "/api/funcionarios/1' OR '1'='1", name: 'SQL Injection no ID' },
    { url: '/api/funcionarios/abc', name: 'ID não numérico' },
  ]

  for (const test of manipulationTests) {
    const response = await makeRequest(
      test.url,
      { method: 'GET' },
      funcionarioLogin.cookie
    )
    
    const isSecure = response.status === 400 || response.status === 403 || response.status === 404
    
    recordTest(
      'Manipulação de IDs',
      `Tentativa com ${test.name}`,
      'Status 400/403/404',
      `Status ${response.status}`,
      isSecure,
      !isSecure ? `VULNERABILIDADE: Sistema aceitou ID inválido (${test.name})` : ''
    )
  }
} else {
  skipTest('Manipulação de IDs', 'Testes de manipulação', 'Login falhou')
}

// ============================================================================
// TESTES DE CSRF
// ============================================================================

console.log('\n\n📋 6. TESTES DE PROTEÇÃO CSRF\n')

if (funcionarioLogin.success) {
  // Teste sem token CSRF
  const csrfTest = await makeRequest(
    '/api/funcionarios',
    { 
      method: 'POST',
      body: JSON.stringify({ nome: 'Teste CSRF' })
    },
    funcionarioLogin.cookie
  )
  
  recordTest(
    'CSRF',
    'Requisição POST sem token CSRF',
    'Status 403',
    `Status ${csrfTest.status}`,
    csrfTest.status === 403,
    csrfTest.status !== 403 ? 'VULNERABILIDADE: Sistema aceita requisições sem token CSRF!' : ''
  )
} else {
  skipTest('CSRF', 'Testes de CSRF', 'Login falhou')
}

// ============================================================================
// TESTES DE RATE LIMITING
// ============================================================================

console.log('\n\n📋 7. TESTES DE RATE LIMITING\n')

console.log('7.1. Testando rate limiting no login (5 tentativas)')

let rateLimitTriggered = false
for (let i = 0; i < 6; i++) {
  const response = await login({ email: 'test@test.com', senha: 'wrong' })
  
  if (i === 5) {
    // Na 6ª tentativa, deve ser bloqueado
    rateLimitTriggered = !response.success && response.error?.includes('429')
  }
}

recordTest(
  'Rate Limiting',
  'Rate limiting no login após 5 tentativas',
  'Bloqueado (429)',
  rateLimitTriggered ? 'Bloqueado' : 'Não bloqueado',
  rateLimitTriggered,
  !rateLimitTriggered ? 'VULNERABILIDADE: Rate limiting não está funcionando!' : ''
)

// ============================================================================
// TESTES DE EXPOSIÇÃO DE DADOS SENSÍVEIS
// ============================================================================

console.log('\n\n📋 8. TESTES DE EXPOSIÇÃO DE DADOS SENSÍVEIS\n')

if (adminLogin.success) {
  const response = await makeRequest(
    '/api/funcionarios',
    { method: 'GET' },
    adminLogin.cookie
  )
  
  if (response.ok && response.data) {
    const funcionarios = Array.isArray(response.data) ? response.data : response.data.funcionarios || []
    
    if (funcionarios.length > 0) {
      const primeiroFuncionario = funcionarios[0]
      
      const hasSenha = 'senha' in primeiroFuncionario || 'senha_hash' in primeiroFuncionario
      
      recordTest(
        'Exposição de Dados',
        'API não deve retornar senhas',
        'Sem campo senha/senha_hash',
        hasSenha ? 'Senha exposta!' : 'Senha não exposta',
        !hasSenha,
        hasSenha ? 'VULNERABILIDADE CRÍTICA: API está retornando senhas!' : ''
      )
    } else {
      skipTest('Exposição de Dados', 'Verificação de senhas', 'Nenhum funcionário retornado')
    }
  } else {
    skipTest('Exposição de Dados', 'Verificação de senhas', 'Falha ao obter funcionários')
  }
} else {
  skipTest('Exposição de Dados', 'Testes de exposição', 'Login de admin falhou')
}

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

console.log('\n\n' + '='.repeat(80))
console.log('📊 RELATÓRIO FINAL DE TESTES DE SEGURANÇA\n')

console.log(`Total de Testes: ${testResults.total}`)
console.log(`✅ Passou: ${testResults.passed} (${Math.round(testResults.passed/testResults.total*100)}%)`)
console.log(`❌ Falhou: ${testResults.failed} (${Math.round(testResults.failed/testResults.total*100)}%)`)
console.log(`⚠️  Pulados: ${testResults.skipped} (${Math.round(testResults.skipped/testResults.total*100)}%)`)

// Agrupar por categoria
const byCategory = {}
testResults.tests.forEach(test => {
  if (!byCategory[test.category]) {
    byCategory[test.category] = { passed: 0, failed: 0, skipped: 0, total: 0 }
  }
  byCategory[test.category].total++
  if (test.passed === true) byCategory[test.category].passed++
  else if (test.passed === false) byCategory[test.category].failed++
  else byCategory[test.category].skipped++
})

console.log('\n📋 Resultados por Categoria:\n')
Object.entries(byCategory).forEach(([category, stats]) => {
  const percentage = Math.round((stats.passed / stats.total) * 100)
  console.log(`  ${category}:`)
  console.log(`    ✅ ${stats.passed}/${stats.total} (${percentage}%)`)
  if (stats.failed > 0) console.log(`    ❌ ${stats.failed} falhas`)
  if (stats.skipped > 0) console.log(`    ⚠️  ${stats.skipped} pulados`)
})

// Listar vulnerabilidades críticas
const vulnerabilities = testResults.tests.filter(t => !t.passed && t.passed !== null && t.details.includes('VULNERABILIDADE'))

if (vulnerabilities.length > 0) {
  console.log('\n\n🚨 VULNERABILIDADES CRÍTICAS DETECTADAS:\n')
  vulnerabilities.forEach((vuln, index) => {
    console.log(`${index + 1}. [${vuln.category}] ${vuln.testName}`)
    console.log(`   ${vuln.details}\n`)
  })
}

// Salvar relatório
const reportPath = path.join(rootDir, 'relatorio-testes-seguranca-apis.json')
fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2))
console.log(`\n📄 Relatório detalhado salvo em: relatorio-testes-seguranca-apis.json`)

console.log('\n' + '='.repeat(80))

// Exit code baseado nos resultados
if (vulnerabilities.length > 0) {
  console.log('\n❌ FALHA: Vulnerabilidades críticas detectadas\n')
  process.exit(1)
} else if (testResults.failed > 0) {
  console.log('\n⚠️  AVISO: Alguns testes falharam\n')
  process.exit(1)
} else {
  console.log('\n✅ SUCESSO: Todos os testes de segurança passaram!\n')
  process.exit(0)
}
