import { requireOwnershipOrAdmin, sanitizeUserData } from '../../utils/authMiddleware'
import { serverSupabaseServiceRole } from '#supabase/server'

// API para buscar dados do funcionário logado (com autenticação e autorização)
export default defineEventHandler(async (event) => {
  try {
    // Pegar ID do usuário do query parameter
    const query = getQuery(event)
    const targetUserId = query.userId

    if (!targetUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do usuário é obrigatório'
      })
    }

    // Verificar autenticação e autorização
    const requestingUser = await requireOwnershipOrAdmin(event, targetUserId)
    
    console.log('🔍 Usuário autenticado:', requestingUser.nome_completo, 'buscando dados do ID:', targetUserId)

    // Buscar dados do funcionário
    const supabase = serverSupabaseServiceRole(event)
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        empresas (
          id,
          nome,
          nome_fantasia,
          cnpj
        )
      `)
      .eq('id', targetUserId)
      .single()

    if (error || !funcionario) {
      console.error('❌ Erro ao buscar funcionário:', error)
      throw createError({
        statusCode: 404,
        statusMessage: 'Funcionário não encontrado'
      })
    }

    // Sanitizar dados removendo informações sensíveis
    const sanitizedData = sanitizeUserData(funcionario, requestingUser)
    
    console.log('✅ Dados do funcionário encontrados:', funcionario.nome_completo)
    console.log('🔒 Dados sanitizados - campos sensíveis removidos')
    
    return {
      success: true,
      data: sanitizedData
    }

  } catch (error: any) {
    console.error('💥 Erro ao buscar dados:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor'
    })
  }
})
