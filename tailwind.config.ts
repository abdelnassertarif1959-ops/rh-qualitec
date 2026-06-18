import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores Qualitec Industrial (baseado no site e padrões industriais)
        qualitec: {
          50: '#f0f9ff',   // Azul muito claro
          100: '#e0f2fe',  // Azul claro
          200: '#bae6fd',  // Azul suave
          300: '#7dd3fc',  // Azul médio claro
          400: '#38bdf8',  // Azul médio
          500: '#0ea5e9',  // Azul principal Qualitec
          600: '#0284c7',  // Azul escuro
          700: '#0369a1',  // Azul muito escuro
          800: '#075985',  // Azul profundo
          900: '#0c4a6e',  // Azul navy
          950: '#082f49',  // Azul quase preto
        },
        // Paleta Industrial Corporativa
        industrial: {
          50: '#f8fafc',   // Cinza muito claro
          100: '#f1f5f9',  // Cinza claro
          200: '#e2e8f0',  // Cinza suave
          300: '#cbd5e1',  // Cinza médio claro
          400: '#94a3b8',  // Cinza médio
          500: '#64748b',  // Cinza principal
          600: '#475569',  // Cinza escuro
          700: '#334155',  // Cinza muito escuro
          800: '#1e293b',  // Cinza profundo
          900: '#0f172a',  // Cinza quase preto
        },
        // Cores de Segurança Industrial
        safety: {
          warning: '#f59e0b',  // Amarelo industrial
          danger: '#dc2626',   // Vermelho industrial
          success: '#059669',  // Verde industrial
          info: '#0284c7',     // Azul informativo
        },
        // Cores primárias do sistema
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Azul principal
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Cores neutras corporativas
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'industrial': ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
        'corporate': ['Roboto', 'Arial', 'sans-serif'],
      },
      zIndex: {
        // Base levels
        '1': '1',
        '2': '2',
        '3': '3',
        
        // Elevated elements
        '100': '100',
        '110': '110',
        '120': '120',
        
        // Overlay elements
        '200': '200',
        '210': '210',
        
        // Modal system
        '1000': '1000',
        '1010': '1010',
        
        // Notification system
        '1100': '1100',
        
        // Critical system
        '9000': '9000',
        '9100': '9100',
        '9200': '9200',
        '9999': '9999',
      },
      height: {
        'dvh': '100dvh', // Dynamic viewport height
      },
      maxHeight: {
        'dvh': '100dvh',
      },
      minHeight: {
        'dvh': '100dvh',
      },
      backgroundImage: {
        'industrial-pattern': 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.1) 1px, transparent 0)',
        'qualitec-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        'industrial-gradient': 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
        'corporate-bg': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'metal-texture': 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    }
  },
  plugins: [],
} satisfies Config
