// API para criar ou atualizar jornada de trabalho
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado criando/atualizando jornada:', requestingUser.nome_completo)
  
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  console.log('⏰ Salvando jornada:', JSON.stringify(body, null, 2))

  try {
    let jornadaId = body.id
    
    // 1. Salvar/atualizar a jornada principal
    if (jornadaId) {
      // Atualizar jornada existente
      console.log('🔄 ATUALIZANDO jornada ID:', jornadaId)
      const { id, horarios, ...dadosJornada } = body
      
      console.log('📝 Dados da jornada:', JSON.stringify(dadosJornada, null, 2))
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/jornadas_trabalho?id=eq.${jornadaId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(dadosJornada)
        }
      )

      console.log('📊 Status PATCH:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro ao atualizar:', errorText)
        throw new Error(`Erro ao atualizar jornada: ${errorText}`)
      }
    } else {
      // Criar nova jornada
      console.log('➕ CRIANDO nova jornada')
      const { horarios, ...dadosJornada } = body
      
      console.log('📝 Dados da jornada:', JSON.stringify(dadosJornada, null, 2))
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/jornadas_trabalho`,
        {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(dadosJornada)
        }
      )

      console.log('📊 Status POST:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro ao criar:', errorText)
        throw new Error(`Erro ao criar jornada: ${errorText}`)
      }

      const jornadas = await response.json()
      console.log('📦 Jornada criada:', jornadas)
      jornadaId = jornadas[0].id
      console.log('🆔 ID da jornada criada:', jornadaId)
    }

    // 2. Salvar horários (se fornecidos)
    if (body.horarios && Array.isArray(body.horarios)) {
      // Deletar horários antigos
      await fetch(
        `${supabaseUrl}/rest/v1/jornada_horarios?jornada_id=eq.${jornadaId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          }
        }
      )

      // Inserir novos horários
      const horariosParaSalvar = body.horarios.map((h: any) => ({
        jornada_id: jornadaId,
        dia_semana: h.dia_semana,
        entrada: h.entrada,
        saida: h.saida,
        intervalo_inicio: h.intervalo_inicio,
        intervalo_fim: h.intervalo_fim,
        horas_brutas: h.horas_brutas,
        horas_intervalo: h.horas_intervalo,
        horas_liquidas: h.horas_liquidas,
        trabalha: h.trabalha
      }))

      await fetch(
        `${supabaseUrl}/rest/v1/jornada_horarios`,
        {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(horariosParaSalvar)
        }
      )
    }

    console.log('✅ Jornada salva com sucesso!')

    return {
      success: true,
      message: body.id ? 'Jornada atualizada com sucesso!' : 'Jornada criada com sucesso!',
      data: { id: jornadaId }
    }
  } catch (error: any) {
    console.error('💥 Erro ao salvar jornada:', error.message)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao salvar jornada'
    })
  }
})
