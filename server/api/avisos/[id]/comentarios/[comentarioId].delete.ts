// DELETE /api/avisos/[id]/comentarios/[comentarioId] - Deletar comentário (admin ou autor)
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    const authenticatedUser = await requireAuth(event)
    const userId = authenticatedUser.id

    const avisoId = getRouterParam(event, 'id')
    const comentarioId = getRouterParam(event, 'comentarioId')

    if (!avisoId) {
      throw createError({
        statusCode: 400,
        message: 'ID do aviso é obrigatório'
      })
    }

    if (!comentarioId) {
      throw createError({
        statusCode: 400,
        message: 'ID do comentário é obrigatório'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Buscar comentário para verificar permissão
    const { data: comentario, error: fetchError } = await supabase
      .from('avisos_comentarios')
      .select('funcionario_id, aviso_id')
      .eq('id', comentarioId)
      .eq('aviso_id', avisoId)
      .single()

    if (fetchError || !comentario) {
      throw createError({
        statusCode: 404,
        message: 'Comentário não encontrado'
      })
    }

    // Verificar se é o autor ou admin
    const isAutor = comentario.funcionario_id.toString() === userId.toString()
    const isAdmin = authenticatedUser.tipo_acesso === 'admin'

    if (!isAutor && !isAdmin) {
      throw createError({
        statusCode: 403,
        message: 'Você não tem permissão para deletar este comentário'
      })
    }

    // Deletar comentário
    const { error } = await supabase
      .from('avisos_comentarios')
      .delete()
      .eq('id', comentarioId)
      .eq('aviso_id', avisoId)

    if (error) {
      console.error('Erro ao deletar comentário:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao deletar comentário'
      })
    }

    return { 
      success: true, 
      message: 'Comentário deletado com sucesso' 
    }
  } catch (error: any) {
    console.error('Erro ao deletar comentário:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao deletar comentário'
    })
  }
})
