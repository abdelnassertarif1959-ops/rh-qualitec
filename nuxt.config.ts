// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-21',
  devtools: { enabled: true },
  
  nitro: {
    preset: 'vercel',
    // TESTE MÍNIMO: Apenas externals inline
    externals: {
      inline: ['vue', '@vue/shared', '@vue/server-renderer']
    },
    vercel: {
      functions: {
        maxDuration: 30
      }
    },
    // Headers de segurança
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      }
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],
  
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login']
    }
  },
  
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Configuração JWT
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    
    // Configuração de cookies seguros
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 24 horas em segundos
      path: '/'
    },
    
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
      baseUrl: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NUXT_PUBLIC_BASE_URL 
        ? process.env.NUXT_PUBLIC_BASE_URL
        : process.env.NODE_ENV === 'production' 
        ? 'https://rhqualitec.vercel.app' 
        : 'http://localhost:3000'
    }
  },
  
  app: {
    head: {
      title: 'Sistema Corporativo - Qualitec Instrumentos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema Interno de Gestão de Recursos Humanos - Qualitec Instrumentos' },
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  build: {
    transpile: ['@headlessui/vue']
  },
  
  css: [
    '~/assets/css/main.css'
  ],

  // Configurações SSR básicas
  ssr: true,
  
  // Configurações experimentais mínimas
  experimental: {
    externalVue: false
  }
})