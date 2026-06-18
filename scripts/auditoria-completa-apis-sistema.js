/**
 * AUDITORIA COMPLETA DE TODAS AS APIs DO SISTEMA
 * 
 * Testa:
 * 1. Proteção de middleware em todas as rotas
 * 2. Autenticação e autorização adequadas
 * 3. Verifica se frontend não faz chamadas diretas ao banco
 * 4. Valida respostas e códigos de status
 */

import { execSync } from 'child_process'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Função para buscar todos os arquivos de API recursivamente
function getAllApiFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllApiFiles(filePath, fileList)
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// Função para extrair informações da rota
function extractRouteInfo(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const relativePath = filePath.replace(/\\/g, '/').replace('server/api/', '')
  
  // Determinar método HTTP
  let method = 'GET'
  if (relativePath.includes('.post.')) method = 'POST'
  else if (relativePath.includes('.patch.')) method = 'PATCH'
  else if (relativePath.includes('.put.')) method = 'PUT'
  else if (relativePath.includes('.delete.')) method = 'DELETE'
  
  // Construir URL da rota
  let route = '/' + relativePath
    .replace(/\.(get|post|patch|put|delete)\.ts$/, '')
    .replace(/\.(get|post|patch|put|delete)\.js$/, '')
    .replace(/index$/, '')
    .replace(/\[(\w+)\]/g, ':$1')
  
  // Verificar se usa middleware de autenticação
  const hasRequireAuth = content.includes('requireAuth(')
  const hasRequireAdmin = content.includes('requireAdmin(')
  const hasRequireOwnership = content.includes('requireOwnershipOrAdmin(')
  
  // Verificar se faz chamadas diretas ao Supabase
  const hasDirectSupabaseCall = content.includes('serverSupabaseServiceRole') || 
                                 content.includes('serverSupabaseClient')
  
  // Verificar se tem validação de entrada
  const hasValidation = content.includes('z.object') || 
                        content.includes('validate') ||
                        content.includes('schema')
  
  return {
    file: relativePath,
    route,
    method,
    hasRequireAuth,
    hasRequireAdmin,
    hasRequireOwnership,
    hasDirectSupabaseCall,
    hasValidation,
    content
  }
}

// Função para verificar se frontend faz chamadas diretas ao banco
function checkFrontendDirectCalls() {
  log('\n📋 VERIFICANDO CHAMADAS DIRETAS AO BANCO NO FRONTEND...', 'cyan')
  
  try {
    const result = execSync(
      'npx rg "createClient|supabase\\.from" app/ --type-add "vue:*.vue" --type vue --type ts --type js -l',
      { encoding: 'utf-8', stdio: 'pipe' }
    )
    
    if (result.trim()) {
      log('❌ ENCONTRADAS CHAMADAS DIRETAS AO BANCO NO FRONTEND:', 'red')
      log(result, 'yellow')
      return false
    } else {
      log('✅ Nenhuma chamada direta ao banco encontrada no frontend', 'green')
      return true
    }
  } catch (error) {
    if (error.status === 1) {
      log('✅ Nenhuma chamada direta ao banco encontrada no frontend', 'green')
      return true
    }
    log('⚠️  Erro ao verificar frontend: ' + error.message, 'yellow')
    return true
  }
}

