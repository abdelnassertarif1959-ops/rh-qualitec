// Utilitário para obter URL base correta em qualquer ambiente
export function getBaseUrl(): string {
  // Em produção no Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Se NODE_ENV é production mas não tem VERCEL_URL, usar URL conhecida
  if (process.env.NODE_ENV === 'production') {
    return 'https://rhqualitec.vercel.app'
  }
  
  // Se tem VERCEL ou VERCEL_ENV (indicadores do Vercel)
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return 'https://rhqualitec.vercel.app'
  }
  
  // URL personalizada se definida
  if (process.env.NUXT_PUBLIC_BASE_URL && !process.env.NUXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NUXT_PUBLIC_BASE_URL
  }
  
  // Fallback para desenvolvimento
  return 'http://localhost:3000'
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