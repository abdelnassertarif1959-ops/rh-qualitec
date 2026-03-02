import { requireAdmin } from '../../utils/authMiddleware'
import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * DELETE /api/funcionarios/[id]
 * Deleta um funcionário (apenas admin)
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do funcionário não fornecido'
    })
  }

  // SEGURANÇA: Apenas admins podem deletar funcionários
  let requestingUser
  try {
    requestingUser = await requireAdmin(event)
    console.log('🔒 Admin autenticado:', requestingUser.nome_completo, 'deletando funcionário ID:', id)
  } catch (error: any) {
    console.error('🔒 Erro de autorização:', error.message)
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado - Apenas administradores podem deletar funcionários'
    })
  }

  try {
    const supabase = serverSupabaseServiceRole(event)

    // Verificar se o funcionário existe
    const { data: funcionario, error: fetchError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .eq('id', id)
      .single()

    if (fetchError || !funcionario) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Funcionário não encontrado'
      })
    }

    // Deletar o funcionário
    const { error: deleteError } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('❌ Erro ao deletar funcionário:', deleteError)
      throw deleteError
    }

    console.log('✅ Funcionário deletado:', funcionario.nome_completo)

    return {
      success: true,
      message: `Funcionário ${funcionario.nome_completo} deletado com sucesso`
    }
  } catch (error: any) {
    console.error('❌ Erro:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao deletar funcionário'
    })
  }
})
