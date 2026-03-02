export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Token de autenticação não fornecido'
    })
  }

  const token = authHeader.substring(7)
  
  // Aqui você implementaria a validação do JWT
  // Por enquanto, vamos usar uma validação simples
  
  try {
    // Em produção, use JWT
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

    // Validar se o usuário ainda existe e está ativo
    const url = `${supabaseUrl}/rest/v1/funcionarios?id=eq.${token}&status=eq.ativo&select=id,nome_completo,email_login,tipo_acesso`
    
    const response = await fetch(url, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    const funcionarios = await response.json()

    if (!response.ok || !funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 401,
        message: 'Token inválido'
      })
    }

    return {
      valid: true,
      user: funcionarios[0]
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token inválido'
    })
  }
})