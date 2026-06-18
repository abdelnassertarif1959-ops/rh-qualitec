import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // O Nuxt pode capturar o param como 'id' ou 'funcionarioId' dependendo do roteamento
  const params = event.context.params || {}
  const id = params.id || params.funcionarioId || Object.values(params)[0]

  await requireAdmin(event)

  const supabase = serverSupabaseServiceRole(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID obrigatório' })
  }

  const { error } = await (supabase as any)
    .from('funcionario_documentos')
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
