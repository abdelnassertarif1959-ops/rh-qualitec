# 🚀 Solução Rápida: Erro horas_mensais

## ❌ Erro Atual

```
Could not find the 'horas_mensais' column of 'jornadas_trabalho' in the schema cache
```

## ✅ Solução Imediata (2 minutos)

### Passo 1: Adicionar Coluna no Banco

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole este código:

```sql
-- Adicionar coluna horas_mensais
ALTER TABLE jornadas_trabalho 
ADD COLUMN IF NOT EXISTS horas_mensais DECIMAL(6,2) NOT NULL DEFAULT 0;

-- Atualizar registros existentes
UPDATE jornadas_trabalho 
SET horas_mensais = horas_semanais * 4.33
WHERE horas_mensais = 0;

-- Verificar
SELECT id, nome, horas_semanais, horas_mensais, ativa, padrao 
FROM jornadas_trabalho;
```

5. Clique em **Run** (Ctrl+Enter)
6. Aguarde a confirmação ✅

### Passo 2: Testar no Sistema

1. Volte para a página `/admin/jornadas`
2. Tente criar uma nova jornada
3. Deve funcionar agora! ✅

## 📝 O que Aconteceu?

A tabela `jornadas_trabalho` foi criada sem a coluna `horas_mensais`, mas o código do frontend estava enviando esse campo. Agora a coluna foi adicionada e tudo deve funcionar.

## 🔍 Verificar se Funcionou

Execute no terminal:

```bash
node verificar-schema-jornadas.js
```

Deve mostrar:
```
✅ Jornada inserida com sucesso!
✅ Horários inseridos com sucesso!
```

## ⚠️ Se Ainda Não Funcionar

Se o erro persistir, pode ser cache do Supabase. Faça:

1. No Supabase Dashboard, vá em **Settings** > **API**
2. Clique em **Restart API** (isso limpa o cache)
3. Aguarde 30 segundos
4. Tente novamente

## 📊 Estrutura Final da Tabela

Após a correção, a tabela `jornadas_trabalho` terá:

```sql
- id (BIGSERIAL)
- nome (VARCHAR 100)
- descricao (TEXT)
- horas_semanais (DECIMAL 5,2)  ← Já existia
- horas_mensais (DECIMAL 6,2)   ← NOVA COLUNA
- ativa (BOOLEAN)
- padrao (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## ✅ Pronto!

Após executar o SQL acima, o sistema de jornadas deve funcionar perfeitamente! 🎉
