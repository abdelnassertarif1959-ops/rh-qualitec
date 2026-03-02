import { requireAdmin } from '../../utils/authMiddleware'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação ANTES de qualquer processamento
  let requestingUser
  try {
    requestingUser = await requireAdmin(event)
    console.log('[HOLERITES] Admin autenticado:', requestingUser.nome_completo)
  } catch (error: any) {
    console.error('[HOLERITES] Erro de autenticação:', error.message)
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado - Autenticação necessária'
    })
  }
  
  try {
    console.log('[HOLERITES] Iniciando busca de holerites...')
    
    // Obter parâmetros de filtro da query
    const query = getQuery(event)
    const { estilo, mes, status, incluir_todos_status } = query
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[HOLERITES] Cliente Supabase criado')
    console.log('[HOLERITES] Filtros aplicados:', { estilo, mes, status, incluir_todos_status })
    
    // Construir query com filtros
    let queryBuilder = supabase
      .from('holerites')
      .select(`
        *,
        funcionarios!inner (
          id,
          nome_completo,
          cpf,
          cargos (
            id,
            nome
          ),
          departamentos (
            id,
            nome
          ),
          empresas (
            id,
            nome,
            nome_fantasia
          )
        )
      `)
    
    // Aplicar filtros
    
    // Filtro por estilo (adiantamento/mensal)
    if (estilo) {
      if (estilo === 'adiantamento') {
        // Adiantamentos: período termina até dia 15
        queryBuilder = queryBuilder.lte('periodo_fim', new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0])
      } else if (estilo === 'mensal') {
        // Mensais: período termina após dia 15
        queryBuilder = queryBuilder.gt('periodo_fim', new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0])
      }
    }
    
    // Filtro por mês/ano - CORRIGIDO: usar último dia real do mês
    if (mes) {
      const [ano, mesNum] = mes.toString().split('-')
      const anoInt = parseInt(ano)
      const mesInt = parseInt(mesNum)
      
      // Calcular primeiro e último dia do mês corretamente
      const inicioMes = `${ano}-${mesNum.padStart(2, '0')}-01`
      
      // Usar new Date(ano, mes, 0) para obter o último dia real do mês
      // mes-1 porque Date usa índice 0-11 para meses, e 0 como dia retorna o último dia do mês anterior
      const ultimoDiaDoMes = new Date(anoInt, mesInt, 0).getDate()
      const fimMes = `${ano}-${mesNum.padStart(2, '0')}-${ultimoDiaDoMes.toString().padStart(2, '0')}`
      
      console.log('[HOLERITES] Filtro de data:', { inicioMes, fimMes, ultimoDiaDoMes })
      
      queryBuilder = queryBuilder
        .gte('periodo_inicio', inicioMes)
        .lte('periodo_fim', fimMes)
    }
    
    // Filtro por status - CORREÇÃO: Se incluir_todos_status for true, não filtrar por status
    if (status && !incluir_todos_status) {
      queryBuilder = queryBuilder.eq('status', status)
    }
    
    const { data: holerites, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('[HOLERITES] Erro na query:', error)
      throw error
    }
    
    console.log('[HOLERITES] Holerites encontrados:', holerites?.length || 0)
    
    // Transformar dados para o formato esperado pelo frontend
    const holeritesTratados = holerites?.map(h => ({
      ...h,
      funcionario: {
        id: h.funcionarios.id,
        nome_completo: h.funcionarios.nome_completo,
        cpf: h.funcionarios.cpf,
        cargo: h.funcionarios.cargos?.nome || 'Cargo não definido',
        empresa: h.funcionarios.empresas?.nome_fantasia || h.funcionarios.empresas?.nome || 'Empresa não definida'
      }
    })) || []
    
    console.log('[HOLERITES] Holerites tratados:', holeritesTratados.length)
    
    return holeritesTratados
    
  } catch (error: any) {
    console.error('[HOLERITES] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar holerites: ${error.message}`
    })
  }
})
