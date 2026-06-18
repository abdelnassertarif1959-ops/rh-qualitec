import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado consultando contador diário:', requestingUser.nome_completo)
  
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = Math.min(parseInt(query.limit as string) || 50, 100)
    const offset = (page - 1) * limit

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuração do Supabase não encontrada'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Buscar registros com paginação
    const { data: registros, error: errorRegistros } = await supabase
      .from('contador_diario')
      .select('id, numero, data_criacao')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)

    if (errorRegistros) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao consultar registros'
      })
    }

    // Contar total para paginação
    const { count, error: errorCount } = await supabase
      .from('contador_diario')
      .select('*', { count: 'exact', head: true })

    if (errorCount) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao contar registros'
      })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      success: true,
      data: {
        registros: registros || [],
        paginacao: {
          pagina_atual: page,
          total_paginas: totalPages,
          total_registros: count || 0,
          registros_por_pagina: limit
        }
      }
    }

  } catch (error) {
    console.error('Erro ao listar contador diário:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})