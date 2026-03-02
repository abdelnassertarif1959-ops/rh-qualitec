import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é admin
    const user = await requireAdmin(event)
    
    console.log('🟢 [API-AVISOS] === INÍCIO POST AVISO ===')
    
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    const { titulo, descricao, criado_por } = body

    console.log('🟢 [API-AVISOS] Body recebido:', {
      titulo,
      descricao: descricao?.substring(0, 50) + '...',
      criado_por
    })

    // Validações
    if (!titulo || titulo.trim().length === 0) {
      console.error('❌ [API-AVISOS] Título vazio')
      throw createError({
        statusCode: 400,
        message: 'Título é obrigatório'
      })
    }

    if (titulo.length > 200) {
      console.error('❌ [API-AVISOS] Título muito longo')
      throw createError({
        statusCode: 400,
        message: 'Título deve ter no máximo 200 caracteres'
      })
    }

    if (!descricao || descricao.trim().length === 0) {
      console.error('❌ [API-AVISOS] Descrição vazia')
      throw createError({
        statusCode: 400,
        message: 'Descrição é obrigatória'
      })
    }

    if (!criado_por) {
      console.error('❌ [API-AVISOS] ID do criador não fornecido')
      throw createError({
        statusCode: 400,
        message: 'ID do criador é obrigatório'
      })
    }

    console.log('🟢 [API-AVISOS] Verificando se usuário é admin...')
    console.log('🟢 [API-AVISOS] criado_por:', criado_por)

    // Verificar se o usuário é admin
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select('tipo_acesso')
      .eq('id', criado_por)
      .single()

    console.log('🟢 [API-AVISOS] Resultado da busca do funcionário:', {
      funcionario,
      funcError,
      tipo_acesso: funcionario?.tipo_acesso
    })

    if (funcError) {
      console.error('❌ [API-AVISOS] Erro ao buscar funcionário:', funcError)
      throw createError({
        statusCode: 500,
        message: 'Erro ao verificar permissões do usuário'
      })
    }

    if (!funcionario) {
      console.error('❌ [API-AVISOS] Funcionário não encontrado')
      throw createError({
        statusCode: 404,
        message: 'Usuário não encontrado'
      })
    }

    if (funcionario.tipo_acesso !== 'admin') {
      console.error('❌ [API-AVISOS] Usuário não é admin:', funcionario.tipo_acesso)
      throw createError({
        statusCode: 403,
        message: 'Apenas administradores podem criar avisos'
      })
    }

    console.log('✅ [API-AVISOS] Usuário é admin, criando aviso...')

    // Criar aviso
    const { data: aviso, error } = await supabase
      .from('avisos')
      .insert({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        criado_por
      })
      .select(`
        *,
        criador:funcionarios!avisos_criado_por_fkey(
          id,
          nome_completo,
          avatar
        )
      `)
      .single()

    if (error) {
      console.error('❌ [API-AVISOS] Erro ao criar aviso no banco:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar aviso'
      })
    }

    console.log('✅ [API-AVISOS] Aviso criado com sucesso:', aviso)
    console.log('🟢 [API-AVISOS] === FIM POST AVISO ===')

    return {
      ...aviso,
      total_comentarios: 0
    }
  } catch (error: any) {
    console.error('❌ [API-AVISOS] Erro geral:', error)
    console.error('❌ [API-AVISOS] Stack:', error.stack)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar aviso'
    })
  }
})
