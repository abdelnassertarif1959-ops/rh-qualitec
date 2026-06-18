// API para deletar empresa
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem deletar empresas
  const requestingUser = await requireAdmin(event)
  console.log('🗑️ [DELETAR-EMPRESA] Admin autenticado:', requestingUser.nome_completo)
  
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  console.log('🗑️ Deletando empresa ID:', id)

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erro ao deletar:', error)
      throw createError({
        statusCode: response.status,
        message: 'Erro ao deletar empresa'
      })
    }

    console.log('✅ Empresa deletada com sucesso!')

    return { 
      success: true, 
      message: 'Empresa deletada com sucesso!' 
    }
  } catch (error: any) {
    console.error('💥 Erro ao deletar empresa:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao deletar empresa'
    })
  }
})
