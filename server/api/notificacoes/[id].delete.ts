import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

/**
 * API para excluir uma notificação específica
 * DELETE /api/notificacoes/[id]
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado excluindo notificação:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)
    const notificacaoId = getRouterParam(event, 'id')

    if (!notificacaoId) {
      throw createError({
        statusCode: 400,
        message: 'ID da notificação é obrigatório'
      })
    }

    console.log(`🗑️ [NOTIFICACOES] Excluindo notificação: ${notificacaoId}`)

    // Verificar se a notificação existe
    const { data: notificacaoExistente, error: erroVerificacao } = await supabase
      .from('notificacoes')
      .select('id, titulo, tipo')
      .eq('id', notificacaoId)
      .maybeSingle()

    if (erroVerificacao) {
      console.error('❌ Erro ao verificar existência da notificação:', erroVerificacao)
      throw erroVerificacao
    }

    if (!notificacaoExistente) {
      console.log(`⚠️ [NOTIFICACOES] Notificação ${notificacaoId} já não existe. Retornando sucesso para idempotência.`)
      return {
        success: true,
        message: 'Notificação já excluída ou não encontrada',
        notificacao_excluida: {
          id: notificacaoId,
          titulo: '',
          tipo: ''
        }
      }
    }

    // Excluir a notificação
    const { error: erroExclusao } = await supabase
      .from('notificacoes')
      .delete()
      .eq('id', notificacaoId)

    if (erroExclusao) {
      console.error('❌ Erro ao excluir notificação:', erroExclusao)
      throw erroExclusao
    }

    console.log(`✅ Notificação excluída: "${notificacaoExistente.titulo}"`)

    return {
      success: true,
      message: 'Notificação excluída com sucesso',
      notificacao_excluida: {
        id: notificacaoId,
        titulo: notificacaoExistente.titulo,
        tipo: notificacaoExistente.tipo
      }
    }

  } catch (error: any) {
    console.error('💥 Erro ao excluir notificação:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao excluir notificação'
    })
  }
})