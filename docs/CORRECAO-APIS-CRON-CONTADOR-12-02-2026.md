# Correção de Segurança - APIs de Cron e Contador Diário

**Data:** 12 de Fevereiro de 2026  
**Status:** ✅ Concluído

---

## Resumo

Protegidas 5 APIs de cron jobs e contador diário com autenticação apropriada:
- 3 APIs de cron com proteção por token/IP
- 2 APIs de contador diário com autenticação de usuário

---

## Novo Middleware Criado

### `server/utils/cronMiddleware.ts`

Middleware especializado para proteger APIs de cron jobs com múltiplas camadas de segurança:

1. **Autenticação por Token (Recomendado)**
   - Verifica header `Authorization: Bearer <CRON_SECRET>`
   - Token configurado via variável de ambiente `CRON_SECRET`

2. **Autenticação por IP (Fallback)**
   - Valida IPs da Vercel Cron Jobs
   - Lista de IPs permitidos: 76.76.21.0/24

3. **Modo Desenvolvimento**
   - Autenticação relaxada em `NODE_ENV=development`
   - Facilita testes locais

---

## APIs Protegidas

### APIs de Cron (3 APIs)

#### 1. `cron/incrementar-contador-diario.get.ts`
- **Proteção:** `requireCronAuth()`
- **Motivo:** Apenas serviços de cron autorizados podem incrementar o contador
- **Método:** Token secreto ou IP da Vercel
- **Log:** Adicionado log de auditoria

#### 2. `cron/verificar-aniversariantes-diario.get.ts`
- **Proteção:** `requireCronAuth()`
- **Motivo:** Apenas serviços de cron autorizados podem criar notificações
- **Método:** Token secreto ou IP da Vercel
- **Log:** Adicionado log de auditoria

#### 3. `cron/verificar-disponibilizacao-adiantamentos.get.ts`
- **Proteção:** `requireCronAuth()`
- **Motivo:** Apenas serviços de cron autorizados podem disponibilizar adiantamentos
- **Método:** Token secreto ou IP da Vercel
- **Log:** Adicionado log de auditoria

---

### APIs de Contador Diário (2 APIs)

#### 4. `contador-diario/index.get.ts`
- **Proteção:** `requireAuth()`
- **Motivo:** Apenas usuários autenticados podem consultar o contador
- **Log:** Adicionado log de auditoria

#### 5. `contador-diario/status.get.ts`
- **Proteção:** `requireAuth()`
- **Motivo:** Apenas usuários autenticados podem ver o status do contador
- **Log:** Adicionado log de auditoria

---

## Configuração Necessária

### Variável de Ambiente

Adicione ao `.env` e nas variáveis de ambiente da Vercel:

```bash
# Secret para autenticar chamadas de cron jobs
# Gere uma string aleatória segura (ex: openssl rand -hex 32)
CRON_SECRET=sua_string_secreta_aqui
```

### Gerar Token Seguro

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Como Usar

### Chamada de Cron Job Autorizada

```bash
# Com token
curl -X GET https://seu-dominio.com/api/cron/incrementar-contador-diario \
  -H "Authorization: Bearer SEU_CRON_SECRET"

# Resposta de sucesso
{
  "success": true,
  "message": "Contador incrementado com sucesso",
  "data": {
    "numero": 123,
    "data_criacao": "2026-02-12T10:00:00Z",
    "data_execucao": "2026-02-12T10:00:00Z"
  }
}
```

### Configuração no Vercel Cron

No arquivo `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/incrementar-contador-diario",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/verificar-aniversariantes-diario",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/verificar-disponibilizacao-adiantamentos",
      "schedule": "0 9 17 * *"
    }
  ]
}
```

O Vercel automaticamente adiciona o header de autorização quando configurado.

---

## Validação

Todas as APIs foram validadas com:
- ✅ Diagnóstico de código TypeScript (0 erros)
- ✅ Middleware de cron implementado
- ✅ Logs de auditoria implementados
- ✅ Múltiplas camadas de segurança

---

## Segurança Implementada

### Camadas de Proteção

1. **Token Secreto (Primária)**
   - Validação de `CRON_SECRET`
   - Proteção contra acesso não autorizado

2. **Whitelist de IPs (Secundária)**
   - IPs da Vercel Cron Jobs
   - Fallback se token não configurado

3. **Modo Desenvolvimento (Terciária)**
   - Facilita testes locais
   - Apenas em `NODE_ENV=development`

### Logs de Auditoria

Todas as chamadas são registradas:
```
[CRON] Verificação de aniversariantes autorizada
[CRON] Incremento de contador diário autorizado
[CRON] Verificação de adiantamentos autorizada
```

---

## Impacto de Segurança

- ✅ Cron Jobs: Apenas serviços autorizados podem executar
- ✅ Contador Diário: Apenas usuários autenticados podem consultar
- ✅ Proteção contra execução não autorizada
- ✅ Logs de auditoria para rastreamento

---

## Próximos Passos

Continuar com APIs críticas pendentes:
- APIs de Holerites (11 APIs) - PRIORIDADE ALTA
- APIs de Notificações (8 APIs)

---

**Responsável:** Kiro AI  
**Arquivos Criados:** 1 middleware + 5 APIs protegidas
