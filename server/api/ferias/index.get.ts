import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

// GET /api/ferias — Lista todos os períodos de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAuth(event)
    const supabase = serverSupabaseServiceRole(event)
    const query = getQuery(event)

    let funcionarioId = query.funcionario_id ? Number(query.funcionario_id) : null
    
    // Se não for admin, só pode listar as próprias férias
    if (requestingUser.tipo_acesso !== 'admin') {
      funcionarioId = requestingUser.id
    }
    const status = query.status as string | null
    const ano = query.ano ? Number(query.ano) : null

    let dbQuery = supabase
      .from('funcionario_ferias')
      .select(`
        *,
        funcionarios (
          id,
          nome_completo,
          salario_base,
          data_admissao,
          numero_dependentes,
          cargo_id,
          departamento_id,
          cargos ( nome ),
          departamentos ( nome )
        )
      `)
      .order('data_inicio', { ascending: false })

    if (funcionarioId) {
      dbQuery = dbQuery.eq('funcionario_id', funcionarioId)
    }

    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }

    if (ano) {
      // Filtrar por ano do início das férias
      dbQuery = dbQuery
        .gte('data_inicio', `${ano}-01-01`)
        .lte('data_inicio', `${ano}-12-31`)
    }

    const { data, error } = await dbQuery

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('[GET /api/ferias] Erro:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro ao listar férias',
    })
  }
})
