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
    
    // Filtro por mês/ano - usa data_pagamento para que folhas mensais
    // apareçam no mês em que foram pagas (ex: pago em 05/06 → filtro de junho),
    // independente do mês de competência (periodo_inicio)
    if (mes) {
      const [ano, mesNum] = mes.toString().split('-')
      const anoInt = parseInt(ano)
      const mesInt = parseInt(mesNum)
      
      // Calcular primeiro e último dia do mês de pagamento
      const inicioMes = `${ano}-${mesNum.padStart(2, '0')}-01`
      const ultimoDiaDoMes = new Date(anoInt, mesInt, 0).getDate()
      const fimMes = `${ano}-${mesNum.padStart(2, '0')}-${ultimoDiaDoMes.toString().padStart(2, '0')}`
      
      console.log('[HOLERITES] Filtro de data_pagamento:', { inicioMes, fimMes })
      
      queryBuilder = queryBuilder
        .gte('data_pagamento', inicioMes)
        .lte('data_pagamento', fimMes)
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
    let holeritesTratados = holerites?.map(h => ({
      ...h,
      funcionario: {
        id: h.funcionarios.id,
        nome_completo: h.funcionarios.nome_completo,
        cpf: h.funcionarios.cpf,
        cargo: h.funcionarios.cargos?.nome || 'Cargo não definido',
        empresa: h.funcionarios.empresas?.nome_fantasia || h.funcionarios.empresas?.nome || 'Empresa não definida'
      }
    })) || []

    // Filtro por estilo aplicado no JS
    // Adiantamento: observacoes começa com "Adiantamento"
    // Férias: observacoes começa com "Recibo de Férias"
    // Mensal: todo o restante (não começa com "Adiantamento" e nem com "Recibo de Férias")
    if (estilo === 'adiantamento') {
      holeritesTratados = holeritesTratados.filter(h => {
        return h.observacoes?.startsWith('Adiantamento')
      })
    } else if (estilo === 'ferias') {
      holeritesTratados = holeritesTratados.filter(h => {
        return h.observacoes?.startsWith('Recibo de Férias')
      })
    } else if (estilo === 'mensal') {
      holeritesTratados = holeritesTratados.filter(h => {
        return !h.observacoes?.startsWith('Adiantamento') && !h.observacoes?.startsWith('Recibo de Férias')
      })
    }
    
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
