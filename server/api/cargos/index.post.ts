// API para criar ou atualizar cargo
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado criando/atualizando cargo:', requestingUser.nome_completo)
  
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  console.log('💼 Salvando cargo:', body)

  try {
    let response
    let url

    if (body.id) {
      // Atualizar cargo existente
      url = `${supabaseUrl}/rest/v1/cargos?id=eq.${body.id}`
      console.log('🔄 ATUALIZANDO cargo ID:', body.id)
      
      const { id, ...dadosSemId } = body
      
      response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dadosSemId)
      })
    } else {
      // Criar novo cargo
      url = `${supabaseUrl}/rest/v1/cargos`
      console.log('➕ CRIANDO novo cargo')
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      })
    }

    console.log('📊 Status da resposta:', response.status)

    const responseText = await response.text()
    console.log('📦 Resposta do Supabase:', responseText)

    if (!response.ok) {
      console.error('❌ Erro HTTP:', response.status, responseText)
      throw new Error(`Erro ao salvar cargo: ${response.status} - ${responseText}`)
    }

    const cargo = responseText ? JSON.parse(responseText) : null
    console.log('✅ Cargo salvo com sucesso!')
    
    return { 
      success: true, 
      message: body.id ? 'Cargo atualizado com sucesso!' : 'Cargo criado com sucesso!',
      data: Array.isArray(cargo) ? cargo[0] : cargo
    }
  } catch (error: any) {
    console.error('💥 Erro ao salvar cargo:', error.message)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao salvar cargo'
    })
  }
})
