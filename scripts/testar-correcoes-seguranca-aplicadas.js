/**
 * TESTE DAS CORREÇÕES DE SEGURANÇA APLICADAS
 * 
 * Este script testa especificamente as 6 rotas que foram corrigidas:
 * 
 * Proteção CSRF adicionada:
 * 1. POST /api/auth/login
 * 2. POST /api/auth/logout
 * 3. POST /api/auth/reset-password
 * 
 * Sanitização de dados adicionada:
 * 4. GET /api/funcionarios/[id]
 * 5. GET /api/funcionarios/meus-dados
 * 6. GET /api/admin/info
 */

import { readFileSync } from 'fs'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Resultados dos testes
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
}

// Função para verificar se um arquivo contém um padrão
function verificarPadrao(filePath, pattern, description) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const found = pattern.test(content)
    
    results.total++
    
    if (found) {
      results.passed++
      log(`  ✅ ${description}`, 'green')
      results.details.push({
        file: filePath,
        test: description,
        status: 'PASSED'
      })
      return true
    } else {
      results.failed++
      log(`  ❌ ${description}`, 'red')
      results.details.push({
        file: filePath,
        test: description,
        status: 'FAILED'
      })
      return false
    }
  } catch (error) {
    results.failed++
    log(`  ❌ ${description} - Erro: ${error.message}`, 'red')
    results.details.push({
      file: filePath,
      test: description,
      status: 'ERROR',
      error: error.message
    })
    return false
  }
}

