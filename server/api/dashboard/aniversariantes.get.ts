import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    console.log('[ANIVERSARIANTES] Iniciando busca...')
    
    // SEGURANÇA: Verificar autenticação
    const requestingUser = await requireAuth(event)
    console.log('[ANIVERSARIANTES] Usuário autenticado:', requestingUser.nome_completo)
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[ANIVERSARIANTES] Cliente Supabase criado')
    
    const hoje = new Date()
    const mesAtual = hoje.getMonth() + 1 // getMonth() retorna 0-11
    
    console.log('[ANIVERSARIANTES] Buscando aniversariantes do mês:', mesAtual)
    
    const { data: aniversariantes, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        data_nascimento,
        avatar,
        cargos (
          id,
          nome
        ),
        departamentos (
          id,
          nome
        )
      `)
      .eq('status', 'ativo')
      .not('data_nascimento', 'is', null)
    
    if (error) {
      console.error('[ANIVERSARIANTES] Erro na query:', error)
      throw error
    }
    
    console.log('[ANIVERSARIANTES] Funcionários encontrados:', aniversariantes?.length || 0)
    
    // Filtrar aniversariantes do mês atual
    const aniversariantesMes = aniversariantes?.filter(funcionario => {
      if (!funcionario.data_nascimento) return false
      
      // CORRIGIDO: Usar split para evitar problemas de timezone
      const [ano, mes, dia] = funcionario.data_nascimento.split('-').map(Number)
      const dataNascimento = new Date(ano, mes - 1, dia)
      const mesNascimento = dataNascimento.getMonth() + 1
      
      return mesNascimento === mesAtual
    }).map(funcionario => ({
      ...funcionario,
      // CORRIGIDO: Usar split para evitar problemas de timezone
      dia: (() => {
        const [ano, mes, dia] = funcionario.data_nascimento.split('-').map(Number)
        return dia
      })(),
      cargo: funcionario.cargos?.nome || 'Cargo não definido',
      departamento: funcionario.departamentos?.nome || 'Departamento não definido'
    })) || []
    
    console.log('[ANIVERSARIANTES] Aniversariantes do mês:', aniversariantesMes.length)
    
    // Ordenar por dia do aniversário
    aniversariantesMes.sort((a, b) => {
      // CORRIGIDO: Usar split para evitar problemas de timezone
      const [anoA, mesA, diaA] = a.data_nascimento.split('-').map(Number)
      const [anoB, mesB, diaB] = b.data_nascimento.split('-').map(Number)
      return diaA - diaB
    })
    
    return aniversariantesMes
    
  } catch (error: any) {
    console.error('[ANIVERSARIANTES] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar aniversariantes: ${error.message}`
    })
  }
})
