// DELETE /api/avisos/comentarios/[id] - Deletar comentário (admin ou autor)
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação via cookie
    const cookies = parseCookies(event)
    if (!cookies.session) {
      throw createError({
        statusCode: 401,
        message: 'Não autenticado'
      })
    }

    const sessionData = JSON.parse(decodeURIComponent(cookies.session))
    const userId = sessionData.userId

    const comentarioId = event.context.params?.id

    if (!comentarioId) {
      throw createError({
        statusCode: 400,
        message: 'ID do comentário não fornecido'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Buscar comentário para verificar permissão
    const { data: comentario, error: fetchError } = await supabase
      .from('avisos_comentarios')
      .select('funcionario_id')
      .eq('id', comentarioId)
      .single()

    if (fetchError || !comentario) {
      throw createError({
        statusCode: 404,
        message: 'Comentário não encontrado'
      })
    }

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
      .from('funcionarios')
      .select('id, tipo_acesso')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      throw createError({
        statusCode: 401,
        message: 'Usuário não encontrado'
      })
    }

    // Verificar se é o autor ou admin
    const isAutor = comentario.funcionario_id.toString() === userId.toString()
    const isAdmin = user.tipo_acesso === 'admin'

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
