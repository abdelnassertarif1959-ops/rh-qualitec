// API para listar todas as jornadas de trabalho
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado listando jornadas:', requestingUser.nome_completo)
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  try {
    // Buscar jornadas
    const response = await fetch(
      `${supabaseUrl}/rest/v1/jornadas_trabalho?select=*&order=nome.asc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar jornadas')
    }

    const jornadas = await response.json()

    // Para cada jornada, buscar os horários
    const jornadasComHorarios = await Promise.all(
      jornadas.map(async (jornada: any) => {
        const horariosResponse = await fetch(
          `${supabaseUrl}/rest/v1/jornada_horarios?jornada_id=eq.${jornada.id}&select=*&order=dia_semana.asc`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const horarios = horariosResponse.ok ? await horariosResponse.json() : []
        
        return {
          ...jornada,
          horarios
        }
      })
    )

    return { success: true, data: jornadasComHorarios }
  } catch (error: any) {
    console.error('Erro ao buscar jornadas:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar jornadas'
    })
  }
})
