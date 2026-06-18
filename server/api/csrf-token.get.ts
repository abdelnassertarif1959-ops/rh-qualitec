import { generateCsrfToken, setCsrfCookie } from '../utils/csrfMiddleware'

/**
 * API para obter token CSRF
 * GET /api/csrf-token
 * 
 * Retorna um token CSRF e o define como cookie
 * O frontend deve incluir este token no header X-CSRF-Token
 * em todas as requisições POST, PUT, PATCH, DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[CSRF-TOKEN] Gerando novo token CSRF')
    
    // Gerar token CSRF
    const csrfToken = generateCsrfToken()
    
    // Setar cookie CSRF
    setCsrfCookie(event, csrfToken)
    
    console.log('[CSRF-TOKEN] ✅ Token CSRF gerado e cookie definido')
    
    return {
      success: true,
      csrfToken,
      message: 'Token CSRF gerado com sucesso'
    }
    
  } catch (error: any) {
    console.error('[CSRF-TOKEN] 💥 Erro ao gerar token:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao gerar token CSRF'
    })
  }
})
