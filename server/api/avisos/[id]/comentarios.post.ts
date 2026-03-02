// POST /api/avisos/[id]/comentarios - Adicionar comentário em um aviso
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    const user = await requireAuth(event)
    const userId = user.id

    const avisoId = event.context.params?.id
    const body = await readBody(event)
    const { comentario } = body

    if (!avisoId) {
      throw createError({
        statusCode: 400,
        message: 'ID do aviso não fornecido'
      })
    }

    // Validações
    if (!comentario || comentario.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Comentário é obrigatório'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Verificar se o aviso existe e está ativo
    const { data: aviso, error: avisoError } = await supabase
      .from('avisos')
      .select('id, ativo')
      .eq('id', avisoId)
      .single()

    if (avisoError || !aviso) {
      throw createError({
        statusCode: 404,
        message: 'Aviso não encontrado'
      })
    }

    if (!aviso.ativo) {
      throw createError({
        statusCode: 400,
        message: 'Não é possível comentar em um aviso inativo'
      })
    }

    // Criar comentário
    const { data: novoComentario, error } = await supabase
      .from('avisos_comentarios')
      .insert({
        aviso_id: avisoId,
        funcionario_id: userId,
        comentario: comentario.trim()
      })
      .select(`
        *,
        autor:funcionarios!avisos_comentarios_funcionario_id_fkey(
          id,
          nome_completo,
          avatar,
          tipo_acesso
        )
      `)
      .single()

    if (error) {
      console.error('Erro ao criar comentário:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar comentário'
      })
    }

    return {
      success: true,
      message: 'Comentário adicionado com sucesso',
      comentario: novoComentario
    }
  } catch (error: any) {
    console.error('Erro ao criar comentário:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar comentário'
    })
  }
})
