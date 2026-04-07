// Utilitário para obter URL base correta em qualquer ambiente
export function getBaseUrl(): string {
  // URL personalizada tem prioridade máxima (configurada nas env vars da Vercel)
  if (process.env.NUXT_PUBLIC_BASE_URL && !process.env.NUXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NUXT_PUBLIC_BASE_URL
  }

  // Em produção sempre usar a URL fixa do projeto
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.VERCEL_ENV) {
    return 'https://rhqualitec.vercel.app'
  }
  
  // Fallback para desenvolvimento
  return 'http://localhost:3001'
}

// Log para debug
export function logEnvironmentInfo() {
  console.log('🌍 [CONFIG] Environment Info:')
  console.log('  - NODE_ENV:', process.env.NODE_ENV)
  console.log('  - VERCEL_URL:', process.env.VERCEL_URL)
  console.log('  - VERCEL:', process.env.VERCEL)
  console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV)
  console.log('  - NUXT_PUBLIC_BASE_URL:', process.env.NUXT_PUBLIC_BASE_URL)
  console.log('  - Base URL calculada:', getBaseUrl())
}