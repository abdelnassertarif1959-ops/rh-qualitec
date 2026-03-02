/**
 * TESTE DE MIDDLEWARES DE SEGURANÇA
 * 
 * Este script analisa o código-fonte das APIs para verificar:
 * 1. Quais APIs estão usando middlewares de autenticação
 * 2. Quais APIs estão usando proteção CSRF
 * 3. Quais APIs estão usando proteção de cron
 * 4. Identificar possíveis vulnerabilidades
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Resultados da análise
const results = {
  totalApis: 0,
  protegidas: 0,
  desprotegidas: 0,
  parcialmenteProtegidas: 0,
  vulnerabilidades: [],
  detalhes: []
}

// Função para ler arquivos recursivamente
function lerArquivosRecursivamente(dir, arquivos = []) {
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      lerArquivosRecursivamente(fullPath, arquivos)
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      arquivos.push(fullPath)
    }
  }
  
  return arquivos
}

// Função para analisar um arquivo de API
function analisarAPI(filePath) {
  const conteudo = readFileSync(filePath, 'utf-8')
  const relativePath = relative(process.cwd(), filePath)
  
  // Extrair método HTTP do nome do arquivo
  const fileName = filePath.split(/[\\/]/).pop()
  let metodo = 'GET'
  
  if (fileName.includes('.post.')) metodo = 'POST'
  else if (fileName.includes('.patch.')) metodo = 'PATCH'
  else if (fileName.includes('.put.')) metodo = 'PUT'
  else if (fileName.includes('.delete.')) metodo = 'DELETE'
  
  // Verificar middlewares de segurança
  const temRequireAuth = /requireAuth\s*\(/.test(conteudo)
  const temRequireAdmin = /requireAdmin\s*\(/.test(conteudo)
  const temRequireOwnership = /requireOwnershipOrAdmin\s*\(/.test(conteudo)
  const temRequireCsrf = /requireCsrfProtection\s*\(/.test(conteudo)
  const temRequireCron = /requireCronAuth\s*\(/.test(conteudo)
  
  // Verificar se é rota pública (auth, health, csrf-token)
  const rotasPublicas = [
    'auth/login',
    'auth/logout',
    'auth/forgot-password',
    'auth/reset-password',
    'auth/validate',
    'health.get',
    'csrf-token.get'
  ]
  
  const eRotaPublica = rotasPublicas.some(rota => relativePath.includes(rota))
  
  // Verificar se é rota de cron
  const eRotaCron = relativePath.includes('api/cron/')
  
  // Verificar se é rota de debug
  const eRotaDebug = relativePath.includes('api/debug/')
  
  // Determinar nível de proteção
  let nivelProtecao = 'NENHUMA'
  let middlewares = []
  
  if (temRequireAuth) {
    middlewares.push('requireAuth')
    nivelProtecao = 'BÁSICA'
  }
  if (temRequireAdmin) {
    middlewares.push('requireAdmin')
    nivelProtecao = 'ADMIN'
  }
  if (temRequireOwnership) {
    middlewares.push('requireOwnershipOrAdmin')
    nivelProtecao = 'OWNERSHIP'
  }
  if (temRequireCsrf) {
    middlewares.push('requireCsrfProtection')
  }
  if (temRequireCron) {
    middlewares.push('requireCronAuth')
    nivelProtecao = 'CRON'
  }
  
  // Análise de vulnerabilidades
  const vulnerabilidades = []
  
  // 1. Rotas públicas não devem ter proteção excessiva
  if (eRotaPublica && middlewares.length > 0) {
    vulnerabilidades.push({
      severidade: 'BAIXA',
      tipo: 'Configuração',
      descricao: 'Rota pública com middleware de autenticação pode causar problemas'
    })
  }
  
  // 2. Rotas protegidas devem ter autenticação
  if (!eRotaPublica && !eRotaCron && middlewares.length === 0) {
    vulnerabilidades.push({
      severidade: 'CRÍTICA',
      tipo: 'Autenticação',
      descricao: 'Rota sem proteção de autenticação'
    })
  }
  
  // 3. Métodos mutáveis devem ter proteção CSRF (exceto auth e cron)
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(metodo) && 
      !temRequireCsrf && 
      !eRotaPublica && 
      !eRotaCron) {
    vulnerabilidades.push({
      severidade: 'ALTA',
      tipo: 'CSRF',
      descricao: 'Método mutável sem proteção CSRF'
    })
  }
  
  // 4. Rotas de cron devem ter proteção específica
  if (eRotaCron && !temRequireCron) {
    vulnerabilidades.push({
      severidade: 'CRÍTICA',
      tipo: 'Autenticação',
      descricao: 'Rota de cron sem proteção requireCronAuth'
    })
  }
  
  // 5. Rotas de debug devem exigir admin
  if (eRotaDebug && !temRequireAdmin) {
    vulnerabilidades.push({
      severidade: 'ALTA',
      tipo: 'Controle de Acesso',
      descricao: 'Rota de debug sem proteção requireAdmin'
    })
  }
  
  // 6. Verificar se há sanitização de dados sensíveis
  const temSanitize = /sanitizeUserData\s*\(/.test(conteudo)
  const retornaDadosUsuario = /funcionarios|user|usuario/i.test(conteudo) && 
                               /return\s+{/.test(conteudo)
  
  if (retornaDadosUsuario && !temSanitize && !eRotaPublica) {
    vulnerabilidades.push({
      severidade: 'MÉDIA',
      tipo: 'Exposição de Dados',
      descricao: 'Possível exposição de dados sensíveis sem sanitização'
    })
  }
  
  return {
    arquivo: relativePath,
    metodo,
    nivelProtecao,
    middlewares,
    eRotaPublica,
    eRotaCron,
    eRotaDebug,
    vulnerabilidades,
    protegida: middlewares.length > 0 || eRotaPublica
  }
}

// Função principal
async function analisarSeguranca() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'magenta')
  log('║     ANÁLISE DE MIDDLEWARES DE SEGURANÇA DAS APIs     ║', 'magenta')
  log('╚═══════════════════════════════════════════════════════╝', 'magenta')
  
  const apiDir = join(process.cwd(), 'server', 'api')
  const arquivos = lerArquivosRecursivamente(apiDir)
  
  log(`\n📁 Analisando ${arquivos.length} arquivos de API...\n`, 'cyan')
  
  for (const arquivo of arquivos) {
    const analise = analisarAPI(arquivo)
    results.totalApis++
    results.detalhes.push(analise)
    
    if (analise.protegida) {
      results.protegidas++
    } else {
      results.desprotegidas++
    }
    
    if (analise.vulnerabilidades.length > 0) {
      results.vulnerabilidades.push(...analise.vulnerabilidades.map(v => ({
        ...v,
        arquivo: analise.arquivo,
        metodo: analise.metodo
      })))
    }
  }
  
  // Relatório por categoria
  log('═══════════════════════════════════════════════════════', 'cyan')
  log('ANÁLISE POR CATEGORIA', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  // Rotas públicas
  const rotasPublicas = results.detalhes.filter(d => d.eRotaPublica)
  log(`\n📖 Rotas Públicas: ${rotasPublicas.length}`, 'blue')
  rotasPublicas.forEach(r => {
    log(`   ✓ ${r.metodo.padEnd(6)} ${r.arquivo}`, 'green')
  })
  
  // Rotas protegidas com requireAuth
  const rotasAuth = results.detalhes.filter(d => d.middlewares.includes('requireAuth'))
  log(`\n🔒 Rotas com requireAuth: ${rotasAuth.length}`, 'blue')
  rotasAuth.slice(0, 5).forEach(r => {
    log(`   ✓ ${r.metodo.padEnd(6)} ${r.arquivo}`, 'green')
  })
  if (rotasAuth.length > 5) {
    log(`   ... e mais ${rotasAuth.length - 5} rotas`, 'white')
  }
  
  // Rotas protegidas com requireAdmin
  const rotasAdmin = results.detalhes.filter(d => d.middlewares.includes('requireAdmin'))
  log(`\n👑 Rotas com requireAdmin: ${rotasAdmin.length}`, 'blue')
  rotasAdmin.slice(0, 5).forEach(r => {
    log(`   ✓ ${r.metodo.padEnd(6)} ${r.arquivo}`, 'green')
  })
  if (rotasAdmin.length > 5) {
    log(`   ... e mais ${rotasAdmin.length - 5} rotas`, 'white')
  }
  
  // Rotas com ownership
  const rotasOwnership = results.detalhes.filter(d => d.middlewares.includes('requireOwnershipOrAdmin'))
  log(`\n🔐 Rotas com requireOwnershipOrAdmin: ${rotasOwnership.length}`, 'blue')
  rotasOwnership.forEach(r => {
    log(`   ✓ ${r.metodo.padEnd(6)} ${r.arquivo}`, 'green')
  })
  
  // Rotas de cron
  const rotasCron = results.detalhes.filter(d => d.eRotaCron)
  log(`\n⏰ Rotas de Cron: ${rotasCron.length}`, 'blue')
  rotasCron.forEach(r => {
    const protegida = r.middlewares.includes('requireCronAuth')
    log(`   ${protegida ? '✓' : '✗'} ${r.metodo.padEnd(6)} ${r.arquivo}`, protegida ? 'green' : 'red')
  })
  
  // Rotas de debug
  const rotasDebug = results.detalhes.filter(d => d.eRotaDebug)
  log(`\n🐛 Rotas de Debug: ${rotasDebug.length}`, 'blue')
  rotasDebug.forEach(r => {
    const protegida = r.middlewares.includes('requireAdmin')
    log(`   ${protegida ? '✓' : '✗'} ${r.metodo.padEnd(6)} ${r.arquivo}`, protegida ? 'green' : 'red')
  })
  
  // Rotas desprotegidas
  const rotasDesprotegidas = results.detalhes.filter(d => !d.protegida)
  if (rotasDesprotegidas.length > 0) {
    log(`\n⚠️  Rotas SEM Proteção: ${rotasDesprotegidas.length}`, 'red')
    rotasDesprotegidas.forEach(r => {
      log(`   ✗ ${r.metodo.padEnd(6)} ${r.arquivo}`, 'red')
    })
  }
  
  // Vulnerabilidades
  log('\n\n═══════════════════════════════════════════════════════', 'cyan')
  log('VULNERABILIDADES ENCONTRADAS', 'cyan')
  log('═══════════════════════════════════════════════════════', 'cyan')
  
  if (results.vulnerabilidades.length === 0) {
    log('\n✅ Nenhuma vulnerabilidade encontrada!', 'green')
  } else {
    const criticas = results.vulnerabilidades.filter(v => v.severidade === 'CRÍTICA')
    const altas = results.vulnerabilidades.filter(v => v.severidade === 'ALTA')
    const medias = results.vulnerabilidades.filter(v => v.severidade === 'MÉDIA')
    const baixas = results.vulnerabilidades.filter(v => v.severidade === 'BAIXA')
    
    log(`\n🔴 Críticas: ${criticas.length}`, 'red')
    criticas.forEach(v => {
      log(`   ${v.metodo.padEnd(6)} ${v.arquivo}`, 'red')
      log(`   └─ ${v.tipo}: ${v.descricao}`, 'red')
    })
    
    log(`\n🟠 Altas: ${altas.length}`, 'yellow')
    altas.forEach(v => {
      log(`   ${v.metodo.padEnd(6)} ${v.arquivo}`, 'yellow')
      log(`   └─ ${v.tipo}: ${v.descricao}`, 'yellow')
    })
    
    log(`\n🟡 Médias: ${medias.length}`, 'blue')
    medias.slice(0, 5).forEach(v => {
      log(`   ${v.metodo.padEnd(6)} ${v.arquivo}`, 'blue')
      log(`   └─ ${v.tipo}: ${v.descricao}`, 'blue')
    })
    if (medias.length > 5) {
      log(`   ... e mais ${medias.length - 5} vulnerabilidades médias`, 'white')
    }
    
    if (baixas.length > 0) {
      log(`\n🟢 Baixas: ${baixas.length}`, 'white')
    }
  }
  
  // Estatísticas finais
  log('\n\n╔═══════════════════════════════════════════════════════╗', 'magenta')
  log('║              ESTATÍSTICAS FINAIS                      ║', 'magenta')
  log('╚═══════════════════════════════════════════════════════╝', 'magenta')
  
  log(`\n📊 Total de APIs analisadas: ${results.totalApis}`, 'cyan')
  log(`   ✅ Protegidas: ${results.protegidas} (${((results.protegidas/results.totalApis)*100).toFixed(1)}%)`, 'green')
  log(`   ❌ Desprotegidas: ${results.desprotegidas} (${((results.desprotegidas/results.totalApis)*100).toFixed(1)}%)`, 'red')
  
  log(`\n🔒 Middlewares de Segurança:`, 'cyan')
  log(`   requireAuth: ${results.detalhes.filter(d => d.middlewares.includes('requireAuth')).length} rotas`, 'white')
  log(`   requireAdmin: ${results.detalhes.filter(d => d.middlewares.includes('requireAdmin')).length} rotas`, 'white')
  log(`   requireOwnershipOrAdmin: ${results.detalhes.filter(d => d.middlewares.includes('requireOwnershipOrAdmin')).length} rotas`, 'white')
  log(`   requireCronAuth: ${results.detalhes.filter(d => d.middlewares.includes('requireCronAuth')).length} rotas`, 'white')
  log(`   requireCsrfProtection: ${results.detalhes.filter(d => d.middlewares.includes('requireCsrfProtection')).length} rotas`, 'white')
  
  log(`\n⚠️  Vulnerabilidades:`, 'cyan')
  log(`   Críticas: ${results.vulnerabilidades.filter(v => v.severidade === 'CRÍTICA').length}`, 'red')
  log(`   Altas: ${results.vulnerabilidades.filter(v => v.severidade === 'ALTA').length}`, 'yellow')
  log(`   Médias: ${results.vulnerabilidades.filter(v => v.severidade === 'MÉDIA').length}`, 'blue')
  log(`   Baixas: ${results.vulnerabilidades.filter(v => v.severidade === 'BAIXA').length}`, 'white')
  
  const taxaSeguranca = ((results.protegidas / results.totalApis) * 100).toFixed(1)
  const cor = taxaSeguranca >= 90 ? 'green' : taxaSeguranca >= 70 ? 'yellow' : 'red'
  log(`\n🎯 Taxa de Segurança: ${taxaSeguranca}%`, cor)
  
  // Salvar relatório
  const relatorio = {
    timestamp: new Date().toISOString(),
    resumo: {
      totalApis: results.totalApis,
      protegidas: results.protegidas,
      desprotegidas: results.desprotegidas,
      taxaSeguranca: `${taxaSeguranca}%`
    },
    middlewares: {
      requireAuth: results.detalhes.filter(d => d.middlewares.includes('requireAuth')).length,
      requireAdmin: results.detalhes.filter(d => d.middlewares.includes('requireAdmin')).length,
      requireOwnershipOrAdmin: results.detalhes.filter(d => d.middlewares.includes('requireOwnershipOrAdmin')).length,
      requireCronAuth: results.detalhes.filter(d => d.middlewares.includes('requireCronAuth')).length,
      requireCsrfProtection: results.detalhes.filter(d => d.middlewares.includes('requireCsrfProtection')).length
    },
    vulnerabilidades: {
      total: results.vulnerabilidades.length,
      criticas: results.vulnerabilidades.filter(v => v.severidade === 'CRÍTICA').length,
      altas: results.vulnerabilidades.filter(v => v.severidade === 'ALTA').length,
      medias: results.vulnerabilidades.filter(v => v.severidade === 'MÉDIA').length,
      baixas: results.vulnerabilidades.filter(v => v.severidade === 'BAIXA').length,
      detalhes: results.vulnerabilidades
    },
    detalhesApis: results.detalhes
  }
  
  const { writeFileSync } = await import('fs')
  writeFileSync(
    'relatorio-analise-middlewares-seguranca.json',
    JSON.stringify(relatorio, null, 2)
  )
  
  log(`\n📄 Relatório detalhado salvo em: relatorio-analise-middlewares-seguranca.json`, 'cyan')
  log('\n═══════════════════════════════════════════════════════\n', 'cyan')
  
  // Recomendações
  if (results.vulnerabilidades.length > 0) {
    log('╔═══════════════════════════════════════════════════════╗', 'yellow')
    log('║                   RECOMENDAÇÕES                       ║', 'yellow')
    log('╚═══════════════════════════════════════════════════════╝', 'yellow')
    
    const criticas = results.vulnerabilidades.filter(v => v.severidade === 'CRÍTICA')
    if (criticas.length > 0) {
      log('\n🔴 AÇÃO IMEDIATA NECESSÁRIA:', 'red')
      log('   As vulnerabilidades críticas devem ser corrigidas imediatamente:', 'red')
      criticas.forEach(v => {
        log(`   • ${v.arquivo}`, 'red')
        log(`     ${v.descricao}`, 'red')
      })
    }
    
    const altas = results.vulnerabilidades.filter(v => v.severidade === 'ALTA')
    if (altas.length > 0) {
      log('\n🟠 ALTA PRIORIDADE:', 'yellow')
      log('   Corrija estas vulnerabilidades o mais rápido possível:', 'yellow')
      altas.slice(0, 3).forEach(v => {
        log(`   • ${v.arquivo}`, 'yellow')
        log(`     ${v.descricao}`, 'yellow')
      })
      if (altas.length > 3) {
        log(`   ... e mais ${altas.length - 3} vulnerabilidades altas`, 'yellow')
      }
    }
    
    log('\n')
  }
}

// Executar análise
analisarSeguranca().catch(console.error)
