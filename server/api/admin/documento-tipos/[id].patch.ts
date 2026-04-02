import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'ID obrigatório' })

  const updates: Record<string, any> = {}
  if (body.nome !== undefined) updates.nome = body.nome.trim()
  if (body.descricao_padrao !== undefined) updates.descricao_padrao = body.descricao_padrao?.trim() || null
  if (body.ativo !== undefined) updates.ativo = body.ativo

  const { data, error } = await supabase
    .from('documento_tipos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
