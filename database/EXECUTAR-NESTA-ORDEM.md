# 🚀 ORDEM DE EXECUÇÃO DOS SCRIPTS - GUIA DEFINITIVO

## ⚠️ IMPORTANTE: Execute os scripts EXATAMENTE nesta ordem!

---

## 📋 **ORDEM CORRETA DE EXECUÇÃO:**

### **1️⃣ PRIMEIRO: Criar Tabelas Base**
**Arquivo:** `database/01-criar-tabelas-base.sql`

**O que faz:**
- ✅ Cria tabela `empresas`
- ✅ Cria tabela `departamentos`
- ✅ Cria tabela `cargos`
- ✅ Cria tabela `jornadas_trabalho`
- ✅ Cria tabela `funcionarios` (PRINCIPAL)
- ✅ Cria índices básicos
- ✅ Configura triggers de updated_at
- ✅ Habilita RLS básico

**Status:** ✅ **EXECUTE ESTE PRIMEIRO!**

---

### **2️⃣ SEGUNDO: Sistema Completo**
**Arquivo:** `database/02-sistema-completo.sql`

**O que faz:**
- ✅ Adiciona campo `tipo_salario` em funcionarios
- ✅ Cria tabela `holerites` (mensal e quinzenal)
- ✅ Cria tabela `funcionario_beneficios` (VT, VR, Planos)
- ✅ Cria tabela `funcionario_descontos` (personalizados)
- ✅ Cria tabela `configuracoes_holerites`
- ✅ Cria tabela `feriados`
- ✅ Cria funções de automação
- ✅ Insere feriados nacionais 2026

**Depende de:** Script 01 (funcionarios, empresas)

**Status:** ✅ **EXECUTE DEPOIS DO SCRIPT 01**

---

### **3️⃣ TERCEIRO: Relacionamentos Completos**
**Arquivo:** `database/03-relacionamentos-completos.sql`

**O que faz:**
- ✅ Cria tabela `funcionario_dependentes`
- ✅ Cria tabela `funcionario_documentos`
- ✅ Cria tabela `funcionario_historico_cargos`
- ✅ Cria tabela `funcionario_historico_salarios`
- ✅ Cria tabela `funcionario_ferias`
- ✅ Cria tabela `funcionario_ponto`
- ✅ Cria tabela `auditoria_funcionarios`
- ✅ Cria views úteis
- ✅ Cria funções de verificação

**Depende de:** Scripts 01 e 02

**Status:** ✅ **EXECUTE DEPOIS DO SCRIPT 02**

---

### **4️⃣ QUARTO: Segurança RLS**
**Arquivo:** `database/04-seguranca-rls.sql`

**O que faz:**
- ✅ Configura políticas RLS rigorosas
- ✅ Garante que funcionários só vejam seus dados
- ✅ Configura permissões de admin
- ✅ Cria view segura sem senhas
- ✅ Funções de segurança
- ✅ Testes de segurança

**Depende de:** Scripts 01, 02 e 03

**Status:** ✅ **EXECUTE DEPOIS DO SCRIPT 03**

---

### **5️⃣ QUINTO: Sistema de Jornadas de Trabalho**
**Arquivo:** `database/06-criar-jornadas-trabalho.sql`

**O que faz:**
- ✅ Cria tabela `jornadas_trabalho`
- ✅ Cria tabela `jornada_horarios`
- ✅ Adiciona coluna `jornada_id` em funcionarios
- ✅ Cria jornada padrão 44h
- ✅ Configura RLS para jornadas
- ✅ Cria índices e triggers

**Depende de:** Script 01 (funcionarios)

**Status:** ✅ **EXECUTE DEPOIS DO SCRIPT 04**

---

### **6️⃣ SEXTO: Adicionar Pensão Alimentícia em Holerites**
**Arquivo:** `database/38-adicionar-pensao-alimenticia-holerites.sql`

**O que faz:**
- ✅ Adiciona coluna `pensao_alimenticia` na tabela `holerites`
- ✅ Define tipo DECIMAL(10,2) para valores monetários
- ✅ Define valor padrão 0.00
- ✅ Adiciona comentário explicativo
- ✅ Inclui query de migração opcional

**Depende de:** Script 02 (holerites)

**Status:** ✅ **EXECUTE SE TIVER ERRO DE PENSÃO ALIMENTÍCIA**

**Quando executar:**
- Se aparecer erro: `Could not find the 'pensao_alimenticia' column of 'holerites'`
- Ao salvar holerites com desconto de pensão alimentícia

**Guia completo:** `database/EXECUTAR-PENSAO-ALIMENTICIA-HOLERITES.md`

---

