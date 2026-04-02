import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'ID obrigatório' })

  const { titulo, descricao } = body

  // Garantir que o documento pertence ao funcionário logado
  const { data: doc } = await supabase
    .from('funcionario_documentos')
    .select('id')
    .eq('id', id)
    .eq('funcionario_id', user.id)
    .single()

  if (!doc) throw createError({ statusCode: 404, message: 'Documento não encontrado' })

  const { data, error } = await supabase
    .from('funcionario_documentos')
    .update({ titulo: titulo || null, descricao: descricao || null })
    .eq('id', id)
    .select('id, nome_original, titulo, descricao, tipo_arquivo, tamanho_bytes, criado_em')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
