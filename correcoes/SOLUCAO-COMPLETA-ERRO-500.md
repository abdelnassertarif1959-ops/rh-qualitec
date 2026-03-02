# 🚨 SOLUÇÃO COMPLETA - Erro 500 nas APIs

## 📋 SITUAÇÃO ATUAL
- ✅ Logging detalhado adicionado nas APIs
- ✅ Commit e push realizados
- ❌ APIs retornando erro 500 no Vercel
- ❌ Variáveis de ambiente podem não estar configuradas

## 🔧 PASSO A PASSO PARA RESOLVER

### 1️⃣ CONFIGURAR VARIÁVEIS NO VERCEL

Acesse o Vercel Dashboard e adicione TODAS estas variáveis:

```bash
# Supabase (CRÍTICAS)
NUXT_PUBLIC_SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4
SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co

# Email
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
EMAIL_JOBS_TOKEN=sk_live_qualitec_email_jobs_2024

# Segurança
NUXT_SECRET_KEY=qualitec-rh-system-2025-super-secret-key-production-ready

# Ambiente (ALTERE A URL)
NUXT_PUBLIC_BASE_URL=https://SEU-DOMINIO.vercel.app
ENVIRONMENT=Production

# Projeto
SUPABASE_PROJECT_ID=rqryspxfvfzfghrfqtbm
SUPABASE_PROJECT_NAME=rh-qualitec
```

### 2️⃣ REDEPLOY
Após adicionar as variáveis, faça redeploy no Vercel.

### 3️⃣ TESTAR APIS
Use o script criado:
```bash
# Edite a URL no arquivo testar-apis-vercel.mjs
node testar-apis-vercel.mjs
```

### 4️⃣ VERIFICAR LOGS
1. Vá para **Vercel Dashboard**
2. Clique no seu projeto
3. Vá em **Functions**
4. Clique em **Runtime Logs**
5. Teste as APIs e veja os logs em tempo real

### 5️⃣ LOGS ESPERADOS
Com o logging implementado, você deve ver:

```
[STATS] Iniciando busca de estatísticas...
[STATS] Cliente Supabase criado
[STATS] Funcionários encontrados: X
[STATS] Holerites encontrados: X
[STATS] Empresas encontradas: X
[STATS] Estatísticas finais: {...}
```

### 6️⃣ SE AINDA HOUVER ERRO
Os logs mostrarão detalhes como:
```
[STATS] Erro completo: {
  message: "...",
  stack: "...",
  details: "...",
  hint: "...",
  code: "..."
}
```

## 🎯 POSSÍVEIS CAUSAS DOS ERROS 500

### A) Variáveis não configuradas
- SUPABASE_SERVICE_ROLE_KEY ausente
- URLs incorretas

### B) Problemas de conexão Supabase
- RLS (Row Level Security) bloqueando
- Tabelas não existem
- Permissões incorretas

### C) Problemas de runtime
- Imports incorretos
- Dependências faltando

## 📞 PRÓXIMOS PASSOS
1. Configure TODAS as variáveis no Vercel
2. Faça redeploy
3. Teste as APIs
4. Me envie os logs de erro específicos que aparecerem

**Com o logging detalhado, conseguiremos identificar exatamente onde está o problema!**