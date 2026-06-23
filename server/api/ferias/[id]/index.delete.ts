import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

// DELETE /api/ferias/[id] — Remove período de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAdmin(event)
    const supabase = serverSupabaseServiceRole(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' })

    const { error } = await supabase
      .from('funcionario_ferias')
      .delete()
      .eq('id', id)

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return { success: true, message: 'Período de férias removido com sucesso' }
  } catch (error: any) {
    console.error('[DELETE /api/ferias/[id]] Erro:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao remover férias' })
  }
})
