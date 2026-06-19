import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado consultando meses disponíveis:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)

    // Buscar todos os períodos únicos de holerites
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('periodo_inicio, periodo_fim')
      .order('periodo_inicio', { ascending: false })

    if (error) {
      console.error('Erro ao buscar holerites:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar holerites do banco'
      })
    }

    // Extrair meses únicos no formato YYYY-MM (usando split para evitar problemas de timezone)
    const mesesSet = new Set<string>()
    
    holerites?.forEach(holerite => {
      if (holerite.periodo_inicio) {
        const parts = holerite.periodo_inicio.split('-')
        if (parts.length >= 2) {
          const mesAno = `${parts[0]}-${parts[1]}`
          mesesSet.add(mesAno)
        }
      }
    })

    // Converter Set para Array e ordenar (mais recente primeiro)
    const meses = Array.from(mesesSet).sort((a, b) => b.localeCompare(a))

    return {
      success: true,
      meses
    }
  } catch (error: any) {
    console.error('Erro ao buscar meses disponíveis:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar meses disponíveis'
    })
  }
})
