# 🚀 Deploy no Vercel - Sistema RH Qualitec

## 📋 Pré-requisitos

1. **Conta no Vercel:** https://vercel.com
2. **Repositório GitHub:** https://github.com/samueltarif/rh3
3. **Banco Supabase:** Configurado e funcionando

## 🔧 Configuração Passo a Passo

### 1. **Conectar Repositório no Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique em **"New Project"**
3. Conecte sua conta GitHub
4. Selecione o repositório: **`samueltarif/rh3`**
5. Clique em **"Import"**

### 2. **Configurar Variáveis de Ambiente**

Na página de configuração do projeto, adicione estas variáveis:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Nitro (para SSR)
NITRO_PRESET=vercel

# Email (opcional - para envio de holerites)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app
EMAIL_FROM=noreply@qualitec.com.br
```

### 3. **Configurações do Build**

- **Framework Preset:** Nuxt.js
- **Build Command:** `npm run build`
- **Output Directory:** `.output/public`
- **Install Command:** `npm install`

### 4. **Deploy**

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. ✅ Seu app estará disponível em: `https://seu-projeto.vercel.app`

## 🔐 Configuração das Variáveis de Ambiente

### Como obter as chaves do Supabase:

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em:** Settings → API
4. **Copie:**
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Adicionar no Vercel:

1. **No dashboard do Vercel:** Settings → Environment Variables
2. **Adicione cada variável:**
   - Name: `SUPABASE_URL`
   - Value: `https://seu-projeto.supabase.co`
   - Environment: `Production`, `Preview`, `Development`

## 📊 Verificação Pós-Deploy

### ✅ Checklist de Funcionamento:

1. **Página inicial carrega:** `https://seu-app.vercel.app`
2. **Login funciona:** `/login`
3. **Dashboard carrega:** `/dashboard`
4. **APIs respondem:** `/api/test-supabase`
5. **Holerites funcionam:** `/admin/holerites`

### 🔍 Debugging:

Se algo não funcionar:

1. **Verifique os logs:** Vercel Dashboard → Functions → View Function Logs
2. **Teste as APIs:** Acesse `/api/test-supabase` diretamente
3. **Verifique variáveis:** Settings → Environment Variables

## 🚨 Problemas Comuns

### 1. **Erro 500 nas APIs**
- ✅ Verifique se as variáveis do Supabase estão corretas
- ✅ Confirme se o banco está acessível

### 2. **Build falha**
- ✅ Verifique se todas as dependências estão no `package.json`
- ✅ Confirme se não há erros de TypeScript

### 3. **Timeout nas funções**
- ✅ Configurado para 30s no `vercel.json`
- ✅ Se precisar de mais tempo, upgrade para Pro

## 🎯 Domínio Personalizado (Opcional)

1. **No Vercel:** Settings → Domains
2. **Adicione:** `rh.qualitec.com.br`
3. **Configure DNS:** Aponte para o Vercel
4. **SSL:** Automático

## 📈 Monitoramento

- **Analytics:** Vercel Analytics (automático)
- **Logs:** Function Logs em tempo real
- **Performance:** Web Vitals dashboard

## 🔄 Atualizações

Para atualizar o sistema:

1. **Faça push** para o repositório GitHub
2. **Deploy automático** será disparado
3. **Verificação** em poucos minutos

---

## 🎉 Resultado Final

Seu sistema RH estará disponível em:
- **URL:** `https://seu-projeto.vercel.app`
- **Performance:** Otimizada globalmente
- **SSL:** Certificado automático
- **Uptime:** 99.9% garantido

**Sistema pronto para produção!** 🚀