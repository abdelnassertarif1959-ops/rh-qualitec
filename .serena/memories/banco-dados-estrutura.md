# Estrutura do Banco de Dados

## Tabelas Principais

### `empresas`
- `id` (UUID, PK)
- `nome` (VARCHAR)
- `cnpj` (VARCHAR, UNIQUE)
- `endereco`, `telefone`, `email`
- `inscricao_estadual`, `inscricao_municipal`
- `created_at`, `updated_at`

### `departamentos`
- `id` (UUID, PK)
- `nome` (VARCHAR)
- `empresa_id` (UUID, FK → empresas)
- `created_at`, `updated_at`

### `cargos`
- `id` (UUID, PK)
- `nome` (VARCHAR)
- `salario_base` (DECIMAL)
- `empresa_id` (UUID, FK → empresas)
- `created_at`, `updated_at`

### `jornadas_trabalho`
- `id` (UUID, PK)
- `nome` (VARCHAR)
- `horas_semanais` (INTEGER)
- `dias_semana` (INTEGER)
- `empresa_id` (UUID, FK → empresas)

### `funcionarios`
- `id` (UUID, PK)
- **Dados Pessoais**: `nome_completo`, `cpf`, `rg`, `data_nascimento`, `sexo`
- **Contato**: `telefone`, `email`, `endereco_completo`
- **Profissionais**: `empresa_id`, `departamento_id`, `cargo_id`, `jornada_id`
- **Financeiros**: `salario`, `conta_bancaria`, `agencia`, `banco`
- **Benefícios**: `vale_transporte_valor`, `cesta_basica_valor`, `plano_saude_valor`
- **Sistema**: `usuario`, `senha_hash`, `is_admin`, `ativo`
- **Datas**: `data_admissao`, `created_at`, `updated_at`

### `holerites`
- `id` (UUID, PK)
- `funcionario_id` (UUID, FK → funcionarios)
- **Período**: `mes_referencia`, `ano_referencia`, `data_disponibilizacao`
- **Valores Base**: `salario_base`, `horas_trabalhadas`, `valor_hora`
- **Proventos**: `salario_bruto`, `horas_extras`, `adicional_noturno`, `outros_proventos`
- **Descontos**: `inss`, `irrf`, `vale_transporte`, `outros_descontos`
- **Líquido**: `salario_liquido`
- **Controle**: `enviado_email`, `data_envio_email`

### `notificacoes`
- `id` (UUID, PK)
- `titulo` (VARCHAR)
- `mensagem` (TEXT)
- `tipo` (VARCHAR) - 'info', 'success', 'warning', 'error'
- `lida` (BOOLEAN)
- `funcionario_id` (UUID, FK → funcionarios)
- `created_at`

## Relacionamentos
- **Empresa** → **Departamentos** (1:N)
- **Empresa** → **Cargos** (1:N)
- **Empresa** → **Jornadas** (1:N)
- **Funcionário** → **Empresa** (N:1)
- **Funcionário** → **Departamento** (N:1)
- **Funcionário** → **Cargo** (N:1)
- **Funcionário** → **Jornada** (N:1)
- **Funcionário** → **Holerites** (1:N)
- **Funcionário** → **Notificações** (1:N)

## Segurança (RLS)
- Políticas de Row Level Security implementadas
- Funcionários só acessam seus próprios dados
- Admins têm acesso completo
- Isolamento por empresa quando aplicável

## Índices Importantes
- `funcionarios.cpf` (UNIQUE)
- `funcionarios.email` (UNIQUE)
- `empresas.cnpj` (UNIQUE)
- `holerites(funcionario_id, mes_referencia, ano_referencia)` (UNIQUE)
- `notificacoes(funcionario_id, created_at)`