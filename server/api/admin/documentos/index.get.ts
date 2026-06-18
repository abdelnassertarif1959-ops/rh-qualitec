import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  // Buscar todos os documentos com dados do funcionário (sem o conteudo blob)
  const { data, error } = await (supabase as any)
    .from('funcionario_documentos')
    .select('id, nome_original, tipo_arquivo, tamanho_bytes, criado_em, funcionario_id, titulo, descricao, data_referencia, funcionarios:funcionario_id(id, nome_completo, cargo_id, cargos:cargo_id(nome))')
    .order('criado_em', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data: data || [] }
})
