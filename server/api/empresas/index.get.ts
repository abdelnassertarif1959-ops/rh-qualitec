// API para listar todas as empresas
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('🏢 [LISTAR-EMPRESAS] Usuário autenticado:', requestingUser.nome_completo)
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?select=*&order=nome.asc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar empresas')
    }

    const empresas = await response.json()
    return { success: true, data: empresas }
  } catch (error: any) {
    console.error('Erro ao buscar empresas:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar empresas'
    })
  }
})