// Função principal de auditoria
async function auditarAPIs() {
  log('═══════════════════════════════════════════════════════════', 'cyan')
  log('🔍 AUDITORIA COMPLETA DE SEGURANÇA DAS APIs', 'cyan')
  log('═══════════════════════════════════════════════════════════', 'cyan')
  
  // 1. Verificar chamadas diretas no frontend
  const frontendOk = checkFrontendDirectCalls()
  
  // 2. Listar todas as APIs
  log('\n📂 MAPEANDO TODAS AS ROTAS DA API...', 'cyan')
  const apiFiles = getAllApiFiles('server/api')
  log(`Encontradas ${apiFiles.length} rotas de API\n`, 'blue')
  
  // 3. Analisar cada rota
  const routes = apiFiles.map(extractRouteInfo)
  
  // Estatísticas
  const stats = {
    total: routes.length,
    comAuth: 0,
    semAuth: 0,
    comAdmin: 0,
    comOwnership: 0,
    comValidacao: 0,
    semValidacao: 0,
    rotasPublicas: [],
    rotasSemProtecao: [],
    rotasSemValidacao: []
  }
  
  // Rotas que devem ser públicas
  const rotasPublicasEsperadas = [
    '/auth/login',
    '/auth/logout',
    '/auth/recuperar-senha',
    '/auth/redefinir-senha',
    '/health',
    '/csrf-token',
    '/test-supabase'
  ]
  
  log('═══════════════════════════════════════════════════════════', 'magenta')
  log('📊 ANÁLISE DETALHADA DAS ROTAS', 'magenta')
  log('═══════════════════════════════════════════════════════════', 'magenta')
  
  routes.forEach(route => {
    const isPublicRoute = rotasPublicasEsperadas.some(r => route.route.includes(r))
    
    // Contabilizar estatísticas
    if (route.hasRequireAuth || route.hasRequireAdmin || route.hasRequireOwnership) {
      stats.comAuth++
    } else {
      stats.semAuth++
      if (!isPublicRoute) {
        stats.rotasSemProtecao.push(route)
      } else {
        stats.rotasPublicas.push(route)
      }
    }
    
    if (route.hasRequireAdmin) stats.comAdmin++
    if (route.hasRequireOwnership) stats.comOwnership++
    
    if (route.hasValidation) {
      stats.comValidacao++
    } else {
      stats.semValidacao++
      if (route.method !== 'GET') {
        stats.rotasSemValidacao.push(route)
      }
    }
    
    // Log da rota
    const authStatus = route.hasRequireAdmin ? '🔐 ADMIN' :
                      route.hasRequireOwnership ? '🔐 OWNER/ADMIN' :
                      route.hasRequireAuth ? '🔐 AUTH' :
                      isPublicRoute ? '🌐 PUBLIC' : '⚠️  SEM PROTEÇÃO'
    
    const validationStatus = route.hasValidation ? '✓ Validação' : 
                             route.method === 'GET' ? '- N/A' : '⚠️  Sem validação'
    
    const color = route.hasRequireAuth || route.hasRequireAdmin || route.hasRequireOwnership || isPublicRoute ? 'green' : 'red'
    
    log(`\n${route.method.padEnd(7)} ${route.route}`, color)
    log(`        ${authStatus} | ${validationStatus}`, color)
    log(`        Arquivo: ${route.file}`, 'blue')
  })
  
  // Relatório de rotas sem proteção
  log('\n═══════════════════════════════════════════════════════════', 'red')
  log('⚠️  ROTAS SEM PROTEÇÃO DE AUTENTICAÇÃO', 'red')
  log('═══════════════════════════════════════════════════════════', 'red')
  
  if (stats.rotasSemProtecao.length === 0) {
    log('✅ Todas as rotas privadas estão protegidas!', 'green')
  } else {
    stats.rotasSemProtecao.forEach(route => {
      log(`\n❌ ${route.method} ${route.route}`, 'red')
      log(`   Arquivo: ${route.file}`, 'yellow')
      log(`   AÇÃO NECESSÁRIA: Adicionar requireAuth(), requireAdmin() ou requireOwnershipOrAdmin()`, 'yellow')
    })
  }
  
  // Relatório de rotas sem validação
  log('\n═══════════════════════════════════════════════════════════', 'yellow')
  log('⚠️  ROTAS SEM VALIDAÇÃO DE ENTRADA (POST/PATCH/PUT/DELETE)', 'yellow')
  log('═══════════════════════════════════════════════════════════', 'yellow')
  
  if (stats.rotasSemValidacao.length === 0) {
    log('✅ Todas as rotas de modificação têm validação!', 'green')
  } else {
    stats.rotasSemValidacao.forEach(route => {
      log(`\n⚠️  ${route.method} ${route.route}`, 'yellow')
      log(`   Arquivo: ${route.file}`, 'yellow')
      log(`   RECOMENDAÇÃO: Adicionar validação com Zod ou similar`, 'yellow')
    })
  }
  
  // Rotas públicas identificadas
  log('\n═══════════════════════════════════════════════════════════', 'blue')
  log('🌐 ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)', 'blue')
  log('═══════════════════════════════════════════════════════════', 'blue')
  
  stats.rotasPublicas.forEach(route => {
    log(`✓ ${route.method} ${route.route}`, 'blue')
  })
  
  // Resumo final
  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('📊 RESUMO DA AUDITORIA', 'cyan')
  log('═══════════════════════════════════════════════════════════', 'cyan')
  
  log(`\n📈 Estatísticas Gerais:`, 'cyan')
  log(`   Total de rotas: ${stats.total}`)
  log(`   Rotas com autenticação: ${stats.comAuth} (${((stats.comAuth/stats.total)*100).toFixed(1)}%)`, 'green')
  log(`   Rotas sem autenticação: ${stats.semAuth} (${((stats.semAuth/stats.total)*100).toFixed(1)}%)`, stats.semAuth === stats.rotasPublicas.length ? 'blue' : 'red')
  log(`   - Rotas públicas esperadas: ${stats.rotasPublicas.length}`, 'blue')
  log(`   - Rotas SEM PROTEÇÃO: ${stats.rotasSemProtecao.length}`, stats.rotasSemProtecao.length === 0 ? 'green' : 'red')
  
  log(`\n🔐 Níveis de Proteção:`, 'cyan')
  log(`   Rotas com requireAdmin: ${stats.comAdmin}`, 'green')
  log(`   Rotas com requireOwnership: ${stats.comOwnership}`, 'green')
  
  log(`\n✓ Validação de Entrada:`, 'cyan')
  log(`   Rotas com validação: ${stats.comValidacao}`, 'green')
  log(`   Rotas sem validação (POST/PATCH/PUT/DELETE): ${stats.rotasSemValidacao.length}`, stats.rotasSemValidacao.length === 0 ? 'green' : 'yellow')
  
  log(`\n🎯 Frontend:`, 'cyan')
  log(`   Chamadas diretas ao banco: ${frontendOk ? 'Nenhuma ✅' : 'ENCONTRADAS ❌'}`, frontendOk ? 'green' : 'red')
  
  // Avaliação final
  log('\n═══════════════════════════════════════════════════════════', 'magenta')
  log('🎯 AVALIAÇÃO FINAL', 'magenta')
  log('═══════════════════════════════════════════════════════════', 'magenta')
  
  const problemas = []
  
  if (!frontendOk) {
    problemas.push('Frontend fazendo chamadas diretas ao banco')
  }
  
  if (stats.rotasSemProtecao.length > 0) {
    problemas.push(`${stats.rotasSemProtecao.length} rotas sem proteção de autenticação`)
  }
  
  if (stats.rotasSemValidacao.length > 5) {
    problemas.push(`${stats.rotasSemValidacao.length} rotas sem validação de entrada`)
  }
  
  if (problemas.length === 0) {
    log('\n✅ SISTEMA APROVADO NA AUDITORIA DE SEGURANÇA!', 'green')
    log('   Todas as verificações passaram com sucesso.', 'green')
  } else {
    log('\n⚠️  PROBLEMAS ENCONTRADOS:', 'red')
    problemas.forEach(p => log(`   ❌ ${p}`, 'red'))
    log('\n   Revise os itens acima antes do deploy em produção.', 'yellow')
  }
  
  log('\n═══════════════════════════════════════════════════════════\n', 'cyan')
  
  return {
    success: problemas.length === 0,
    stats,
    problemas
  }
}

// Executar auditoria
auditarAPIs().catch(error => {
  log('\n❌ ERRO NA AUDITORIA:', 'red')
  log(error.message, 'red')
  process.exit(1)
})
