/**
 * AUDITORIA COMPLETA DE SEGURANÇA DAS APIs
 * 
 * Este script testa:
 * 1. Proteção de autenticação em rotas protegidas
 * 2. Proteção CSRF em métodos mutáveis
 * 3. Controle de acesso (admin vs funcionário)
 * 4. Proteção de cron jobs
 * 5. Sanitização de dados sensíveis
 * 6. Validação de ownership (acesso a dados próprios)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Resultados da auditoria
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  vulnerabilities: []
}

// Função para log colorido
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Função para registrar vulnerabilidade
function reportVulnerability(severity, category, endpoint, description, recommendation) {
  results.vulnerabilities.push({
    severity,
    category,
    endpoint,
    description,
    recommendation,
    timestamp: new Date().toISOString()
  })
  
  const severityColor = severity === 'CRÍTICA' ? 'red' : severity === 'ALTA' ? 'yellow' : 'blue'
  log(`\n⚠️  VULNERABILIDADE ${severity}`, severityColor)
  log(`   Categoria: ${category}`, severityColor)
  log(`   Endpoint: ${endpoint}`, severityColor)
  log(`   Descrição: ${description}`, severityColor)
  log(`   Recomendação: ${recommendation}`, severityColor)
}

// Função para fazer requisição HTTP
async function makeRequest(method, endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json().catch(() => null) : null,
      error: !response.ok ? await response.text().catch(() => null) : null
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    }
  }
}

// Função para criar usuários de teste
async function setupTestUsers() {
  log('\n📋 Configurando usuários de teste...', 'cyan')
  
  // Criar empresa de teste
  const { data: empresa, error: empresaError } = await supabase
    .from('empresas')
    .insert({
      razao_social: 'Empresa Teste Segurança',
      nome_fantasia: 'Teste Seg',
      cnpj: '00000000000199',
      status: 'ativa'
    })
    .select()
    .single()
  
  if (empresaError) {
    log('❌ Erro ao criar empresa de teste', 'red')
    return null
  }
  
  // Criar admin de teste
  const { data: admin, error: adminError } = await supabase
    .from('funcionarios')
    .insert({
      nome_completo: 'Admin Teste Segurança',
      email_login: 'admin.teste.seg@test.com',
      senha: 'MIGRAR_senha123',
      tipo_acesso: 'admin',
      empresa_id: empresa.id,
      status: 'ativo',
      cpf: '00000000099'
    })
    .select()
    .single()
  
  if (adminError) {
    log('❌ Erro ao criar admin de teste', 'red')
    return null
  }
  
  // Criar funcionário de teste
  const { data: funcionario, error: funcError } = await supabase
    .from('funcionarios')
    .insert({
      nome_completo: 'Funcionário Teste Segurança',
      email_login: 'func.teste.seg@test.com',
      senha: 'MIGRAR_senha123',
      tipo_acesso: 'funcionario',
      empresa_id: empresa.id,
      status: 'ativo',
      cpf: '00000000098',
      salario_base: 5000.00
    })
    .select()
    .single()
  
  if (funcError) {
    log('❌ Erro ao criar funcionário de teste', 'red')
    return null
  }
  
  log('✅ Usuários de teste criados', 'green')
  
  return {
    empresa,
    admin,
    funcionario
  }
}

// Função para fazer login e obter sessão
async function login(email, senha) {
  const response = await makeRequest('POST', '/api/auth/login', {
    body: { email_login: email, senha }
  })
  
  if (!response.ok) {
    return null
  }
  
  // Extrair cookie de sessão da resposta
  // Em produção, isso viria do Set-Cookie header
  return response.data?.userId || null
}

// Função para limpar usuários de teste
async function cleanupTestUsers(testData) {
  if (!testData) return
  
  log('\n🧹 Limpando usuários de teste...', 'cyan')
  
  await supabase.from('funcionarios').delete().eq('id', testData.admin.id)
  await supabase.from('funcionarios').delete().eq('id', testData.funcionario.id)
  await supabase.from('empresas').delete().eq('id', testData.empresa.id)
  
  log('✅ Limpeza concluída', 'green')
}

// ============================================================================
// TESTES DE SEGURANÇA
// ============================================================================

// Teste 1: Rotas públicas devem ser acessíveis sem autenticação
async function testPublicRoutes() {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 1: Rotas Públicas', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  const publicRoutes = [
    { method: 'GET', path: '/api/health' },
    { method: 'GET', path: '/api/csrf-token' },
    { method: 'POST', path: '/api/auth/login' },
    { method: 'POST', path: '/api/auth/forgot-password' }
  ]
  
  for (const route of publicRoutes) {
    results.total++
    const response = await makeRequest(route.method, route.path, {
      body: route.method === 'POST' ? {} : undefined
    })
    
    if (response.status === 401 || response.status === 403) {
      results.failed++
      log(`❌ ${route.method} ${route.path} - Rota pública está protegida indevidamente`, 'red')
      reportVulnerability(
        'MÉDIA',
        'Configuração',
        `${route.method} ${route.path}`,
        'Rota pública está retornando 401/403',
        'Verificar se a rota não está aplicando middleware de autenticação'
      )
    } else {
      results.passed++
      log(`✅ ${route.method} ${route.path} - Acessível sem autenticação`, 'green')
    }
  }
}

// Teste 2: Rotas protegidas devem exigir autenticação
async function testProtectedRoutes() {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 2: Proteção de Autenticação', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  const protectedRoutes = [
    { method: 'GET', path: '/api/funcionarios' },
    { method: 'GET', path: '/api/empresas' },
    { method: 'GET', path: '/api/holerites' },
    { method: 'GET', path: '/api/dashboard/stats' },
    { method: 'GET', path: '/api/notificacoes' },
    { method: 'POST', path: '/api/funcionarios' },
    { method: 'POST', path: '/api/empresas' },
    { method: 'POST', path: '/api/holerites/gerar' }
  ]
  
  for (const route of protectedRoutes) {
    results.total++
    const response = await makeRequest(route.method, route.path, {
      body: route.method === 'POST' ? {} : undefined
    })
    
    if (response.status === 401) {
      results.passed++
      log(`✅ ${route.method} ${route.path} - Protegida (401)`, 'green')
    } else if (response.status === 200 || response.status === 201) {
      results.failed++
      log(`❌ ${route.method} ${route.path} - VULNERÁVEL! Acessível sem autenticação`, 'red')
      reportVulnerability(
        'CRÍTICA',
        'Autenticação',
        `${route.method} ${route.path}`,
        'Rota protegida acessível sem autenticação',
        'Adicionar middleware requireAuth() no início do handler'
      )
    } else {
      results.warnings++
      log(`⚠️  ${route.method} ${route.path} - Status inesperado: ${response.status}`, 'yellow')
    }
  }
}

// Teste 3: Proteção CSRF em métodos mutáveis
async function testCsrfProtection(testData) {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 3: Proteção CSRF', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  // Obter token CSRF
  const csrfResponse = await makeRequest('GET', '/api/csrf-token')
  const csrfToken = csrfResponse.data?.token
  
  if (!csrfToken) {
    log('⚠️  Não foi possível obter token CSRF', 'yellow')
    return
  }
  
  // Fazer login para obter sessão
  const sessionCookie = `session=${encodeURIComponent(JSON.stringify({ userId: testData.admin.id }))}`
  
  const mutatingRoutes = [
    { method: 'POST', path: '/api/funcionarios', body: {} },
    { method: 'PATCH', path: `/api/funcionarios/${testData.funcionario.id}`, body: {} },
    { method: 'DELETE', path: `/api/empresas/999`, body: undefined },
    { method: 'POST', path: '/api/holerites/gerar', body: {} }
  ]
  
  for (const route of mutatingRoutes) {
    // Teste sem token CSRF
    results.total++
    const responseWithoutCsrf = await makeRequest(route.method, route.path, {
      headers: {
        'Cookie': sessionCookie
      },
      body: route.body
    })
    
    if (responseWithoutCsrf.status === 403) {
      results.passed++
      log(`✅ ${route.method} ${route.path} - Bloqueado sem CSRF token`, 'green')
    } else if (responseWithoutCsrf.status === 200 || responseWithoutCsrf.status === 201) {
      results.failed++
      log(`❌ ${route.method} ${route.path} - VULNERÁVEL! Aceita requisição sem CSRF`, 'red')
      reportVulnerability(
        'ALTA',
        'CSRF',
        `${route.method} ${route.path}`,
        'Rota aceita requisições mutáveis sem token CSRF',
        'Adicionar middleware requireCsrfProtection() antes do handler'
      )
    } else {
      results.warnings++
      log(`⚠️  ${route.method} ${route.path} - Status: ${responseWithoutCsrf.status}`, 'yellow')
    }
    
    // Teste com token CSRF inválido
    results.total++
    const responseWithInvalidCsrf = await makeRequest(route.method, route.path, {
      headers: {
        'Cookie': sessionCookie,
        'x-csrf-token': 'token-invalido'
      },
      body: route.body
    })
    
    if (responseWithInvalidCsrf.status === 403) {
      results.passed++
      log(`✅ ${route.method} ${route.path} - Bloqueado com CSRF inválido`, 'green')
    } else if (responseWithInvalidCsrf.status === 200 || responseWithInvalidCsrf.status === 201) {
      results.failed++
      log(`❌ ${route.method} ${route.path} - VULNERÁVEL! Aceita CSRF inválido`, 'red')
      reportVulnerability(
        'ALTA',
        'CSRF',
        `${route.method} ${route.path}`,
        'Rota aceita token CSRF inválido',
        'Verificar implementação da validação de CSRF token'
      )
    }
  }
}

// Teste 4: Controle de acesso admin vs funcionário
async function testAccessControl(testData) {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 4: Controle de Acesso (Admin vs Funcionário)', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  const adminOnlyRoutes = [
    { method: 'GET', path: '/api/funcionarios' },
    { method: 'POST', path: '/api/funcionarios' },
    { method: 'GET', path: '/api/empresas' },
    { method: 'POST', path: '/api/empresas' },
    { method: 'POST', path: '/api/holerites/gerar' },
    { method: 'GET', path: '/api/dashboard/stats' }
  ]
  
  // Simular sessão de funcionário
  const funcSessionCookie = `session=${encodeURIComponent(JSON.stringify({ userId: testData.funcionario.id }))}`
  
  for (const route of adminOnlyRoutes) {
    results.total++
    const response = await makeRequest(route.method, route.path, {
      headers: {
        'Cookie': funcSessionCookie
      },
      body: route.method === 'POST' ? {} : undefined
    })
    
    if (response.status === 403) {
      results.passed++
      log(`✅ ${route.method} ${route.path} - Bloqueado para funcionário`, 'green')
    } else if (response.status === 200 || response.status === 201) {
      results.failed++
      log(`❌ ${route.method} ${route.path} - VULNERÁVEL! Funcionário tem acesso`, 'red')
      reportVulnerability(
        'CRÍTICA',
        'Controle de Acesso',
        `${route.method} ${route.path}`,
        'Funcionário comum consegue acessar rota administrativa',
        'Adicionar middleware requireAdmin() no handler'
      )
    } else {
      results.warnings++
      log(`⚠️  ${route.method} ${route.path} - Status: ${response.status}`, 'yellow')
    }
  }
}

// Teste 5: Proteção de ownership (acesso a dados próprios)
async function testOwnershipProtection(testData) {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 5: Proteção de Ownership', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  // Criar segundo funcionário
  const { data: outroFunc } = await supabase
    .from('funcionarios')
    .insert({
      nome_completo: 'Outro Funcionário',
      email_login: 'outro.func@test.com',
      senha: 'MIGRAR_senha123',
      tipo_acesso: 'funcionario',
      empresa_id: testData.empresa.id,
      status: 'ativo',
      cpf: '00000000097'
    })
    .select()
    .single()
  
  // Simular sessão do primeiro funcionário
  const funcSessionCookie = `session=${encodeURIComponent(JSON.stringify({ userId: testData.funcionario.id }))}`
  
  // Tentar acessar dados de outro funcionário
  results.total++
  const response = await makeRequest('GET', `/api/funcionarios/${outroFunc.id}`, {
    headers: {
      'Cookie': funcSessionCookie
    }
  })
  
  if (response.status === 403) {
    results.passed++
    log(`✅ GET /api/funcionarios/${outroFunc.id} - Bloqueado (ownership)`, 'green')
  } else if (response.status === 200) {
    results.failed++
    log(`❌ GET /api/funcionarios/${outroFunc.id} - VULNERÁVEL! Acesso a dados de outro usuário`, 'red')
    reportVulnerability(
      'CRÍTICA',
      'Controle de Acesso',
      `GET /api/funcionarios/${outroFunc.id}`,
      'Funcionário consegue acessar dados de outro funcionário',
      'Adicionar middleware requireOwnershipOrAdmin() no handler'
    )
  }
  
  // Limpar
  await supabase.from('funcionarios').delete().eq('id', outroFunc.id)
}

// Teste 6: Proteção de cron jobs
async function testCronProtection() {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 6: Proteção de Cron Jobs', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  const cronRoutes = [
    '/api/cron/incrementar-contador-diario',
    '/api/cron/verificar-aniversariantes-diario',
    '/api/cron/verificar-disponibilizacao-adiantamentos'
  ]
  
  for (const route of cronRoutes) {
    // Teste sem autenticação
    results.total++
    const responseWithoutAuth = await makeRequest('GET', route)
    
    if (responseWithoutAuth.status === 401 || responseWithoutAuth.status === 403) {
      results.passed++
      log(`✅ ${route} - Bloqueado sem autenticação`, 'green')
    } else if (responseWithoutAuth.status === 200) {
      results.failed++
      log(`❌ ${route} - VULNERÁVEL! Acessível sem autenticação`, 'red')
      reportVulnerability(
        'ALTA',
        'Autenticação',
        route,
        'Cron job acessível sem autenticação',
        'Adicionar middleware requireCronAuth() e configurar CRON_SECRET'
      )
    }
    
    // Teste com token inválido
    results.total++
    const responseWithInvalidToken = await makeRequest('GET', route, {
      headers: {
        'Authorization': 'Bearer token-invalido'
      }
    })
    
    if (responseWithInvalidToken.status === 401 || responseWithInvalidToken.status === 403) {
      results.passed++
      log(`✅ ${route} - Bloqueado com token inválido`, 'green')
    } else if (responseWithInvalidToken.status === 200) {
      results.failed++
      log(`❌ ${route} - VULNERÁVEL! Aceita token inválido`, 'red')
      reportVulnerability(
        'ALTA',
        'Autenticação',
        route,
        'Cron job aceita token inválido',
        'Verificar implementação da validação de CRON_SECRET'
      )
    }
  }
}

// Teste 7: Sanitização de dados sensíveis
async function testDataSanitization(testData) {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 7: Sanitização de Dados Sensíveis', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  // Simular sessão de funcionário
  const funcSessionCookie = `session=${encodeURIComponent(JSON.stringify({ userId: testData.funcionario.id }))}`
  
  // Buscar próprios dados
  results.total++
  const response = await makeRequest('GET', '/api/funcionarios/meus-dados', {
    headers: {
      'Cookie': funcSessionCookie
    }
  })
  
  if (response.ok && response.data) {
    const sensitiveFields = ['senha', 'senha_hash', 'password']
    const hasSensitiveData = sensitiveFields.some(field => field in response.data)
    
    if (hasSensitiveData) {
      results.failed++
      log(`❌ /api/funcionarios/meus-dados - VULNERÁVEL! Retorna dados sensíveis`, 'red')
      reportVulnerability(
        'CRÍTICA',
        'Exposição de Dados',
        '/api/funcionarios/meus-dados',
        'API retorna campos sensíveis (senha, senha_hash)',
        'Aplicar sanitizeUserData() antes de retornar dados'
      )
    } else {
      results.passed++
      log(`✅ /api/funcionarios/meus-dados - Dados sensíveis removidos`, 'green')
    }
  } else {
    results.warnings++
    log(`⚠️  /api/funcionarios/meus-dados - Não foi possível testar`, 'yellow')
  }
}

// Teste 8: Injeção SQL e validação de entrada
async function testInputValidation(testData) {
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('TESTE 8: Validação de Entrada e Injeção SQL', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  const adminSessionCookie = `session=${encodeURIComponent(JSON.stringify({ userId: testData.admin.id }))}`
  
  const sqlInjectionPayloads = [
    "1' OR '1'='1",
    "1; DROP TABLE funcionarios--",
    "' UNION SELECT * FROM funcionarios--",
    "../../../etc/passwd",
    "<script>alert('XSS')</script>"
  ]
  
  for (const payload of sqlInjectionPayloads) {
    results.total++
    const response = await makeRequest('GET', `/api/funcionarios/${payload}`, {
      headers: {
        'Cookie': adminSessionCookie
      }
    })
    
    if (response.status === 400 || response.status === 404) {
      results.passed++
      log(`✅ Payload rejeitado: ${payload.substring(0, 30)}...`, 'green')
    } else if (response.status === 200) {
      results.failed++
      log(`❌ VULNERÁVEL! Payload aceito: ${payload}`, 'red')
      reportVulnerability(
        'CRÍTICA',
        'Injeção SQL / XSS',
        '/api/funcionarios/[id]',
        `Payload malicioso aceito: ${payload}`,
        'Implementar validação rigorosa de entrada e sanitização'
      )
    }
  }
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function runSecurityAudit() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'magenta')
  log('║     AUDITORIA COMPLETA DE SEGURANÇA DAS APIs         ║', 'magenta')
  log('╚═══════════════════════════════════════════════════════╝', 'magenta')
  
  let testData = null
  
  try {
    // Setup
    testData = await setupTestUsers()
    if (!testData) {
      log('\n❌ Falha ao configurar usuários de teste', 'red')
      return
    }
    
    // Executar testes
    await testPublicRoutes()
    await testProtectedRoutes()
    await testCsrfProtection(testData)
    await testAccessControl(testData)
    await testOwnershipProtection(testData)
    await testCronProtection()
    await testDataSanitization(testData)
    await testInputValidation(testData)
    
  } catch (error) {
    log(`\n❌ Erro durante auditoria: ${error.message}`, 'red')
    console.error(error)
  } finally {
    // Cleanup
    if (testData) {
      await cleanupTestUsers(testData)
    }
  }
  
  // Relatório final
  log('\n\n╔═══════════════════════════════════════════════════════╗', 'magenta')
  log('║              RELATÓRIO FINAL DA AUDITORIA            ║', 'magenta')
  log('╚═══════════════════════════════════════════════════════╝', 'magenta')
  
  log(`\n📊 Estatísticas:`, 'cyan')
  log(`   Total de testes: ${results.total}`)
  log(`   ✅ Aprovados: ${results.passed}`, 'green')
  log(`   ❌ Falhados: ${results.failed}`, 'red')
  log(`   ⚠️  Avisos: ${results.warnings}`, 'yellow')
  
  const successRate = ((results.passed / results.total) * 100).toFixed(1)
  log(`\n   Taxa de sucesso: ${successRate}%`, successRate >= 80 ? 'green' : 'red')
  
  if (results.vulnerabilities.length > 0) {
    log(`\n🔴 VULNERABILIDADES ENCONTRADAS: ${results.vulnerabilities.length}`, 'red')
    
    const critical = results.vulnerabilities.filter(v => v.severity === 'CRÍTICA').length
    const high = results.vulnerabilities.filter(v => v.severity === 'ALTA').length
    const medium = results.vulnerabilities.filter(v => v.severity === 'MÉDIA').length
    
    log(`   Críticas: ${critical}`, 'red')
    log(`   Altas: ${high}`, 'yellow')
    log(`   Médias: ${medium}`, 'blue')
    
    // Salvar relatório detalhado
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        warnings: results.warnings,
        successRate: `${successRate}%`
      },
      vulnerabilities: results.vulnerabilities
    }
    
    const fs = await import('fs')
    fs.writeFileSync(
      'relatorio-auditoria-seguranca-completa.json',
      JSON.stringify(report, null, 2)
    )
    
    log(`\n📄 Relatório detalhado salvo em: relatorio-auditoria-seguranca-completa.json`, 'cyan')
  } else {
    log(`\n✅ Nenhuma vulnerabilidade encontrada!`, 'green')
  }
  
  log('\n═══════════════════════════════════════════════════════\n', 'cyan')
}

// Executar auditoria
runSecurityAudit().catch(console.error)
