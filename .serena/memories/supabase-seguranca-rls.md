# Regras de Segurança Supabase - Sistema RH Qualitec

## Visão Geral da Segurança

O sistema RH Qualitec implementa um modelo de segurança robusto baseado em:
- **Row Level Security (RLS)** do PostgreSQL
- **Políticas granulares** por tabela e operação
- **Funções de autenticação** personalizadas
- **Auditoria completa** de todas as operações
- **Controle de acesso baseado em roles** (admin/funcionario)

## Modelo de Autenticação

### Tipos de Usuário
1. **Admin**: Acesso total ao sistema
2. **Funcionário**: Acesso limitado aos próprios dados

### Função de Verificação
```sql
is_admin() RETURNS BOOLEAN
-- Verifica se o usuário logado é admin baseado no email_login
```

### Função de Identificação
```sql
get_funcionario_id() RETURNS INTEGER
-- Retorna o ID do funcionário baseado no email_login
```

## Políticas RLS por Tabela

### 1. Funcionários (RLS: Desabilitado - Controlado por Políticas)

**Políticas Ativas:**
- **"Admins gerenciam funcionários"**: Admins podem fazer todas operações
- **"Funcionários veem apenas seus dados"**: SELECT limitado aos próprios dados
- **"Funcionários atualizam seus dados"**: UPDATE limitado aos próprios dados
- **"Bloquear listagem de funcionários"**: Controla acesso à listagem geral

**Regras:**
- Admin: Acesso total (CRUD)
- Funcionário: Apenas seus próprios dados (READ/UPDATE limitado)

### 2. Holerites (RLS: Habilitado)

**Políticas Ativas:**
- **"Admins podem ver todos os holerites"**: SELECT total para admins
- **"Admins podem inserir holerites"**: INSERT para admins
- **"Admins podem atualizar holerites"**: UPDATE para admins
- **"Admins podem deletar holerites"**: DELETE para admins
- **"Usuários podem ver seus holerites"**: SELECT limitado para funcionários

**Regras:**
- Admin: Acesso total (CRUD)
- Funcionário: Apenas visualização dos próprios holerites

### 3. Notificações (RLS: Habilitado)

**Políticas Ativas:**
- **"Apenas admins podem acessar notificações"**: Usa função `is_admin()`

**Regras:**
- Admin: Acesso total
- Funcionário: Sem acesso

### 4. Benefícios e Relacionados (RLS: Habilitado)

#### funcionario_beneficios
- **"Admins gerenciam benefícios"**: CRUD para admins
- **"Funcionários veem seus benefícios"**: SELECT limitado

#### funcionario_dependentes
- **"Admins gerenciam dependentes"**: CRUD para admins
- **"Funcionários veem seus dependentes"**: SELECT limitado

#### funcionario_descontos
- **"Admins gerenciam descontos"**: CRUD para admins
- **"Funcionários veem seus descontos"**: SELECT limitado

### 5. Históricos (RLS: Habilitado)

#### funcionario_historico_cargos
- **"Admins gerenciam histórico de cargos"**: CRUD para admins
- **"Funcionários veem seu histórico de cargos"**: SELECT limitado

#### funcionario_historico_salarios
- **"Admins gerenciam histórico de salários"**: CRUD para admins
- **"Funcionários veem seu histórico de salários"**: SELECT limitado

### 6. Controle de Ponto (RLS: Habilitado)

#### funcionario_ponto
- **"Admins gerenciam todo ponto"**: CRUD para admins
- **"Funcionários gerenciam seu ponto"**: CRUD limitado aos próprios dados

### 7. Auditoria (RLS: Habilitado)

#### auditoria_funcionarios
- **"Admins veem toda auditoria"**: SELECT total para admins
- **"Funcionários veem sua auditoria"**: SELECT limitado aos próprios registros

### 8. Tabelas de Configuração (RLS: Habilitado)

#### empresas, departamentos, cargos, jornadas_trabalho
- **"Todos podem ver"**: SELECT público (dados não sensíveis)

#### feriados
- **"Todos podem visualizar feriados"**: SELECT público
- **"Admins gerenciam feriados"**: CRUD para admins

#### configuracoes_holerites
- **"Admins gerenciam configurações"**: CRUD para admins

## Funções de Segurança Auxiliares

