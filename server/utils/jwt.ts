/**
 * Utilitário JWT para autenticação
 * Implementa geração, validação e refresh de tokens JWT
 */

import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JWTPayload {
  userId: number
  email: string
  tipo: 'admin' | 'funcionario'
  empresa_id: number
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Gerar par de tokens (access + refresh)
 */
export function generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret
  const jwtRefreshSecret = config.jwtRefreshSecret
  
  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error('JWT secrets não configurados')
  }
  
  // Access token - expira em 15 minutos
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '15m',
    issuer: 'qualitec-rh',
    audience: 'qualitec-rh-api'
  })
  
  // Refresh token - expira em 7 dias
  const refreshToken = jwt.sign(
    { userId: payload.userId, tipo: payload.tipo },
    jwtRefreshSecret,
    {
      expiresIn: '7d',
      issuer: 'qualitec-rh',
      audience: 'qualitec-rh-api'
    }
  )
  
  return { accessToken, refreshToken }
}

/**
 * Verificar e decodificar access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret
  
  if (!jwtSecret) {
    throw new Error('JWT secret não configurado')
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: 'qualitec-rh',
      audience: 'qualitec-rh-api'
    }) as JWTPayload
    
    return decoded
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token expirado'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token inválido'
      })
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Erro ao verificar token'
    })
  }
}

/**
 * Verificar e decodificar refresh token
 */
export function verifyRefreshToken(token: string): { userId: number; tipo: string } {
  const config = useRuntimeConfig()
  const jwtRefreshSecret = config.jwtRefreshSecret
  
  if (!jwtRefreshSecret) {
    throw new Error('JWT refresh secret não configurado')
  }
  
  try {
    const decoded = jwt.verify(token, jwtRefreshSecret, {
      issuer: 'qualitec-rh',
      audience: 'qualitec-rh-api'
    }) as { userId: number; tipo: string }
    
    return decoded
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token expirado'
      })
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token inválido'
    })
  }
}

/**
 * Extrair token do header Authorization
 */
export function extractTokenFromHeader(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    return null
  }
  
  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ')
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * Extrair token do cookie (fallback para compatibilidade)
 */
export function extractTokenFromCookie(event: H3Event): string | null {
  const cookies = parseCookies(event)
  return cookies.accessToken || null
}

/**
 * Extrair token do request (header ou cookie)
 */
export function extractToken(event: H3Event): string | null {
  // Prioridade: Header Authorization > Cookie
  return extractTokenFromHeader(event) || extractTokenFromCookie(event)
}

/**
 * Setar tokens em cookies seguros
 */
export function setTokenCookies(event: H3Event, tokens: TokenPair) {
  const config = useRuntimeConfig()
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Access token - 15 minutos
  setCookie(event, 'accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutos
    path: '/'
  })
  
  // Refresh token - 7 dias
  setCookie(event, 'refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    path: '/'
  })
  
  console.log('🔐 [JWT] Tokens definidos em cookies seguros')
}

/**
 * Remover tokens dos cookies
 */
export function clearTokenCookies(event: H3Event) {
  deleteCookie(event, 'accessToken', { path: '/' })
  deleteCookie(event, 'refreshToken', { path: '/' })
  
  // Remover cookie de sessão antigo (compatibilidade)
  deleteCookie(event, 'session', { path: '/' })
  
  console.log('🔐 [JWT] Tokens removidos dos cookies')
}

/**
 * Decodificar token sem verificar (útil para debug)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Verificar se token está próximo de expirar (menos de 5 minutos)
 */
export function isTokenExpiringSoon(token: string): boolean {
  const decoded = decodeToken(token)
  
  if (!decoded || !decoded.exp) {
    return true
  }
  
  const now = Math.floor(Date.now() / 1000)
  const timeUntilExpiry = decoded.exp - now
  
  // Retorna true se falta menos de 5 minutos
  return timeUntilExpiry < 5 * 60
}
