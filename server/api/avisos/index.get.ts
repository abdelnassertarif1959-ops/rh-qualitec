// GET /api/avisos - Listar todos os avisos ativos
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    await requireAuth(event)
    
    const supabase = serverSupabaseServiceRole(event)

    // Buscar avisos ativos com informações do criador
    const { data: avisos, error } = await supabase
      .from('avisos')
      .select(`
        *,
        criador:funcionarios!avisos_criado_por_fkey(
          id,
          nome_completo,
          avatar
        )
      `)
      .eq('ativo', true)
      .order('criado_em', { ascending: false })

    if (error) {
      console.error('Erro ao buscar avisos:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar avisos'
      })
    }

    return {
      success: true,
      avisos: avisos || []
    }
  } catch (error: any) {
    console.error('Erro ao listar avisos:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao listar avisos'
    })
  }
})
