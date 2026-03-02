# 🗄️ Database Setup - Sistema RH

Este diretório contém os scripts SQL para configurar o banco de dados no Supabase.

## 📋 Arquivos

- `supabase-schema.sql` - Schema completo das tabelas, índices, triggers e políticas RLS
- `supabase-seed.sql` - Dados iniciais para teste do sistema
- `README.md` - Este arquivo com instruções

## 🚀 Como executar no Supabase

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login e acesse seu projeto
- Vá para **SQL Editor**

### 2. Execute o Schema
1. Copie todo o conteúdo de `supabase-schema.sql`
2. Cole no SQL Editor
3. Clique em **Run** para executar

### 3. Execute os Dados Iniciais
1. Copie todo o conteúdo de `supabase-seed.sql`
2. Cole no SQL Editor
3. Clique em **Run** para executar

## 🔐 Credenciais de Teste

Após executar os scripts, você terá estas contas disponíveis:

**Administrador:**
- Email: `admin@empresa.com`
- Senha: `123456`
- Acesso: Completo ao sistema

**Funcionário:**
- Email: `funcionario@empresa.com`
- Senha: `123456`
- Acesso: Apenas aos próprios dados

## 🏗️ Estrutura do Banco

### Tabelas Principais

1. **empresas** - Dados da empresa
2. **departamentos** - Setores da empresa
3. **cargos** - Cargos e hierarquia
4. **funcionarios** - Dados dos colaboradores
5. **beneficios** - Benefícios oferecidos
6. **funcionario_beneficios** - Associação funcionário-benefício
7. **holerites** - Contracheques gerados
8. **configuracoes_empresa** - Configurações do sistema
9. **tabelas_fiscais** - Tabelas de INSS e IRRF

### 🔒 Segurança (RLS)

O sistema implementa **Row Level Security** para garantir que:

- **Funcionários** só acessam seus próprios dados
- **Administradores** têm acesso completo
- **Dados sensíveis** são protegidos por políticas específicas

### 📊 Dados de Exemplo

O script de seed inclui:

- 1 empresa exemplo
- 4 departamentos (RH, Financeiro, TI, Comercial)
- 5 cargos hierárquicos
- 4 funcionários (1 admin + 3 funcionários)
- 4 benefícios padrão
- Holerites de exemplo
- Tabelas fiscais 2026 (INSS e IRRF)

## ⚠️ Importante

- **IDs Fixos**: Os UUIDs são fixos para evitar problemas de referência
- **Senhas**: Todas as senhas são hasheadas com bcrypt
- **Unicidade**: Constraints garantem dados únicos (CPF, email, etc.)
- **Triggers**: Atualização automática de `updated_at`

## 🔄 Atualizações Futuras

Para atualizar tabelas fiscais:

```sql
-- Exemplo: Atualizar INSS para 2027
INSERT INTO tabelas_fiscais (tipo, ano, faixa_inicial, faixa_final, aliquota, deducao) 
VALUES ('INSS', 2027, 0.00, 1600.00, 0.075, 0.00);
-- ... outras faixas
```

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se todas as extensões estão habilitadas
2. Confirme que o RLS está configurado corretamente
3. Teste as credenciais de acesso
4. Verifique os logs do Supabase para erros específicos