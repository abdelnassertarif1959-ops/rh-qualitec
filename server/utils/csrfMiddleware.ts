import type { EventHandlerRequest, H3Event } from 'h3'
import crypto from 'crypto'

/**
 * Middleware de proteção CSRF
 * Implementa Double Submit Cookie pattern
 */

// Métodos HTTP que requerem proteção CSRF
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

// Rotas que não precisam de proteção CSRF (públicas)
const EXCLUDED_ROUTES = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/validate',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/health',
  '/api/cron/',  // Cron jobs usam outro tipo de autenticação
]

/**
 * Gerar token CSRF seguro
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('base64')
}

/**
 * Verificar se a rota está excluída da proteção CSRF
 */
function isExcludedRoute(path: string): boolean {
  return EXCLUDED_ROUTES.some(route => path.startsWith(route))
}

/**
 * Obter token CSRF do cookie
 */
function getCsrfTokenFromCookie(event: H3Event<EventHandlerRequest>): string | null {
  const cookies = parseCookies(event)
  return cookies['csrf-token'] || null
}

/**
 * Obter token CSRF do header
 */
function getCsrfTokenFromHeader(event: H3Event<EventHandlerRequest>): string | null {
  return getHeader(event, 'x-csrf-token') || null
}

/**
 * Setar cookie CSRF
 */
export function setCsrfCookie(event: H3Event<EventHandlerRequest>, token: string) {
  setCookie(event, 'csrf-token', token, {
    httpOnly: false, // Precisa ser acessível pelo JavaScript para enviar no header
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400, // 24 horas
    path: '/'
  })
}

/**
 * Middleware para validar token CSRF
 * Usa o padrão Double Submit Cookie
 */
export async function requireCsrfProtection(event: H3Event<EventHandlerRequest>): Promise<void> {
  const method = event.method
  const path = event.path

  // Ignorar métodos seguros (GET, HEAD, OPTIONS)
  if (!PROTECTED_METHODS.includes(method)) {
    return
  }

  // Ignorar rotas excluídas
  if (isExcludedRoute(path)) {
    console.log(`[CSRF] Rota excluída da proteção: ${path}`)
    return
  }

  // Obter tokens
  const cookieToken = getCsrfTokenFromCookie(event)
  const headerToken = getCsrfTokenFromHeader(event)

  console.log(`[CSRF] Validando proteção para ${method} ${path}`)
  console.log(`[CSRF] Cookie token: ${cookieToken ? 'presente' : 'ausente'}`)
  console.log(`[CSRF] Header token: ${headerToken ? 'presente' : 'ausente'}`)

  // Validar presença dos tokens
  if (!cookieToken || !headerToken) {
    console.error(`[CSRF] Token CSRF ausente`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF ausente. Por favor, recarregue a página.'
    })
  }

  // Validar se os tokens são iguais (Double Submit Cookie pattern)
  if (cookieToken !== headerToken) {
    console.error(`[CSRF] Tokens CSRF não correspondem`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF inválido. Por favor, recarregue a página.'
    })
  }

  console.log(`[CSRF] ✅ Proteção CSRF validada com sucesso`)
}

/**
 * Função auxiliar para verificar se CSRF está habilitado
 */
export function isCsrfEnabled(): boolean {
  // CSRF sempre habilitado em produção
  if (process.env.NODE_ENV === 'production') {
    return true
  }
  
  // Em desenvolvimento, pode ser desabilitado via variável de ambiente
  return process.env.DISABLE_CSRF !== 'true'
}
