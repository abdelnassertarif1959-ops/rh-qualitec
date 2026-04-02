import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)
  const { codigo_etica_id } = await readBody(event)

  if (!codigo_etica_id) throw createError({ statusCode: 400, message: 'codigo_etica_id obrigatório' })

  // Buscar versão atual
  const { data: codigo } = await (supabase as any)
    .from('codigo_etica')
    .select('versao')
    .eq('id', codigo_etica_id)
    .single()

  // Upsert confirmação
  const { error } = await (supabase as any)
    .from('codigo_etica_confirmacoes')
    .upsert({
      codigo_etica_id,
      funcionario_id: user.id,
      confirmado_em: new Date().toISOString(),
      versao_confirmada: codigo?.versao || 1
    }, { onConflict: 'codigo_etica_id,funcionario_id' })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
