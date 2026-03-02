import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado buscando jornada:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID da jornada não fornecido'
      })
    }

    const { data: jornada, error } = await supabase
      .from('jornadas_trabalho')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar jornada:', error)
      throw error
    }

    if (!jornada) {
      throw createError({
        statusCode: 404,
        message: 'Jornada não encontrada'
      })
    }

    return jornada

  } catch (error: any) {
    console.error('Erro ao buscar jornada:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar jornada'
    })
  }
})