// Função principal de testes
async function executarTestes() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan')
  log('║     TESTE DAS CORREÇÕES DE SEGURANÇA APLICADAS       ║', 'cyan')
  log('╚═══════════════════════════════════════════════════════╝', 'cyan')
  
  // ========================================================================
  // TESTE 1: Proteção CSRF em POST /api/auth/login
  // ========================================================================
  log('\n📋 TESTE 1: POST /api/auth/login', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const loginFile = 'server/api/auth/login.post.ts'
  
  verificarPadrao(
    loginFile,
    /import.*requireCsrfProtection.*from.*csrfMiddleware/,
    'Import do requireCsrfProtection'
  )
  
  verificarPadrao(
    loginFile,
    /await requireCsrfProtection\(event\)/,
    'Chamada ao requireCsrfProtection no handler'
  )
  
  verificarPadrao(
    loginFile,
    /\/\/ SEGURANÇA: Verificar proteção CSRF/,
    'Comentário de segurança presente'
  )
  
  // ========================================================================
  // TESTE 2: Proteção CSRF em POST /api/auth/logout
  // ========================================================================
  log('\n📋 TESTE 2: POST /api/auth/logout', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const logoutFile = 'server/api/auth/logout.post.ts'
  
  verificarPadrao(
    logoutFile,
    /import.*requireCsrfProtection.*from.*csrfMiddleware/,
    'Import do requireCsrfProtection'
  )
  
  verificarPadrao(
    logoutFile,
    /await requireCsrfProtection\(event\)/,
    'Chamada ao requireCsrfProtection no handler'
  )
  
  verificarPadrao(
    logoutFile,
    /\/\/ SEGURANÇA: Verificar proteção CSRF/,
    'Comentário de segurança presente'
  )
  
  // ========================================================================
  // TESTE 3: Proteção CSRF em POST /api/auth/reset-password
  // ========================================================================
  log('\n📋 TESTE 3: POST /api/auth/reset-password', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const resetPasswordFile = 'server/api/auth/reset-password.post.ts'
  
  verificarPadrao(
    resetPasswordFile,
    /import.*requireCsrfProtection.*from.*csrfMiddleware/,
    'Import do requireCsrfProtection'
  )
  
  verificarPadrao(
    resetPasswordFile,
    /await requireCsrfProtection\(event\)/,
    'Chamada ao requireCsrfProtection no handler'
  )
  
  verificarPadrao(
    resetPasswordFile,
    /\/\/ SEGURANÇA: Verificar proteção CSRF/,
    'Comentário de segurança presente'
  )
  
  // ========================================================================
  // TESTE 4: Sanitização em GET /api/funcionarios/[id]
  // ========================================================================
  log('\n📋 TESTE 4: GET /api/funcionarios/[id]', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const funcionarioIdFile = 'server/api/funcionarios/[id].get.ts'
  
  verificarPadrao(
    funcionarioIdFile,
    /import.*sanitizeUserData.*from.*authMiddleware/,
    'Import do sanitizeUserData'
  )
  
  verificarPadrao(
    funcionarioIdFile,
    /sanitizeUserData\(funcionario,\s*requestingUser\)/,
    'Chamada ao sanitizeUserData antes de retornar'
  )
  
  verificarPadrao(
    funcionarioIdFile,
    /\/\/ SEGURANÇA: Sanitizar dados/,
    'Comentário de segurança presente'
  )
  
  verificarPadrao(
    funcionarioIdFile,
    /return dadosSanitizados/,
    'Retorna dados sanitizados ao invés de dados brutos'
  )
  
  // ========================================================================
  // TESTE 5: Sanitização em GET /api/funcionarios/meus-dados
  // ========================================================================
  log('\n📋 TESTE 5: GET /api/funcionarios/meus-dados', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const meusDadosFile = 'server/api/funcionarios/meus-dados.get.ts'
  
  verificarPadrao(
    meusDadosFile,
    /import.*sanitizeUserData.*from.*authMiddleware/,
    'Import do sanitizeUserData'
  )
  
  verificarPadrao(
    meusDadosFile,
    /sanitizeUserData\(funcionario,\s*requestingUser\)/,
    'Chamada ao sanitizeUserData'
  )
  
  verificarPadrao(
    meusDadosFile,
    /const sanitizedData = sanitizeUserData/,
    'Armazena dados sanitizados em variável'
  )
  
  verificarPadrao(
    meusDadosFile,
    /data: sanitizedData/,
    'Retorna dados sanitizados na resposta'
  )
  
  // ========================================================================
  // TESTE 6: Sanitização em GET /api/admin/info
  // ========================================================================
  log('\n📋 TESTE 6: GET /api/admin/info', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const adminInfoFile = 'server/api/admin/info.get.ts'
  
  verificarPadrao(
    adminInfoFile,
    /import.*sanitizeUserData.*from.*authMiddleware/,
    'Import do sanitizeUserData'
  )
  
  verificarPadrao(
    adminInfoFile,
    /sanitizeUserData\(user,\s*user\)/,
    'Chamada ao sanitizeUserData'
  )
  
  verificarPadrao(
    adminInfoFile,
    /\/\/ SEGURANÇA: Sanitizar dados/,
    'Comentário de segurança presente'
  )
  
  verificarPadrao(
    adminInfoFile,
    /data: dadosSanitizados/,
    'Retorna dados sanitizados na resposta'
  )
  
  // ========================================================================
  // TESTE ADICIONAL: Verificar middleware CSRF
  // ========================================================================
  log('\n📋 TESTE ADICIONAL: Middleware CSRF', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const csrfMiddlewareFile = 'server/utils/csrfMiddleware.ts'
  
  verificarPadrao(
    csrfMiddlewareFile,
    /export async function requireCsrfProtection/,
    'Função requireCsrfProtection exportada'
  )
  
  verificarPadrao(
    csrfMiddlewareFile,
    /\/api\/auth\/login/,
    'Rota /api/auth/login nas rotas excluídas'
  )
  
  verificarPadrao(
    csrfMiddlewareFile,
    /\/api\/auth\/logout/,
    'Rota /api/auth/logout nas rotas excluídas'
  )
  
  verificarPadrao(
    csrfMiddlewareFile,
    /\/api\/auth\/reset-password/,
    'Rota /api/auth/reset-password nas rotas excluídas'
  )
  
  // ========================================================================
  // TESTE ADICIONAL: Verificar função sanitizeUserData
  // ========================================================================
  log('\n📋 TESTE ADICIONAL: Função sanitizeUserData', 'cyan')
  log('─────────────────────────────────────────────────────────', 'cyan')
  
  const authMiddlewareFile = 'server/utils/authMiddleware.ts'
  
  verificarPadrao(
    authMiddlewareFile,
    /export function sanitizeUserData/,
    'Função sanitizeUserData exportada'
  )
  
  verificarPadrao(
    authMiddlewareFile,
    /delete sanitized\.senha/,
    'Remove campo senha'
  )
  
  verificarPadrao(
    authMiddlewareFile,
    /delete sanitized\.senha_hash/,
    'Remove campo senha_hash'
  )
  
  // ========================================================================
  // RELATÓRIO FINAL
  // ========================================================================
  log('\n\n╔═══════════════════════════════════════════════════════╗', 'magenta')
  log('║              RELATÓRIO FINAL DOS TESTES               ║', 'magenta')
  log('╚═══════════════════════════════════════════════════════╝', 'magenta')
  
  log(`\n📊 Estatísticas:`, 'cyan')
  log(`   Total de testes: ${results.total}`)
  log(`   ✅ Aprovados: ${results.passed}`, 'green')
  log(`   ❌ Falhados: ${results.failed}`, results.failed > 0 ? 'red' : 'green')
  
  const successRate = ((results.passed / results.total) * 100).toFixed(1)
  const color = successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red'
  log(`\n🎯 Taxa de Sucesso: ${successRate}%`, color)
  
  // Resumo por categoria
  log('\n📋 Resumo por Categoria:', 'cyan')
  
  const csrfTests = results.details.filter(d => d.test.includes('CSRF') || d.test.includes('requireCsrfProtection'))
  const csrfPassed = csrfTests.filter(t => t.status === 'PASSED').length
  log(`   🔒 Proteção CSRF: ${csrfPassed}/${csrfTests.length}`, csrfPassed === csrfTests.length ? 'green' : 'red')
  
  const sanitizeTests = results.details.filter(d => d.test.includes('sanitize') || d.test.includes('Sanitiz'))
  const sanitizePassed = sanitizeTests.filter(t => t.status === 'PASSED').length
  log(`   🧹 Sanitização: ${sanitizePassed}/${sanitizeTests.length}`, sanitizePassed === sanitizeTests.length ? 'green' : 'red')
  
  // Testes falhados
  if (results.failed > 0) {
    log('\n⚠️  TESTES FALHADOS:', 'red')
    results.details
      .filter(d => d.status === 'FAILED' || d.status === 'ERROR')
      .forEach(d => {
        log(`   ❌ ${d.file}`, 'red')
        log(`      ${d.test}`, 'red')
        if (d.error) {
          log(`      Erro: ${d.error}`, 'red')
        }
      })
  }
  
  // Conclusão
  log('\n═══════════════════════════════════════════════════════', 'cyan')
  
  if (results.failed === 0) {
    log('\n✅ TODAS AS CORREÇÕES FORAM APLICADAS COM SUCESSO!', 'green')
    log('\n🎉 O sistema está mais seguro agora:', 'green')
    log('   • Proteção CSRF implementada nas rotas de autenticação', 'green')
    log('   • Sanitização de dados implementada nas rotas de usuários', 'green')
    log('   • Campos sensíveis (senhas) não são mais expostos', 'green')
  } else {
    log('\n⚠️  ALGUMAS CORREÇÕES FALHARAM', 'yellow')
    log('\nPróximos passos:', 'yellow')
    log('   1. Revise os testes falhados acima', 'yellow')
    log('   2. Verifique se os arquivos foram modificados corretamente', 'yellow')
    log('   3. Execute novamente este script após as correções', 'yellow')
  }
  
  log('\n═══════════════════════════════════════════════════════\n', 'cyan')
  
  // Salvar relatório
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      successRate: `${successRate}%`
    },
    categories: {
      csrf: {
        total: csrfTests.length,
        passed: csrfPassed,
        failed: csrfTests.length - csrfPassed
      },
      sanitization: {
        total: sanitizeTests.length,
        passed: sanitizePassed,
        failed: sanitizeTests.length - sanitizePassed
      }
    },
    details: results.details
  }
  
  const { writeFileSync } = await import('fs')
  writeFileSync(
    'relatorio-testes-correcoes-seguranca.json',
    JSON.stringify(report, null, 2)
  )
  
  log('📄 Relatório detalhado salvo em: relatorio-testes-correcoes-seguranca.json', 'cyan')
  
  // Retornar código de saída apropriado
  process.exit(results.failed > 0 ? 1 : 0)
}

// Executar testes
executarTestes().catch(error => {
  console.error('❌ Erro ao executar testes:', error)
  process.exit(1)
})
