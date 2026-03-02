// API para listar todos os cargos
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado listando cargos:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)

    // Buscar cargos com contagem de funcionários
    const { data: cargos, error } = await supabase
      .from('cargos')
      .select(`
        *,
        funcionarios_count:funcionarios(count)
      `)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cargos:', error)
      throw error
    }

    // Transformar os dados para incluir a contagem
    const cargosComContagem = cargos?.map(cargo => ({
      ...cargo,
      funcionarios_count: cargo.funcionarios_count?.[0]?.count || 0
    })) || []

    return { 
      success: true, 
      data: cargosComContagem 
    }
  } catch (error: any) {
    console.error('Erro ao buscar cargos:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar cargos'
    })
  }
})
