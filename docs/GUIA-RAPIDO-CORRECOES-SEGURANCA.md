# Guia Rápido - Correções de Segurança

**Data:** 12 de Fevereiro de 2026  
**Tempo Total Estimado:** 13 horas  
**Prioridade:** ALTA

---

## 🚀 INÍCIO RÁPIDO

Execute este comando para verificar o status atual:

```bash
node scripts/verificar-vulnerabilidades-seguranca.js
```

---

## ⚡ CORREÇÃO 1: JWT_SECRET (IMEDIATO - 15 min)

### Passo 1: Gerar Secret
```bash
# Opção 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opção 2: OpenSSL
openssl rand -hex 64
```

### Passo 2: Adicionar no .env
```bash
# Abrir .env e adicionar
JWT_SECRET=<seu_secret_gerado>
```

### Passo 3: Adicionar no .env.example
```bash
# Abrir .env.example e adicionar
JWT_SECRET=your_jwt_secret_here_generate_with_openssl_rand_hex_64
```

### Passo 4: Testar
```bash
# Reiniciar servidor
npm run dev
```

✅ **Correção 1 Completa**

---

## ⚡ CORREÇÃO 2: Cookies Seguros (1-2 horas)

### Passo 1: Atualizar nuxt.config.ts

Adicionar após `runtimeConfig`:

```typescript
export default defineNuxtConfig({
  // ... configurações existentes
  
  runtimeConfig: {
    public: {
      // ... configs existentes
    },
    
    // ADICIONAR ISTO:
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
      path: '/'
    }
  },
  
  // ... resto da configuração
})
```

### Passo 2: Criar função setSecureCookie

Adicionar em `server/utils/authMiddleware.ts`:

```typescript
/**
 * Função para setar cookie seguro
 */
export function setSecureCookie(event: H3Event, name: string, value: string) {
  const config = useRuntimeConfig()
  
  setCookie(event, name, value, {
    httpOnly: config.cookieOptions.httpOnly,
    sameSite: config.cookieOptions.sameSite as 'lax' | 'strict' | 'none',
    secure: config.cookieOptions.secure,
    maxAge: config.cookieOptions.maxAge,
    path: config.cookieOptions.path
  })
}
```

### Passo 3: Atualizar API de Login

Em `server/api/auth/login.post.ts`, substituir:

```typescript
// ANTES:
setCookie(event, 'session', sessionCookie, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 86400
})

// DEPOIS:
setSecureCookie(event, 'session', sessionCookie)
```

### Passo 4: Atualizar API de Logout

Em `server/api/auth/logout.post.ts`, substituir:

```typescript
// ANTES:
deleteCookie(event, 'session')

// DEPOIS:
setSecureCookie(event, 'session', '')
```

### Passo 5: Testar

```bash
# Reiniciar servidor
npm run dev

# Fazer login
# Abrir DevTools > Application > Cookies
# Verificar: HttpOnly ✓, Secure ✓, SameSite=Lax ✓
```

✅ **Correção 2 Completa**

---

## ⚡ CORREÇÃO 3: CSRF Protection (2-3 horas)

### Passo 1: Instalar Dependência

```bash
npm install @nuxtjs/security
```

### Passo 2: Adicionar Módulo

Em `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/security',  // ADICIONAR ISTO
    // ... outros módulos
  ],
  
  // ... resto da configuração
})
```

### Passo 3: Configurar CSRF

Em `nuxt.config.ts`, adicionar:

```typescript
export default defineNuxtConfig({
  // ... outras configurações
  
  security: {
    csrf: {
      enabled: true,
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      excludedUrls: [
        '/api/auth/login',
        '/api/auth/logout',
        '/api/auth/validate',
        '/api/health'
      ]
    }
  },
  
  // ... resto da configuração
})
```

### Passo 4: Testar

```bash
# Reiniciar servidor
npm run dev

# Testar login (deve funcionar)
# Testar outras APIs (devem requerer CSRF token)
```

✅ **Correção 3 Completa**

---

## ⚡ CORREÇÃO 4: Headers de Segurança (1 hora)

### Passo 1: Adicionar Headers

Em `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // ... outras configurações
  
  nitro: {
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
  
  // ... resto da configuração
})
```

### Passo 2: Testar

```bash
# Reiniciar servidor
npm run dev

# Abrir DevTools > Network
# Verificar headers na resposta
```

