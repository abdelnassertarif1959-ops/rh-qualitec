# Estrutura Completa do Banco Supabase - Sistema RH Qualitec

## ⚠️ INFORMAÇÕES ATUALIZADAS DO SUPABASE
**Data da Atualização**: 03/02/2026
**Fonte**: Dados extraídos diretamente do Supabase via MCP Tools

## Informações do Projeto Supabase
- **Projeto ID**: rqryspxfvfzfghrfqtbm
- **Nome**: rh qualitec
- **Região**: us-east-1
- **Status**: ACTIVE_HEALTHY
- **PostgreSQL**: 17.6.1.063
- **MCP Tools**: 29 ferramentas conectadas
- **URL**: db.rqryspxfvfzfghrfqtbm.supabase.co

## Status Atual do Sistema
- **11 funcionários ativos**
- **22 holerites gerados**
- **252 notificações no sistema**
- **3 empresas cadastradas**
- **7 departamentos**
- **14 cargos**
- **1 jornada de trabalho configurada**

## Empresas Cadastradas
1. **SPEED GESTAO E SERVICOS ADMINISTRATIVOS LTDA** (46.732.564/0001-10)
2. **QUALITEC COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA** (09.117.117/0001-24)
3. **QUALI COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA** (28.135.413/0001-00)

## Estrutura de Tabelas Principais

### 1. funcionarios (11 registros, RLS: ❌ - Controlado por políticas)
**Campos principais:**
- id, nome_completo, cpf (unique), email_login (unique)
- empresa_id, departamento_id, cargo_id, jornada_trabalho_id
- tipo_acesso ('admin'/'funcionario'), status, salario_base, tipo_salario
- beneficios (jsonb), descontos_personalizados (jsonb)
- pis_pasep, numero_dependentes, pensao_alimenticia, avatar
- senha_hash, chave_pix

**Políticas de Segurança:**
- Admins gerenciam funcionários (CRUD total)
- Funcionários veem apenas seus dados
- Funcionários atualizam seus dados (limitado)

### 2. holerites (22 registros, RLS: ✅)
**Campos principais:**
- id, funcionario_id, periodo_inicio, periodo_fim, data_pagamento
- salario_base, inss, irrf, vale_transporte, plano_saude
- total_proventos, total_descontos, salario_liquido
- status ('gerado'/'enviado'/'visualizado')
- beneficios (jsonb), descontos_personalizados (jsonb)

**Políticas de Segurança:**
- Admins: CRUD total
- Funcionários: Apenas visualização dos próprios holerites

### 3. notificacoes (252 registros, RLS: ✅)
**Campos principais:**
- id (uuid), titulo, mensagem, tipo, dados (jsonb)
- lida, importante, data_criacao, data_expiracao
- origem, acao_url

**Políticas de Segurança:**
- Apenas admins podem acessar (função is_admin())

### 4. empresas (3 registros, RLS: ✅)
**Campos:** id, nome, nome_fantasia, cnpj (unique), inscricao_estadual, endereco, telefone, email

### 5. funcionario_beneficios (11 registros, RLS: ✅)
**Campos:** vt_ativo, vt_valor_diario, vr_ativo, vr_valor_diario, ps_ativo, po_ativo
**Relação:** 1:1 com funcionários

## Tabelas de Relacionamento e Histórico

### funcionario_dependentes (0 registros, RLS: ✅)
### funcionario_descontos (0 registros, RLS: ✅)
### funcionario_historico_cargos (0 registros, RLS: ✅)
### funcionario_historico_salarios (0 registros, RLS: ✅)
### funcionario_ferias (0 registros, RLS: ✅)
### funcionario_ponto (0 registros, RLS: ✅)
### auditoria_funcionarios (0 registros, RLS: ✅)

## Tabelas de Configuração

