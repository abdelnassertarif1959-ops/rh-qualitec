import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { titulo, conteudo, logo_base64 } = body

  const { data, error } = await (supabase as any)
    .from('codigo_etica')
    .update({ titulo, conteudo, logo_base64: logo_base64 ?? null, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