✅ **Correção 4 Completa**

---

## ⚡ CORREÇÃO 5: Sanitização no Login (30 min)

### Passo 1: Verificar API de Login

Em `server/api/auth/login.post.ts`, garantir que após verificar a senha:

```typescript
// Após verificar senha
const senhaValida = await verifyPassword(senha, funcionario.senha_hash)

if (!senhaValida) {
  // ... erro
}

// IMPORTANTE: Remover senha_hash antes de retornar
delete funcionario.senha_hash

// Ou usar sanitizeUserData
const sanitizedUser = sanitizeUserData(funcionario, funcionario)

// Retornar usuário sanitizado
return {
  success: true,
  user: sanitizedUser,
  message: 'Login realizado com sucesso'
}
```

### Passo 2: Testar

```bash
# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qualitec.com","senha":"senha123"}'

# Verificar que senha_hash NÃO aparece na resposta
```

✅ **Correção 5 Completa**

---

## 📋 CHECKLIST COMPLETO

### Fase 1 - IMEDIATO
- [ ] Gerar JWT_SECRET
- [ ] Adicionar JWT_SECRET no .env
- [ ] Adicionar JWT_SECRET no .env.example
- [ ] Verificar sanitização no login
- [ ] Testar login

### Fase 2 - CURTO PRAZO
- [ ] Adicionar cookieOptions no nuxt.config.ts
- [ ] Criar função setSecureCookie()
- [ ] Atualizar API de login
- [ ] Atualizar API de logout
- [ ] Testar cookies no DevTools

### Fase 3 - MÉDIO PRAZO
- [ ] Instalar @nuxtjs/security
- [ ] Adicionar módulo no nuxt.config.ts
- [ ] Configurar CSRF
- [ ] Adicionar headers de segurança
- [ ] Testar todas as APIs

---

## 🧪 TESTES FINAIS

### Teste 1: Verificar Vulnerabilidades
```bash
node scripts/verificar-vulnerabilidades-seguranca.js
```

**Resultado Esperado:**
```
✅ SUCESSO: Nenhuma vulnerabilidade crítica ou alta detectada
Exit Code: 0
```

### Teste 2: Verificar APIs
```bash
node scripts/verificar-seguranca-apis.js
```

**Resultado Esperado:**
```
✅ TODAS AS APIs ESTÃO PROTEGIDAS!
Exit Code: 0
```

### Teste 3: Auditoria Completa
```bash
node scripts/auditoria-seguranca-completa.js
```

**Resultado Esperado:**
```
🎯 Pontuação de Segurança: 98/100
📈 Nível: EXCELENTE
Exit Code: 0
```

---

## 🎯 RESULTADO FINAL

Após todas as correções:

```
Antes:  92/100 - 6 vulnerabilidades
Depois: 98/100 - 0 vulnerabilidades críticas/altas
```

---

## 📞 SUPORTE

### Problemas Comuns

**Erro: "Cannot find module '@nuxtjs/security'"**
```bash
npm install @nuxtjs/security
```

**Erro: "CSRF token missing"**
- Verificar se a rota está em `excludedUrls`
- Verificar se o frontend está enviando o token

**Cookies não aparecem no DevTools**
- Verificar se o servidor está rodando
- Limpar cookies antigos
- Fazer logout e login novamente

### Documentação

- Auditoria Completa: `docs/AUDITORIA-SEGURANCA-COMPLETA-12-02-2026.md`
- Plano de Ação: `docs/PLANO-ACAO-SEGURANCA-12-02-2026.md`
- Resumo: `RESUMO-AUDITORIA-SEGURANCA-12-02-2026.md`

---

## ✅ CONCLUSÃO

Seguindo este guia, todas as vulnerabilidades críticas e altas serão corrigidas em aproximadamente **4-5 horas** de trabalho.

**Prioridade de Implementação:**
1. ⚡ Correção 1 (15 min) - IMEDIATO
2. ⚡ Correção 5 (30 min) - IMEDIATO
3. ⚡ Correção 2 (2 horas) - CURTO PRAZO
4. ⚡ Correção 3 (3 horas) - MÉDIO PRAZO
5. ⚡ Correção 4 (1 hora) - MÉDIO PRAZO

**Total:** ~6.75 horas

---

**Criado por:** Kiro AI  
**Data:** 12 de Fevereiro de 2026  
**Versão:** 1.0.0
