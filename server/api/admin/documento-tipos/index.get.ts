import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase
    .from('documento_tipos')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data: data || [] }
})
