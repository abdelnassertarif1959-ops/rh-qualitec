import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)

  // Buscar código de ética da empresa do usuário
  const { data: funcionario } = await (supabase as any)
    .from('funcionarios')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  const empresaId = funcionario?.empresa_id

  const { data, error } = await (supabase as any)
    .from('codigo_etica')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('versao', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Verificar se o usuário já confirmou
  let confirmado = false
  if (data) {
    const { data: conf } = await (supabase as any)
      .from('codigo_etica_confirmacoes')
      .select('id, confirmado_em')
      .eq('codigo_etica_id', data.id)
      .eq('funcionario_id', user.id)
      .single()
    confirmado = !!conf
  }

  return { success: true, data: data || null, confirmado }
})
