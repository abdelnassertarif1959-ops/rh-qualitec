/**
 * Script de Validação das 6 Vulnerabilidades Corrigidas
 * 
 * Este script testa as correções aplicadas para as 6 vulnerabilidades identificadas:
 * 1. Listar holerites sem autenticação (deveria retornar 401)
 * 2. Dashboard stats sem autenticação (deveria retornar 401)
 * 3. Funcionário deletando funcionário (deveria retornar 403)
 * 4. Funcionário gerando holerite (deveria retornar 403)
 * 5. Editar dados de outro funcionário - IDOR (deveria retornar 403)
 * 6. Ver holerites de outro funcionário - IDOR (deveria retornar 403)
 */

const BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Função auxiliar para fazer requisições
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options)
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.text() : null
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      data: null,
      error: error.message
    }
  }
}

// Função para fazer login e obter cookie
async function login(cpf, senha) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cpf, senha })
  })

  if (!response.ok) {
    throw new Error(`Login falhou: ${response.status}`)
  }

  // Extrair cookie da resposta
  const setCookie = response.headers.get('set-cookie')
  return setCookie
}

async function runTests() {
  log('\n=== VALIDAÇÃO DAS 6 VULNERABILIDADES CORRIGIDAS ===\n', 'cyan')
  
  const results = {
    total: 6,
    passed: 0,
    failed: 0,
    tests: []
  }

  // ========================================
  // TESTE 1: Listar holerites sem autenticação
  // ========================================
  log('📋 TESTE 1: Listar holerites sem autenticação', 'blue')
  try {
    const response = await makeRequest(`${BASE_URL}/api/holerites`)
    
    if (response.status === 401) {
      log('✅ PASSOU: Retornou 401 (não autorizado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Listar holerites sem autenticação',
        passed: true,
        expected: 401,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 401, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Listar holerites sem autenticação',
        passed: false,
        expected: 401,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Listar holerites sem autenticação',
      passed: false,
      expected: 401,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // TESTE 2: Dashboard stats sem autenticação
  // ========================================
  log('\n📋 TESTE 2: Dashboard stats sem autenticação', 'blue')
  try {
    const response = await makeRequest(`${BASE_URL}/api/dashboard/stats`)
    
    if (response.status === 401) {
      log('✅ PASSOU: Retornou 401 (não autorizado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Dashboard stats sem autenticação',
        passed: true,
        expected: 401,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 401, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Dashboard stats sem autenticação',
        passed: false,
        expected: 401,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Dashboard stats sem autenticação',
      passed: false,
      expected: 401,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // TESTE 3: Funcionário tentando deletar funcionário
  // ========================================
  log('\n📋 TESTE 3: Funcionário tentando deletar funcionário', 'blue')
  try {
    // Fazer login como funcionário
    const funcionarioCookie = await login('12345678901', 'senha123')
    
    // Tentar deletar outro funcionário (ID 2)
    const response = await makeRequest(`${BASE_URL}/api/funcionarios/2`, {
      method: 'DELETE',
      headers: {
        'Cookie': funcionarioCookie
      }
    })
    
    if (response.status === 403) {
      log('✅ PASSOU: Retornou 403 (acesso negado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Funcionário deletando funcionário',
        passed: true,
        expected: 403,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 403, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Funcionário deletando funcionário',
        passed: false,
        expected: 403,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Funcionário deletando funcionário',
      passed: false,
      expected: 403,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // TESTE 4: Funcionário tentando gerar holerite
  // ========================================
  log('\n📋 TESTE 4: Funcionário tentando gerar holerite', 'blue')
  try {
    // Fazer login como funcionário
    const funcionarioCookie = await login('12345678901', 'senha123')
    
    // Tentar gerar holerite
    const response = await makeRequest(`${BASE_URL}/api/holerites/gerar`, {
      method: 'POST',
      headers: {
        'Cookie': funcionarioCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tipo: 'mensal',
        funcionario_ids: [1]
      })
    })
    
    if (response.status === 403) {
      log('✅ PASSOU: Retornou 403 (acesso negado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Funcionário gerando holerite',
        passed: true,
        expected: 403,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 403, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Funcionário gerando holerite',
        passed: false,
        expected: 403,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Funcionário gerando holerite',
      passed: false,
      expected: 403,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // TESTE 5: Editar dados de outro funcionário (IDOR)
  // ========================================
  log('\n📋 TESTE 5: Editar dados de outro funcionário (IDOR)', 'blue')
  try {
    // Fazer login como funcionário ID 1
    const funcionarioCookie = await login('12345678901', 'senha123')
    
    // Tentar editar dados do funcionário ID 2
    const response = await makeRequest(`${BASE_URL}/api/funcionarios/2`, {
      method: 'PATCH',
      headers: {
        'Cookie': funcionarioCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome_completo: 'Teste Hacker'
      })
    })
    
    if (response.status === 403) {
      log('✅ PASSOU: Retornou 403 (acesso negado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Editar dados de outro funcionário (IDOR)',
        passed: true,
        expected: 403,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 403, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Editar dados de outro funcionário (IDOR)',
        passed: false,
        expected: 403,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Editar dados de outro funcionário (IDOR)',
      passed: false,
      expected: 403,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // TESTE 6: Ver holerites de outro funcionário (IDOR)
  // ========================================
  log('\n📋 TESTE 6: Ver holerites de outro funcionário (IDOR)', 'blue')
  try {
    // Fazer login como funcionário ID 1
    const funcionarioCookie = await login('12345678901', 'senha123')
    
    // Tentar ver holerites do funcionário ID 2
    const response = await makeRequest(`${BASE_URL}/api/holerites/meus-holerites?funcionarioId=2`, {
      method: 'GET',
      headers: {
        'Cookie': funcionarioCookie
      }
    })
    
    if (response.status === 403) {
      log('✅ PASSOU: Retornou 403 (acesso negado)', 'green')
      results.passed++
      results.tests.push({
        name: 'Ver holerites de outro funcionário (IDOR)',
        passed: true,
        expected: 403,
        actual: response.status
      })
    } else {
      log(`❌ FALHOU: Esperado 403, recebeu ${response.status}`, 'red')
      results.failed++
      results.tests.push({
        name: 'Ver holerites de outro funcionário (IDOR)',
        passed: false,
        expected: 403,
        actual: response.status
      })
    }
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red')
    results.failed++
    results.tests.push({
      name: 'Ver holerites de outro funcionário (IDOR)',
      passed: false,
      expected: 403,
      actual: `Erro: ${error.message}`
    })
  }

  // ========================================
  // RESUMO
  // ========================================
  log('\n=== RESUMO DOS TESTES ===\n', 'cyan')
  log(`Total de testes: ${results.total}`, 'blue')
  log(`✅ Passou: ${results.passed} (${Math.round(results.passed / results.total * 100)}%)`, 'green')
  log(`❌ Falhou: ${results.failed} (${Math.round(results.failed / results.total * 100)}%)`, 'red')

  if (results.failed > 0) {
    log('\n⚠️  TESTES QUE FALHARAM:', 'yellow')
    results.tests.filter(t => !t.passed).forEach(test => {
      log(`   - ${test.name}: Esperado ${test.expected}, recebeu ${test.actual}`, 'red')
    })
  }

  if (results.passed === results.total) {
    log('\n🎉 TODAS AS VULNERABILIDADES FORAM CORRIGIDAS COM SUCESSO!', 'green')
  } else {
    log('\n⚠️  AINDA HÁ VULNERABILIDADES A CORRIGIR', 'yellow')
  }

  // Salvar relatório
  const fs = require('fs')
  fs.writeFileSync(
    'relatorio-correcoes-6-vulnerabilidades.json',
    JSON.stringify(results, null, 2)
  )
  log('\n📄 Relatório salvo em: relatorio-correcoes-6-vulnerabilidades.json', 'cyan')
}

// Executar testes
runTests().catch(error => {
  log(`\n💥 ERRO FATAL: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
