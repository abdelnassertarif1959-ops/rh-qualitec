import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado deletando item personalizado:', requestingUser.nome_completo)
  
  const params = event.context.params || {}
  const id = params.id || params.funcionarioId || Object.values(params)[0]
  const supabase = serverSupabaseServiceRole(event)

  try {
    const { error } = await supabase
      .from('holerite_itens_personalizados')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar item personalizado:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
