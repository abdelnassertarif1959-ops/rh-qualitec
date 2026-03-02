/**
 * Script para Verificar Vulnerabilidades de Segurança
 * Foca nas vulnerabilidades identificadas na auditoria
 * 
 * Data: 12 de Fevereiro de 2026
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔍 VERIFICAÇÃO DE VULNERABILIDADES DE SEGURANÇA\n')
console.log('='.repeat(80))

const vulnerabilities = []
const warnings = []
const recommendations = []

// ============================================================================
// 1. VERIFICAR CONFIGURAÇÃO DE COOKIES
// ============================================================================

console.log('\n📋 1. VERIFICANDO CONFIGURAÇÃO DE COOKIES\n')

const nuxtConfigPath = path.join(rootDir, 'nuxt.config.ts')
const nuxtConfig = fs.readFileSync(nuxtConfigPath, 'utf-8')

const cookieChecks = {
  httpOnly: /httpOnly:\s*true/i.test(nuxtConfig),
  sameSite: /sameSite:\s*['"]lax['"]/i.test(nuxtConfig),
  secure: /secure:\s*true/i.test(nuxtConfig) || /secure:\s*process\.env\.NODE_ENV\s*===\s*['"]production['"]/i.test(nuxtConfig),
  maxAge: /maxAge:\s*\d+/i.test(nuxtConfig)
}

console.log('🍪 Configuração de Cookies:')
Object.entries(cookieChecks).forEach(([check, passed]) => {
  console.log(`  ${passed ? '✅' : '❌'} ${check}`)
  
  if (!passed) {
    vulnerabilities.push({
      severity: 'ALTO',
      category: 'Cookies',
      issue: `Cookie attribute '${check}' não configurado`,
      file: 'nuxt.config.ts',
      fix: `Adicionar ${check} na configuração de cookies`
    })
  }
})

// ============================================================================
// 2. VERIFICAR CSRF PROTECTION
// ============================================================================

console.log('\n\n📋 2. VERIFICANDO CSRF PROTECTION\n')

const hasCSRF = /csrf/i.test(nuxtConfig)
const hasCsrfMiddleware = fs.existsSync(path.join(rootDir, 'server/utils/csrfMiddleware.ts'))
const hasCsrfAPI = fs.existsSync(path.join(rootDir, 'server/api/csrf-token.get.ts'))
const hasCsrfComposable = fs.existsSync(path.join(rootDir, 'app/composables/useCsrf.ts'))
const hasCsrfPlugin = fs.existsSync(path.join(rootDir, 'plugins/csrf.client.ts'))

const csrfImplemented = hasCsrfMiddleware && hasCsrfAPI && hasCsrfComposable && hasCsrfPlugin

if (csrfImplemented) {
  console.log('✅ CSRF protection implementado')
  console.log('  ✅ Middleware CSRF')
  console.log('  ✅ API de token CSRF')
  console.log('  ✅ Composable CSRF')
  console.log('  ✅ Plugin CSRF')
} else {
  console.log('❌ CSRF protection NÃO completamente implementado')
  if (!hasCsrfMiddleware) console.log('  ❌ Middleware CSRF ausente')
  if (!hasCsrfAPI) console.log('  ❌ API de token CSRF ausente')
  if (!hasCsrfComposable) console.log('  ❌ Composable CSRF ausente')
  if (!hasCsrfPlugin) console.log('  ❌ Plugin CSRF ausente')
  
  vulnerabilities.push({
    severity: 'MÉDIO',
    category: 'CSRF',
    issue: 'CSRF protection não configurado',
    file: 'nuxt.config.ts',
    fix: 'Adicionar configuração de CSRF protection'
  })
}

// ============================================================================
// 3. VERIFICAR RATE LIMITING
// ============================================================================

console.log('\n\n📋 3. VERIFICANDO RATE LIMITING\n')

const loginAPIPath = path.join(rootDir, 'server/api/auth/login.post.ts')
const loginContent = fs.readFileSync(loginAPIPath, 'utf-8')

const rateLimitChecks = {
  hasRateLimit: /rate.*limit|tentativas|attempts/i.test(loginContent),
  hasMaxAttempts: /max.*tentativas|max.*attempts/i.test(loginContent),
  hasTimeWindow: /minutos|minutes|tempo|time/i.test(loginContent),
  hasLockout: /bloqueio|lockout|blocked/i.test(loginContent)
}

console.log('⏱️  Rate Limiting no Login:')
Object.entries(rateLimitChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '⚠️ '} ${label}`)
  
  if (!passed && check === 'hasRateLimit') {
    warnings.push({
      severity: 'ALTO',
      category: 'Rate Limiting',
      issue: 'Rate limiting pode não estar implementado no login',
      file: 'server/api/auth/login.post.ts',
      recommendation: 'Implementar rate limiting para prevenir ataques de força bruta'
    })
  }
})

// ============================================================================
// 4. VERIFICAR LOGS DE AUDITORIA
// ============================================================================

console.log('\n\n📋 4. VERIFICANDO LOGS DE AUDITORIA\n')

const apiFiles = []

function findAPIFiles(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      findAPIFiles(filePath)
    } else if (file.endsWith('.ts') && !file.includes('test')) {
      apiFiles.push(filePath)
    }
  })
}

findAPIFiles(path.join(rootDir, 'server/api'))

let apisWithLogs = 0
let apisWithoutLogs = 0

apiFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8')
  const hasLogs = /console\.log.*\[API\]|console\.log.*\[.*\]/.test(content)
  
  if (hasLogs) {
    apisWithLogs++
  } else {
    apisWithoutLogs++
  }
})

console.log(`📊 APIs com logs: ${apisWithLogs}/${apiFiles.length} (${Math.round(apisWithLogs/apiFiles.length*100)}%)`)
console.log(`📊 APIs sem logs: ${apisWithoutLogs}/${apiFiles.length} (${Math.round(apisWithoutLogs/apiFiles.length*100)}%)`)

if (apisWithoutLogs > apiFiles.length * 0.2) {
  recommendations.push({
    priority: 'ALTO',
    category: 'Auditoria',
    recommendation: 'Adicionar logs de auditoria em todas as APIs',
    benefit: 'Rastreamento completo de ações e detecção de atividades suspeitas'
  })
}

// ============================================================================
// 5. VERIFICAR JWT IMPLEMENTATION
// ============================================================================

console.log('\n\n📋 5. VERIFICANDO IMPLEMENTAÇÃO JWT\n')

const authMiddlewarePath = path.join(rootDir, 'server/utils/authMiddleware.ts')
const authMiddleware = fs.readFileSync(authMiddlewarePath, 'utf-8')

const hasJWT = /jwt|jsonwebtoken/.test(authMiddleware)

if (hasJWT) {
  console.log('✅ JWT detectado')
} else {
  console.log('⚠️  JWT não detectado (usando cookies de sessão)')
  recommendations.push({
    priority: 'MÉDIO',
    category: 'Autenticação',
    recommendation: 'Considerar implementar JWT para tokens mais seguros',
    benefit: 'Tokens assinados, stateless e com expiração automática'
  })
}

// ============================================================================
// 6. VERIFICAR 2FA
// ============================================================================

console.log('\n\n📋 6. VERIFICANDO AUTENTICAÇÃO DE DOIS FATORES (2FA)\n')

const has2FA = fs.existsSync(path.join(rootDir, 'server/api/auth/2fa.post.ts')) ||
               fs.existsSync(path.join(rootDir, 'server/api/auth/totp.post.ts'))

if (has2FA) {
  console.log('✅ 2FA implementado')
} else {
  console.log('⚠️  2FA não implementado')
  recommendations.push({
    priority: 'MÉDIO',
    category: 'Autenticação',
    recommendation: 'Implementar autenticação de dois fatores (2FA)',
    benefit: 'Camada adicional de segurança para contas administrativas'
  })
}

// ============================================================================
// 7. VERIFICAR HEADERS DE SEGURANÇA
// ============================================================================

console.log('\n\n📋 7. VERIFICANDO HEADERS DE SEGURANÇA\n')

const securityHeaders = {
  'X-Frame-Options': /x-frame-options/i.test(nuxtConfig),
  'X-Content-Type-Options': /x-content-type-options/i.test(nuxtConfig),
  'X-XSS-Protection': /x-xss-protection/i.test(nuxtConfig),
  'Strict-Transport-Security': /strict-transport-security|hsts/i.test(nuxtConfig),
  'Content-Security-Policy': /content-security-policy|csp/i.test(nuxtConfig)
}

console.log('🛡️  Headers de Segurança:')
Object.entries(securityHeaders).forEach(([header, configured]) => {
  console.log(`  ${configured ? '✅' : '⚠️ '} ${header}`)
  
  if (!configured) {
    warnings.push({
      severity: 'MÉDIO',
      category: 'Headers',
      issue: `Header de segurança '${header}' não configurado`,
      file: 'nuxt.config.ts',
      recommendation: `Adicionar header ${header} para melhor segurança`
    })
  }
})

// ============================================================================
// 8. VERIFICAR VARIÁVEIS DE AMBIENTE SENSÍVEIS
// ============================================================================

console.log('\n\n📋 8. VERIFICANDO VARIÁVEIS DE AMBIENTE\n')

const envExamplePath = path.join(rootDir, '.env.example')
const envPath = path.join(rootDir, '.env')

if (!fs.existsSync(envExamplePath)) {
  warnings.push({
    severity: 'BAIXO',
    category: 'Configuração',
    issue: 'Arquivo .env.example não encontrado',
    file: '.env.example',
    recommendation: 'Criar .env.example com variáveis necessárias (sem valores sensíveis)'
  })
  console.log('⚠️  .env.example não encontrado')
} else {
  console.log('✅ .env.example encontrado')
}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'CRON_SECRET'
  ]
  
  console.log('\n🔑 Variáveis de Ambiente Críticas:')
  requiredVars.forEach(varName => {
    const hasVar = new RegExp(`${varName}=.+`).test(envContent)
    console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`)
    
    if (!hasVar) {
      vulnerabilities.push({
        severity: 'CRÍTICO',
        category: 'Configuração',
        issue: `Variável de ambiente '${varName}' não configurada`,
        file: '.env',
        fix: `Adicionar ${varName} no arquivo .env`
      })
    }
  })
}

// ============================================================================
// 9. VERIFICAR EXPOSIÇÃO DE DADOS SENSÍVEIS
// ============================================================================

console.log('\n\n📋 9. VERIFICANDO EXPOSIÇÃO DE DADOS SENSÍVEIS\n')

let exposedDataCount = 0

apiFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8')
  const relativePath = path.relative(rootDir, file)
  
  // Verificar se retorna senha sem sanitização
  if (/select.*senha|senha.*from/i.test(content) && !/sanitize/i.test(content)) {
    exposedDataCount++
    warnings.push({
      severity: 'CRÍTICO',
      category: 'Exposição de Dados',
      issue: 'API pode estar retornando senhas sem sanitização',
      file: relativePath,
      recommendation: 'Usar sanitizeUserData() para remover campos sensíveis'
    })
  }
})

if (exposedDataCount === 0) {
  console.log('✅ Nenhuma exposição de dados sensíveis detectada')
} else {
  console.log(`⚠️  ${exposedDataCount} possível(is) exposição(ões) de dados detectada(s)`)
}

// ============================================================================
// 10. VERIFICAR INJEÇÃO SQL
// ============================================================================

console.log('\n\n📋 10. VERIFICANDO PROTEÇÃO CONTRA INJEÇÃO SQL\n')

let sqlInjectionRisks = 0

apiFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8')
  const relativePath = path.relative(rootDir, file)
  
  // Verificar concatenação de strings em queries
  if (/\$\{.*\}.*from|from.*\$\{.*\}/i.test(content) && !/supabase/i.test(content)) {
    sqlInjectionRisks++
    vulnerabilities.push({
      severity: 'CRÍTICO',
      category: 'SQL Injection',
      issue: 'Possível vulnerabilidade de SQL Injection (concatenação de strings)',
      file: relativePath,
      fix: 'Usar prepared statements ou ORM (Supabase) para queries'
    })
  }
})

if (sqlInjectionRisks === 0) {
  console.log('✅ Nenhum risco de SQL Injection detectado')
  console.log('   (Usando Supabase ORM que previne SQL Injection)')
} else {
  console.log(`⚠️  ${sqlInjectionRisks} possível(is) risco(s) de SQL Injection detectado(s)`)
}

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

console.log('\n\n' + '='.repeat(80))
console.log('📊 RELATÓRIO DE VULNERABILIDADES\n')

console.log(`🔴 Vulnerabilidades Críticas: ${vulnerabilities.filter(v => v.severity === 'CRÍTICO').length}`)
console.log(`🟠 Vulnerabilidades Altas: ${vulnerabilities.filter(v => v.severity === 'ALTO').length}`)
console.log(`🟡 Vulnerabilidades Médias: ${vulnerabilities.filter(v => v.severity === 'MÉDIO').length}`)
console.log(`⚪ Vulnerabilidades Baixas: ${vulnerabilities.filter(v => v.severity === 'BAIXO').length}`)
console.log(`\n⚠️  Avisos: ${warnings.length}`)
console.log(`💡 Recomendações: ${recommendations.length}`)

if (vulnerabilities.length > 0) {
  console.log('\n\n🔴 VULNERABILIDADES DETECTADAS:\n')
  vulnerabilities.forEach((vuln, index) => {
    console.log(`${index + 1}. [${vuln.severity}] ${vuln.issue}`)
    console.log(`   📁 ${vuln.file}`)
    console.log(`   🔧 ${vuln.fix}\n`)
  })
}

if (warnings.length > 0) {
  console.log('\n⚠️  AVISOS:\n')
  warnings.forEach((warn, index) => {
    console.log(`${index + 1}. [${warn.severity}] ${warn.issue}`)
    console.log(`   📁 ${warn.file}`)
    console.log(`   💡 ${warn.recommendation}\n`)
  })
}

if (recommendations.length > 0) {
  console.log('\n💡 RECOMENDAÇÕES:\n')
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. [${rec.priority}] ${rec.recommendation}`)
    console.log(`   📦 ${rec.category}`)
    console.log(`   ✨ ${rec.benefit}\n`)
  })
}

console.log('='.repeat(80))

// Salvar relatório em arquivo
const report = {
  date: new Date().toISOString(),
  summary: {
    critical: vulnerabilities.filter(v => v.severity === 'CRÍTICO').length,
    high: vulnerabilities.filter(v => v.severity === 'ALTO').length,
    medium: vulnerabilities.filter(v => v.severity === 'MÉDIO').length,
    low: vulnerabilities.filter(v => v.severity === 'BAIXO').length,
    warnings: warnings.length,
    recommendations: recommendations.length
  },
  vulnerabilities,
  warnings,
  recommendations
}

const reportPath = path.join(rootDir, 'relatorio-vulnerabilidades.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`\n📄 Relatório salvo em: relatorio-vulnerabilidades.json\n`)

// Exit code baseado na severidade
const hasCritical = vulnerabilities.some(v => v.severity === 'CRÍTICO')
const hasHigh = vulnerabilities.some(v => v.severity === 'ALTO')

if (hasCritical) {
  console.log('❌ FALHA: Vulnerabilidades críticas detectadas\n')
  process.exit(2)
} else if (hasHigh) {
  console.log('⚠️  AVISO: Vulnerabilidades altas detectadas\n')
  process.exit(1)
} else {
  console.log('✅ SUCESSO: Nenhuma vulnerabilidade crítica ou alta detectada\n')
  process.exit(0)
}
