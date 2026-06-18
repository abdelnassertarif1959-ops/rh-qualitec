import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado deletando holerite:', requestingUser.nome_completo)
  
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID do holerite não fornecido'
    })
  }

  const supabase = await serverSupabaseServiceRole(event)

  // Excluir holerite
  const { error } = await supabase
    .from('holerites')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir holerite:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao excluir holerite'
    })
  }

  return {
    success: true,
    message: 'Holerite excluído com sucesso'
  }
})
