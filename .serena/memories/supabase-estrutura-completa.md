# Estrutura Completa do Banco Supabase - Sistema RH Qualitec

## Informações do Projeto
- **Projeto ID**: rqryspxfvfzfghrfqtbm
- **Nome**: rh qualitec
- **Região**: us-east-1
- **Status**: ACTIVE_HEALTHY
- **PostgreSQL**: 17.6.1.063

## Estrutura de Tabelas

### 1. Tabelas Principais

#### empresas (RLS: ✅)
- **Registros**: 3
- **Campos**: id, nome, nome_fantasia, cnpj (unique), inscricao_estadual, situacao_cadastral, endereco, telefone, email, created_at, updated_at
- **Políticas**: Todos podem ver empresas

#### funcionarios (RLS: ❌)
- **Registros**: 11
- **Campos**: id, nome_completo, cpf (unique), rg, data_nascimento, sexo, telefone, email_pessoal, empresa_id, departamento_id, cargo_id, jornada_trabalho_id, responsavel_id, tipo_contrato, data_admissao, data_demissao, matricula, email_login (unique), senha, tipo_acesso, status, salario_base, tipo_salario, banco, agencia, conta, tipo_conta, forma_pagamento, beneficios (jsonb), descontos_personalizados (jsonb), pis_pasep, numero_dependentes, pensao_alimenticia, avatar, responsavel_cadastro_id, chave_pix, endereco, cep, cidade, estado, senha_hash
- **Políticas**: 
  - Admins gerenciam funcionários
  - Funcionários veem apenas seus dados
  - Funcionários atualizam seus dados

#### holerites (RLS: ✅)
- **Registros**: 22
- **Campos**: id, funcionario_id, periodo_inicio, periodo_fim, data_pagamento, salario_base, bonus, horas_extras, adicional_noturno, adicional_periculosidade, adicional_insalubridade, comissoes, inss, base_inss, aliquota_inss, irrf, base_irrf, aliquota_irrf, vale_transporte, cesta_basica_desconto, plano_saude, plano_odontologico, adiantamento, faltas, outros_descontos, status, horas_trabalhadas, observacoes, enviado_em, visualizado_em, faixa_irrf, beneficios (jsonb), descontos_personalizados (jsonb), total_proventos, total_descontos, salario_liquido
- **Políticas**:
  - Admins podem ver/inserir/atualizar/deletar todos holerites
  - Usuários podem ver seus holerites

#### notificacoes (RLS: ✅)
- **Registros**: 252
- **Campos**: id (uuid), titulo, mensagem, tipo, dados (jsonb), lida, importante, data_criacao, data_leitura, data_expiracao, origem, acao_url
- **Políticas**: Apenas admins podem acessar notificações

### 2. Tabelas de Configuração

#### departamentos (RLS: ✅)
- **Registros**: 7
- **Políticas**: Todos podem ver departamentos

#### cargos (RLS: ✅)
- **Registros**: 14
- **Políticas**: Todos podem ver cargos

#### jornadas_trabalho (RLS: ✅)
- **Registros**: 1
- **Políticas**: Todos podem ver jornadas

#### jornada_horarios (RLS: ✅)
- **Registros**: 7
- **Políticas**: Usuários autenticados podem ler

#### feriados (RLS: ✅)
- **Registros**: 8
- **Políticas**: 
  - Todos podem visualizar feriados
  - Admins gerenciam feriados

### 3. Tabelas de Relacionamento

#### funcionario_beneficios (RLS: ✅)
- **Registros**: 11
- **Políticas**:
  - Admins gerenciam benefícios
  - Funcionários veem seus benefícios

#### funcionario_dependentes (RLS: ✅)
- **Registros**: 0
- **Políticas**:
  - Admins gerenciam dependentes
  - Funcionários veem seus dependentes

#### funcionario_descontos (RLS: ✅)
- **Registros**: 0
- **Políticas**:
  - Admins gerenciam descontos
  - Funcionários veem seus descontos

#### holerite_itens_personalizados (RLS: ✅)
- **Registros**: 0
- **Políticas**: Service role bypass

### 4. Tabelas de Auditoria e Controle

#### auditoria_funcionarios (RLS: ✅)
- **Registros**: 0
- **Políticas**:
  - Admins veem toda auditoria
  - Funcionários veem sua auditoria

#### contador_diario (RLS: ❌)
- **Registros**: 6
- **Função**: Contador que incrementa até 2078

## Funções de Segurança

### Funções de Autenticação
- `is_admin()`: Verifica se usuário é admin
- `get_funcionario_id()`: Retorna ID do funcionário logado
- `pode_ver_funcionario(p_funcionario_id)`: Verifica permissão de visualização

### Funções de Negócio
- `calcular_data_disponibilizacao(ano, mes)`: Calcula data de disponibilização de holerites
- `is_dia_util(data_verificar)`: Verifica se data é dia útil
- `gerar_holerites_quinzenais(p_funcionario_id, p_ano, p_mes)`: Gera holerites quinzenais
- `atualizar_status_holerites()`: Atualiza status dos holerites
- `incrementar_contador_diario()`: Incrementa contador diário

