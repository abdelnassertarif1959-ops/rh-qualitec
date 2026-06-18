export default defineEventHandler(async () => {
  try {
    console.log('[HEALTH] Iniciando health check...')
    
    const config = useRuntimeConfig()
    
    // Verificar variáveis de ambiente (sem expor valores)
    const envCheck = {
      supabaseUrl: !!config.public.supabaseUrl,
      supabaseKey: !!config.public.supabaseKey,
      supabaseServiceRoleKey: !!config.supabaseServiceRoleKey,
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    }
    
    console.log('[HEALTH] Variáveis verificadas:', envCheck)
    
    // Verificar variáveis específicas
    const detailedCheck = {
      NUXT_PUBLIC_SUPABASE_URL: !!process.env.NUXT_PUBLIC_SUPABASE_URL,
      NUXT_PUBLIC_SUPABASE_KEY: !!process.env.NUXT_PUBLIC_SUPABASE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NUXT_SECRET_KEY: !!process.env.NUXT_SECRET_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV
    }
    
    console.log('[HEALTH] Verificação detalhada:', detailedCheck)
    
    const result = {
      status: 'ok',
      message: 'Health check passed',
      environment: envCheck,
      detailed: detailedCheck,
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        env: process.env.VERCEL_ENV || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
      }
    }
    
    console.log('[HEALTH] Health check concluído com sucesso')
    
    return result
    
  } catch (error: any) {
    console.error('[HEALTH] Erro no health check:', {
      message: error.message,
      stack: error.stack
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Health check failed: ${error.message}`
    })
  }
})
