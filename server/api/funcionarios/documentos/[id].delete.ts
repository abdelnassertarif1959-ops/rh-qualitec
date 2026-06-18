import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  const { error } = await (supabase as any)
    .from('funcionario_documentos')
    .delete()
    .eq('id', id)
    .eq('funcionario_id', user.id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
