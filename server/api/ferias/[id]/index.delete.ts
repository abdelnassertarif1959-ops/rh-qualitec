import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

// DELETE /api/ferias/[id] — Remove período de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAdmin(event)
    const supabase = serverSupabaseServiceRole(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' })

    // Buscar as férias para obter o holerite_id antes de deletar
    const { data: ferias, error: errGet } = await supabase
      .from('funcionario_ferias')
      .select('holerite_id')
      .eq('id', id)
      .maybeSingle()

    if (errGet) {
      console.error('[DELETE /api/ferias/[id]] Erro ao buscar férias:', errGet)
    }

    const holeriteId = ferias?.holerite_id

    // Deletar o registro de férias
    const { error: errDelete } = await supabase
      .from('funcionario_ferias')
      .delete()
      .eq('id', id)

    if (errDelete) throw createError({ statusCode: 500, statusMessage: errDelete.message })

    // Se houver holerite associado, excluí-lo também para evitar órfãos
    if (holeriteId) {
      console.log(`🗑️ [DELETE /api/ferias/[id]] Removendo holerite associado ID: ${holeriteId}`)
      const { error: errHolerite } = await supabase
        .from('holerites')
        .delete()
        .eq('id', holeriteId)
      
      if (errHolerite) {
        console.error(`❌ [DELETE /api/ferias/[id]] Erro ao remover holerite ${holeriteId}:`, errHolerite)
      } else {
        console.log(`✅ [DELETE /api/ferias/[id]] Holerite ${holeriteId} removido com sucesso`)
      }
    }

    return { success: true, message: 'Período de férias removido com sucesso' }
  } catch (error: any) {
    console.error('[DELETE /api/ferias/[id]] Erro:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao remover férias' })
  }
})
