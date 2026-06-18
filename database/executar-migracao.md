# 🚀 Como Executar a Migração no Supabase

## 📋 Pré-requisitos

1. **Acesso ao Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Projeto: `rh-qualitec` (ID: rqryspxfvfzfghrfqtbm)

2. **Credenciais do .env**
   - SUPABASE_URL: `https://rqryspxfvfzfghrfqtbm.supabase.co`
   - SUPABASE_SERVICE_ROLE_KEY: Disponível no .env

## 🎯 Passos para Executar a Migração

### **Método 1: Via Supabase Dashboard (Recomendado)**

1. **Acessar o SQL Editor:**
   ```
   1. Faça login no Supabase Dashboard
   2. Selecione o projeto "rh-qualitec"
   3. Vá para "SQL Editor" no menu lateral
   4. Clique em "New Query"
   ```

2. **Executar a Migração:**
   ```
   1. Copie todo o conteúdo do arquivo: database/migration-supabase-completa.sql
   2. Cole no SQL Editor
   3. Clique em "Run" (ou Ctrl+Enter)
   4. Aguarde a execução (pode levar alguns minutos)
   ```

3. **Verificar Execução:**
   ```sql
   -- Verificar se as tabelas foram criadas
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('holerites', 'funcionario_beneficios', 'funcionario_descontos', 'feriados');
   
   -- Verificar funcionários quinzenais
   SELECT nome_completo, tipo_salario FROM funcionarios WHERE tipo_salario = 'quinzenal';
   
   -- Verificar holerites gerados
   SELECT referencia, tipo, quinzena, status FROM holerites ORDER BY created_at DESC;
   ```

### **Método 2: Via CLI do Supabase**

1. **Instalar Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Fazer Login:**
   ```bash
   supabase login
   ```

3. **Executar Migração:**
   ```bash
   supabase db push --db-url "postgresql://postgres:[senha]@db.rqryspxfvfzfghrfqtbm.supabase.co:5432/postgres"
   ```

## ✅ Verificações Pós-Migração

### **1. Verificar Estrutura das Tabelas:**
```sql
-- Listar todas as novas tabelas
\dt public.*holerites*
\dt public.*funcionario_*
\dt public.*feriados*

-- Verificar constraints
SELECT conname, contype FROM pg_constraint 
WHERE conrelid IN (
  SELECT oid FROM pg_class 
  WHERE relname IN ('holerites', 'funcionario_beneficios', 'funcionario_descontos')
);
```

### **2. Testar Funções:**
```sql
-- Testar função de data útil
SELECT is_dia_util('2026-01-20'::DATE); -- Segunda-feira (deve retornar true)
SELECT is_dia_util('2026-01-25'::DATE); -- Sábado (deve retornar false)

-- Testar cálculo de disponibilização
SELECT calcular_data_disponibilizacao(2026, 1); -- Janeiro 2026

-- Testar geração de holerites
SELECT gerar_holerites_quinzenais(1, 2026, 2); -- Fevereiro 2026 para funcionário ID 1
```

### **3. Verificar Dados de Exemplo:**
```sql
-- Funcionários quinzenais
SELECT id, nome_completo, tipo_salario, salario_base 
FROM funcionarios 
WHERE tipo_salario = 'quinzenal';

-- Holerites gerados
SELECT f.nome_completo, h.referencia, h.quinzena, h.status, h.data_disponibilizacao
FROM holerites h
JOIN funcionarios f ON h.funcionario_id = f.id
ORDER BY h.created_at DESC;

-- Feriados cadastrados
SELECT data, descricao FROM feriados WHERE ativo = true ORDER BY data;
```

## 🔧 Solução de Problemas

### **Erro: "relation already exists"**
```sql
-- Se alguma tabela já existir, você pode removê-la primeiro:
DROP TABLE IF EXISTS holerites CASCADE;
DROP TABLE IF EXISTS funcionario_beneficios CASCADE;
DROP TABLE IF EXISTS funcionario_descontos CASCADE;
-- Depois execute a migração novamente
```

### **Erro: "function already exists"**
```sql
-- Remover funções existentes:
DROP FUNCTION IF EXISTS calcular_data_disponibilizacao(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS gerar_holerites_quinzenais(BIGINT, INTEGER, INTEGER);
-- Depois execute a migração novamente
```

### **Erro de Permissões:**
```sql
-- Verificar se está usando a service_role_key correta
-- Ou execute como superuser no Supabase Dashboard
```

## 📊 Validação Final

Após executar a migração com sucesso, você deve ter:

- ✅ **5 novas tabelas:** holerites, funcionario_beneficios, funcionario_descontos, configuracoes_holerites, feriados
- ✅ **3 funções:** is_dia_util, calcular_data_disponibilizacao, gerar_holerites_quinzenais
- ✅ **Funcionários quinzenais:** 2 funcionários de exemplo
- ✅ **Holerites gerados:** 4 holerites (2 funcionários × 2 quinzenas)
- ✅ **Feriados:** 8 feriados nacionais para 2026
- ✅ **Políticas RLS:** Segurança configurada

## 🎉 Próximos Passos

1. **Testar no Frontend:**
   - Acesse a página de funcionários
   - Crie um funcionário com salário quinzenal
   - Verifique a página de holerites automáticos

2. **Configurar Automação:**
   - Configure um cron job para executar `atualizar_status_holerites()` diariamente
   - Implemente notificações por email

3. **Personalizar:**
   - Adicione feriados municipais/estaduais específicos
   - Configure benefícios padrão da empresa
   - Ajuste valores e percentuais conforme necessário

---

**🚀 Sistema pronto para produção!**