// DELETE /api/avisos/[id] - Deletar aviso (apenas admin)
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é admin
    const user = await requireAdmin(event)
    
    const supabase = serverSupabaseServiceRole(event)

    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do aviso não fornecido'
      })
    }

    // Soft delete - marcar como inativo
    const { error } = await supabase
      .from('avisos')
      .update({ ativo: false })
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar aviso:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao deletar aviso'
      })
    }

    return {
      success: true,
      message: 'Aviso deletado com sucesso'
    }
  } catch (error: any) {
    console.error('Erro ao deletar aviso:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao deletar aviso'
    })
  }
})
