// GET /api/avisos/[id]/comentarios - Listar comentários de um aviso
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    await requireAuth(event)
    
    const avisoId = event.context.params?.id

    if (!avisoId) {
      throw createError({
        statusCode: 400,
        message: 'ID do aviso não fornecido'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Buscar comentários com informações do autor
    const { data: comentarios, error } = await supabase
      .from('avisos_comentarios')
      .select(`
        *,
        autor:funcionarios!avisos_comentarios_funcionario_id_fkey(
          id,
          nome_completo,
          avatar,
          tipo_acesso
        )
      `)
      .eq('aviso_id', avisoId)
      .order('criado_em', { ascending: true })

    if (error) {
      console.error('Erro ao buscar comentários:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar comentários'
      })
    }

    return {
      success: true,
      comentarios: comentarios || []
    }
  } catch (error: any) {
    console.error('Erro ao listar comentários:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao listar comentários'
    })
  }
})
