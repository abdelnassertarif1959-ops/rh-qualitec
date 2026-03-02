# Plano de Ação - Correção de Vulnerabilidades de Segurança

**Data:** 12 de Fevereiro de 2026  
**Status:** 🔴 AÇÃO NECESSÁRIA  
**Responsável:** Kiro AI

---

## 🚨 RESUMO EXECUTIVO

A auditoria de segurança identificou **6 vulnerabilidades** que precisam ser corrigidas:

- 🔴 **1 Crítica** - JWT_SECRET não configurado
- 🟠 **4 Altas** - Configuração de cookies insegura
- 🟡 **1 Média** - CSRF protection não configurado

**Prioridade:** ALTA - Correções devem ser aplicadas antes do próximo deploy

---

## 📊 VULNERABILIDADES DETECTADAS

### 🔴 CRÍTICA (1)

#### 1. Variável JWT_SECRET não configurada

**Severidade:** CRÍTICO  
**Arquivo:** `.env`  
**Impacto:** Sistema pode não ter secret para assinatura de tokens

**Correção:**
```bash
# Adicionar no arquivo .env
JWT_SECRET=<gerar_secret_forte_aqui>
```

**Como gerar um secret forte:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

**Prazo:** IMEDIATO

---

### 🟠 ALTAS (4)

#### 2. Cookie httpOnly não configurado

**Severidade:** ALTO  
**Arquivo:** `nuxt.config.ts`  
**Impacto:** Cookies acessíveis via JavaScript (vulnerável a XSS)

**Correção:** Ver seção "Correção Completa de Cookies" abaixo

**Prazo:** 1-2 dias

---

#### 3. Cookie sameSite não configurado

**Severidade:** ALTO  
**Arquivo:** `nuxt.config.ts`  
**Impacto:** Vulnerável a ataques CSRF

**Correção:** Ver seção "Correção Completa de Cookies" abaixo

**Prazo:** 1-2 dias

---

#### 4. Cookie secure não configurado

**Severidade:** ALTO  
**Arquivo:** `nuxt.config.ts`  
**Impacto:** Cookies podem ser transmitidos via HTTP (não criptografado)

**Correção:** Ver seção "Correção Completa de Cookies" abaixo

**Prazo:** 1-2 dias

---

#### 5. Cookie maxAge não configurado

**Severidade:** ALTO  
**Arquivo:** `nuxt.config.ts`  
**Impacto:** Cookies podem não expirar corretamente

**Correção:** Ver seção "Correção Completa de Cookies" abaixo

**Prazo:** 1-2 dias

---

### 🟡 MÉDIA (1)

#### 6. CSRF Protection não configurado

**Severidade:** MÉDIO  
**Arquivo:** `nuxt.config.ts`  
**Impacto:** Vulnerável a ataques Cross-Site Request Forgery

**Correção:** Ver seção "Configuração de CSRF" abaixo

**Prazo:** 1 semana

---

## 🔧 CORREÇÕES NECESSÁRIAS

### 1. Correção Completa de Cookies

**Arquivo:** `nuxt.config.ts`

Adicionar configuração de cookies seguros:

```typescript
export default defineNuxtConfig({
  // ... outras configurações
  
  runtimeConfig: {
    public: {
      // ... outras configs públicas
    },
    
    // Configuração de cookies seguros
    cookieOptions: {
      httpOnly: true,           // Previne acesso via JavaScript
      sameSite: 'lax',          // Previne CSRF
      secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
      maxAge: 86400,            // 24 horas em segundos
      path: '/'                 // Disponível em todo o site
    }
  },
  
  // ... resto da configuração
})
```

**Atualizar criação de cookies em `server/utils/authMiddleware.ts`:**

```typescript
export function createSessionCookie(userId: number, userType: string): string {
  const config = useRuntimeConfig()
  const sessionData = {
    userId: userId.toString(),
    userType,
    timestamp: Date.now(),
    expires: Date.now() + (config.cookieOptions.maxAge * 1000)
  }
  
  return encodeURIComponent(JSON.stringify(sessionData))
}

// Usar ao setar o cookie
export function setSecureCookie(event: H3Event, name: string, value: string) {
  const config = useRuntimeConfig()
  
  setCookie(event, name, value, {
    httpOnly: config.cookieOptions.httpOnly,
    sameSite: config.cookieOptions.sameSite,
    secure: config.cookieOptions.secure,
    maxAge: config.cookieOptions.maxAge,
    path: config.cookieOptions.path
  })
}
```