### Funções de Notificações
- `criar_notificacao_aniversario(funcionario_id, funcionario_nome, data_aniversario)`: Cria notificação de aniversário
- `contar_notificacoes_nao_lidas()`: Conta notificações não lidas
- `marcar_notificacao_lida(notificacao_uuid)`: Marca notificação como lida
- `limpar_notificacoes_antigas()`: Remove notificações antigas

### Funções de Auditoria
- `registrar_auditoria()`: Registra ações na auditoria
- `remover_senha_auditoria()`: Remove senhas dos logs de auditoria
- `verificar_integridade_funcionario(p_funcionario_id)`: Verifica integridade dos dados

### Funções de Teste
- `testar_seguranca_rls()`: Testa configurações de RLS

## Triggers

### Triggers de Updated_at
- `update_empresas_updated_at`: Atualiza timestamp em empresas
- `update_funcionarios_updated_at`: Atualiza timestamp em funcionários
- `update_departamentos_updated_at`: Atualiza timestamp em departamentos
- `update_cargos_updated_at`: Atualiza timestamp em cargos
- `update_beneficios_updated_at`: Atualiza timestamp em benefícios
- `update_funcionario_beneficios_updated_at`: Atualiza timestamp em funcionario_beneficios
- `update_configuracoes_holerites_updated_at`: Atualiza timestamp em configuracoes_holerites
- `trigger_update_jornadas_trabalho_updated_at`: Atualiza timestamp em jornadas_trabalho
- `trigger_update_holerites_updated_at`: Atualiza timestamp em holerites
- `trigger_update_itens_personalizados_updated_at`: Atualiza timestamp em holerite_itens_personalizados
- `trigger_update_notificacoes_updated_at`: Atualiza timestamp em notificacoes

### Triggers de Negócio
- `trigger_criar_beneficios_padrao`: Cria benefícios padrão ao inserir funcionário
- `trigger_remover_senha_auditoria`: Remove senhas dos logs de auditoria

## Políticas RLS Detalhadas

### Funcionários
1. **Admins gerenciam funcionários**: Admins podem fazer tudo
2. **Funcionários veem apenas seus dados**: Funcionários só veem seus próprios dados
3. **Funcionários atualizam seus dados**: Funcionários podem atualizar seus dados
4. **Bloquear listagem de funcionários**: Controla acesso à listagem

### Holerites
1. **Admins podem ver todos os holerites**: Acesso total para admins
2. **Admins podem inserir holerites**: Criação por admins
3. **Admins podem atualizar holerites**: Edição por admins
4. **Admins podem deletar holerites**: Exclusão por admins
5. **Usuários podem ver seus holerites**: Funcionários veem apenas seus holerites

### Benefícios e Descontos
- Padrão: Admins gerenciam, funcionários veem apenas os seus

### Auditoria
- Admins veem toda auditoria
- Funcionários veem apenas sua auditoria

### Notificações
- Apenas admins podem acessar (função `is_admin()`)

## Índices de Performance

### Índices Principais
- **funcionarios**: cpf, email_login, empresa_id, departamento_id, cargo_id, status, tipo_salario
- **holerites**: funcionario_id, periodo, data_pagamento, status
- **notificacoes**: data_criacao (DESC), lida, tipo, origem, importante
- **auditoria_funcionarios**: funcionario_id, usuario_id, created_at

### Índices GIN (JSON)
- **funcionarios**: beneficios, descontos_personalizados

### Índices Únicos
- **empresas**: cnpj
- **funcionarios**: cpf, email_login
- **funcionario_beneficios**: funcionario_id
- **feriados**: data
- **funcionario_ponto**: funcionario_id + data
- **jornada_horarios**: jornada_id + dia_semana

## Configurações de Segurança

### RLS Habilitado
- ✅ empresas, departamentos, cargos, jornadas_trabalho, jornada_horarios
- ✅ funcionario_beneficios, funcionario_dependentes, funcionario_descontos
- ✅ funcionario_documentos, funcionario_historico_cargos, funcionario_historico_salarios
- ✅ funcionario_ferias, funcionario_ponto, auditoria_funcionarios
- ✅ holerites, holerite_itens_personalizados, notificacoes
- ✅ feriados, configuracoes_holerites, beneficios

### RLS Desabilitado
- ❌ funcionarios (acesso controlado por políticas específicas)
- ❌ contador_diario (tabela de controle interno)

## Empresas Cadastradas
1. **SPEED GESTAO E SERVICOS ADMINISTRATIVOS LTDA** (46.732.564/0001-10)
2. **QUALITEC COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA** (09.117.117/0001-24)
3. **QUALI COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA** (28.135.413/0001-00)

## Status Atual
- **11 funcionários ativos**
- **22 holerites gerados**
- **252 notificações no sistema**
- **Sistema de segurança RLS implementado**
- **Auditoria completa configurada**
- **Triggers de integridade ativos**