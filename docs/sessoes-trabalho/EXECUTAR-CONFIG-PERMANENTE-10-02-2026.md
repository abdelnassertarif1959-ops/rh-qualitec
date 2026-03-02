# Guia Rápido: Executar Configurações Permanentes
**Data:** 10/02/2026

## 🎯 O Que Fazer

Executar a migração SQL para adicionar campos de configuração permanente de INSS e Pensão no cadastro dos funcionários.

## 📋 Passo a Passo

### 1. Abrir Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral

### 2. Executar Migração

1. Abra o arquivo: `database/42-adicionar-config-permanente-inss-pensao.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em "Run" (ou pressione Ctrl+Enter)

### 3. Verificar Resultado

Você deve ver:

```
✅ ALTER TABLE
✅ COMMENT ON COLUMN (9x)
✅ UPDATE funcionarios
✅ SELECT (mostrando funcionários com configurações)
```

### 4. Testar no Sistema

1. Abra o sistema RH
2. Vá em "Gestão de Holerites"
3. Clique em "Editar" em qualquer holerite
4. Configure INSS e Pensão
5. Salve
6. Gere um novo holerite para o mesmo funcionário
7. Verifique se as configurações foram aplicadas automaticamente

## ✅ Resultado Esperado

Após executar a migração:

1. **Campos Criados:** 9 novos campos na tabela `funcionarios`
2. **Dados Migrados:** Configurações dos holerites mais recentes copiadas para os funcionários
3. **Sistema Funcionando:** Configurações permanentes sendo salvas e carregadas automaticamente

## 🔍 Verificar Manualmente

Execute no SQL Editor:

```sql
SELECT 
  id,
  nome_completo,
  inss_config_tipo,
  inss_config_percentual,
  inss_config_referencia,
  pensao_config_tipo,
  pensao_config_percentual,
  pensao_config_ativa
FROM funcionarios
WHERE inss_config_tipo IS NOT NULL OR pensao_config_ativa = true
ORDER BY nome_completo;
```

Você deve ver os funcionários com suas configurações permanentes.

## 📝 Exemplo de Resultado

```
| id | nome_completo      | inss_config_tipo | inss_config_percentual | inss_config_referencia | pensao_config_tipo | pensao_config_percentual | pensao_config_ativa |
|----|-------------------|------------------|------------------------|------------------------|-------------------|-------------------------|---------------------|
| 1  | Leonardo Ramos    | fixo             | 8.79                   | 8.79                   | percentual        | 30.00                   | true                |
| 2  | Samuel Tarif      | fixo             | 8.90                   | 8.90                   | NULL              | NULL                    | false               |
| 3  | Cloves Alexandre  | fixo             | 9.00                   | 9.00                   | NULL              | NULL                    | false               |
```

## ⚠️ Importante

- **Backup:** A migração faz UPDATE na tabela `funcionarios`, mas é seguro
- **Reversível:** Se necessário, os campos podem ser removidos sem afetar dados existentes
- **Compatível:** Funciona com holerites antigos e novos

## 🚀 Próximos Passos

Após executar a migração:

1. As configurações de INSS e Pensão serão permanentes
2. Ao editar um holerite e salvar, as configurações são salvas no funcionário
3. Ao gerar novos holerites, as configurações são aplicadas automaticamente
4. Você pode alterar as configurações a qualquer momento

---

**Execute a migração e aproveite as configurações permanentes! ✅**
