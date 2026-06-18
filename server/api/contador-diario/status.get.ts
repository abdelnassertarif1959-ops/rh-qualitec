import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado consultando status do contador:', requestingUser.nome_completo)
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuração do Supabase não encontrada'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Buscar estatísticas do contador
    const { data: ultimoRegistro, error: errorUltimo } = await supabase
      .from('contador_diario')
      .select('numero, data_criacao')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (errorUltimo && errorUltimo.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao consultar contador'
      })
    }

    // Contar total de registros
    const { count, error: errorCount } = await supabase
      .from('contador_diario')
      .select('*', { count: 'exact', head: true })

    if (errorCount) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao contar registros'
      })
    }

    // Calcular estatísticas
    const dataLimite = new Date('2078-12-31')
    const hoje = new Date()
    const diasRestantes = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    const ativo = hoje < dataLimite

    const stats = {
      ativo,
      numero_atual: ultimoRegistro?.numero || 0,
      total_registros: count || 0,
      ultimo_incremento: ultimoRegistro?.data_criacao || null,
      dias_restantes: diasRestantes,
      data_limite: '2078-12-31',
      progresso_percentual: ultimoRegistro?.numero ? 
        ((ultimoRegistro.numero / (diasRestantes + (ultimoRegistro.numero || 0))) * 100).toFixed(2) : 
        '0.00'
    }

    return {
      success: true,
      data: stats
    }

  } catch (error) {
    console.error('Erro ao consultar status do contador:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})