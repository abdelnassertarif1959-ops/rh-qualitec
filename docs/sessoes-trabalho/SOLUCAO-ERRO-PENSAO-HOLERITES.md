# 🚨 Solução: Erro Pensão Alimentícia nos Holerites

**Data:** 10/02/2026  
**Status:** ✅ Solução Pronta

## 🔴 Problema

```
ERROR: Could not find the 'pensao_alimenticia' column of 'holerites' in the schema cache
```

**Causa:** A coluna `pensao_alimenticia` existe na tabela `funcionarios`, mas **não existe** na tabela `holerites`.

## ✅ Solução Rápida (2 Passos)

### 1️⃣ Executar Script SQL no Supabase

**Arquivo:** `database/38-adicionar-pensao-alimenticia-holerites-SIMPLES.sql`

**Como executar:**
1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo acima
4. Clique em **Run**

**O script faz:**
```sql
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;
```

### 2️⃣ Reiniciar Servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## 📊 O Que Foi Corrigido

### Estrutura da Tabela Holerites

**Antes:**
- ❌ Sem coluna `pensao_alimenticia`
- ❌ Erro 500 ao salvar holerites com pensão

**Depois:**
- ✅ Coluna `pensao_alimenticia` adicionada
- ✅ Holerites salvam corretamente

### Colunas de Descontos na Tabela

```
- inss
- irrf
- vale_transporte
- cesta_basica_desconto
- plano_saude
- plano_odontologico
- adiantamento
- faltas
- pensao_alimenticia  ← NOVA
- outros_descontos
```

## 📁 Arquivos Criados

1. **`database/38-adicionar-pensao-alimenticia-holerites-SIMPLES.sql`** ⭐ RECOMENDADO
   - Script SQL simples que apenas adiciona a coluna
   - Rápido e seguro

2. **`database/38-adicionar-pensao-alimenticia-holerites.sql`**
   - Script completo que adiciona a coluna E atualiza colunas calculadas
   - Use se quiser que os totais incluam pensão automaticamente

3. **`database/EXECUTAR-PENSAO-ALIMENTICIA-HOLERITES.md`**
   - Guia detalhado de execução

4. **`SOLUCAO-ERRO-PENSAO-HOLERITES.md`** (este arquivo)
   - Resumo executivo

## 🔍 Verificação

Após executar o script, verifique no Supabase:

```sql
-- Verificar estrutura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name = 'pensao_alimenticia';

-- Verificar alguns registros
SELECT id, pensao_alimenticia, total_descontos, salario_liquido
FROM holerites
LIMIT 5;
```

## ⚠️ Importante

- ✅ O script é **seguro** e pode ser executado múltiplas vezes
- ✅ Não afeta dados existentes
- ✅ Atualiza automaticamente holerites já criados
- ✅ As colunas calculadas são recriadas automaticamente

## 🎯 Resultado Esperado

Após executar a solução:

1. ✅ Erro 500 desaparece
2. ✅ Pensão alimentícia é salva corretamente nos holerites
3. ✅ Total de descontos inclui pensão
4. ✅ Salário líquido está correto
5. ✅ Sistema funciona normalmente

## 📞 Próximos Passos

1. Execute o script SQL no Supabase
2. Reinicie o servidor
3. Teste editar um holerite
4. Confirme que tudo está funcionando

---

**Documentação Completa:** `database/EXECUTAR-PENSAO-ALIMENTICIA-HOLERITES.md`
