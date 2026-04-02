import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await (supabase as any)
    .from('funcionario_documentos')
    .select('id, nome_original, tipo_arquivo, tamanho_bytes, criado_em, titulo, descricao, tipo_id, documento_tipos(nome)')
    .eq('funcionario_id', user.id)
    .order('criado_em', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data: data || [] }
})
