import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem acessar esta API de debug
  const requestingUser = await requireAdmin(event)
  console.log('🔍 [DEBUG-VARIAVEIS] Admin autenticado:', requestingUser.nome_completo)
  
  const config = useRuntimeConfig()
  
  console.log('🔍 [DEBUG-VARIAVEIS] === VERIFICAÇÃO DE CONFIGURAÇÕES ===')
  console.log('🔍 [DEBUG-VARIAVEIS] Timestamp:', new Date().toISOString())
  console.log('🔍 [DEBUG-VARIAVEIS] Environment:', process.env.NODE_ENV)
  console.log('🔍 [DEBUG-VARIAVEIS] Vercel URL:', process.env.VERCEL_URL)
  
  // Verificar todas as variáveis importantes
  const variaveis = {
    // Ambiente
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
    VERCEL_URL: process.env.VERCEL_URL || 'MISSING',
    ENVIRONMENT: process.env.ENVIRONMENT || 'MISSING',
    
    // Supabase - URLs
    SUPABASE_URL: process.env.SUPABASE_URL ? 'PRESENTE' : 'MISSING',
    NUXT_PUBLIC_SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL ? 'PRESENTE' : 'MISSING',
    
    // Supabase - Chaves
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENTE' : 'MISSING',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'PRESENTE' : 'MISSING',
    NUXT_PUBLIC_SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY ? 'PRESENTE' : 'MISSING',
    
    // Runtime Config
    'config.public.supabaseUrl': config.public.supabaseUrl ? 'PRESENTE' : 'MISSING',
    'config.public.supabaseKey': config.public.supabaseKey ? 'PRESENTE' : 'MISSING',
    'config.supabaseServiceRoleKey': config.supabaseServiceRoleKey ? 'PRESENTE' : 'MISSING',
    
    // Email
    GMAIL_EMAIL: process.env.GMAIL_EMAIL ? 'PRESENTE' : 'MISSING',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'PRESENTE' : 'MISSING',
    
    // Segurança
    NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY ? 'PRESENTE' : 'MISSING',
    CRON_SECRET: process.env.CRON_SECRET ? 'PRESENTE' : 'MISSING'
  }
  
  console.log('🔍 [DEBUG-VARIAVEIS] Variáveis verificadas:', variaveis)
  
  // Verificar se as variáveis críticas estão presentes
  const variavelsCriticas = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'NUXT_PUBLIC_SUPABASE_URL',
    'NUXT_PUBLIC_SUPABASE_KEY'
  ]
  
  const variavelsFaltando = variavelsCriticas.filter(v => !process.env[v])
  
  const status = {
    ambiente: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    variaveis,
    variavelsCriticas: {
      total: variavelsCriticas.length,
      presentes: variavelsCriticas.length - variavelsFaltando.length,
      faltando: variavelsFaltando
    },
    configuracaoOK: variavelsFaltando.length === 0,
    urls: {
      supabaseUrl: config.public.supabaseUrl || 'MISSING',
      baseUrl: config.public.baseUrl || 'MISSING'
    }
  }
  
  console.log('🔍 [DEBUG-VARIAVEIS] Status final:', status)
  
  return {
    success: true,
    data: status
  }
})