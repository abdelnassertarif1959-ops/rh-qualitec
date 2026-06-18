import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  // Buscar todos os códigos de ética com contagem de confirmações
  const { data, error } = await (supabase as any)
    .from('codigo_etica')
    .select(`
      *,
      empresa:empresa_id(id, nome_fantasia),
      confirmacoes:codigo_etica_confirmacoes(
        id, funcionario_id, confirmado_em, versao_confirmada,
        funcionario:funcionario_id(id, nome_completo, status)
      )
    `)
    .eq('ativo', true)
    .order('empresa_id')

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data: data || [] }
})
