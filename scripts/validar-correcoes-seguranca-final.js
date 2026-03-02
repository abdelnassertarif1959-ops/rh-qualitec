/**
 * Script para validar as correções de segurança aplicadas
 * 
 * Testa as 6 vulnerabilidades que foram corrigidas:
 * 1. Listar holerites sem autenticação
 * 2. Dashboard stats sem autenticação
 * 3. Funcionário deletando funcionário
 * 4. Funcionário gerando holerite
 * 5. Editar dados de outro funcionário
 * 6. Ver holerites de outro funcionário
 */

const BASE_URL = 'http://localhost:3000'

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

async function testarEndpoint(nome, url, options = {}, statusEsperado) {
  try {
    log(`\n🧪 Testando: ${nome}`, 'cyan')
    log(`   URL: ${url}`, 'blue')
    log(`   Status esperado: ${statusEsperado}`, 'blue')
    
    const response = await fetch(url, options)
    const status = response.status
    
    log(`   Status recebido: ${status}`, status === statusEsperado ? 'green' : 'red')
    
    if (status === statusEsperado) {
      log(`   ✅ PASSOU - Retornou ${status} como esperado`, 'green')
      return { passed: true, status, expected: statusEsperado }
    } else {
      log(`   ❌ FALHOU - Esperado ${statusEsperado}, recebido ${status}`, 'red')
      
      // Tentar ler o corpo da resposta para debug
      try {
        const body = await response.text()
        if (body) {
          log(`   Resposta: ${body.substring(0, 200)}`, 'yellow')
        }
      } catch (e) {
        // Ignorar erro ao ler corpo
      }
      
      return { passed: false, status, expected: statusEsperado }
    }
  } catch (error) {
    log(`   ❌ ERRO: ${error.message}`, 'red')
    return { passed: false, error: error.message, expected: statusEsperado }
  }
}

async function fazerLogin(email, senha) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })
    
    if (!response.ok) {
      throw new Error(`Login falhou: ${response.status}`)
    }
    
    // Extrair cookie da resposta
    const setCookie = response.headers.get('set-cookie')
    return setCookie
  } catch (error) {
    log(`❌ Erro no login: ${error.message}`, 'red')
    return null
  }
}

async function executarTestes() {
  log('\n' + '='.repeat(80), 'cyan')
  log('VALIDAÇÃO DAS CORREÇÕES DE SEGURANÇA', 'cyan')
  log('='.repeat(80) + '\n', 'cyan')
  
  const resultados = []
  
  // ========================================
  // CATEGORIA 1: Autorização - Sem Auth
  // ========================================
  log('\n📋 CATEGORIA 1: Autorização - Sem Auth', 'yellow')
  log('─'.repeat(80), 'yellow')
  
  // Teste 1: Listar holerites sem autenticação
  resultados.push(await testarEndpoint(
    'Listar holerites sem autenticação',
    `${BASE_URL}/api/holerites`,
    { method: 'GET' },
    401 // Deve retornar 401, não 500
  ))
  
  // Teste 2: Dashboard stats sem autenticação
  resultados.push(await testarEndpoint(
    'Dashboard stats sem autenticação',
    `${BASE_URL}/api/dashboard/stats`,
    { method: 'GET' },
    401 // Deve retornar 401, não 500
  ))
  
  // ========================================
  // CATEGORIA 2: Escalação de Privilégios
  // ========================================
  log('\n📋 CATEGORIA 2: Escalação de Privilégios', 'yellow')
  log('─'.repeat(80), 'yellow')
  
  // Fazer login como funcionário
  log('\n🔐 Fazendo login como funcionário...', 'blue')
  const cookieFuncionario = await fazerLogin('funcionario@teste.com', 'senha123')
  
  if (cookieFuncionario) {
    log('✅ Login de funcionário bem-sucedido', 'green')
    
    // Teste 3: Funcionário tentando deletar funcionário
    resultados.push(await testarEndpoint(
      'Funcionário tentando deletar funcionário',
      `${BASE_URL}/api/funcionarios/999`,
      { 
        method: 'DELETE',
        headers: {
          'Cookie': cookieFuncionario
        }
      },
      403 // Deve retornar 403, não 404
    ))
    
    // Teste 4: Funcionário tentando gerar holerite
    resultados.push(await testarEndpoint(
      'Funcionário tentando gerar holerite',
      `${BASE_URL}/api/holerites/gerar`,
      { 
        method: 'POST',
        headers: {
          'Cookie': cookieFuncionario,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo: 'mensal' })
      },
      403 // Deve retornar 403, não 500
    ))
  } else {
    log('⚠️ Não foi possível fazer login como funcionário - pulando testes', 'yellow')
  }
  
  // ========================================
  // CATEGORIA 3: IDOR (Insecure Direct Object Reference)
  // ========================================
  log('\n📋 CATEGORIA 3: IDOR', 'yellow')
  log('─'.repeat(80), 'yellow')
  
  if (cookieFuncionario) {
    // Teste 5: Editar dados de outro funcionário
    resultados.push(await testarEndpoint(
      'Editar dados de outro funcionário',
      `${BASE_URL}/api/funcionarios/999`,
      { 
        method: 'PATCH',
        headers: {
          'Cookie': cookieFuncionario,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_completo: 'Teste' })
      },
      403 // Deve retornar 403, não 500
    ))
    
    // Teste 6: Ver holerites de outro funcionário
    resultados.push(await testarEndpoint(
      'Ver holerites de outro funcionário',
      `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=999`,
      { 
        method: 'GET',
        headers: {
          'Cookie': cookieFuncionario
        }
      },
      403 // Deve retornar 403, não 500
    ))
  }
  
  // ========================================
  // RESUMO DOS RESULTADOS
  // ========================================
  log('\n' + '='.repeat(80), 'cyan')
  log('RESUMO DOS RESULTADOS', 'cyan')
  log('='.repeat(80) + '\n', 'cyan')
  
  const totalTestes = resultados.length
  const testesPassados = resultados.filter(r => r.passed).length
  const testesFalhados = totalTestes - testesPassados
  const taxaSucesso = ((testesPassados / totalTestes) * 100).toFixed(1)
  
  log(`Total de Testes: ${totalTestes}`, 'blue')
  log(`✅ Passou: ${testesPassados} (${taxaSucesso}%)`, 'green')
  log(`❌ Falhou: ${testesFalhados} (${(100 - taxaSucesso).toFixed(1)}%)`, 'red')
  
  if (testesFalhados > 0) {
    log('\n❌ TESTES QUE FALHARAM:', 'red')
    resultados.forEach((r, i) => {
      if (!r.passed) {
        log(`   ${i + 1}. Status esperado: ${r.expected}, recebido: ${r.status || 'erro'}`, 'red')
      }
    })
  }
  
  log('\n' + '='.repeat(80), 'cyan')
  
  if (testesPassados === totalTestes) {
    log('🎉 TODAS AS CORREÇÕES DE SEGURANÇA FORAM APLICADAS COM SUCESSO!', 'green')
  } else {
    log('⚠️ ALGUMAS CORREÇÕES AINDA PRECISAM SER AJUSTADAS', 'yellow')
  }
  
  log('='.repeat(80) + '\n', 'cyan')
  
  return {
    total: totalTestes,
    passed: testesPassados,
    failed: testesFalhados,
    successRate: taxaSucesso
  }
}

// Executar testes
executarTestes()
  .then(resultado => {
    process.exit(resultado.failed > 0 ? 1 : 0)
  })
  .catch(error => {
    log(`\n💥 Erro fatal: ${error.message}`, 'red')
    process.exit(1)
  })
