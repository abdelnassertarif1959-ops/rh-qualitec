import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  // Documentos das últimas 48h
  const limite = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const { data, error } = await (supabase as any)
    .from('funcionario_documentos')
    .select('id, nome_original, criado_em, funcionarios:funcionario_id(nome_completo)')
    .gte('criado_em', limite)
    .order('criado_em', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, total: (data || []).length, data: data || [] }
})
