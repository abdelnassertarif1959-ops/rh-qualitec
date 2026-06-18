# ⚡ EXECUTAR AGORA: Persistência de Percentuais

## 🎯 O QUE FAZER

Você precisa executar **1 script SQL** no Supabase para adicionar as colunas de configuração.

## 📋 PASSO A PASSO

### 1. Abrir Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral

### 2. Executar o Script

1. Clique em **New Query**
2. Cole o conteúdo do arquivo: `database/40-adicionar-config-inss-pensao.sql`
3. Clique em **Run** (ou pressione Ctrl+Enter)

### 3. Verificar Sucesso

Você deve ver uma mensagem mostrando as 5 novas colunas:

```
column_name          | data_type | column_default | is_nullable
---------------------|-----------|----------------|------------
inss_percentual      | numeric   | 7.5            | YES
inss_tipo            | varchar   | 'percentual'   | YES
pensao_percentual    | numeric   | 30             | YES
pensao_recorrente    | boolean   | false          | YES
pensao_tipo          | varchar   | 'percentual'   | YES
```

## ✅ TESTAR

1. Abra o sistema
2. Vá em Admin → Holerites
3. Clique em "Editar" em qualquer holerite
4. Vá na aba "Descontos"
5. Mude o percentual do INSS de 7,5% para 8,79%
6. Clique em "Salvar Alterações"
7. Feche o modal
8. Reabra o mesmo holerite
9. ✅ O percentual deve estar em 8,79%

## 🐛 SE DER ERRO

### Erro: "column already exists"

Significa que as colunas já foram criadas. Tudo certo!

### Erro: "permission denied"

Você precisa de permissões de admin no Supabase.

### Erro: "table holerites does not exist"

A tabela holerites não existe. Execute primeiro os scripts de criação da tabela.

## 📝 O QUE FOI CORRIGIDO

**Antes:**
- Você mudava o percentual para 8,79%
- Salvava
- Reabria o modal
- ❌ Voltava para 7,5%

**Depois:**
- Você muda o percentual para 8,79%
- Salva
- Reabre o modal
- ✅ Continua em 8,79%

## 🎉 PRONTO!

Após executar o script SQL, o sistema já estará funcionando corretamente. Não precisa reiniciar nada.

---

**Arquivo SQL:** `database/40-adicionar-config-inss-pensao.sql`  
**Documentação Completa:** `CORRECAO-PERSISTENCIA-CONFIG-INSS-PENSAO-10-02-2026.md`
