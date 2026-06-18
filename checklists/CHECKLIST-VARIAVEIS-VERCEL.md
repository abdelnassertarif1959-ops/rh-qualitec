# Checklist: Variáveis de Ambiente no Vercel - ATUALIZADO

## ✅ Variáveis Obrigatórias no Vercel

### 1. Supabase - URLs
- [ ] `NUXT_PUBLIC_SUPABASE_URL` = `https://rqryspxfvfzfghrfqtbm.supabase.co`
- [ ] `SUPABASE_URL` = `https://rqryspxfvfzfghrfqtbm.supabase.co`

### 2. Supabase - Chaves de API
- [ ] `NUXT_PUBLIC_SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4`
- [ ] `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo`

### 3. Email
- [ ] `GMAIL_EMAIL` = `qualitecinstrumentosdemedicao@gmail.com`
- [ ] `GMAIL_APP_PASSWORD` = `byeqpdyllakkwxkk`

### 4. Segurança
- [ ] `NUXT_SECRET_KEY` = `qualitec-rh-system-2025-super-secret-key-production-ready`
- [ ] `CRON_SECRET` = `qualitec-cron-contador-diario-2026-secure-token-xyz789`

### 5. Ambiente
- [ ] `ENVIRONMENT` = `Production`
- [ ] `NODE_ENV` = `production` (automático no Vercel)

## 🚨 Variável CRÍTICA para Holerites

A variável mais importante para o funcionamento dos holerites é:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4
```

**SEM ESTA VARIÁVEL, OS HOLERITES NÃO APARECEM EM PRODUÇÃO!**

## 📝 Como Configurar no Vercel

1. Acesse o painel do Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione cada variável acima **UMA POR UMA**
5. **IMPORTANTE**: Marque para todos os ambientes: **Production**, **Preview**, **Development**
6. Clique em **Save** para cada uma
7. Após adicionar todas, faça um **Redeploy**

## 🧪 Como Testar Após Configurar

### 1. Teste no Servidor (Node.js)
Execute localmente para verificar se as variáveis estão corretas:
```bash
node scripts/diagnostico-servidor-completo.js
```

### 2. Teste no Navegador (Produção)
Abra o console (F12) no link de produção e execute:
```javascript
// DIAGNÓSTICO COMPLETO - PRODUÇÃO
console.log('🔍 Iniciando diagnóstico...')

// Verificar autenticação
const authData = localStorage.getItem('sb-rqryspxfvfzfghrfqtbm-auth-token')
console.log('🔐 Auth token presente:', !!authData)

if (authData) {
  const parsed = JSON.parse(authData)
  const userId = parsed?.user?.id
  console.log('👤 Usuário ID:', userId)
  
  // Testar API de holerites
  if (userId) {
    fetch(`/api/holerites/meus-holerites?funcionarioId=${userId}`)
      .then(response => {
        console.log('📊 Status:', response.status)
        return response.json()
      })
      .then(data => {
        console.log('✅ Holerites:', data?.length || 0)
        console.log('✅ Dados:', data)
      })
      .catch(error => {
        console.error('❌ Erro:', error)
      })
  }
}
```

## ⚠️ Problemas Comuns e Soluções

### Problema: Holerites não aparecem
**Causa**: `SUPABASE_SERVICE_ROLE_KEY` não configurada
**Solução**: Adicionar a variável no Vercel e fazer redeploy

### Problema: Erro 401/403 do Supabase
**Causa**: Chave incorreta ou expirada
**Solução**: Verificar se a chave está correta (copiar do .env local)

### Problema: Cache do Vercel
**Causa**: Vercel pode estar usando cache antigo
**Solução**: 
1. Ir em **Deployments**
2. Clicar nos 3 pontos do último deploy
3. Selecionar **Redeploy**

### Problema: Timeout das funções
**Causa**: Funções do Vercel têm timeout padrão de 10s
**Solução**: Já configurado no `nuxt.config.ts` para 30s

## 📋 Lista de Verificação Final

Antes de testar em produção, confirme:

- [ ] Todas as 9 variáveis foram adicionadas no Vercel
- [ ] Cada variável foi marcada para Production, Preview e Development
- [ ] Foi feito um redeploy após adicionar as variáveis
- [ ] O link de produção está funcionando (não erro 500)
- [ ] É possível fazer login no sistema
- [ ] O usuário logado é um funcionário (não admin)

## 🎯 Teste Final

1. Acesse o link de produção
2. Faça login como funcionário
3. Vá para "Meus Holerites"
4. Se aparecerem os holerites: ✅ **PROBLEMA RESOLVIDO!**
5. Se não aparecerem: Execute o script de diagnóstico no console

## 📞 Suporte

Se ainda houver problemas após seguir todos os passos:
1. Execute o diagnóstico no console
2. Copie todos os logs
3. Verifique os logs das funções no Vercel
4. Envie os logs para análise