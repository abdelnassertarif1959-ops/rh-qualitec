import { deleteSecureCookie } from '../../utils/authMiddleware'
import { clearTokenCookies } from '../../utils/jwt'
import { requireCsrfProtection } from '../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar proteção CSRF
  await requireCsrfProtection(event)
  try {
    console.log('🚪 Processando logout...')
    
    // Limpar tokens JWT
    clearTokenCookies(event)
    
    // Limpar cookie de sessão antigo (compatibilidade)
    deleteSecureCookie(event, 'session')
    
    console.log('✅ Logout realizado com sucesso')
    
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    }
    
  } catch (error: any) {
    console.error('💥 Erro no logout:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