### departamentos (7 registros, RLS: ✅)
### cargos (14 registros, RLS: ✅)
### jornadas_trabalho (1 registro, RLS: ✅)
### jornada_horarios (7 registros, RLS: ✅)
### feriados (8 registros, RLS: ✅)
### beneficios (6 registros, RLS: ✅)

## Funções de Segurança Implementadas

### Autenticação
- `is_admin()`: Verifica se usuário é admin
- `get_funcionario_id()`: Retorna ID do funcionário logado
- `pode_ver_funcionario(p_funcionario_id)`: Verifica permissões

### Negócio
- `calcular_data_disponibilizacao(ano, mes)`: Calcula datas de holerites
- `is_dia_util(data_verificar)`: Verifica dias úteis
- `gerar_holerites_quinzenais()`: Gera holerites automáticos
- `incrementar_contador_diario()`: Sistema de contador

### Notificações
- `criar_notificacao_aniversario()`: Cria notificações de aniversário
- `contar_notificacoes_nao_lidas()`: Conta notificações pendentes
- `limpar_notificacoes_antigas()`: Limpeza automática

### Auditoria
- `registrar_auditoria()`: Log automático de operações
- `remover_senha_auditoria()`: Proteção de dados sensíveis
- `verificar_integridade_funcionario()`: Validação de dados

## Triggers Ativos

### Triggers de Updated_at (11 triggers)
- Atualizam automaticamente timestamps em todas as tabelas principais

### Triggers de Negócio
- `trigger_criar_beneficios_padrao`: Cria benefícios ao inserir funcionário
- `trigger_remover_senha_auditoria`: Remove senhas dos logs

## Índices de Performance

### Índices Principais
- **funcionarios**: cpf, email_login, empresa_id, departamento_id, cargo_id, status
- **holerites**: funcionario_id, periodo, data_pagamento, status
- **notificacoes**: data_criacao (DESC), lida, tipo, origem

### Índices GIN (JSON)
- **funcionarios**: beneficios, descontos_personalizados

### Índices Únicos
- **empresas**: cnpj
- **funcionarios**: cpf, email_login
- **funcionario_beneficios**: funcionario_id
- **feriados**: data

## Sistema de Segurança RLS

### Tabelas com RLS Habilitado (18 tabelas)
- empresas, departamentos, cargos, jornadas_trabalho
- funcionario_beneficios, funcionario_dependentes, funcionario_descontos
- holerites, notificacoes, auditoria_funcionarios
- feriados, configuracoes_holerites, beneficios

### Tabelas com RLS Desabilitado (2 tabelas)
- **funcionarios**: Controlado por políticas específicas
- **contador_diario**: Tabela de controle interno

## Políticas de Segurança Implementadas

### Modelo de Acesso
- **Admin**: Acesso total com auditoria
- **Funcionário**: Acesso limitado aos próprios dados
- **Service Role**: Bypass para operações internas

### Controle por JWT
- Autenticação via Supabase Auth
- Identificação por email_login
- Validação contínua de permissões

## Integrações e APIs

### MCP Tools Disponíveis (29 ferramentas)
- Consultas SQL diretas
- Gerenciamento de schema
- Execução de migrações
- Monitoramento em tempo real

### Automações Configuradas
- Geração automática de holerites quinzenais
- Notificações de aniversário
- Limpeza de dados antigos
- Incremento de contador diário

## Observações Importantes

1. **Segurança**: Sistema implementa RLS robusto com auditoria completa
2. **Performance**: Índices otimizados para consultas frequentes
3. **Integridade**: Triggers garantem consistência dos dados
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Manutenibilidade**: Funções e procedures bem documentadas

## Próximas Melhorias Sugeridas

1. Implementar backup automático
2. Adicionar métricas de performance
3. Criar dashboards de monitoramento
4. Implementar alertas de segurança
5. Otimizar consultas mais pesadas

---

**Última Atualização**: 03/02/2026 via MCP Supabase Tools
**Responsável**: Sistema automatizado de documentação