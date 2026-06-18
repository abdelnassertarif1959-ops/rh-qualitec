# 🚨 TROUBLESHOOTING RÁPIDO - Erro 500

## 🎯 DIAGNÓSTICO RÁPIDO

### 1️⃣ TESTAR LOCALMENTE
```bash
# Verificar se tudo funciona localmente
node verificar-status-apis.mjs

# Verificar schema das tabelas
node verificar-schema-funcionarios-atual.mjs
```

### 2️⃣ PROBLEMAS MAIS COMUNS

#### A) Variáveis não configuradas no Vercel
```
❌ SUPABASE_SERVICE_ROLE_KEY ausente
❌ NUXT_PUBLIC_SUPABASE_URL ausente
❌ NUXT_PUBLIC_SUPABASE_KEY ausente
```

#### B) URLs incorretas
```
❌ NUXT_PUBLIC_BASE_URL ainda apontando para localhost
❌ URLs do Supabase incorretas
```

#### C) Problemas de RLS (Row Level Security)
```
❌ Service Role Key não tem permissões
❌ Políticas RLS muito restritivas
```

### 3️⃣ VERIFICAÇÃO RÁPIDA NO VERCEL

1. **Vá para Vercel Dashboard**
2. **Clique no seu projeto**
3. **Settings → Environment Variables**
4. **Verifique se TODAS estas variáveis estão definidas:**

```
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_KEY  
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_URL
NUXT_SECRET_KEY
NUXT_PUBLIC_BASE_URL
ENVIRONMENT
```

### 4️⃣ TESTE RÁPIDO DE API

Acesse diretamente no navegador:
```
https://seu-dominio.vercel.app/api/health
```

Se retornar erro 500, o problema é nas variáveis.

### 5️⃣ LOGS EM TEMPO REAL

1. **Vercel Dashboard → Seu Projeto**
2. **Functions → Runtime Logs**
3. **Teste uma API e veja os logs aparecerem**

Com o logging implementado, você verá:
```
[STATS] Iniciando busca de estatísticas...
[STATS] Cliente Supabase criado
[STATS] Erro completo: { ... }
```

## 🔧 SOLUÇÕES RÁPIDAS

### Se API retorna 500:
1. ✅ Adicionar todas as variáveis no Vercel
2. ✅ Redeploy
3. ✅ Verificar logs

### Se conexão Supabase falha:
1. ✅ Verificar SUPABASE_SERVICE_ROLE_KEY
2. ✅ Verificar URLs do Supabase
3. ✅ Testar conexão localmente

### Se tabelas não existem:
1. ✅ Verificar se migrations foram executadas
2. ✅ Verificar RLS policies
3. ✅ Testar queries no Supabase Dashboard

## ⚡ AÇÃO IMEDIATA

**Execute agora:**
```bash
node verificar-status-apis.mjs
```

Se tudo estiver OK localmente, o problema é 100% nas variáveis do Vercel!