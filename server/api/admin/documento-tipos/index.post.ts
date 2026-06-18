import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  if (!body?.nome?.trim()) {
    throw createError({ statusCode: 400, message: 'Nome é obrigatório' })
  }

  const { data, error } = await supabase
    .from('documento_tipos')
    .insert({ nome: body.nome.trim(), descricao_padrao: body.descricao_padrao?.trim() || null })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
