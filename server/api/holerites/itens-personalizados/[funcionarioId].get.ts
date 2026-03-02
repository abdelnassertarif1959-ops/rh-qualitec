import { serverSupabaseServiceRole } from '#supabase/server'
import { requireOwnershipOrAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const funcionarioId = getRouterParam(event, 'funcionarioId')
  
  // SEGURANÇA: Verificar ownership ou admin
  const requestingUser = await requireOwnershipOrAdmin(event, funcionarioId!)
  console.log('[API] Acesso autorizado para itens personalizados:', requestingUser.nome_completo)
  
  const supabase = serverSupabaseServiceRole(event)

  try {
    const { data, error } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', funcionarioId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar itens personalizados:', error)
      
      // Se a tabela não existe, retornar array vazio ao invés de erro
      if (error.code === 'PGRST205' || error.code === '42P01') {
        return { 
          success: true, 
          data: [],
          warning: 'Tabela holerite_itens_personalizados não existe. Execute o SQL de criação.'
        }
      }
      
      throw error
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error('Erro ao buscar itens personalizados:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar itens personalizados'
    })
  }
})
