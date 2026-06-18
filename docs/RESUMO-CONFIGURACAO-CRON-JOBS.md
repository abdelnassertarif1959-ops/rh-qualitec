# Resumo: Configuração de Cron Jobs - Sistema RH

## 📋 Configurações no Sistema

### 1. Arquivo `vercel.json` (raiz do projeto)
```json
{
  "crons": [
    {
      "path": "/api/cron/contador-diario",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule:** `0 0 * * *` = Todo dia à meia-noite (00:00)

### 2. Variável de Ambiente `.env`
```env
CRON_SECRET=qualitec-cron-contador-diario-2026-secure-token-xyz789
```

### 3. API do Cron Job
**Arquivo:** `server/api/cron/contador-diario.get.ts`

```typescript
import { requireCronAuth } from '../../utils/cronMiddleware'

export default defineEventHandler(async (event) => {
  // Validar autenticação
  await requireCronAuth(event)
  
  const supabase = serverSupabaseServiceRole(event)
  const hoje = new Date()
  
  // Incrementar contador
  const { data, error } = await supabase
    .from('contador_diario')
    .insert({
      data: hoje.toISOString().split('T')[0],
      contador: 1
    })
  
  return { success: true, data: hoje }
})
```

---

## ⚙️ Configurações na Vercel

### Passo 1: Adicionar Variável de Ambiente
1. Acesse: **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**
2. Adicione:
   - **Key:** `CRON_SECRET`
   - **Value:** `qualitec-cron-contador-diario-2026-secure-token-xyz789`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
3. Clique em **Save**

### Passo 2: Deploy
```bash
git add vercel.json server/api/cron/contador-diario.get.ts
git commit -m "feat: adicionar cron job contador diário"
git push origin main
```

### Passo 3: Verificar Cron Job
1. Acesse: **Vercel Dashboard** → Seu Projeto → **Settings** → **Cron Jobs**
2. Você verá: `contador-diario` com schedule `0 0 * * *`
3. Clique em **Run** para testar manualmente

---

## 🗄️ Tabela no Supabase

### Criar Tabela `contador_diario`

**SQL para executar no Supabase SQL Editor:**

```sql
-- Criar tabela contador_diario
CREATE TABLE IF NOT EXISTS public.contador_diario (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL UNIQUE,
  contador INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para busca por data
CREATE INDEX idx_contador_diario_data ON public.contador_diario(data DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.contador_diario ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura para autenticados"
  ON public.contador_diario
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Permitir inserção apenas via service_role
CREATE POLICY "Permitir inserção via service_role"
  ON public.contador_diario
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Comentários
COMMENT ON TABLE public.contador_diario IS 'Contador diário incrementado automaticamente por cron job';
COMMENT ON COLUMN public.contador_diario.data IS 'Data do registro (única por dia)';
COMMENT ON COLUMN public.contador_diario.contador IS 'Valor do contador (sempre 1 para novos registros)';
```

### Estrutura da Tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGSERIAL | ID único (auto-incremento) |
| `data` | DATE | Data do registro (UNIQUE) |
| `contador` | INTEGER | Valor do contador (sempre 1) |
| `created_at` | TIMESTAMPTZ | Data/hora de criação |
| `updated_at` | TIMESTAMPTZ | Data/hora de atualização |

---

## 🔄 Como Funciona o Envio do Contador

### Fluxo Completo

```
1. VERCEL CRON (00:00 diariamente)
   ↓
   Envia requisição HTTP GET para:
   https://seu-projeto.vercel.app/api/cron/contador-diario
   
   Headers:
   - Authorization: Bearer qualitec-cron-contador-diario-2026-secure-token-xyz789

2. API ENDPOINT (server/api/cron/contador-diario.get.ts)
   ↓
   - Valida token via requireCronAuth()
   - Se inválido → retorna 401 Unauthorized
   - Se válido → continua

3. LÓGICA DE NEGÓCIO
   ↓
   const hoje = new Date()
   const dataFormatada = hoje.toISOString().split('T')[0] // "2026-03-10"
   
   await supabase
     .from('contador_diario')
     .insert({
       data: dataFormatada,  // "2026-03-10"
       contador: 1           // Sempre 1
     })

4. SUPABASE
   ↓
   - Recebe INSERT
   - Verifica constraint UNIQUE na coluna 'data'
   - Se data já existe → erro (ignorado)
   - Se data não existe → cria novo registro
   
   Registro criado:
   {
     id: 123,
     data: "2026-03-10",
     contador: 1,
     created_at: "2026-03-10T00:00:05.123Z",
     updated_at: "2026-03-10T00:00:05.123Z"
   }

5. RESPOSTA
   ↓
   API retorna:
   {
     success: true,
     data: "2026-03-10T00:00:00.000Z"
   }
```

### Exemplo de Dados na Tabela

```sql
SELECT * FROM contador_diario ORDER BY data DESC LIMIT 5;
```

| id | data | contador | created_at | updated_at |
|----|------|----------|------------|------------|
| 5 | 2026-03-10 | 1 | 2026-03-10 00:00:05 | 2026-03-10 00:00:05 |
| 4 | 2026-03-09 | 1 | 2026-03-09 00:00:03 | 2026-03-09 00:00:03 |
| 3 | 2026-03-08 | 1 | 2026-03-08 00:00:02 | 2026-03-08 00:00:02 |
| 2 | 2026-03-07 | 1 | 2026-03-07 00:00:01 | 2026-03-07 00:00:01 |
| 1 | 2026-03-06 | 1 | 2026-03-06 00:00:00 | 2026-03-06 00:00:00 |

---

## 🧪 Testar Manualmente

### Localmente (Desenvolvimento)
```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Chamar API
curl http://localhost:3000/api/cron/contador-diario
```

### Na Vercel (Produção)
```bash
curl -H "Authorization: Bearer qualitec-cron-contador-diario-2026-secure-token-xyz789" \
     https://seu-projeto.vercel.app/api/cron/contador-diario
```

### Via Dashboard Vercel
1. **Settings** → **Cron Jobs**
2. Clique em **Run** no job `contador-diario`
3. Veja o resultado em **Functions** → **Logs**

---

## 📊 Consultar Dados

### Ver últimos 30 dias
```sql
SELECT 
  data,
  contador,
  created_at
FROM contador_diario
WHERE data >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY data DESC;
```

### Verificar se hoje já foi registrado
```sql
SELECT * 
FROM contador_diario 
WHERE data = CURRENT_DATE;
```

### Contar total de registros
```sql
SELECT COUNT(*) as total_dias 
FROM contador_diario;
```

---

## ✅ Checklist de Configuração

- [ ] Criar tabela `contador_diario` no Supabase
- [ ] Adicionar `CRON_SECRET` no `.env` local
- [ ] Adicionar `CRON_SECRET` na Vercel (Environment Variables)
- [ ] Criar arquivo `vercel.json` com configuração do cron
- [ ] Criar API `server/api/cron/contador-diario.get.ts`
- [ ] Fazer commit e push
- [ ] Verificar deploy na Vercel
- [ ] Testar execução manual na Vercel
- [ ] Verificar registro criado no Supabase
- [ ] Aguardar execução automática à meia-noite

---

## 🔍 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Erro 401 | Verificar `CRON_SECRET` na Vercel |
| Cron não executa | Verificar `vercel.json` commitado |
| Erro no Supabase | Verificar se tabela existe |
| Registro duplicado | Normal - constraint UNIQUE impede duplicatas |
| Sem logs | Verificar **Functions** → **Logs** na Vercel |

---

**Data:** 10/03/2026  
**Sistema:** RH Qualitec  
**Versão:** 1.0
