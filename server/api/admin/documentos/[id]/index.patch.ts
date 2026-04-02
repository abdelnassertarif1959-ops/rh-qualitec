import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  const params = event.context.params || {}
  const id = params.id || params.funcionarioId || Object.values(params)[0]

  if (!id) throw createError({ statusCode: 400, message: 'ID é obrigatório' })

  const body = await readBody(event)
  const { titulo, descricao } = body

  const { data, error } = await (supabase as any)
    .from('funcionario_documentos')
    .update({ titulo: titulo ?? null, descricao: descricao ?? null })
    .eq('id', id)
    .select('id, titulo, descricao')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
