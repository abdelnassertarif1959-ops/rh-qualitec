import type { EventHandlerRequest, H3Event } from 'h3'

/**
 * Middleware para proteger APIs de cron jobs
 * Verifica se a requisição vem de um serviço de cron autorizado
 * usando um token secreto ou verificando o IP de origem
 */
export async function requireCronAuth(event: H3Event<EventHandlerRequest>): Promise<void> {
  try {
    // 1. Verificar token de autorização
    const authHeader = getHeader(event, 'authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Se há um CRON_SECRET configurado, validar o token
    if (cronSecret) {
      if (!authHeader) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token de autorização não fornecido'
        })
      }
      
      const token = authHeader.replace('Bearer ', '')
      
      if (token !== cronSecret) {
        console.error('[CRON] Token inválido fornecido')
        throw createError({
          statusCode: 401,
          statusMessage: 'Token de autorização inválido'
        })
      }
      
      console.log('[CRON] Autenticação por token bem-sucedida')
      return
    }
    
    // 2. Se não há CRON_SECRET, verificar se é ambiente de desenvolvimento
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      console.warn('[CRON] Executando em modo desenvolvimento - autenticação relaxada')
      return
    }
    
    // 3. Em produção sem CRON_SECRET, verificar IPs permitidos (Vercel Cron)
    const forwardedFor = getHeader(event, 'x-forwarded-for')
    const realIp = getHeader(event, 'x-real-ip')
    const clientIp = forwardedFor?.split(',')[0].trim() || realIp
    
    // IPs da Vercel para Cron Jobs (podem variar)
    const vercelCronIPs = [
      '76.76.21.0/24',
      '76.76.21.21',
      '76.76.21.22',
      '76.76.21.23',
      '76.76.21.98',
      '76.76.21.99',
      '76.76.21.100',
      '76.76.21.164',
      '76.76.21.165',
      '76.76.21.166'
    ]
    
    // Verificar se o IP está na lista permitida
    const isVercelCron = vercelCronIPs.some(allowedIp => {
      if (allowedIp.includes('/')) {
        // Verificação de range CIDR (simplificada)
        const [network] = allowedIp.split('/')
        return clientIp?.startsWith(network.substring(0, network.lastIndexOf('.')))
      }
      return clientIp === allowedIp
    })
    
    if (isVercelCron) {
      console.log('[CRON] Autenticação por IP Vercel bem-sucedida:', clientIp)
      return
    }
    
    // Se chegou aqui, não está autorizado
    console.error('[CRON] Acesso negado - IP não autorizado:', clientIp)
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado - configure CRON_SECRET nas variáveis de ambiente'
    })
    
  } catch (error: any) {
    console.error('[CRON] Erro na autenticação:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Erro na autenticação do cron job'
    })
  }
}

/**
 * Função auxiliar para verificar se uma requisição é de um cron job válido
 * Retorna true se autorizado, false caso contrário
 */
export function isCronAuthorized(event: H3Event<EventHandlerRequest>): boolean {
  try {
    const authHeader = getHeader(event, 'authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader) {
      const token = authHeader.replace('Bearer ', '')
      return token === cronSecret
    }
    
    return process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}
