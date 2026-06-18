import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // Verificar autenticação
  await requireAuth(event)
  
  const supabase = await serverSupabaseServiceRole(event)

  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do aviso é obrigatório'
      })
    }

    // Buscar aviso com informações do autor
    const { data: aviso, error } = await supabase
      .from('avisos')
      .select(`
        *,
        autor:funcionarios!avisos_criado_por_fkey(
          id,
          nome_completo,
          avatar_url
        )
      `)
      .eq('id', id)
      .eq('ativo', true)
      .single()

    if (error || !aviso) {
      throw createError({
        statusCode: 404,
        message: 'Aviso não encontrado'
      })
    }

    // Contar comentários
    const { count } = await supabase
      .from('avisos_comentarios')
      .select('*', { count: 'exact', head: true })
      .eq('aviso_id', id)

    return {
      ...aviso,
      total_comentarios: count || 0
    }
  } catch (error: any) {
    console.error('Erro ao buscar aviso:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar aviso'
    })
  }
})
