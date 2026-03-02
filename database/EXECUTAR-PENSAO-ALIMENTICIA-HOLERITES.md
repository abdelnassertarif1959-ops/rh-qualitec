# 🔧 Adicionar Coluna Pensão Alimentícia na Tabela Holerites

## ⚠️ Problema Identificado

**Erro no Terminal:**
```
Could not find the 'pensao_alimenticia' column of 'holerites' in the schema cache
```

**Causa:** A coluna `pensao_alimenticia` existe na tabela `funcionarios`, mas não existe na tabela `holerites`.

## ✅ Solução

Execute o script SQL no Supabase para adicionar a coluna.

## 🚀 OPÇÃO 1: Script Simples (RECOMENDADO)

### Arquivo: `database/38-adicionar-pensao-alimenticia-holerites-SIMPLES.sql`

Este script apenas adiciona a coluna `pensao_alimenticia` sem mexer nas colunas calculadas.

**Passo a Passo:**

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie o conteúdo de `database/38-adicionar-pensao-alimenticia-holerites-SIMPLES.sql`
4. Cole e execute (Run)

## 🔧 OPÇÃO 2: Script Completo

### Arquivo: `database/38-adicionar-pensao-alimenticia-holerites.sql`

Este script adiciona a coluna E recria as colunas calculadas para incluir pensão alimentícia nos totais.

**Use esta opção se:**
- Você quer que `total_descontos` inclua automaticamente a pensão
- Você quer que `salario_liquido` desconte automaticamente a pensão

## 📋 Após Executar o Script

## 📋 Após Executar o Script

### 1. Reinicie o Servidor

### 1. Reinicie o Servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 2. Teste Editar um Holerite

1. Acesse um holerite que tenha pensão alimentícia
2. Clique em "Salvar"
3. Verifique que não há mais erro 500

## 🔍 Verificação no Supabase

Execute esta query para confirmar que a coluna foi criada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name = 'pensao_alimenticia';
```

## 📊 Colunas da Tabela Holerites

Após a execução, a tabela terá estas colunas de descontos:

- `inss`
- `irrf`
- `vale_transporte`
- `cesta_basica_desconto`
- `plano_saude`
- `plano_odontologico`
- `adiantamento`
- `faltas`
- `pensao_alimenticia` ✅ **NOVA**
- `outros_descontos`

## ⚠️ Importante

## ⚠️ Importante

- ✅ O script é **seguro** e pode ser executado múltiplas vezes
- ✅ Usa `IF NOT EXISTS` para evitar erros
- ✅ Não afeta dados existentes
- ✅ Apenas adiciona a coluna necessária

## 🎯 Resultado Esperado

Após executar a solução:

1. ✅ Erro 500 desaparece
2. ✅ Pensão alimentícia é salva corretamente nos holerites
3. ✅ Sistema funciona normalmente

---

**Recomendação:** Use o script SIMPLES primeiro. Se precisar atualizar as colunas calculadas depois, execute o script completo.
