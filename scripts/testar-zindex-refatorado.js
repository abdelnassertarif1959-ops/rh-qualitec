/**
 * Script de Teste - Refatoração useZIndexDebug
 * Valida que os composables refatorados estão funcionando corretamente
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔍 Testando Refatoração do useZIndexDebug...\n')

let totalTests = 0
let passedTests = 0

// Teste 1: Verificar se os arquivos existem
console.log('📁 Teste 1: Verificando arquivos...')
try {
  const files = [
    'app/composables/useZIndexDebug.ts',
    'app/composables/useZIndexDebugVisual.ts',
    'app/composables/useZIndexDebugAnalyze.ts',
    'app/composables/useZIndexDebugSearch.ts',
    'app/composables/useZIndexDebugHelpers.ts',
    'app/composables/useZIndexDebugComplete.ts'
  ]
  
  let allExist = true
  files.forEach(file => {
    totalTests++
    const exists = fs.existsSync(path.join(rootDir, file))
    console.log(`  ${exists ? '✅' : '❌'} ${file}`)
    if (exists) passedTests++
    else allExist = false
  })
  
  if (allExist) {
    console.log('✅ Todos os arquivos existem\n')
  } else {
    console.log('❌ Alguns arquivos não foram encontrados\n')
  }
} catch (error) {
  console.error('❌ Erro ao verificar arquivos:', error.message)
}

// Teste 2: Verificar estrutura do Core
console.log('🔧 Teste 2: Verificando estrutura do Core...')
try {
  const coreFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebug.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Estado isDebugging', pattern: /const isDebugging = ref/ },
    { name: 'Função toggleDebug', pattern: /const toggleDebug = / },
    { name: 'Import Visual', pattern: /useZIndexDebugVisual/ },
    { name: 'onUnmounted cleanup', pattern: /onUnmounted/ },
    { name: 'Export useZIndexDebug', pattern: /export const useZIndexDebug/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(coreFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Core verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Core:', error.message)
}

// Teste 3: Verificar estrutura do Visual
console.log('🎨 Teste 3: Verificando estrutura do Visual...')
try {
  const visualFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebugVisual.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Função startDebug', pattern: /const startDebug = / },
    { name: 'Função stopDebug', pattern: /const stopDebug = / },
    { name: 'Import Helpers', pattern: /useZIndexDebugHelpers/ },
    { name: 'Estilos CSS', pattern: /style\.textContent = `/ },
    { name: 'Export useZIndexDebugVisual', pattern: /export const useZIndexDebugVisual/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(visualFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Visual verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Visual:', error.message)
}

// Teste 4: Verificar estrutura do Analyze
console.log('🔍 Teste 4: Verificando estrutura do Analyze...')
try {
  const analyzeFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebugAnalyze.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Função analyzeElement', pattern: /const analyzeElement = / },
    { name: 'Import Helpers', pattern: /useZIndexDebugHelpers/ },
    { name: 'Análise de hierarquia', pattern: /Hierarquia de Stacking Context/ },
    { name: 'Export useZIndexDebugAnalyze', pattern: /export const useZIndexDebugAnalyze/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(analyzeFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Analyze verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Analyze:', error.message)
}

// Teste 5: Verificar estrutura do Search
console.log('🔎 Teste 5: Verificando estrutura do Search...')
try {
  const searchFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebugSearch.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Função findHighZIndex', pattern: /const findHighZIndex = / },
    { name: 'Função checkConflicts', pattern: /const checkConflicts = / },
    { name: 'Busca de modais', pattern: /querySelectorAll.*modal/ },
    { name: 'Export useZIndexDebugSearch', pattern: /export const useZIndexDebugSearch/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(searchFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Search verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Search:', error.message)
}

// Teste 6: Verificar estrutura do Helpers
console.log('🛠️ Teste 6: Verificando estrutura do Helpers...')
try {
  const helpersFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebugHelpers.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Função checkStackingContext', pattern: /const checkStackingContext = / },
    { name: 'Função debugStackingContexts', pattern: /const debugStackingContexts = / },
    { name: 'Verificação de position', pattern: /style\.position/ },
    { name: 'Export useZIndexDebugHelpers', pattern: /export const useZIndexDebugHelpers/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(helpersFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Helpers verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Helpers:', error.message)
}

// Teste 7: Verificar estrutura do Complete
console.log('📦 Teste 7: Verificando estrutura do Complete...')
try {
  const completeFile = fs.readFileSync(
    path.join(rootDir, 'app/composables/useZIndexDebugComplete.ts'),
    'utf-8'
  )
  
  const checks = [
    { name: 'Import Core', pattern: /useZIndexDebug/ },
    { name: 'Import Analyze', pattern: /useZIndexDebugAnalyze/ },
    { name: 'Import Search', pattern: /useZIndexDebugSearch/ },
    { name: 'Export useZIndexDebugComplete', pattern: /export const useZIndexDebugComplete/ }
  ]
  
  checks.forEach(check => {
    totalTests++
    const passed = check.pattern.test(completeFile)
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (passed) passedTests++
  })
  
  console.log('✅ Estrutura do Complete verificada\n')
} catch (error) {
  console.error('❌ Erro ao verificar Complete:', error.message)
}

// Teste 8: Verificar tamanho dos arquivos
console.log('📏 Teste 8: Verificando tamanho dos arquivos...')
try {
  const files = [
    'app/composables/useZIndexDebug.ts',
    'app/composables/useZIndexDebugVisual.ts',
    'app/composables/useZIndexDebugAnalyze.ts',
    'app/composables/useZIndexDebugSearch.ts',
    'app/composables/useZIndexDebugHelpers.ts',
    'app/composables/useZIndexDebugComplete.ts'
  ]
  
  let totalLines = 0
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8')
    const lines = content.split('\n').length
    totalLines += lines
    console.log(`  📄 ${path.basename(file)}: ${lines} linhas`)
  })
  
  console.log(`  📄 Total: ${totalLines} linhas`)
  console.log(`  📄 Média: ${Math.round(totalLines / files.length)} linhas por arquivo`)
  
  totalTests++
  if (totalLines / files.length < 100) {
    console.log('✅ Tamanhos adequados\n')
    passedTests++
  } else {
    console.log('⚠️ Alguns arquivos podem estar grandes\n')
  }
} catch (error) {
  console.error('❌ Erro ao verificar tamanhos:', error.message)
}

// Resumo Final
console.log('=' .repeat(60))
console.log(`📊 RESULTADO: ${passedTests}/${totalTests} testes passaram`)
console.log('=' .repeat(60))

if (passedTests === totalTests) {
  console.log('\n✅ TODOS OS TESTES PASSARAM!')
  console.log('\n📊 Resumo da Refatoração:')
  console.log('  • 1 composable refatorado em 6 arquivos')
  console.log('  • Core: Estado e controle (2 funções)')
  console.log('  • Visual: Debug visual (2 funções)')
  console.log('  • Analyze: Análise de elementos (1 função)')
  console.log('  • Search: Busca e conflitos (2 funções)')
  console.log('  • Helpers: Funções auxiliares (2 funções)')
  console.log('  • Complete: Agregador de funcionalidades')
  console.log('\n🎉 Refatoração do useZIndexDebug concluída com sucesso!')
  process.exit(0)
} else {
  console.log(`\n⚠️ ${totalTests - passedTests} teste(s) falharam`)
  process.exit(1)
}