## 🎯 **RESUMO VISUAL:**

```
┌─────────────────────────────────────────┐
│  01-criar-tabelas-base.sql              │
│  ✅ Empresas, Departamentos, Cargos     │
│  ✅ Jornadas, Funcionários              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  02-sistema-completo.sql                │
│  ✅ Holerites, Benefícios               │
│  ✅ Descontos, Feriados                 │
│  ✅ Funções de Automação                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  03-relacionamentos-completos.sql       │
│  ✅ Dependentes, Documentos             │
│  ✅ Históricos, Férias, Ponto           │
│  ✅ Auditoria, Views                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  04-seguranca-rls.sql                   │
│  ✅ Políticas de Segurança              │
│  ✅ Proteção de Dados                   │
│  ✅ Testes de Segurança                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  06-criar-jornadas-trabalho.sql         │
│  ✅ Jornadas de Trabalho                │
│  ✅ Horários por Dia da Semana          │
│  ✅ Jornada Padrão 44h                  │
└─────────────────────────────────────────┘
```

---

## 📝 **COMO EXECUTAR NO SUPABASE:**

### **Passo a Passo:**

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Projeto: rh-qualitec

2. **Vá para SQL Editor**
   - Menu lateral > SQL Editor
   - Clique em "New Query"

3. **Execute Script 01**
   - Copie TODO o conteúdo de `01-criar-tabelas-base.sql`
   - Cole no SQL Editor
   - Clique em "Run" (Ctrl+Enter)
   - ✅ Aguarde mensagem de sucesso

4. **Execute Script 02**
   - Copie TODO o conteúdo de `02-sistema-completo.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Aguarde mensagem de sucesso

5. **Execute Script 03**
   - Copie TODO o conteúdo de `03-relacionamentos-completos.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Aguarde mensagem de sucesso

6. **Execute Script 04**
   - Copie TODO o conteúdo de `04-seguranca-rls.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Aguarde mensagem de sucesso

7. **Execute Script 06 (Jornadas)**
   - Copie TODO o conteúdo de `06-criar-jornadas-trabalho.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Aguarde mensagem de sucesso

---

## ✅ **VERIFICAÇÃO FINAL:**

Após executar TODOS os scripts, execute este comando para verificar:

```sql
-- Verificar todas as tabelas criadas
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('empresas', 'departamentos', 'cargos', 'jornadas_trabalho', 'funcionarios') 
      THEN '01-base'
    WHEN table_name IN ('holerites', 'funcionario_beneficios', 'funcionario_descontos', 'configuracoes_holerites', 'feriados') 
      THEN '02-sistema'
    WHEN table_name IN ('funcionario_dependentes', 'funcionario_documentos', 'funcionario_historico_cargos', 'funcionario_historico_salarios', 'funcionario_ferias', 'funcionario_ponto', 'auditoria_funcionarios') 
      THEN '03-relacionamentos'
    ELSE 'outro'
  END as origem_script
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY origem_script, table_name;

-- Verificar funções criadas
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Verificar políticas RLS
SELECT tablename, policyname
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:**
- ✅ 17+ tabelas criadas
- ✅ 10+ funções criadas
- ✅ 20+ políticas RLS criadas

---

## 🆘 **SE DER ERRO:**

### **Erro: "relation already exists"**
- ✅ **Solução:** Tabela já existe, pode ignorar ou dropar e recriar

### **Erro: "relation does not exist"**
- ❌ **Problema:** Você pulou um script
- ✅ **Solução:** Execute os scripts na ordem correta

### **Erro: "syntax error"**
- ❌ **Problema:** Comentário quebrado ou erro de sintaxe
- ✅ **Solução:** Verifique se copiou o arquivo completo

---

## 🎉 **PRONTO!**

Após executar os 4 scripts na ordem, seu banco de dados estará:

- ✅ **Completo** - Todas as tabelas criadas
- ✅ **Seguro** - RLS configurado
- ✅ **Funcional** - Funções de automação prontas
- ✅ **Pronto para produção** - Sistema 100% operacional

**Agora você pode começar a usar o sistema!** 🚀

---

## 📚 **ARQUIVOS ANTIGOS (IGNORAR):**

Estes arquivos foram reorganizados e podem ser ignorados:
- ❌ `migration-supabase-completa.sql` (use `02-sistema-completo.sql`)
- ❌ `migration-relacionamentos-completos.sql` (use `03-relacionamentos-completos.sql`)
- ❌ `migration-seguranca-rls.sql` (use `04-seguranca-rls.sql`)
- ❌ `migration-sistema-completo.sql` (obsoleto)

**Use APENAS os arquivos numerados (01, 02, 03, 04)!**
