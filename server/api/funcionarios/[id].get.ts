import { requireOwnershipOrAdmin, sanitizeUserData } from '../../utils/authMiddleware'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  console.log('🔍 [API] GET /api/funcionarios/[id] - Iniciando busca')
  
  try {
    const id = getRouterParam(event, 'id')

    console.log('📋 [API] ID recebido:', id)

    if (!id) {
      console.error('❌ [API] ID do funcionário não fornecido')
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do funcionário não fornecido'
      })
    }

    // SEGURANÇA: Verificar autenticação e autorização
    const requestingUser = await requireOwnershipOrAdmin(event, id)
    console.log('🔒 [API] Usuário autenticado:', requestingUser.nome_completo, 'acessando dados do ID:', id)

    const supabase = serverSupabaseServiceRole(event)

    console.log('🔍 [API] Buscando funcionário no Supabase...')
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ [API] Erro do Supabase:', error)
      throw error
    }

    if (!funcionario) {
      console.error('❌ [API] Funcionário não encontrado para ID:', id)
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    console.log('✅ [API] Funcionário encontrado:', {
      id: funcionario.id,
      nome: funcionario.nome_completo,
      beneficios: funcionario.beneficios ? 'Existe' : 'Null',
      beneficiosType: typeof funcionario.beneficios,
      keys: Object.keys(funcionario)
    })

    // SEGURANÇA: Sanitizar dados antes de retornar
    const dadosSanitizados = sanitizeUserData(funcionario, requestingUser)
    console.log('🔒 [API] Dados sanitizados - campos sensíveis removidos')

    return dadosSanitizados

  } catch (error: any) {
    console.error('❌ [API] Erro geral:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar funcionário'
    })
  }
})
