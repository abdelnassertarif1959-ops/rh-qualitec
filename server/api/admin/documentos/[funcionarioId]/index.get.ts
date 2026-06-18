import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const funcionarioId = getRouterParam(event, 'funcionarioId')

  if (!funcionarioId) {
    throw createError({ statusCode: 400, message: 'funcionarioId é obrigatório' })
  }

  const { data, error } = await supabase
    .from('funcionario_documentos')
    .select('id, nome_original, tipo_arquivo, tamanho_bytes, criado_em, titulo, descricao, data_referencia')
    .eq('funcionario_id', funcionarioId)
    .order('criado_em', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data: data || [] }
})
