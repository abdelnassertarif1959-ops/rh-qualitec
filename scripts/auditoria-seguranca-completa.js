/**
 * Script de Auditoria Completa de Segurança
 * Foca em Autenticação e Autorização
 * 
 * Data: 12 de Fevereiro de 2026
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔒 AUDITORIA COMPLETA DE SEGURANÇA - AUTENTICAÇÃO E AUTORIZAÇÃO\n')
console.log('='.repeat(80))

// ============================================================================
// 1. ANÁLISE DE MIDDLEWARES
// ============================================================================

console.log('\n📋 1. ANÁLISE DE MIDDLEWARES\n')

const middlewares = {
  frontend: [
    { path: 'app/middleware/auth.ts', name: 'auth', type: 'frontend' },
    { path: 'app/middleware/admin.ts', name: 'admin', type: 'frontend' }
  ],
  backend: [
    { path: 'server/utils/authMiddleware.ts', name: 'authMiddleware', type: 'backend' },
    { path: 'server/utils/cronMiddleware.ts', name: 'cronMiddleware', type: 'backend' },
    { path: 'server/utils/auth.ts', name: 'auth utils', type: 'backend' }
  ]
}

console.log('📁 Middlewares Frontend:')
middlewares.frontend.forEach(m => {
  const exists = fs.existsSync(path.join(rootDir, m.path))
  console.log(`  ${exists ? '✅' : '❌'} ${m.name} - ${m.path}`)
})

console.log('\n📁 Middlewares Backend:')
middlewares.backend.forEach(m => {
  const exists = fs.existsSync(path.join(rootDir, m.path))
  console.log(`  ${exists ? '✅' : '❌'} ${m.name} - ${m.path}`)
})

// ============================================================================
// 2. ANÁLISE DE VALIDAÇÃO JWT/SESSÃO
// ============================================================================

console.log('\n\n📋 2. ANÁLISE DE VALIDAÇÃO JWT/SESSÃO\n')

const authMiddlewarePath = path.join(rootDir, 'server/utils/authMiddleware.ts')
const authMiddlewareContent = fs.readFileSync(authMiddlewarePath, 'utf-8')

const validationChecks = {
  cookieValidation: /cookies\.session/.test(authMiddlewareContent),
  authHeaderValidation: /getHeader.*authorization/.test(authMiddlewareContent),
  userIdExtraction: /userId/.test(authMiddlewareContent),
  databaseValidation: /supabase.*funcionarios/.test(authMiddlewareContent),
  statusCheck: /status.*ativo/.test(authMiddlewareContent),
  errorHandling: /createError/.test(authMiddlewareContent)
}

console.log('🔍 Validações Implementadas:')
Object.entries(validationChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '❌'} ${label}`)
})

// ============================================================================
// 3. ANÁLISE DE ROLES (ADMIN, FUNCIONARIO)
// ============================================================================

console.log('\n\n📋 3. ANÁLISE DE VERIFICAÇÃO DE ROLES\n')

const roleChecks = {
  requireAuth: /export.*function requireAuth/.test(authMiddlewareContent),
  requireAdmin: /export.*function requireAdmin/.test(authMiddlewareContent),
  requireOwnership: /export.*function requireOwnershipOrAdmin/.test(authMiddlewareContent),
  adminTypeCheck: /tipo_acesso.*admin/.test(authMiddlewareContent),
  ownershipCheck: /user\.id.*targetUserId/.test(authMiddlewareContent)
}

console.log('🔍 Funções de Autorização:')
Object.entries(roleChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '❌'} ${label}`)
})

// ============================================================================
// 4. ANÁLISE DE ROTAS PROTEGIDAS
// ============================================================================

console.log('\n\n📋 4. ANÁLISE DE ROTAS PROTEGIDAS (FRONTEND)\n')

const pagesDir = path.join(rootDir, 'app/pages')
const protectedRoutes = []
const unprotectedRoutes = []
const publicRoutes = ['login', 'reset-password', 'index', 'test-login']

function scanPages(dir, basePath = '') {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      scanPages(filePath, path.join(basePath, file))
    } else if (file.endsWith('.vue')) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const routePath = path.join(basePath, file.replace('.vue', '')).replace(/\\/g, '/')
      
      // Verificar se é uma rota pública conhecida
      const isPublicRoute = publicRoutes.some(pub => routePath.includes(pub))
      
      if (isPublicRoute) {
        return // Ignorar rotas públicas
      }
      
      // Verificar se tem middleware
      const hasAuthMiddleware = /middleware:\s*['"]auth['"]/.test(content) || 
                               /middleware:\s*\[.*['"]auth['"].*\]/.test(content)
      const hasAdminMiddleware = /middleware:\s*\[.*['"]admin['"].*\]/.test(content)
      
      if (hasAuthMiddleware || hasAdminMiddleware) {
        protectedRoutes.push({
          path: routePath,
          middleware: hasAdminMiddleware ? ['auth', 'admin'] : ['auth']
        })
      } else {
        unprotectedRoutes.push(routePath)
      }
    }
  })
}

scanPages(pagesDir)

console.log('✅ Rotas Protegidas:')
protectedRoutes.forEach(route => {
  console.log(`  🔒 /${route.path} - [${route.middleware.join(', ')}]`)
})

if (unprotectedRoutes.length > 0) {
  console.log('\n⚠️  Rotas Sem Middleware (podem precisar proteção):')
  unprotectedRoutes.forEach(route => {
    console.log(`  ⚠️  /${route}`)
  })
}

// ============================================================================
// 5. ANÁLISE DE APIS PROTEGIDAS
// ============================================================================

console.log('\n\n📋 5. ANÁLISE DE APIS PROTEGIDAS (BACKEND)\n')

const apiDir = path.join(rootDir, 'server/api')
let totalAPIs = 0
let protectedAPIs = 0
let publicAPIs = 0
let unprotectedAPIs = []

const authPatterns = [
  /requireAuth\(/,
  /requireAdmin\(/,
  /requireOwnershipOrAdmin\(/,
  /requireCronAuth\(/
]

const publicAPIsList = [
  'auth/login.post.ts',
  'auth/logout.post.ts',
  'auth/forgot-password.post.ts',
  'auth/reset-password.post.ts',
  'auth/validate.get.ts',
  'health.get.ts'
]

function scanAPIs(dir, baseDir = dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      scanAPIs(filePath, baseDir)
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      totalAPIs++
      
      const content = fs.readFileSync(filePath, 'utf-8')
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/')
      
      const isPublicAPI = publicAPIsList.some(pub => relativePath.includes(pub))
      
      if (isPublicAPI) {
        publicAPIs++
      } else if (authPatterns.some(pattern => pattern.test(content))) {
        protectedAPIs++
      } else {
        unprotectedAPIs.push(relativePath)
      }
    }
  })
}

scanAPIs(apiDir)

console.log(`📊 Total de APIs: ${totalAPIs}`)
console.log(`✅ APIs Protegidas: ${protectedAPIs} (${Math.round(protectedAPIs/totalAPIs*100)}%)`)
console.log(`🌐 APIs Públicas: ${publicAPIs} (${Math.round(publicAPIs/totalAPIs*100)}%)`)
console.log(`⚠️  APIs Desprotegidas: ${unprotectedAPIs.length} (${Math.round(unprotectedAPIs.length/totalAPIs*100)}%)`)

if (unprotectedAPIs.length > 0) {
  console.log('\n⚠️  APIs SEM PROTEÇÃO:')
  unprotectedAPIs.forEach((api, index) => {
    console.log(`  ${index + 1}. ${api}`)
  })
}

// ============================================================================
// 6. ANÁLISE DE SEGURANÇA DE SENHAS
// ============================================================================

console.log('\n\n📋 6. ANÁLISE DE SEGURANÇA DE SENHAS\n')

const authUtilsPath = path.join(rootDir, 'server/utils/auth.ts')
const authUtilsContent = fs.readFileSync(authUtilsPath, 'utf-8')

const passwordSecurityChecks = {
  hashFunction: /hashPassword/.test(authUtilsContent),
  verifyFunction: /verifyPassword/.test(authUtilsContent),
  bcryptSupport: /bcryptjs/.test(authUtilsContent),
  saltGeneration: /salt/.test(authUtilsContent),
  iterations: /10000/.test(authUtilsContent),
  sha256: /SHA-256/.test(authUtilsContent),
  migrationSupport: /MIGRAR_/.test(authUtilsContent)
}

console.log('🔐 Segurança de Senhas:')
Object.entries(passwordSecurityChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '❌'} ${label}`)
})

// ============================================================================
// 7. ANÁLISE DE COOKIES E SESSÕES
// ============================================================================

console.log('\n\n📋 7. ANÁLISE DE COOKIES E SESSÕES\n')

const sessionChecks = {
  sessionCookieCreation: /createSessionCookie/.test(authMiddlewareContent),
  sessionValidation: /isSessionValid/.test(authMiddlewareContent),
  expirationCheck: /expires/.test(authMiddlewareContent),
  timestampTracking: /timestamp/.test(authMiddlewareContent),
  cookieParsing: /parseCookies/.test(authMiddlewareContent)
}

console.log('🍪 Gerenciamento de Sessões:')
Object.entries(sessionChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '❌'} ${label}`)
})

// Verificar configuração de cookies no nuxt.config
const nuxtConfigPath = path.join(rootDir, 'nuxt.config.ts')
if (fs.existsSync(nuxtConfigPath)) {
  const nuxtConfig = fs.readFileSync(nuxtConfigPath, 'utf-8')
  
  console.log('\n🔧 Configuração de Cookies (nuxt.config.ts):')
  console.log(`  ${/httpOnly/.test(nuxtConfig) ? '✅' : '⚠️ '} httpOnly`)
  console.log(`  ${/sameSite/.test(nuxtConfig) ? '✅' : '⚠️ '} sameSite`)
  console.log(`  ${/secure/.test(nuxtConfig) ? '✅' : '⚠️ '} secure`)
}

// ============================================================================
// 8. ANÁLISE DE SANITIZAÇÃO DE DADOS
// ============================================================================

console.log('\n\n📋 8. ANÁLISE DE SANITIZAÇÃO DE DADOS\n')

const sanitizationChecks = {
  sanitizeFunction: /sanitizeUserData/.test(authMiddlewareContent),
  passwordRemoval: /delete.*senha/.test(authMiddlewareContent),
  financialDataProtection: /salario_base|banco|agencia|conta/.test(authMiddlewareContent),
  ownershipCheck: /isViewingOwnData/.test(authMiddlewareContent)
}

console.log('🧹 Sanitização de Dados Sensíveis:')
Object.entries(sanitizationChecks).forEach(([check, passed]) => {
  const label = check.replace(/([A-Z])/g, ' $1').toLowerCase()
  console.log(`  ${passed ? '✅' : '❌'} ${label}`)
})

// ============================================================================
// 9. VULNERABILIDADES CONHECIDAS
// ============================================================================

console.log('\n\n📋 9. VERIFICAÇÃO DE VULNERABILIDADES CONHECIDAS\n')

const vulnerabilities = []

// Verificar se há senhas em texto plano
const loginAPIPath = path.join(rootDir, 'server/api/auth/login.post.ts')
if (fs.existsSync(loginAPIPath)) {
  const loginContent = fs.readFileSync(loginAPIPath, 'utf-8')
  
  if (!/verifyPassword/.test(loginContent)) {
    vulnerabilities.push({
      severity: 'CRÍTICO',
      issue: 'Login pode não estar usando verificação segura de senha',
      file: 'server/api/auth/login.post.ts'
    })
  }
}

// Verificar rate limiting
const hasRateLimiting = fs.existsSync(loginAPIPath) && 
                       /rate.*limit|tentativas|attempts/i.test(fs.readFileSync(loginAPIPath, 'utf-8'))

if (!hasRateLimiting) {
  vulnerabilities.push({
    severity: 'ALTO',
    issue: 'Login pode não ter rate limiting implementado',
    file: 'server/api/auth/login.post.ts'
  })
}

// Verificar CSRF protection
const nuxtConfigPath2 = path.join(rootDir, 'nuxt.config.ts')
if (fs.existsSync(nuxtConfigPath2)) {
  const nuxtConfig = fs.readFileSync(nuxtConfigPath2, 'utf-8')
  
  if (!/csrf/.test(nuxtConfig)) {
    vulnerabilities.push({
      severity: 'MÉDIO',
      issue: 'CSRF protection pode não estar configurado',
      file: 'nuxt.config.ts'
    })
  }
}

if (vulnerabilities.length === 0) {
  console.log('✅ Nenhuma vulnerabilidade crítica detectada')
} else {
  console.log('⚠️  Vulnerabilidades Detectadas:\n')
  vulnerabilities.forEach((vuln, index) => {
    console.log(`  ${index + 1}. [${vuln.severity}] ${vuln.issue}`)
    console.log(`     📁 ${vuln.file}\n`)
  })
}

// ============================================================================
// 10. RECOMENDAÇÕES
// ============================================================================

console.log('\n\n📋 10. RECOMENDAÇÕES DE SEGURANÇA\n')

const recommendations = []

// Verificar JWT
if (!/jwt|jsonwebtoken/.test(authMiddlewareContent)) {
  recommendations.push({
    priority: 'MÉDIO',
    recommendation: 'Considerar implementar JWT para tokens mais seguros',
    benefit: 'Tokens assinados e com expiração automática'
  })
}

// Verificar 2FA
const has2FA = fs.existsSync(path.join(rootDir, 'server/api/auth/2fa.post.ts'))
if (!has2FA) {
  recommendations.push({
    priority: 'MÉDIO',
    recommendation: 'Implementar autenticação de dois fatores (2FA)',
    benefit: 'Camada adicional de segurança para contas sensíveis'
  })
}

// Verificar logs de auditoria
const hasAuditLogs = /console\.log.*\[API\]/.test(authMiddlewareContent)
if (!hasAuditLogs) {
  recommendations.push({
    priority: 'ALTO',
    recommendation: 'Implementar logs de auditoria detalhados',
    benefit: 'Rastreamento de ações e detecção de atividades suspeitas'
  })
}

// Verificar refresh tokens
if (!/refresh.*token/i.test(authMiddlewareContent)) {
  recommendations.push({
    priority: 'BAIXO',
    recommendation: 'Implementar refresh tokens',
    benefit: 'Melhor experiência do usuário com sessões mais longas e seguras'
  })
}

if (recommendations.length === 0) {
  console.log('✅ Sistema está seguindo as melhores práticas')
} else {
  recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. [${rec.priority}] ${rec.recommendation}`)
    console.log(`     💡 ${rec.benefit}\n`)
  })
}

// ============================================================================
// RESUMO FINAL
// ============================================================================

console.log('\n' + '='.repeat(80))
console.log('📊 RESUMO DA AUDITORIA DE SEGURANÇA\n')

const totalScore = 
  (Object.values(validationChecks).filter(Boolean).length / Object.keys(validationChecks).length) * 15 +
  (Object.values(roleChecks).filter(Boolean).length / Object.keys(roleChecks).length) * 15 +
  (protectedRoutes.length / (protectedRoutes.length + unprotectedRoutes.length)) * 15 +
  (protectedAPIs / totalAPIs) * 25 +
  (Object.values(passwordSecurityChecks).filter(Boolean).length / Object.keys(passwordSecurityChecks).length) * 15 +
  (Object.values(sessionChecks).filter(Boolean).length / Object.keys(sessionChecks).length) * 10 +
  (Object.values(sanitizationChecks).filter(Boolean).length / Object.keys(sanitizationChecks).length) * 5

const scorePercentage = Math.round(totalScore)

console.log(`🎯 Pontuação de Segurança: ${scorePercentage}/100`)
console.log(`📈 Nível: ${scorePercentage >= 90 ? 'EXCELENTE' : scorePercentage >= 75 ? 'BOM' : scorePercentage >= 60 ? 'REGULAR' : 'PRECISA MELHORIAS'}`)

console.log('\n📋 Estatísticas:')
console.log(`  • Middlewares: ${middlewares.frontend.length + middlewares.backend.length} implementados`)
console.log(`  • Rotas Protegidas: ${protectedRoutes.length}/${protectedRoutes.length + unprotectedRoutes.length}`)
console.log(`  • APIs Protegidas: ${protectedAPIs}/${totalAPIs}`)
console.log(`  • Vulnerabilidades: ${vulnerabilities.length}`)
console.log(`  • Recomendações: ${recommendations.length}`)

console.log('\n' + '='.repeat(80))
console.log('✅ Auditoria Completa Finalizada\n')

// Exit code baseado na pontuação
process.exit(scorePercentage >= 75 ? 0 : 1)
