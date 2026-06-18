# Solução Definitiva: Sistema Funciona em Localhost mas não no Vercel

## Problema Identificado

- ✅ **Localhost (desenvolvimento)**: Sistema funciona perfeitamente
- ❌ **Vercel (produção)**: Holerites não aparecem para funcionários
- 🔍 **Causa**: Diferenças de configuração entre ambientes

## Checklist de Verificação no Vercel

### 1. Variáveis de Ambiente

Verificar se estas variáveis estão configuradas no painel do Vercel:

```bash
# Supabase Configuration
NUXT_PUBLIC_SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk

# Security
NUXT_SECRET_KEY=qualitec-rh-system-2025-super-secret-key-production-ready
CRON_SECRET=qualitec-cron-contador-diario-2026-secure-token-xyz789
```

### 2. Como Configurar no Vercel

1. Acesse o painel do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável acima
4. **IMPORTANTE**: Marque para todos os ambientes (Production, Preview, Development)

### 3. Verificar Deploy

Após configurar as variáveis:
1. Faça um novo deploy (ou redeploy)
2. Aguarde o deploy completar
3. Teste o sistema

## Script de Diagnóstico para Produção

Execute este script no console do navegador **na produção**:

```javascript
// DIAGNÓSTICO COMPLETO - PRODUÇÃO
console.log('🔍 [DIAGNÓSTICO-PRODUÇÃO] Iniciando...')

// 1. Verificar ambiente
console.log('🌍 Ambiente:', window.location.hostname)
console.log('🌍 URL completa:', window.location.href)

// 2. Verificar autenticação
const authData = localStorage.getItem('sb-rqryspxfvfzfghrfqtbm-auth-token')
console.log('🔐 Auth token presente:', !!authData)

if (authData) {
  try {
    const parsed = JSON.parse(authData)
    console.log('👤 Usuário ID:', parsed?.user?.id)
    console.log('👤 Email:', parsed?.user?.email)
  } catch (e) {
    console.error('❌ Erro ao parsear auth:', e)
  }
}

// 3. Testar API diretamente
async function testarAPI() {
  try {
    const authToken = JSON.parse(localStorage.getItem('sb-rqryspxfvfzfghrfqtbm-auth-token') || '{}')
    const userId = authToken?.user?.id
    
    if (!userId) {
      console.error('❌ Usuário não encontrado')
      return
    }
    
    console.log('📡 Testando API de holerites...')
    const response = await fetch(`/api/holerites/meus-holerites?funcionarioId=${userId}`)
    
    console.log('📊 Status:', response.status)
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Dados recebidos:', data)
      console.log('✅ Quantidade:', data?.length || 0)
    } else {
      const error = await response.text()
      console.error('❌ Erro da API:', error)
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error)
  }
}

testarAPI()
```

## Correções Específicas para Produção

### 1. Configuração do Nuxt para Vercel

Verificar se o `nuxt.config.ts` está correto:

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 30 // Aumentar timeout para 30 segundos
      }
    }
  },
  
  runtimeConfig: {
    // Chaves privadas (server-side only)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    public: {
      // Chaves públicas (client + server)
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
    }
  }
})
```

### 2. API com Fallback para Produção

A API já foi corrigida com:
- ✅ Logs detalhados para debug
- ✅ Timeout aumentado
- ✅ Headers específicos para produção
- ✅ Verificação de configurações

### 3. Verificação de CORS

Se necessário, adicionar headers CORS:

```typescript
// Em server/api/holerites/meus-holerites.get.ts
setHeader(event, 'Access-Control-Allow-Origin', '*')
setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
```

## Passos para Resolver

### 1. Verificar Variáveis no Vercel
- Acessar painel do Vercel
- Verificar se todas as variáveis estão configuradas
- Fazer redeploy se necessário

### 2. Testar com Script de Diagnóstico
- Executar o script acima na produção
- Verificar os logs no console
- Identificar onde está falhando

### 3. Verificar Logs do Vercel
- Acessar Functions > View Function Logs
- Procurar por erros da API `/api/holerites/meus-holerites`
- Verificar se as configurações estão sendo carregadas

### 4. Teste Gradual
1. Primeiro, verificar se a API responde (mesmo que vazia)
2. Depois, verificar se as configurações estão corretas
3. Por último, verificar se os dados estão sendo retornados

## Comandos Úteis

### Verificar Deploy Local
```bash
# Simular produção localmente
npm run build
npm run preview
```

### Verificar Variáveis
```bash
# No terminal do Vercel CLI
vercel env ls
```

## Status da Correção

- ✅ **API corrigida** com logs detalhados
- ✅ **Script de diagnóstico** criado
- ✅ **Documentação** completa
- ⏳ **Teste em produção** - aguardando configuração das variáveis
- ⏳ **Verificação final** - dependente dos logs de produção

## Próximos Passos

1. **Configure as variáveis no Vercel**
2. **Faça um redeploy**
3. **Execute o script de diagnóstico**
4. **Me envie os logs** para análise final