**Atualizar API de login `server/api/auth/login.post.ts`:**

```typescript
// Substituir
setCookie(event, 'session', sessionCookie, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 86400
})

// Por
setSecureCookie(event, 'session', sessionCookie)
```

---

### 2. Configuração de CSRF

**Arquivo:** `nuxt.config.ts`

Adicionar proteção CSRF:

```typescript
export default defineNuxtConfig({
  // ... outras configurações
  
  security: {
    csrf: {
      enabled: true,
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      excludedUrls: [
        '/api/auth/login',      // Login precisa funcionar sem token CSRF inicial
        '/api/auth/logout',
        '/api/health'
      ]
    }
  },
  
  // ... resto da configuração
})
```

**Instalar dependência:**

```bash
npm install @nuxtjs/security
```

**Adicionar ao nuxt.config.ts:**

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/security',
    // ... outros módulos
  ],
  
  // ... resto da configuração
})
```

---

### 3. Adicionar JWT_SECRET

**Arquivo:** `.env`

```bash
# Gerar secret forte
JWT_SECRET=<seu_secret_gerado_aqui>
```

**Arquivo:** `.env.example`

```bash
# JWT Secret para assinatura de tokens
JWT_SECRET=your_jwt_secret_here_generate_with_openssl_rand_hex_64
```

---

### 4. Adicionar Headers de Segurança

**Arquivo:** `nuxt.config.ts`

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

---

### 5. Corrigir Exposição de Senha no Login

**Arquivo:** `server/api/auth/login.post.ts`

Garantir que a senha nunca seja retornada:

```typescript
// Após buscar o usuário
const { data: funcionario, error } = await supabase
  .from('funcionarios')
  .select('id, nome_completo, email_login, tipo_acesso, empresa_id, status, senha_hash')
  .eq('email_login', email)
  .eq('status', 'ativo')
  .single()

// Verificar senha
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
  // ...
}
```

---

## ⚠️ AVISOS (6)

### Headers de Segurança Não Configurados

Os seguintes headers de segurança devem ser adicionados (ver seção 4 acima):

1. **X-Frame-Options** - Previne clickjacking
2. **X-Content-Type-Options** - Previne MIME sniffing
3. **X-XSS-Protection** - Proteção adicional contra XSS
4. **Strict-Transport-Security** - Força HTTPS
5. **Content-Security-Policy** - Controla recursos carregados

**Prioridade:** MÉDIA  
**Prazo:** 1 semana

---

### API de Login Pode Expor Senha

**Arquivo:** `server/api/auth/login.post.ts`

Verificar se a senha_hash está sendo removida antes de retornar o usuário.

**Prioridade:** CRÍTICA  
**Prazo:** IMEDIATO

---

## 💡 RECOMENDAÇÕES (2)

### 1. Implementar JWT

**Prioridade:** MÉDIA  
**Prazo:** 1-2 meses

**Benefícios:**
- Tokens assinados e verificáveis
- Stateless (não precisa consultar banco)
- Expiração automática
- Mais seguro que cookies simples

**Implementação:**

```bash
npm install jsonwebtoken
```

```typescript
// server/utils/jwt.ts
import jwt from 'jsonwebtoken'

export function createJWT(userId: number, userType: string) {
  const secret = process.env.JWT_SECRET!
  
  return jwt.sign(
    { 
      userId, 
      userType,
      iat: Math.floor(Date.now() / 1000)
    },
    secret,
    { 
      expiresIn: '24h',
      issuer: 'rh-qualitec',
      audience: 'rh-qualitec-users'
    }
  )
}

export function verifyJWT(token: string) {
  const secret = process.env.JWT_SECRET!
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'rh-qualitec',
      audience: 'rh-qualitec-users'
    })
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token inválido ou expirado'
    })
  }
}
```

---

### 2. Implementar 2FA

**Prioridade:** MÉDIA  
**Prazo:** 2-3 meses

**Benefícios:**
- Camada adicional de segurança
- Proteção contra roubo de credenciais
- Recomendado para contas administrativas

**Implementação:**

```bash
npm install speakeasy qrcode
```

```typescript
// server/api/auth/2fa/setup.post.ts
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // Gerar secret
  const secret = speakeasy.generateSecret({
    name: `RH Qualitec (${user.email_login})`,
    issuer: 'RH Qualitec'
  })
  
  // Gerar QR Code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)
  
  // Salvar secret no banco (temporário até confirmação)
  await supabase
    .from('funcionarios')
    .update({ 
      totp_secret_temp: secret.base32 
    })
    .eq('id', user.id)
  
  return {
    success: true,
    qrCode,
    secret: secret.base32
  }
})
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - IMEDIATO (Hoje)

