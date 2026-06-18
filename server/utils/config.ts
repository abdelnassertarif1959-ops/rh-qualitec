// Utilitário para obter URL base correta em qualquer ambiente
export function getBaseUrl(): string {
  // Sempre usar a URL de produção — o link de reset deve funcionar em produção
  return 'https://rhqualitec.vercel.app'
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