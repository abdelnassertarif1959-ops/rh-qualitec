/**
 * Script para Verificar Segurança das APIs
 * Identifica APIs sem proteção de autenticação
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔒 Verificando Segurança das APIs...\n')

const apiDir = path.join(rootDir, 'server/api')

// Padrões de autenticação a procurar
const authPatterns = [
  /requireAuth\(/,
  /requireAdmin\(/,
  /requireOwnershipOrAdmin\(/,
  /requireCronAuth\(/
]

// APIs que devem ser públicas
const publicAPIs = [
  'auth/login.post.ts',
  'auth/logout.post.ts',
  'auth/forgot-password.post.ts',
  'auth/reset-password.post.ts',
  'auth/validate.get.ts',
  'health.get.ts'
]

let totalAPIs = 0
let protectedAPIs = 0
let publicAPIsCount = 0
let unprotectedAPIs = []

/**
 * Verificar se arquivo é uma API pública legítima
 */
function isPublicAPI(filePath) {
  // Normalizar o caminho para usar barras normais
  const normalizedPath = filePath.replace(/\\/g, '/')
  return publicAPIs.some(publicAPI => {
    const normalizedPublicAPI = publicAPI.replace(/\\/g, '/')
    return normalizedPath.includes(normalizedPublicAPI)
  })
}

/**
 * Verificar se arquivo tem proteção de autenticação
 */
function hasAuthProtection(content) {
  return authPatterns.some(pattern => pattern.test(content))
}

/**
 * Escanear diretório recursivamente
 */
function scanDirectory(dir, baseDir = dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, baseDir)
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      totalAPIs++
      
      const content = fs.readFileSync(filePath, 'utf-8')
      const relativePath = path.relative(baseDir, filePath)
      
      if (isPublicAPI(relativePath)) {
        publicAPIsCount++
        console.log(`✅ Pública (Correto): ${relativePath}`)
      } else if (hasAuthProtection(content)) {
        protectedAPIs++
        console.log(`🔒 Protegida: ${relativePath}`)
      } else {
        unprotectedAPIs.push(relativePath)
        console.log(`⚠️  SEM PROTEÇÃO: ${relativePath}`)
      }
    }
  })
}

// Escanear todas as APIs
scanDirectory(apiDir)

// Resumo
console.log('\n' + '='.repeat(60))
console.log('📊 RESUMO DA ANÁLISE DE SEGURANÇA')
console.log('='.repeat(60))
console.log(`Total de APIs: ${totalAPIs}`)
console.log(`APIs Protegidas: ${protectedAPIs} (${Math.round(protectedAPIs/totalAPIs*100)}%)`)
console.log(`APIs Públicas: ${publicAPIsCount} (${Math.round(publicAPIsCount/totalAPIs*100)}%)`)
console.log(`APIs Desprotegidas: ${unprotectedAPIs.length} (${Math.round(unprotectedAPIs.length/totalAPIs*100)}%)`)

if (unprotectedAPIs.length > 0) {
  console.log('\n⚠️  APIs SEM PROTEÇÃO:')
  unprotectedAPIs.forEach((api, index) => {
    console.log(`  ${index + 1}. ${api}`)
  })
  
  console.log('\n🔧 AÇÃO NECESSÁRIA:')
  console.log('  1. Revisar cada API desprotegida')
  console.log('  2. Adicionar requireAuth() ou requireAdmin()')
  console.log('  3. Ou adicionar à lista de APIs públicas se apropriado')
  
  process.exit(1)
} else {
  console.log('\n✅ TODAS AS APIs ESTÃO PROTEGIDAS!')
  process.exit(0)
}
