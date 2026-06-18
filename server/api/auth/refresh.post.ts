/**
 * API para renovar access token usando refresh token
 * POST /api/auth/refresh
 */

import { serverSupabaseServiceRole } from '#supabase/server'
import { verifyRefreshToken, generateTokenPair, setTokenCookies } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Extrair refresh token do cookie ou body
    const cookies = parseCookies(event)
    const body = await readBody(event).catch(() => ({}))
    
    const refreshToken = body.refreshToken || cookies.refreshToken
    
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token não fornecido'
      })
    }
    
    // Verificar refresh token
    const payload = verifyRefreshToken(refreshToken)
    
    // Buscar dados atualizados do usuário
    const supabase = serverSupabaseServiceRole(event)
    const { data: user, error } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, email_login, tipo_acesso, empresa_id, status')
      .eq('id', payload.userId)
      .eq('status', 'ativo')
      .single()
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não encontrado ou inativo'
      })
    }
    
    // Gerar novo par de tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email_login,
      tipo: user.tipo_acesso,
      empresa_id: user.empresa_id
    })
    
    // Definir novos tokens em cookies
    setTokenCookies(event, tokens)
    
    console.log(`🔄 [REFRESH] Tokens renovados para usuário ${user.id}`)
    
    return {
      success: true,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: {
        id: user.id,
        nome: user.nome_completo,
        email: user.email_login,
        tipo: user.tipo_acesso
      }
    }
    
  } catch (error: any) {
    console.error('Erro ao renovar token:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Erro ao renovar token'
    })
  }
})