### Verificação de Permissões
```sql
pode_ver_funcionario(p_funcionario_id INTEGER) RETURNS BOOLEAN
-- Verifica se o usuário pode ver dados de um funcionário específico
```

### Auditoria Automática
```sql
registrar_auditoria() RETURNS TRIGGER
-- Registra automaticamente todas as operações CRUD
```

### Proteção de Senhas
```sql
remover_senha_auditoria() RETURNS TRIGGER
-- Remove senhas dos logs de auditoria automaticamente
```

## Triggers de Segurança

### 1. Auditoria Automática
- Todas as tabelas relacionadas a funcionários têm triggers de auditoria
- Registra: ação, usuário, dados anteriores/novos, timestamp

### 2. Proteção de Dados Sensíveis
- **trigger_remover_senha_auditoria**: Remove senhas dos logs automaticamente
- Aplicado na tabela `auditoria_funcionarios`

### 3. Criação Automática de Registros
- **trigger_criar_beneficios_padrao**: Cria registro de benefícios ao cadastrar funcionário

## Controle de Acesso por JWT

### Configuração
- Sistema usa JWT do Supabase Auth
- Email do usuário é extraído do token: `auth.email()`
- Comparação com `funcionarios.email_login` para identificação

### Políticas Baseadas em JWT
```sql
-- Exemplo de política que usa JWT
(EXISTS ( SELECT 1
   FROM funcionarios
  WHERE (((funcionarios.email_login)::text = auth.email()) 
    AND ((funcionarios.tipo_acesso)::text = 'admin'::text))))
```

## Service Role Bypass

### Tabelas com Bypass
- **holerite_itens_personalizados**: Service role pode fazer tudo
- **jornadas_trabalho**: Service role pode fazer tudo
- **jornada_horarios**: Service role pode fazer tudo
- **beneficios**: Service role pode fazer tudo

### Uso do Service Role
- APIs internas do sistema
- Operações de manutenção
- Cron jobs e automações

## Testes de Segurança

### Função de Teste
```sql
testar_seguranca_rls() RETURNS TABLE
-- Testa se RLS está configurado corretamente
-- Verifica políticas criadas
-- Valida views seguras
```

### Validações Implementadas
1. **RLS Habilitado**: Verifica se 13+ tabelas têm RLS ativo
2. **Políticas Criadas**: Confirma 20+ políticas implementadas
3. **Views Seguras**: Valida existência de views de segurança

## Integridade de Dados

### Função de Verificação
```sql
verificar_integridade_funcionario(p_funcionario_id INTEGER)
-- Verifica integridade completa dos dados de um funcionário
-- Valida relacionamentos
-- Confirma configurações obrigatórias
```

## Logs e Monitoramento

### Auditoria Completa
- **Tabela**: `auditoria_funcionarios`
- **Campos**: funcionario_id, usuario_id, acao, tabela_afetada, dados_anteriores, dados_novos, ip_address, user_agent, created_at
- **Ações Rastreadas**: criar, atualizar, deletar, visualizar, exportar

### Limpeza Automática
```sql
limpar_notificacoes_antigas() RETURNS INTEGER
-- Remove notificações lidas com mais de 30 dias
-- Remove notificações expiradas
```

## Boas Práticas Implementadas

### 1. Princípio do Menor Privilégio
- Funcionários só acessam seus próprios dados
- Admins têm acesso controlado e auditado

### 2. Defesa em Profundidade
- RLS + Políticas + Funções + Triggers
- Múltiplas camadas de validação

### 3. Auditoria Completa
- Todas as operações são logadas
- Dados sensíveis são protegidos nos logs

### 4. Segregação de Dados
- Dados por funcionário são isolados
- Empresas têm dados segregados

### 5. Controle de Sessão
- Baseado em JWT do Supabase
- Validação contínua de permissões

## Considerações de Performance

### Índices de Segurança
- `idx_funcionarios_email`: Para lookup rápido de autenticação
- `idx_auditoria_funcionarios_funcionario`: Para consultas de auditoria
- `idx_auditoria_funcionarios_usuario`: Para rastreamento de usuários

### Otimizações
- Políticas RLS otimizadas com índices apropriados
- Funções de segurança com performance considerada
- Limpeza automática de dados antigos