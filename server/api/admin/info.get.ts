import { requireAdmin, sanitizeUserData } from '../../utils/authMiddleware'

// API para buscar informações da admin (com autenticação)
export default defineEventHandler(async (event) => {
  try {
    // Verificar se o usuário é admin
    const user = await requireAdmin(event)
    
    console.log('📊 Admin autenticado acessando info:', user.nome_completo)
    
    // SEGURANÇA: Sanitizar dados antes de retornar
    const dadosSanitizados = sanitizeUserData(user, user)
    console.log('🔒 Dados sanitizados - campos sensíveis removidos')
    
    return {
      success: true,
      data: dadosSanitizados
    }
    
  } catch (error: any) {
    console.error('💥 Erro ao buscar info admin:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
