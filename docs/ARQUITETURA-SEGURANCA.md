# 🔐 Arquitetura de Segurança - Sistema RH

## ✅ Princípio Fundamental

**NUNCA expor credenciais ou rotas do Supabase no frontend!**

Todo acesso ao banco de dados **DEVE** passar pelo backend (server/api).

---

## 📐 Arquitetura Implementada

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (app/pages, app/components, app/composables)              │
│                                                              │
│  ❌ SEM acesso direto ao Supabase                           │
│  ❌ SEM credenciais expostas                                │
│  ❌ SEM rotas de banco de dados                             │
│                                                              │
│  ✅ Apenas chamadas para /api/*                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ $fetch('/api/...')
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                      BACKEND (API)                           │
│                  (server/api/*)                              │
│                                                              │
│  ✅ Valida autenticação                                     │
│  ✅ Valida permissões                                       │
│  ✅ Sanitiza dados                                          │
│  ✅ Aplica regras de negócio                                │
│  ✅ Protege credenciais                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ fetch() com credenciais
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                      SUPABASE                                │
│                   (Banco de Dados)                           │
│                                                              │
│  ✅ RLS (Row Level Security) habilitado                     │
│  ✅ Políticas de segurança ativas                           │
│  ✅ Credenciais protegidas no .env                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Camadas de Segurança

### 1️⃣ **Frontend (app/)**
- **Responsabilidade:** Interface do usuário
- **Segurança:**
  - ❌ Não tem acesso direto ao Supabase
  - ❌ Não conhece credenciais
  - ❌ Não conhece estrutura do banco
  - ✅ Apenas chama APIs do backend

### 2️⃣ **Backend (server/api/)**
- **Responsabilidade:** Lógica de negócio e segurança
- **Segurança:**
  - ✅ Valida autenticação do usuário
  - ✅ Verifica permissões (admin vs funcionário)
  - ✅ Sanitiza e valida dados de entrada
  - ✅ Aplica regras de negócio
  - ✅ Protege credenciais do Supabase
  - ✅ Retorna apenas dados autorizados

### 3️⃣ **Banco de Dados (Supabase)**
- **Responsabilidade:** Armazenamento e RLS
- **Segurança:**
  - ✅ RLS habilitado em todas as tabelas
  - ✅ Políticas impedem acesso não autorizado
  - ✅ Funcionários só veem seus próprios dados
  - ✅ Admins têm acesso controlado

---

## 📁 Estrutura de APIs Criadas

### **Autenticação**
```
POST /api/auth/login
  - Valida email e senha
  - Retorna dados do usuário (sem senha)
  - Cria sessão segura
```

### **Empresas**
```
GET  /api/empresas           - Lista todas empresas
GET  /api/empresas/[id]      - Busca empresa por ID
POST /api/empresas           - Cria/atualiza empresa
```

### **Jornadas**
```
GET  /api/jornadas           - Lista jornadas com horários
```

### **CNPJ (Externa)**
```
POST /api/consulta-cnpj      - Consulta CNPJ na ReceitaWS
```

---

## 🔒 Variáveis de Ambiente (.env)

```env
# ✅ Protegidas no servidor
NUXT_PUBLIC_SUPABASE_URL=https://...
NUXT_PUBLIC_SUPABASE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# ❌ NUNCA expor no frontend:
# - SERVICE_ROLE_KEY
# - Senhas de banco
# - Tokens secretos
```

---

## ✅ Checklist de Segurança

### Frontend
- [x] Sem imports do Supabase
- [x] Sem credenciais hardcoded
- [x] Sem acesso direto ao banco
- [x] Todas chamadas via /api/*

### Backend
- [x] Validação de autenticação
- [x] Validação de permissões
- [x] Sanitização de dados
- [x] Credenciais no .env
- [x] Erros genéricos (não expõe detalhes)

### Banco de Dados
- [x] RLS habilitado
- [x] Políticas de segurança ativas
- [x] Senhas não expostas em views
- [x] Auditoria de ações

---

## 🚨 O que NÃO fazer

### ❌ NUNCA no Frontend:
```typescript
// ❌ ERRADO - Expõe credenciais
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
const { data } = await supabase.from('funcionarios').select('*')
```

### ✅ SEMPRE via Backend:
```typescript
// ✅ CORRETO - Passa pelo backend
const response = await $fetch('/api/funcionarios')
```

---

## 📊 Fluxo de Autenticação

```
1. Usuário digita email/senha no frontend
   ↓
2. Frontend envia para POST /api/auth/login
   ↓
3. Backend valida no Supabase
   ↓
4. Backend retorna dados do usuário (sem senha)
   ↓
5. Frontend armazena em useState
   ↓
6. Middleware valida em cada rota protegida
```

---

## 🎯 Benefícios desta Arquitetura

1. **Segurança:** Credenciais nunca expostas
2. **Controle:** Toda lógica no backend
3. **Auditoria:** Logs centralizados
4. **Manutenção:** Mudanças isoladas no backend
5. **Performance:** Cache e otimizações no backend
6. **Compliance:** Atende normas de segurança

---

## 📝 Próximas APIs a Criar

Quando precisar de novas funcionalidades, crie APIs no backend:

```
server/api/
  ├── funcionarios/
  │   ├── index.get.ts       - Listar funcionários
  │   ├── [id].get.ts        - Buscar por ID
  │   ├── index.post.ts      - Criar/atualizar
  │   └── [id].delete.ts     - Deletar
  ├── holerites/
  │   ├── index.get.ts       - Listar holerites
  │   ├── [id].get.ts        - Buscar por ID
  │   └── gerar.post.ts      - Gerar holerite
  ├── beneficios/
  └── ...
```

---

## 🔐 Resumo

**Frontend → Backend → Supabase**

- Frontend: Interface bonita e segura
- Backend: Cérebro e segurança
- Supabase: Armazenamento protegido

**Nunca pule o backend!** 🛡️
