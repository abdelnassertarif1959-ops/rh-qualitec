/**
 * Script para testar as 6 vulnerabilidades corrigidas
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

async function testarVulnerabilidade(numero, descricao, url, metodo, esperado, body = null) {
  log(`\n${numero}. ${descricao}`, 'cyan')
  log(`  