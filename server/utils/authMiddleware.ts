import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventHandlerRequest, H3Event } from 'h3'
import { extractToken, verifyAccessToken } from './jwt'

export interface AuthenticatedUser {
  id: number
  nome_completo: string
  email_login: string
  tipo_acesso: 'admin' | 'funcionario'
  empresa_id: number
  status: string
}

/**
 * Middleware para verificar autenticação do usuário com JWT
 * Verifica se existe um token JWT válido e retorna os dados do usuário
 */
export async function requireAuth(event: H3Event<EventHandlerRequest>): Promise<AuthenticatedUser> {
  try {
    // Extrair token JWT do header ou cookie
    const token = extractToken(event)
    
    if (!token) {
      // Fallback: tentar cookie de sessão antigo (compatibilidade)
      const cookies = parseCookies(event)
      if (cookies.session) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(cookies.session))
          const userId = sessionData.userId
          
          // Buscar dados do usuário no banco (modo compatibilidade)
          const supabase = serverSupabaseServiceRole(event)
          const { data: user, error } = await supabase
            .from('funcionarios')
            .select('id, nome_completo, email_login, tipo_acesso, empresa_id, status')
            .eq('id', userId)
            .eq('status', 'ativo')
            .single()
          
          if (error || !user) {
            throw createError({
              statusCode: 401,
              statusMessage: 'Sessão inválida ou expirada'
            })
          }
          
          console.log('⚠️ [AUTH] Usando cookie de sessão antigo (migre para JWT)')
          return user as AuthenticatedUser
        } catch (error) {
          console.error('Erro ao parsear cookie de sessão:', error)
        }
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticação não fornecido'
      })
    }
    
    // Verificar e decodificar JWT
    const payload = verifyAccessToken(token)
    
    // Buscar dados atualizados do usuário no banco
    const supabase = serverSupabaseServiceRole(event)
    const { data: user, error } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, email_login, tipo_acesso, empresa_id, status')
      .eq('id', payload.userId)
      .eq('status', 'ativo')
      .single()
    
    if (error || !user) {
      console.error('Usuário não encontrado ou inativo:', error)
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não encontrado ou inativo'
      })
    }
    
    return user as AuthenticatedUser
    
  } catch (error: any) {
    console.error('Erro na autenticação:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Erro na autenticação'
    })
  }
}

/**
 * Middleware para verificar se o usuário é admin
 */
export async function requireAdmin(event: H3Event<EventHandlerRequest>): Promise<AuthenticatedUser> {
  const user = await requireAuth(event)
  
  if (user.tipo_acesso !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado - privilégios de administrador requeridos'
    })
  }
  
  return user
}

/**
 * Middleware para verificar se o usuário pode acessar dados de um funcionário específico
 * Admins podem acessar qualquer funcionário, funcionários só podem acessar seus próprios dados
 */
export async function requireOwnershipOrAdmin(
  event: H3Event<EventHandlerRequest>, 
  targetUserId: string | number
): Promise<AuthenticatedUser> {
  const user = await requireAuth(event)
  
  // Admin pode acessar qualquer usuário
  if (user.tipo_acesso === 'admin') {
    return user
  }
  
  // Funcionário só pode acessar seus próprios dados
  if (user.id.toString() !== targetUserId.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado - você só pode acessar seus próprios dados'
    })
  }
  
  return user
}

/**
 * Função para sanitizar dados do usuário removendo informações sensíveis
 */
export function sanitizeUserData(userData: any, requestingUser: AuthenticatedUser): any {
  if (!userData) return null
  
  // Criar cópia dos dados
  const sanitized = { ...userData }
  
  // SEMPRE remover campos sensíveis
  delete sanitized.senha
  delete sanitized.senha_hash
  
  // Se não é admin E não está vendo seus próprios dados, remover dados financeiros sensíveis
  const isViewingOwnData = userData.id === requestingUser.id
  if (requestingUser.tipo_acesso !== 'admin' && !isViewingOwnData) {
    delete sanitized.salario_base
    delete sanitized.banco
    delete sanitized.agencia
    delete sanitized.conta
    delete sanitized.chave_pix
  }
  
  return sanitized
}

/**
 * Função para criar cookie de sessão seguro
 */
export function createSessionCookie(userId: number, userType: string): string {
  const sessionData = {
    userId: userId.toString(),
    userType,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }
  
  return encodeURIComponent(JSON.stringify(sessionData))
}

/**
 * Função para validar se a sessão não expirou
 */
export function isSessionValid(sessionCookie: string): boolean {
  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie))
    return sessionData.expires > Date.now()
  } catch {
    return false
  }
}

/**
 * Função para setar cookie seguro com todas as opções de segurança
 */
export function setSecureCookie(event: H3Event<EventHandlerRequest>, name: string, value: string) {
  const config = useRuntimeConfig()
  
  setCookie(event, name, value, {
    httpOnly: config.cookieOptions.httpOnly,
    sameSite: config.cookieOptions.sameSite as 'lax' | 'strict' | 'none',
    secure: config.cookieOptions.secure,
    maxAge: config.cookieOptions.maxAge,
    path: config.cookieOptions.path
  })
  
  console.log(`[COOKIE] Cookie '${name}' definido com segurança (httpOnly: ${config.cookieOptions.httpOnly}, sameSite: ${config.cookieOptions.sameSite}, secure: ${config.cookieOptions.secure})`)
}

/**
 * Função para deletar cookie seguro
 */
export function deleteSecureCookie(event: H3Event<EventHandlerRequest>, name: string) {
  deleteCookie(event, name, {
    path: '/'
  })
  
  console.log(`[COOKIE] Cookie '${name}' removido`)
}