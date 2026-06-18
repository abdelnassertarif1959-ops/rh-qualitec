import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID obrigatório' })

  // Verificar se há documentos usando este tipo antes de excluir
  const { count } = await supabase
    .from('funcionario_documentos')
    .select('id', { count: 'exact', head: true })
    .eq('tipo_id', id)

  if (count && count > 0) {
    throw createError({ statusCode: 409, message: `Este tipo está em uso por ${count} documento(s). Desative-o em vez de excluir.` })
  }

  const { error } = await supabase
    .from('documento_tipos')
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
