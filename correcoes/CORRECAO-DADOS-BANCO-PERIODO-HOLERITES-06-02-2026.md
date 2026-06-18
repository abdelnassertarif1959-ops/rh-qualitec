# 🔧 Correção: Dados do Banco - Período dos Holerites

**Data:** 06/02/2026  
**Status:** ⚠️ REQUER EXECUÇÃO DE SCRIPT SQL

## 🎯 Problema Identificado

O email está mostrando **"fevereiro de 2026"** quando deveria mostrar **"janeiro de 2026"**.

### Causa Raiz:

Os dados no banco estão **ERRADOS**:
- `periodo_inicio`: **2026-02-01** (fevereiro) ❌
- `periodo_fim`: **2026-02-28** (fevereiro) ❌

Deveriam estar:
- `periodo_inicio`: **2026-01-01** (janeiro) ✅
- `periodo_fim`: **2026-01-31** (janeiro) ✅

## 🔍 Por que isso aconteceu?

A API de geração de holerites (`server/api/holerites/gerar.post.ts`) está salvando o **mês vigente** (fevereiro) no banco, mas o correto seria salvar o **mês anterior** (janeiro) para folhas mensais.

## ✅ Solução

### Opção 1: Corrigir os Dados Existentes (RECOMENDADO)

Execute o script SQL no Supabase:

**Arquivo:** `database/37-corrigir-periodo-holerites-janeiro.sql`

```sql
-- Voltar 1 mês nos holerites mensais de fevereiro
UPDATE holerites
SET 
  periodo_inicio = periodo_inicio - INTERVAL '1 month',
  periodo_fim = (periodo_inicio - INTERVAL '1 month' + INTERVAL '1 month' - INTERVAL '1 day')::date,
  updated_at = NOW()
WHERE 
  EXTRACT(DAY FROM periodo_inicio) = 1
  AND periodo_inicio >= '2026-02-01'
  AND periodo_inicio < '2026-03-01'
  AND (observacoes NOT LIKE '%Adiantamento%' OR observacoes IS NULL);
```

**O que faz:**
- Pega holerites mensais (dia 1) de fevereiro
- Volta 1 mês: 2026-02-01 → 2026-01-01
- Ajusta periodo_fim: 2026-02-28 → 2026-01-31
- Não afeta adiantamentos

### Opção 2: Corrigir a API de Geração (FUTURO)

Para evitar o problema em meses futuros, a API `server/api/holerites/gerar.post.ts` precisa ser ajustada para salvar o mês anterior ao invés do mês vigente.

**Mudança necessária (linha 82-95):**

```typescript
// ANTES (salva mês vigente)
const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
const periodoFim = new Date(anoAtual, mesAtual, 0)

// DEPOIS (salva mês anterior)
const mesAnterior = mesAtual - 1
const anoAnterior = mesAnterior === 0 ? anoAtual - 1 : anoAtual
const mesAjustado = mesAnterior === 0 ? 12 : mesAnterior

const periodoInicio = new Date(anoAnterior, mesAjustado - 1, 1)
const periodoFim = new Date(anoAnterior, mesAjustado, 0)
```

## 📋 Passo a Passo para Executar

### 1. Fazer Backup (IMPORTANTE!)

O script já cria um backup automático:
```sql
CREATE TABLE IF NOT EXISTS holerites_backup_20260206 AS 
SELECT * FROM holerites;
```

### 2. Executar no Supabase

1. Acesse o Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de `database/37-corrigir-periodo-holerites-janeiro.sql`
4. Clique em **Run**

### 3. Verificar Resultado

Após executar, o script mostra os dados corrigidos:
```
id | funcionario_id | periodo_inicio | periodo_fim | observacoes
---|----------------|----------------|-------------|------------
X  | Y              | 2026-01-01     | 2026-01-31  | Folha mensal
```

### 4. Testar Email

1. Reiniciar o servidor (se necessário)
2. Enviar um holerite
3. Verificar email:
   - ✅ Deve mostrar "janeiro de 2026"
   - ✅ Deve mostrar "01/01/2026 a 31/01/2026"

## 🔄 Rollback (se necessário)

Se algo der errado, você pode reverter:

```sql
DELETE FROM holerites WHERE updated_at > '2026-02-06';
INSERT INTO holerites SELECT * FROM holerites_backup_20260206;
DROP TABLE holerites_backup_20260206;
```

## 📊 Resumo

### Problema:
- Banco: `periodo_inicio = 2026-02-01` (fevereiro)
- Email: Mostra "fevereiro de 2026"
- Esperado: "janeiro de 2026"

### Solução:
- Executar script SQL para corrigir dados
- Banco: `periodo_inicio = 2026-01-01` (janeiro)
- Email: Mostrará "janeiro de 2026" ✅

### Arquivos:
- Script SQL: `database/37-corrigir-periodo-holerites-janeiro.sql`
- Documentação: `correcoes/CORRECAO-DADOS-BANCO-PERIODO-HOLERITES-06-02-2026.md`

## ⚠️ Importante

- Execute o script **apenas uma vez**
- Verifique o backup antes de executar
- Teste em ambiente de desenvolvimento primeiro (se possível)
- O script afeta apenas holerites mensais de fevereiro
- Adiantamentos não são afetados
