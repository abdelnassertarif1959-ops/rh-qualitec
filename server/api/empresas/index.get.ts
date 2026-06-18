// API para listar todas as empresas
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const requestingUser = await requireAuth(event)
  console.log('🏢 [LISTAR-EMPRESAS] Usuário autenticado:', requestingUser.nome_completo)

  const supabase = serverSupabaseServiceRole(event)

  try {
    // Buscar empresas
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')
      .order('nome', { ascending: true })

    if (error) throw error

    // Buscar contagem de funcionários ativos por empresa
    const { data: funcCounts } = await supabase
      .from('funcionarios')
      .select('empresa_id')
      .eq('status', 'ativo')

    // Montar mapa de contagem
    const contagemMap: Record<number, number> = {}
    funcCounts?.forEach((f: any) => {
      contagemMap[f.empresa_id] = (contagemMap[f.empresa_id] || 0) + 1
    })

    // Adicionar funcionarios_count em cada empresa
    const empresasComContagem = (empresas || []).map((emp: any) => ({
      ...emp,
      funcionarios_count: contagemMap[emp.id] || 0
    }))

    return { success: true, data: empresasComContagem }
  } catch (error: any) {
    console.error('Erro ao buscar empresas:', error)
    throw createError({ statusCode: 500, message: 'Erro ao buscar empresas' })
  }
})
