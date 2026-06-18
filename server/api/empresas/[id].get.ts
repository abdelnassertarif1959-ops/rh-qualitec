// API para buscar uma empresa por ID
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('🏢 [BUSCAR-EMPRESA] Usuário autenticado:', requestingUser.nome_completo)
  
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar empresa')
    }

    const empresas = await response.json()
    
    if (!empresas || empresas.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Empresa não encontrada'
      })
    }

    return { success: true, data: empresas[0] }
  } catch (error: any) {
    console.error('Erro ao buscar empresa:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar empresa'
    })
  }
})
