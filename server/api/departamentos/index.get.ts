// API para listar departamentos
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado listando departamentos:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)

    // Buscar departamentos com contagem de funcionários
    const { data: departamentos, error } = await supabase
      .from('departamentos')
      .select(`
        *,
        funcionarios_count:funcionarios(count)
      `)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar departamentos:', error)
      throw error
    }

    // Transformar os dados para incluir a contagem
    const departamentosComContagem = departamentos?.map(dept => ({
      ...dept,
      funcionarios_count: dept.funcionarios_count?.[0]?.count || 0
    })) || []

    return {
      success: true,
      data: departamentosComContagem
    }
  } catch (error: any) {
    console.error('Erro ao buscar departamentos:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar departamentos'
    })
  }
})
