# 📋 Ordem de Execução dos Scripts SQL

## ⚠️ IMPORTANTE: Execute os scripts nesta ordem exata!

### **Passo 1: Verificar se as tabelas base existem**

Antes de executar qualquer script, verifique se você já tem as tabelas base criadas no Supabase:

```sql
-- Execute este comando para verificar:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('funcionarios', 'empresas', 'departamentos', 'cargos', 'jornadas_trabalho');
```

---

## 🎯 Cenário 1: Banco de Dados VAZIO (Primeira Instalação)

Se você **NÃO** tem nenhuma tabela criada, execute nesta ordem:

### **1️⃣ Primeiro: Criar Estrutura Base**
Execute o arquivo: `database/supabase-schema.sql`
- Cria tabelas: empresas, departamentos, cargos, funcionarios, jornadas_trabalho
- **Arquivo:** Você precisa ter este arquivo ou criar as tabelas base manualmente

### **2️⃣ Segundo: Adicionar Sistema Completo**
Execute o arquivo: `database/migration-supabase-completa.sql`
- Adiciona: tipo_salario, holerites, benefícios, feriados
- Cria funções de automação

### **3️⃣ Terceiro: Adicionar Relacionamentos Completos**
Execute o arquivo: `database/migration-relacionamentos-completos.sql`
- Adiciona: dependentes, documentos, históricos, férias, ponto
- Cria views e funções avançadas

### **4️⃣ Quarto: Aplicar Segurança RLS**
Execute o arquivo: `database/migration-seguranca-rls.sql`
- Configura políticas de segurança
- Garante que funcionários só vejam seus dados

---

## 🔄 Cenário 2: Banco de Dados JÁ EXISTE (Atualização)

Se você **JÁ TEM** as tabelas base (funcionarios, empresas, etc.), execute nesta ordem:

### **1️⃣ Primeiro: Sistema Completo**
Execute: `database/migration-supabase-completa.sql`

### **2️⃣ Segundo: Relacionamentos**
Execute: `database/migration-relacionamentos-completos.sql`

### **3️⃣ Terceiro: Segurança**
Execute: `database/migration-seguranca-rls.sql`

---

## 🆘 Se você NÃO tem o arquivo base (supabase-schema.sql)

Execute este script PRIMEIRO para criar as tabelas base:

```sql
-- =====================================================
-- SCRIPT BASE - Execute PRIMEIRO
-- =====================================================

-- 1. Criar tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  inscricao_estadual VARCHAR(50),
  situacao_cadastral VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de departamentos
CREATE TABLE IF NOT EXISTS departamentos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela de cargos
CREATE TABLE IF NOT EXISTS cargos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar tabela de jornadas de trabalho
CREATE TABLE IF NOT EXISTS jornadas_trabalho (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  horas_semanais DECIMAL(5,2),
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar tabela de funcionarios
CREATE TABLE IF NOT EXISTS funcionarios (
  id BIGSERIAL PRIMARY KEY,
  nome_completo VARCHAR(200) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  data_nascimento DATE,
  sexo VARCHAR(1),
  telefone VARCHAR(20),
  email_pessoal VARCHAR(100),
  
  -- Profissional
  empresa_id BIGINT REFERENCES empresas(id),
  departamento_id BIGINT REFERENCES departamentos(id),
  cargo_id BIGINT REFERENCES cargos(id),
  jornada_trabalho_id BIGINT REFERENCES jornadas_trabalho(id),
  responsavel_id BIGINT REFERENCES funcionarios(id),
  tipo_contrato VARCHAR(20),
  data_admissao DATE,
  matricula VARCHAR(50),
  
  -- Acesso
  email_login VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_acesso VARCHAR(20) DEFAULT 'funcionario',
  status VARCHAR(20) DEFAULT 'ativo',
  
  -- Financeiro
  salario_base DECIMAL(10,2),
  tipo_salario VARCHAR(20) DEFAULT 'mensal',
  banco VARCHAR(100),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  forma_pagamento VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionarios_tipo_acesso_check CHECK (tipo_acesso IN ('funcionario', 'admin')),
  CONSTRAINT funcionarios_status_check CHECK (status IN ('ativo', 'inativo')),
  CONSTRAINT funcionarios_tipo_salario_check CHECK (tipo_salario IN ('mensal', 'quinzenal', 'horista'))
);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_funcionarios_empresa ON funcionarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_departamento ON funcionarios(departamento_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cargo ON funcionarios(cargo_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_email ON funcionarios(email_login);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);

-- =====================================================
-- TABELAS BASE CRIADAS!
-- Agora execute os outros scripts na ordem indicada
-- =====================================================
```

---

## ✅ Verificação Final

Após executar todos os scripts, verifique se tudo foi criado:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar funções criadas
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🎯 Resumo da Ordem Correta

```
1. Script Base (criar tabelas funcionarios, empresas, etc.)
   ↓
2. migration-supabase-completa.sql
   ↓
3. migration-relacionamentos-completos.sql
   ↓
4. migration-seguranca-rls.sql
```

**Agora você pode executar os scripts sem erros!** 🚀