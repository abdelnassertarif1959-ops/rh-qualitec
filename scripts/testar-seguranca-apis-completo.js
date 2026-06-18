/**
 * Script de Teste Completo de Segurança das APIs
 * 
 * Testa todas as rotas da API para verificar:
 * 1. Proteção de autenticação (requireAuth)
 * 2. Proteção de admin (requireAdmin)
 * 3. Proteção de ownership (requireOwnershipOrAdmin)
 * 4. Vazamento de dados sensíveis
 * 5. Validação de entrada
 * 
 * Data: 12/02/2026
 */

const BASE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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

// Resultados dos testes
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  vulnerabilities: []
}

/**
 * Fazer requisição HTTP
 */
async function makeRequest(method, path, options = {}) {
  const url = `${BASE_URL}${path}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })
    
    const data = await response.text().then(text => {
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    }