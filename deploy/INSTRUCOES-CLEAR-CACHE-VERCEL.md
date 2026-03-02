# 🔧 INSTRUÇÕES: Clear Build Cache no Vercel

## ⚠️ **CRÍTICO - FAÇA ISSO AGORA**

O problema é que o Vercel está usando **cache antigo** que contém chunks. Você PRECISA limpar o cache antes de testar.

## 📋 **PASSO A PASSO**

### **1. Acessar Vercel Dashboard**
```
https://vercel.com/dashboard
```

### **2. Selecionar o Projeto**
- Procure por: `rhqualitec` ou `rhhhh`
- Clique no projeto

### **3. Ir para Settings**
- No menu lateral, clique em **"Settings"**

### **4. Limpar Build Cache**
- No menu Settings, procure por **"Functions"** ou **"General"**
- Procure a opção: **"Clear Build Cache"**
- Clique no botão **"Clear Build Cache"**
- Confirme a ação

### **5. Fazer Redeploy Manual**
- Volte para a aba **"Deployments"**
- Encontre o deployment mais recente (commit: "TESTE MÍNIMO")
- Clique nos 3 pontinhos (...) ao lado do deployment
- Selecione **"Redeploy"**
- **IMPORTANTE**: Marque a opção **"Use existing Build Cache"** como **DESMARCADA**

## 🔍 **VERIFICAR BUILD LOGS**

Após o redeploy, você PRECISA verificar os logs de build:

### **Como Acessar:**
1. Clique no deployment em andamento
2. Vá para a aba **"Building"** ou **"Logs"**
3. Procure por estas linhas:

```bash
# Deve aparecer:
✓ Nuxt 4.2.2 (with Nitro 2.13.1, Vite 7.3.1 and Vue 3.5.27)
• Nitro preset: vercel

# Procure por:
"manualChunks"  # NÃO deve aparecer (removemos)
"inlineDynamicImports"  # NÃO deve aparecer (removemos)
"externals.inline"  # DEVE aparecer

# No final do build, procure por:
√ Nuxt Nitro server built
├─ .vercel/output/functions/__fallback.func/chunks/_/...
```

### **O QUE VERIFICAR:**
- ✅ Se aparecer `chunks/_/` no build log = **Vercel está gerando chunks**
- ✅ Se aparecer apenas `index.mjs` = **Bundle único funcionou**

## 🎯 **TESTE APÓS DEPLOY**

Aguarde o deploy completar (2-5 minutos) e teste:

```bash
# Teste 1: API Health
https://rhqualitec.vercel.app/api/health

# Teste 2: Home
https://rhqualitec.vercel.app/

# Teste 3: Debug
https://rhqualitec.vercel.app/api/debug/variaveis
```

## 📊 **RESULTADOS ESPERADOS**

### **SE FUNCIONAR (200 OK):**
✅ Problema era cache antigo  
✅ Configuração mínima suficiente  
✅ Sistema funcionando

### **SE CONTINUAR 500:**
❌ Vercel está ignorando config  
❌ Problema de artifact packaging  
❌ Precisamos testar fallback nuclear

## 🚨 **SE AINDA FALHAR**

Me envie:
1. **Screenshot dos Build Logs** (parte que mostra Nitro build)
2. **Screenshot do Runtime Error** (logs de função)
3. **Confirme que fez Clear Build Cache**

Aí vamos para o **Fallback Nuclear**:
- Mudar para `preset: 'node-server'`
- Ou desabilitar SSR completamente
- Ou usar configuração Vercel customizada

---
**Repositório:** git@github.com:samueltarif/rhhhh.git  
**Commit Atual:** "TESTE MÍNIMO: Apenas externals inline"  
**Ação Necessária:** Clear Build Cache + Redeploy