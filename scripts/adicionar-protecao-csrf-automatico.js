/**
 * Script para adicionar proteção CSRF automaticamente nas APIs
 * 
 * Este script:
 * 1. Identifica rotas mutáveis sem proteção CSRF
 * 2. Adiciona o import do middleware
 * 3. Adiciona a chamada ao middleware no início do handler
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Rotas que NÃO devem ter proteção CSRF
const ROTAS_EXCLUIDAS = [
  'auth/login',
  'auth/logout',
  'auth/forgot-password',
  'auth/reset-password',
  'auth/validate',
  'cron/',
  'health',
  'csrf-token'
]

// Estatísticas
const stats = {
  total: 0,
  modificados: 0,
  jaProtegidos: 0,
  excluidos: 0,
  erros: 0
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

// Função para verificar se é rota mutável
function eRotaMutavel(filePath) {
  const fileName = filePath.split(/[\\/]/).pop()
  return fileName.includes('.post.') || 
         fileName.includes('.patch.') || 
         fileName.includes('.put.') || 
         fileName.includes('.delete.')
}

// Função para verificar se deve ser excluída
function deveSerExcluida(filePath) {
  const relativePath = relative(process.cwd(), filePath)
  return ROTAS_EXCLUIDAS.some(rota => relativePath.includes(rota))
}

// Função para adicionar proteção CSRF
function adicionarProtecaoCsrf(filePath) {
  const relativePath = relative(process.cwd(), filePath)
  
  try {
    let conteudo = readFileSync(filePath, 'utf-8')
    
    // Verificar se já tem proteção CSRF
    if (conteudo.includes('requireCsrfProtection')) {
      log(`⏭️  ${relativePath} - Já protegido`, 'blue')
      stats.jaProtegidos++
      return false
    }
    
    // Verificar se deve ser excluído
    if (deveSerExcluida(filePath)) {
      log(`⏭️  ${relativePath} - Excluído (rota pública/cron)`, 'yellow')
      stats.excluidos++
      return false
    }
    
    // Adicionar import se não existir
    if (!conteudo.includes("from '../../utils/csrfMiddleware'") && 
        !conteudo.includes("from '../utils/csrfMiddleware'") &&
        !conteudo.includes("from '../../../utils/csrfMiddleware'")) {
      
      // Determinar o caminho correto baseado na profundidade
      const depth = relativePath.split(/[\\/]/).length - 2 // -2 para server/api
      const importPath = '../'.repeat(depth) + 'utils/csrfMiddleware'
      
      // Encontrar a última linha de import
      const lines = conteudo.split('\n')
      let lastImportIndex = -1
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, `import { requireCsrfProtection } from '${importPath}'`)
        conteudo = lines.join('\n')
      }
    }
    
    // Adicionar chamada ao middleware no início do handler
    // Procurar por "export default defineEventHandler(async (event) => {"
    const handlerRegex = /export default defineEventHandler\(async \(event\) => \{/
    
    if (handlerRegex.test(conteudo)) {
      conteudo = conteudo.replace(
        handlerRegex,
        `export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar proteção CSRF
  await requireCsrfProtection(event)
`
      )
      
      // Salvar arquivo modificado
      writeFileSync(filePath, conteudo, 'utf-8')
      log(`✅ ${relativePath} - Proteção CSRF adicionada`, 'green')
      stats.modificados++
      return true
    } else {
      log(`⚠️  ${relativePath} - Padrão de handler não encontrado`, 'yellow')
      stats.erros++
      return false
    }
    
  } catch (error) {
    log(`❌ ${relativePath} - Erro: ${error.message}`, 'red')
    stats.erros++
    return false
  }
}

// Função principal
async function adicionarProtecaoCsrfEmTodas() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan')
  log('║     ADICIONAR PROTEÇÃO CSRF AUTOMATICAMENTE          ║', 'cyan')
  log('╚═══════════════════════════════════════════════════════╝', 'cyan')
  
  const apiDir = join(process.cwd(), 'server', 'api')
  const arquivos = lerArquivosRecursivamente(apiDir)
  
  log(`\n📁 Analisando ${arquivos.length} arquivos...\n`, 'cyan')
  
  for (const arquivo of arquivos) {
    if (eRotaMutavel(arquivo)) {
      stats.total++
      adicionarProtecaoCsrf(arquivo)
    }
  }
  
  // Relatório final
  log('\n\n╔═══════════════════════════════════════════════════════╗', 'cyan')
  log('║              RELATÓRIO FINAL                          ║', 'cyan')
  log('╚═══════════════════════════════════════════════════════╝', 'cyan')
  
  log(`\n📊 Estatísticas:`, 'cyan')
  log(`   Total de rotas mutáveis: ${stats.total}`)
  log(`   ✅ Modificados: ${stats.modificados}`, 'green')
  log(`   ⏭️  Já protegidos: ${stats.jaProtegidos}`, 'blue')
  log(`   ⏭️  Excluídos: ${stats.excluidos}`, 'yellow')
  log(`   ❌ Erros: ${stats.erros}`, 'red')
  
  const taxaSucesso = ((stats.modificados / stats.total) * 100).toFixed(1)
  log(`\n🎯 Taxa de sucesso: ${taxaSucesso}%`, taxaSucesso >= 80 ? 'green' : 'yellow')
  
  log('\n═══════════════════════════════════════════════════════\n', 'cyan')
  
  if (stats.modificados > 0) {
    log('⚠️  IMPORTANTE:', 'yellow')
    log('   1. Revise os arquivos modificados', 'yellow')
    log('   2. Teste as APIs modificadas', 'yellow')
    log('   3. Certifique-se de que o frontend está enviando o token CSRF', 'yellow')
    log('\n')
  }
}

// Executar
adicionarProtecaoCsrfEmTodas().catch(console.error)
