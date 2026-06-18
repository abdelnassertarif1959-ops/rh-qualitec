import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

/**
 * API para criar nova notificação
 * POST /api/notificacoes/criar
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado criando notificação:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)

    const {
      titulo,
      mensagem,
      tipo = 'info',
      origem = 'sistema',
      dados = {},
      importante = false,
      acao_url,
      data_expiracao
    } = body

    // Validações
    if (!titulo || !mensagem) {
      throw createError({
        statusCode: 400,
        message: 'Título e mensagem são obrigatórios'
      })
    }

    console.log('📬 [CRIAR-NOTIFICACAO] Criando nova notificação...')
    console.log('📋 Dados:', { titulo, tipo, origem, importante })

    // Criar notificação
    const { data: notificacao, error } = await supabase
      .from('notificacoes')
      .insert({
        titulo,
        mensagem,
        tipo,
        origem,
        dados,
        importante,
        acao_url,
        data_expiracao: data_expiracao ? new Date(data_expiracao).toISOString() : null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar notificação:', error)
      throw error
    }

    console.log(`✅ Notificação criada: ${notificacao.id}`)

    return {
      success: true,
      message: 'Notificação criada com sucesso',
      notificacao: notificacao
    }

  } catch (error: any) {
    console.error('💥 Erro ao criar notificação:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar notificação'
    })
  }
})