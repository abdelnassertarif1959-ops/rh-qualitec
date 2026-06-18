import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  const { empresa_id, titulo, conteudo } = body
  if (!empresa_id || !conteudo) throw createError({ statusCode: 400, message: 'empresa_id e conteudo são obrigatórios' })

  // Verificar se já existe e incrementar versão
  const { data: existente } = await (supabase as any)
    .from('codigo_etica')
    .select('versao')
    .eq('empresa_id', empresa_id)
    .eq('ativo', true)
    .single()

  const novaVersao = existente ? existente.versao + 1 : 1

  // Desativar versão anterior
  if (existente) {
    await (supabase as any)
      .from('codigo_etica')
      .update({ ativo: false })
      .eq('empresa_id', empresa_id)
  }

  const { data, error } = await (supabase as any)
    .from('codigo_etica')
    .insert({ empresa_id, titulo: titulo || 'Código de Ética e Conduta', conteudo, versao: novaVersao, logo_base64: body.logo_base64 || null })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
