/**
 * API para excluir uma notificação específica
 */
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado excluindo notificação:', requestingUser.nome_completo)
  
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey
    
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID da notificação não fornecido'
      })
    }

    console.log(`🗑️ [NOTIFICACAO-DELETE] Excluindo notificação ID: ${id}`)

    // Excluir notificação
    const response = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [NOTIFICACAO-DELETE] Erro ao excluir:', errorText)
      throw new Error('Erro ao excluir notificação')
    }

    console.log('✅ [NOTIFICACAO-DELETE] Notificação excluída com sucesso')

    return {
      success: true,
      message: 'Notificação excluída com sucesso'
    }

  } catch (error: any) {
    console.error('💥 [NOTIFICACAO-DELETE] Erro:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao excluir notificação'
    })
  }
})