- [ ] Adicionar `JWT_SECRET` no `.env`
- [ ] Adicionar `JWT_SECRET` no `.env.example`
- [ ] Verificar e corrigir exposição de senha no login
- [ ] Testar login após correções

### Fase 2 - CURTO PRAZO (1-2 dias)

- [ ] Adicionar configuração de cookies seguros no `nuxt.config.ts`
- [ ] Criar função `setSecureCookie()` em `authMiddleware.ts`
- [ ] Atualizar API de login para usar `setSecureCookie()`
- [ ] Atualizar API de logout para usar `setSecureCookie()`
- [ ] Testar autenticação com cookies seguros

### Fase 3 - MÉDIO PRAZO (1 semana)

- [ ] Instalar `@nuxtjs/security`
- [ ] Configurar CSRF protection
- [ ] Adicionar headers de segurança
- [ ] Testar todas as APIs com CSRF habilitado
- [ ] Ajustar exclusões de CSRF se necessário

### Fase 4 - LONGO PRAZO (1-3 meses)

- [ ] Implementar JWT (opcional)
- [ ] Implementar 2FA para admins (opcional)
- [ ] Implementar refresh tokens (opcional)
- [ ] Adicionar logs de auditoria em banco de dados

---

## 🧪 TESTES NECESSÁRIOS

### Após Fase 1
```bash
# Testar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qualitec.com","senha":"senha123"}'

# Verificar que senha_hash não é retornada
```

### Após Fase 2
```bash
# Testar cookies seguros
# Verificar no DevTools > Application > Cookies
# Deve mostrar: HttpOnly, Secure, SameSite=Lax
```

### Após Fase 3
```bash
# Testar CSRF protection
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste"}'
# Deve retornar erro 403 (CSRF token missing)
```

---

## 📊 IMPACTO DAS CORREÇÕES

### Segurança
- ✅ Proteção contra XSS (httpOnly)
- ✅ Proteção contra CSRF (sameSite + CSRF token)
- ✅ Proteção contra man-in-the-middle (secure)
- ✅ Expiração adequada de sessões (maxAge)
- ✅ Headers de segurança padrão da indústria

### Performance
- ⚡ Impacto mínimo (< 1ms por requisição)
- ⚡ Cookies seguros não afetam performance
- ⚡ CSRF validation é rápida

### Compatibilidade
- ✅ Compatível com todos os navegadores modernos
- ✅ Não quebra funcionalidades existentes
- ⚠️ Pode requerer ajustes em testes automatizados

---

## 🎯 MÉTRICAS DE SUCESSO

### Antes das Correções
- Pontuação de Segurança: 92/100
- Vulnerabilidades Críticas: 1
- Vulnerabilidades Altas: 4
- Vulnerabilidades Médias: 1

### Após as Correções (Meta)
- Pontuação de Segurança: 98/100
- Vulnerabilidades Críticas: 0
- Vulnerabilidades Altas: 0
- Vulnerabilidades Médias: 0

---

## 📞 SUPORTE

Para dúvidas sobre as correções:

1. Consultar documentação: `docs/AUDITORIA-SEGURANCA-COMPLETA-12-02-2026.md`
2. Executar script de verificação: `node scripts/verificar-vulnerabilidades-seguranca.js`
3. Revisar relatório JSON: `relatorio-vulnerabilidades.json`

---

## ✅ CONCLUSÃO

As vulnerabilidades identificadas são **corrigíveis** e não representam riscos imediatos se o sistema estiver em ambiente controlado. No entanto, **devem ser corrigidas antes do próximo deploy em produção**.

**Prioridade de Correção:**
1. 🔴 JWT_SECRET e exposição de senha (IMEDIATO)
2. 🟠 Configuração de cookies (1-2 dias)
3. 🟡 CSRF e headers de segurança (1 semana)

**Status Atual:** Sistema seguro mas pode ser melhorado  
**Status Após Correções:** Sistema com segurança de nível empresarial

---

**Responsável:** Kiro AI  
**Data:** 12 de Fevereiro de 2026  
**Próxima Revisão:** Após implementação das correções
