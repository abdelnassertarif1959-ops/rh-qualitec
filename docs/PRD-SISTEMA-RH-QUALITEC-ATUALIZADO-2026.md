# PRD - Sistema de Gestão de RH Qualitec

**Versão:** 2.0  
**Data:** 10 de Fevereiro de 2026  
**Status:** Em Produção  
**Empresa:** Qualitec - Speed Gestão e Serviços Administrativos LTDA

---

## 1. Visão Geral do Produto

### 1.1 Objetivo
Sistema web completo para gestão de recursos humanos, focado em:
- Cadastro e gestão de funcionários (CLT e PJ)
- Geração automatizada de holerites mensais e adiantamentos
- Controle de benefícios e descontos personalizados
- Envio automático de holerites por email
- Portal do funcionário para consulta de documentos
- Sistema de notificações administrativas

### 1.2 Usuários
- **Administradores:** Gestores de RH com acesso total ao sistema
- **Funcionários:** Acesso restrito para visualização de seus próprios holerites

### 1.3 Stack Tecnológica
- **Frontend:** Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS
- **Backend:** Nuxt Server API + Supabase
- **Banco de Dados:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth
- **Email:** Resend API
- **Deploy:** Vercel

---

## 2. Funcionalidades Principais

### 2.1 Gestão de Funcionários

#### 2.1.1 Cadastro de Funcionários
**Dados Pessoais:**
- Nome completo (obrigatório, maiúsculas automáticas)
- CPF (obrigatório, validado, único)
- RG
- Data de nascimento
- Sexo (Masculino/Feminino)
- Estado civil
- Endereço completo
- Telefone e email
- Avatar (seleção de ícones predefinidos)

**Dados Profissionais:**
- Empresa (obrigatório)
- Cargo (obrigatório)
- Departamento (obrigatório)
- Tipo de contrato: CLT ou PJ
- Data de admissão
- Salário base
- Jornada de trabalho (seleção de templates)
- PIS/PASEP (apenas CLT)

**Dados Bancários:**
- Banco
- Agência
- Conta
- Tipo de conta
- PIX (opcional)

**Benefícios:**
- Vale transporte (com cálculo automático de desconto 6%)
- Cesta básica (valor fixo, sem desconto)
- Plano de saúde (com desconto opcional)
- Plano odontológico (com desconto opcional)

**Itens Personalizados:**
- Benefícios ou descontos recorrentes
- Vigência definida (data início e fim)
- Aplicação automática nos holerites do período

#### 2.1.2 Validações
- CPF único no sistema
- Email único no sistema
- Campos obrigatórios validados
- Máscaras de entrada (CPF, telefone, CEP, etc.)


### 2.2 Sistema de Holerites

#### 2.2.1 Tipos de Holerite
1. **Adiantamento Salarial (Quinzenal)**
   - Gerado automaticamente no 5º dia útil do mês
   - Valor: 40% do salário base
   - Período: Dia 15 até último dia do mês anterior
   - Sem descontos (INSS, IRRF, benefícios)
   - Apenas para funcionários CLT

2. **Folha Mensal**
   - Gerado manualmente pelo administrador
   - Período: Dia 1 até último dia do mês vigente
   - Inclui todos os proventos e descontos
   - Desconta o adiantamento pago
   - Para CLT e PJ

#### 2.2.2 Cálculos Automáticos

**Proventos:**
- Salário base
- Horas extras
- Bônus
- Comissões
- Adicionais (noturno, periculosidade, insalubridade)
- Benefícios (cesta básica)

**Descontos CLT:**
- INSS (tabela progressiva 2026)
- IRRF (com dependentes e deduções)
- Vale transporte (6% do salário base)
- Plano de saúde (se configurado)
- Plano odontológico (se configurado)
- Pensão alimentícia
- Itens personalizados vigentes
- Adiantamento pago (na folha mensal)

**Descontos PJ:**
- Apenas itens personalizados
- Sem INSS, IRRF ou benefícios obrigatórios

**FGTS:**
- Calculado automaticamente (8% do salário base)
- Exibido no holerite
- Editável pelo administrador

#### 2.2.3 Geração de Holerites
- Geração em lote para todos os funcionários
- Geração individual
- Regeneração de holerite específico
- Status: Gerado, Enviado, Visualizado
- Data de disponibilização automática

#### 2.2.4 Edição de Holerites
Campos editáveis pelo administrador:
- Salário base
- Horas extras
- Bônus
- Comissões
- Adicionais
- INSS (manual)
- IRRF (manual)
- Vale transporte
- Cesta básica
- Planos de saúde/odontológico
- Pensão alimentícia
- Faltas
- Outros descontos
- FGTS
- Observações

Recálculo automático ao salvar.


**Descontos Personalizados:**
- Pensão alimentícia
- Empréstimos consignados
- Outros descontos recorrentes ou únicos

**Itens Personalizados:**
Sistema flexível para adicionar benefícios ou descontos temporários:
- Tipo: Benefício ou Desconto
- Descrição
- Valor fixo
- Período de vigência (data início e fim)
- Recorrência: Único ou Recorrente
- Aplicação automática nos holerites do período

#### 2.1.2 Acesso ao Sistema
**Criação de Credenciais:**
- Geração automática de usuário e senha
- Envio de email com credenciais de acesso
- Link direto para login
- Validação de CPF único (não permite duplicação)

**Botão "Salvar e Enviar Acesso":**
- Salva o funcionário
- Cria usuário no Supabase Auth
- Envia email com credenciais
- Feedback visual de sucesso/erro

#### 2.1.3 Edição de Funcionários
- Edição completa de todos os dados
- Histórico de alterações via sistema de notificações
- Validação de CPF único ao editar
- Recálculo automático de benefícios ao alterar salário

---

### 2.2 Sistema de Holerites

#### 2.2.1 Geração de Holerites

**Tipos de Holerite:**

1. **Adiantamento Salarial (Quinzenal)**
   - Período: Dia 1 ao dia 14 do mês
   - Valor: 40% do salário base
   - Data de pagamento: 5º dia útil do mês
   - Disponibilização: Automática no 5º dia útil
   - Descontos: Nenhum (apenas proventos)

2. **Folha Mensal**
   - Período: Dia 1 ao último dia do mês
   - Valor: Salário base + benefícios - descontos - adiantamento
   - Data de pagamento: 5º dia útil do mês seguinte
   - Disponibilização: Automática no 5º dia útil
   - Descontos: INSS, IRRF, benefícios, pensão, etc.

**Cálculos Automáticos:**

1. **INSS (CLT)** - Tabela 2026:
   - Até R$ 1.518,00: 7,5%
   - De R$ 1.518,01 até R$ 2.793,88: 9%
   - De R$ 2.793,89 até R$ 4.190,83: 12%
   - De R$ 4.190,84 até R$ 8.157,41: 14%
   - Teto: R$ 908,85

2. **IRRF (CLT):**
   - Base de cálculo: Salário bruto - INSS - dependentes
   - Dedução por dependente: R$ 189,59
   - Faixas progressivas com alíquotas de 0% a 27,5%

3. **FGTS (CLT):**
   - 8% do salário base
   - Não é descontado do funcionário
   - Exibido apenas para informação

4. **Vale Transporte:**
   - Cálculo baseado em tarifa e dias úteis
   - Desconto máximo: 6% do salário base
   - Configurável por funcionário

5. **Pensão Alimentícia:**
   - Valor fixo ou percentual
   - Pode ser cadastrada como item personalizado
   - Aplicada automaticamente nos holerites

**Regras de Negócio:**

- **PJ não tem descontos:** Apenas salário base nos proventos
- **CLT tem todos os descontos:** INSS, IRRF, benefícios, etc.
- **Adiantamento é descontado na folha mensal**
- **Itens personalizados são aplicados automaticamente** se vigentes no período


### 2.3 Sistema de Email

#### 2.3.1 Envio de Holerites
- Envio individual ou em lote
- Email personalizado com dados do funcionário
- Anexo HTML do holerite
- Link direto para visualização no sistema
- Registro de data/hora de envio
- Reenvio permitido

#### 2.3.2 Template de Email
**Assunto:** Holerite disponível - [Mês/Ano]

**Conteúdo:**
- Saudação personalizada
- Período de referência correto:
  - Adiantamento: "15/[mês] - [último dia do mês anterior]"
  - Folha mensal: "[Mês por extenso]"
- Valor do salário líquido
- Link para acesso ao sistema
- Credenciais de primeiro acesso
- Instruções de uso

#### 2.3.3 Email de Acesso
Enviado ao criar/atualizar credenciais:
- Link para login: https://rh-qualitec.vercel.app/login
- CPF (usuário)
- Senha temporária
- Instruções para primeiro acesso

### 2.4 Portal do Funcionário

#### 2.4.1 Autenticação
- Login com CPF (sem pontos/traços)
- Senha (maiúsculas/minúsculas respeitadas)
- Recuperação de senha por email
- Sessão segura com Supabase Auth

#### 2.4.2 Dashboard
- Dados pessoais resumidos
- Último holerite disponível
- Acesso rápido aos holerites

#### 2.4.3 Meus Dados
Visualização de:
- Dados pessoais
- Dados profissionais
- Dados bancários
- Benefícios ativos
- Itens personalizados

#### 2.4.4 Holerites
- Listagem de todos os holerites
- Filtros por competência e tipo
- Visualização em modal
- Download HTML
- Download PDF (em desenvolvimento)
- Indicador de visualização


#### 2.2.2 Edição de Holerites

**Campos Editáveis:**
- Salário base
- Bônus
- Horas extras
- Adicional noturno
- Adicional de periculosidade
- Adicional de insalubridade
- Comissões
- INSS (manual)
- IRRF (manual)
- Vale transporte
- Cesta básica
- Plano de saúde
- Plano odontológico
- Adiantamento
- Faltas
- Pensão alimentícia
- FGTS (editável, mas não afeta o líquido)
- Outros descontos

**Recálculo Automático:**
- Total de proventos
- Total de descontos
- Salário líquido
- Atualização em tempo real

**Validações:**
- Valores não podem ser negativos
- Salário líquido não pode ser negativo
- Campos numéricos com 2 casas decimais

#### 2.2.3 Visualização de Holerites

**Modal de Detalhes:**
- Dados do funcionário
- Período de referência (formatado corretamente)
- Lista de proventos com valores
- Lista de descontos com valores
- Total de proventos (verde)
- Total de descontos (vermelho)
- Salário líquido (azul, destaque)
- Botões: Baixar HTML, Baixar PDF, Fechar

**Período de Referência:**
- **Adiantamento:** "DD/MM/AAAA - DD/MM/AAAA" (período exato)
- **Folha Mensal:** "Mês de AAAA" (mês vigente)

**Exibição de Itens Personalizados:**
- Itens personalizados são exibidos para detalhamento
- Não são somados novamente ao total (já incluídos no banco)
- Identificados visualmente

#### 2.2.4 Envio de Holerites

**Envio Individual:**
- Botão "Enviar por Email" em cada holerite
- Validação: funcionário deve ter email cadastrado
- Email com holerite em HTML anexo
- Registro de data de envio
- Notificação de sucesso/erro

**Envio em Lote:**
- Seleção múltipla de holerites
- Botão "Enviar Selecionados"
- Envio sequencial com feedback
- Contador de sucessos/erros
- Log detalhado de envios

**Template de Email:**
- Assunto: "Holerite - [Mês/Ano] - [Nome do Funcionário]"
- Corpo: Mensagem personalizada com período
- Anexo: Holerite em formato HTML
- Remetente: noreply@qualitec.com.br

**Regras de Envio:**
- Apenas holerites com status "gerado" podem ser enviados
- Email é obrigatório
- Registro de data de envio no banco
- Possibilidade de reenvio

---

### 2.3 Sistema de Notificações

#### 2.3.1 Tipos de Notificações

**Notificações Administrativas:**
- Criação de funcionário
- Edição de funcionário (com campos alterados)
- Exclusão de funcionário
- Geração de holerites
- Envio de holerites
- Erros do sistema

**Informações da Notificação:**
- Título
- Mensagem
- Tipo (info, success, warning, error)
- Data/hora
- Usuário responsável (quando aplicável)
- Campos alterados (em edições)
- Status de leitura

#### 2.3.2 Exibição de Notificações

**Badge de Contador:**
- Ícone de sino no header
- Contador de não lidas (badge vermelho)
- Atualização em tempo real
- Máximo exibido: 99+

**Drawer de Notificações:**
- Abertura ao clicar no sino
- Lista ordenada por data (mais recentes primeiro)
- Scroll infinito
- Marcação de lida ao visualizar
- Botão "Marcar todas como lidas"
- Filtros por tipo (futuro)

**Formatação:**
- Notificações não lidas: fundo destacado
- Notificações lidas: fundo normal
- Ícones por tipo
- Data relativa (há X minutos/horas/dias)

#### 2.3.3 Persistência

**Armazenamento:**
- Tabela `notificacoes` no Supabase
- Campos: id, titulo, mensagem, tipo, lida, created_at, usuario_id
- Índice por data para performance
- Soft delete (não remove, apenas marca como arquivada)

**Limpeza:**
- Notificações antigas (>90 dias) podem ser arquivadas
- Manutenção automática via cron job (futuro)

---

### 2.4 Dashboard

#### 2.4.1 Visão Geral

**Cards de Estatísticas:**
- Total de funcionários ativos
- Total de funcionários CLT
- Total de funcionários PJ
- Folha de pagamento mensal
- Holerites gerados no mês
- Holerites enviados no mês

**Aniversariantes do Mês:**
- Lista de funcionários com aniversário no mês atual
- Foto/avatar
- Nome
- Data de aniversário
- Cargo
- Tooltip com informações adicionais

**Ações Rápidas:**
- Botão "Gerar Holerites"
- Botão "Cadastrar Funcionário"
- Botão "Ver Holerites"
- Botão "Ver Funcionários"


### 2.5 Painel Administrativo

#### 2.5.1 Dashboard
- Total de funcionários ativos
- Holerites gerados no mês
- Aniversariantes do mês (com tooltip)
- Notificações recentes
- Atalhos rápidos

#### 2.5.2 Gestão de Funcionários
- Listagem com busca e filtros
- Cards com informações resumidas
- Ações rápidas: Ver, Editar, Gerar Holerite
- Indicadores visuais (tipo de contrato, status)

#### 2.5.3 Gestão de Holerites
- Listagem completa
- Filtros: Competência, Tipo, Status, Funcionário
- Ações em lote: Gerar, Enviar
- Ações individuais: Ver, Editar, Enviar, Reenviar
- Indicadores de status

#### 2.5.4 Sistema de Notificações
**Tipos de Notificação:**
- Holerite gerado
- Holerite enviado
- Holerite visualizado
- Funcionário cadastrado
- Funcionário editado
- Acesso criado/atualizado

**Funcionalidades:**
- Badge com contador não lidas
- Drawer lateral com listagem
- Ordenação por data (mais recentes primeiro)
- Marcar como lida
- Marcar todas como lidas
- Detalhes da alteração (campos modificados)
- Limite de 50 notificações exibidas

#### 2.5.5 Cadastros Auxiliares
- Empresas
- Departamentos
- Cargos
- Jornadas de trabalho


---

## 3. Regras de Negócio

### 3.1 Cálculos Trabalhistas

#### 3.1.1 INSS 2026 (Tabela Progressiva)
| Faixa | Alíquota |
|-------|----------|
| Até R$ 1.412,00 | 7,5% |
| R$ 1.412,01 a R$ 2.666,68 | 9% |
| R$ 2.666,69 a R$ 4.000,03 | 12% |
| R$ 4.000,04 a R$ 7.786,02 | 14% |

Teto: R$ 908,85

#### 3.1.2 IRRF 2026
**Base de Cálculo:**
- Salário bruto
- (-) INSS
- (-) Dependentes (R$ 189,59 cada)
- (-) Pensão alimentícia

**Tabela:**
| Faixa | Alíquota | Dedução |
|-------|----------|---------|
| Até R$ 2.259,20 | Isento | - |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

#### 3.1.3 Vale Transporte
- Desconto: 6% do salário base
- Apenas para CLT
- Opcional (funcionário pode recusar)

#### 3.1.4 FGTS
- Cálculo: 8% do salário base
- Informativo (não é desconto)
- Editável pelo administrador

### 3.2 Tipos de Contrato

#### 3.2.1 CLT
- Todos os descontos aplicáveis
- INSS e IRRF obrigatórios
- Benefícios com descontos
- Adiantamento quinzenal
- Folha mensal completa

#### 3.2.2 PJ
- Sem INSS e IRRF
- Sem benefícios obrigatórios
- Apenas itens personalizados
- Sem adiantamento
- Folha mensal simplificada

### 3.3 Itens Personalizados

#### 3.3.1 Tipos
- **Benefício:** Soma aos proventos
- **Desconto:** Soma aos descontos

#### 3.3.2 Vigência
- Data início (obrigatória)
- Data fim (opcional)
- Recorrente: Sim/Não
- Aplicação automática em holerites do período

#### 3.3.3 Aplicação
- Verificado na geração do holerite
- Item vigente = data_inicio <= periodo_fim AND (data_fim IS NULL OR data_fim >= periodo_inicio)
- Incluído automaticamente no cálculo


#### 2.4.2 Gráficos e Relatórios (Futuro)
- Evolução da folha de pagamento
- Distribuição por departamento
- Distribuição por tipo de contrato
- Turnover
- Custos com benefícios

---

### 2.5 Portal do Funcionário

#### 2.5.1 Autenticação
- Login com CPF e senha
- Recuperação de senha via email
- Sessão segura com Supabase Auth
- Logout

#### 2.5.2 Meus Dados
**Visualização:**
- Dados pessoais
- Dados profissionais
- Dados bancários
- Benefícios ativos
- Descontos personalizados

**Edição Limitada:**
- Telefone
- Email
- Endereço
- Dados bancários
- Outros dados são somente leitura

#### 2.5.3 Meus Holerites
**Listagem:**
- Holerites disponíveis (ordenados por data)
- Filtros por período
- Status: Disponível, Visualizado
- Busca por competência

**Visualização:**
- Modal com detalhes completos
- Download em HTML
- Download em PDF (futuro)
- Marcação automática como visualizado

**Regras de Acesso:**
- Funcionário vê apenas seus próprios holerites
- Holerites disponíveis automaticamente no 5º dia útil
- Histórico completo desde a admissão

---

## 3. Arquitetura do Sistema

### 3.1 Estrutura de Pastas

```
projeto-rh-qualitec/
├── app/
│   ├── components/          # Componentes Vue
│   │   ├── admin/          # Componentes administrativos
│   │   ├── dashboard/      # Componentes do dashboard
│   │   ├── funcionarios/   # Componentes de funcionários
│   │   ├── holerites/      # Componentes de holerites
│   │   ├── layout/         # Layout e navegação
│   │   └── ui/             # Componentes UI reutilizáveis
│   ├── composables/        # Composables Vue
│   ├── layouts/            # Layouts Nuxt
│   ├── middleware/         # Middleware de autenticação
│   ├── pages/              # Páginas Nuxt
│   ├── types/              # TypeScript types
│   └── utils/              # Utilitários
├── server/
│   ├── api/                # Endpoints da API
│   │   ├── admin/         # APIs administrativas
│   │   ├── auth/          # APIs de autenticação
│   │   ├── funcionarios/  # APIs de funcionários
│   │   ├── holerites/     # APIs de holerites
│   │   └── notificacoes/  # APIs de notificações
│   └── utils/             # Utilitários do servidor
├── database/              # Scripts SQL
├── docs/                  # Documentação
├── scripts/               # Scripts de manutenção
└── public/                # Arquivos estáticos
```

### 3.2 Banco de Dados

**Tabelas Principais:**

1. **funcionarios**
   - Dados pessoais, profissionais e bancários
   - Relacionamento com empresas, cargos, departamentos
   - Benefícios e descontos

2. **holerites**
   - Dados do holerite (proventos, descontos, líquido)
   - Relacionamento com funcionário
   - Status e datas de envio/visualização

3. **itens_personalizados_holerite**
   - Benefícios e descontos temporários
   - Vigência e recorrência
   - Relacionamento com funcionário

4. **notificacoes**
   - Notificações administrativas
   - Status de leitura
   - Tipo e prioridade

5. **empresas**
   - Dados da empresa
   - CNPJ, razão social, endereço

6. **cargos**
   - Cargos disponíveis
   - Relacionamento com funcionários

7. **departamentos**
   - Departamentos da empresa
   - Relacionamento com funcionários

8. **jornadas_trabalho**
   - Jornadas de trabalho disponíveis
   - Horas semanais e mensais

9. **contador_diario**
   - Controle de dias úteis
   - Usado para disponibilização automática

**Segurança:**
- RLS (Row Level Security) habilitado
- Políticas por perfil (admin/funcionário)
- Funcionários veem apenas seus dados
- Admins veem todos os dados


### 3.4 Períodos e Datas

#### 3.4.1 Adiantamento
- **Geração:** 5º dia útil do mês
- **Período:** Dia 15 até último dia do mês anterior
- **Exemplo:** Adiantamento gerado em 05/02/2026
  - Período: 15/01/2026 a 31/01/2026
  - Competência: 2026-01
  - Email: "Período: 15/01 - 31/01"

#### 3.4.2 Folha Mensal
- **Geração:** Manual pelo administrador
- **Período:** Dia 1 até último dia do mês vigente
- **Exemplo:** Folha gerada em 06/02/2026
  - Período: 01/02/2026 a 28/02/2026
  - Competência: 2026-02
  - Email: "Período: Fevereiro de 2026"

#### 3.4.3 Data de Disponibilização
- Adiantamento: 5º dia útil do mês
- Folha mensal: Data de geração
- Usada para ordenação e filtros

### 3.5 Segurança e Permissões

#### 3.5.1 RLS (Row Level Security)
Todas as tabelas protegidas com políticas:
- Funcionários: Veem apenas seus próprios dados
- Administradores: Acesso total
- Holerites: Funcionário vê apenas os seus
- Notificações: Apenas administradores

#### 3.5.2 Autenticação
- Senhas hasheadas com bcrypt
- Sessões gerenciadas pelo Supabase
- Tokens JWT para APIs
- Middleware de autenticação em rotas protegidas

#### 3.5.3 Validações
- CPF único no sistema
- Email único no sistema
- Campos obrigatórios validados
- Tipos de dados validados
- Máscaras de entrada


### 3.3 APIs Principais

**Autenticação:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/recuperar-senha` - Recuperação de senha
- `POST /api/auth/redefinir-senha` - Redefinição de senha
- `GET /api/auth/me` - Dados do usuário logado

**Funcionários:**
- `GET /api/funcionarios` - Listar funcionários
- `GET /api/funcionarios/[id]` - Buscar funcionário
- `POST /api/funcionarios` - Criar funcionário
- `PATCH /api/funcionarios/[id]` - Atualizar funcionário
- `DELETE /api/funcionarios/[id]` - Excluir funcionário
- `POST /api/funcionarios/[id]/criar-acesso` - Criar acesso ao sistema

**Holerites:**
- `GET /api/holerites` - Listar holerites
- `GET /api/holerites/[id]` - Buscar holerite
- `POST /api/holerites/gerar` - Gerar holerites
- `PATCH /api/holerites/[id]` - Atualizar holerite
- `DELETE /api/holerites/[id]` - Excluir holerite
- `POST /api/holerites/[id]/enviar-email` - Enviar por email
- `GET /api/holerites/[id]/html` - Gerar HTML
- `GET /api/holerites/[id]/pdf` - Gerar PDF (futuro)

**Itens Personalizados:**
- `GET /api/holerites/itens-personalizados/[funcionarioId]` - Listar itens
- `POST /api/holerites/itens-personalizados` - Criar item
- `DELETE /api/holerites/itens-personalizados/[id]` - Excluir item

**Notificações:**
- `GET /api/notificacoes` - Listar notificações
- `GET /api/notificacoes/nao-lidas` - Contar não lidas
- `PATCH /api/notificacoes/[id]/marcar-lida` - Marcar como lida
- `POST /api/notificacoes/marcar-todas-lidas` - Marcar todas como lidas

**Dashboard:**
- `GET /api/dashboard/estatisticas` - Estatísticas gerais
- `GET /api/dashboard/aniversariantes` - Aniversariantes do mês

**Utilitários:**
- `POST /api/consulta-cnpj` - Consultar CNPJ na Receita Federal
- `GET /api/cargos` - Listar cargos
- `GET /api/departamentos` - Listar departamentos
- `GET /api/empresas` - Listar empresas
- `GET /api/jornadas` - Listar jornadas

---

## 4. Regras de Negócio Detalhadas

### 4.1 Cálculo de Holerites

#### 4.1.1 Adiantamento Salarial
```
Proventos:
  - Salário Base × 40%

Descontos:
  - Nenhum

Líquido:
  - Proventos
```

#### 4.1.2 Folha Mensal CLT
```
Proventos:
  - Salário Base
  + Bônus
  + Horas Extras
  + Adicional Noturno
  + Adicional Periculosidade
  + Adicional Insalubridade
  + Comissões
  = Total Proventos

Descontos:
  - INSS (calculado sobre salário base)
  - IRRF (calculado sobre base: salário - INSS - dependentes)
  - Vale Transporte (máximo 6% do salário)
  - Cesta Básica (desconto se houver)
  - Plano de Saúde
  - Plano Odontológico
  - Pensão Alimentícia
  - Adiantamento (se houver)
  - Faltas
  - Outros Descontos
  - Itens Personalizados (descontos vigentes)
  = Total Descontos

Líquido:
  - Total Proventos - Total Descontos
```

#### 4.1.3 Folha Mensal PJ
```
Proventos:
  - Salário Base
  + Bônus (se houver)
  = Total Proventos

Descontos:
  - Nenhum (PJ não tem descontos)

Líquido:
  - Total Proventos
```

### 4.2 Disponibilização Automática

**Sistema de Contador Diário:**
- Cron job executa diariamente às 00:00
- Verifica se é dia útil
- Incrementa contador de dias úteis do mês
- No 5º dia útil:
  - Marca adiantamentos como disponíveis
  - Marca folhas mensais como disponíveis (do mês anterior)
  - Envia notificação aos funcionários

**Regras:**
- Sábados e domingos não contam
- Feriados não contam (configurável)
- Contador reseta no início de cada mês

### 4.3 Itens Personalizados

**Vigência:**
- Data início obrigatória
- Data fim opcional (null = indeterminado)
- Item é aplicado se:
  - `data_inicio <= periodo_fim_holerite`
  - `data_fim == null OU data_fim >= periodo_inicio_holerite`

**Recorrência:**
- **Único:** Aplicado apenas uma vez
- **Recorrente:** Aplicado em todos os holerites do período

**Tipos:**
- **Benefício:** Soma aos proventos
- **Desconto:** Soma aos descontos

**Aplicação:**
- Automática na geração de holerites
- Não altera holerites já gerados
- Pode ser editado/removido antes da geração


---

## 4. Arquitetura Técnica

### 4.1 Estrutura do Projeto

```
projeto-rh/
├── app/
│   ├── components/          # Componentes Vue
│   │   ├── admin/          # Componentes administrativos
│   │   ├── dashboard/      # Cards e estatísticas
│   │   ├── funcionarios/   # Gestão de funcionários
│   │   ├── holerites/      # Gestão de holerites
│   │   ├── jornadas/       # Jornadas de trabalho
│   │   └── ui/             # Componentes de UI reutilizáveis
│   ├── composables/        # Composables Vue
│   ├── layouts/            # Layouts da aplicação
│   ├── middleware/         # Middlewares de rota
│   ├── pages/              # Páginas da aplicação
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Utilitários
├── server/
│   ├── api/                # Endpoints da API
│   │   ├── admin/         # APIs administrativas
│   │   ├── auth/          # Autenticação
│   │   ├── funcionarios/  # CRUD funcionários
│   │   ├── holerites/     # CRUD holerites
│   │   └── notificacoes/  # Sistema de notificações
│   └── utils/             # Utilitários do servidor
├── database/              # Migrations SQL
├── docs/                  # Documentação
└── scripts/               # Scripts de manutenção
```

### 4.2 Banco de Dados

#### 4.2.1 Tabelas Principais
- **usuarios:** Autenticação e perfis
- **funcionarios:** Dados completos dos funcionários
- **holerites:** Holerites gerados
- **itens_personalizados_holerite:** Benefícios/descontos recorrentes
- **notificacoes:** Sistema de notificações
- **empresas:** Cadastro de empresas
- **departamentos:** Cadastro de departamentos
- **cargos:** Cadastro de cargos
- **jornadas_trabalho:** Templates de jornada

#### 4.2.2 Relacionamentos
- funcionarios → usuarios (1:1)
- funcionarios → empresas (N:1)
- funcionarios → departamentos (N:1)
- funcionarios → cargos (N:1)
- funcionarios → jornadas_trabalho (N:1)
- holerites → funcionarios (N:1)
- itens_personalizados_holerite → funcionarios (N:1)
- notificacoes → usuarios (N:1)

### 4.3 APIs Principais

#### 4.3.1 Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/recuperar-senha` - Recuperação de senha
- `POST /api/auth/redefinir-senha` - Redefinir senha

#### 4.3.2 Funcionários
- `GET /api/funcionarios` - Listar
- `GET /api/funcionarios/[id]` - Buscar por ID
- `POST /api/funcionarios` - Criar
- `PATCH /api/funcionarios/[id]` - Atualizar
- `DELETE /api/funcionarios/[id]` - Deletar
- `POST /api/funcionarios/[id]/criar-acesso` - Criar acesso ao sistema

#### 4.3.3 Holerites
- `GET /api/holerites` - Listar
- `GET /api/holerites/[id]` - Buscar por ID
- `POST /api/holerites/gerar` - Gerar holerites
- `PATCH /api/holerites/[id]` - Atualizar
- `POST /api/holerites/[id]/enviar-email` - Enviar por email
- `GET /api/holerites/[id]/html` - Gerar HTML
- `GET /api/holerites/[id]/pdf` - Gerar PDF

#### 4.3.4 Itens Personalizados
- `GET /api/holerites/itens-personalizados/[funcionarioId]` - Listar
- `POST /api/holerites/itens-personalizados` - Criar
- `DELETE /api/holerites/itens-personalizados/[id]` - Deletar

#### 4.3.5 Notificações
- `GET /api/notificacoes` - Listar
- `GET /api/notificacoes/nao-lidas` - Contar não lidas
- `PATCH /api/notificacoes/[id]/marcar-lida` - Marcar como lida
- `POST /api/notificacoes/marcar-todas-lidas` - Marcar todas


### 4.4 Integrações

#### 4.4.1 Supabase
- **Autenticação:** Gerenciamento de usuários e sessões
- **Banco de Dados:** PostgreSQL com RLS
- **Storage:** (Futuro) Armazenamento de documentos
- **Realtime:** (Futuro) Notificações em tempo real

#### 4.4.2 Resend
- **Email Transacional:** Envio de holerites e credenciais
- **Templates:** HTML personalizados
- **Tracking:** Registro de envios

#### 4.4.3 ReceitaWS
- **Consulta CNPJ:** Dados da empresa
- **Validação:** Informações cadastrais

### 4.5 Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Resend
RESEND_API_KEY=[api-key]

# URLs
NUXT_PUBLIC_SITE_URL=https://rh-qualitec.vercel.app
```

---

## 5. Interface do Usuário

### 5.1 Design System

#### 5.1.1 Cores
- **Primary:** Azul (#3B82F6)
- **Success:** Verde (#10B981)
- **Warning:** Amarelo (#F59E0B)
- **Danger:** Vermelho (#EF4444)
- **Gray:** Escala de cinza (#F9FAFB a #111827)

#### 5.1.2 Componentes
- **UiButton:** Botões com variantes
- **UiInput:** Campos de entrada com máscaras
- **UiSelect:** Seleção com busca
- **UiModal:** Modais responsivos
- **UiCard:** Cards informativos
- **UiBadge:** Badges de status
- **UiAlert:** Alertas e mensagens
- **UiNotification:** Notificações toast

### 5.2 Responsividade
- **Mobile First:** Design otimizado para mobile
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Grid System:** Tailwind CSS Grid
- **Componentes Adaptáveis:** Layout fluido

### 5.3 Acessibilidade
- **ARIA Labels:** Elementos semânticos
- **Keyboard Navigation:** Navegação por teclado
- **Focus Visible:** Indicadores de foco
- **Color Contrast:** Contraste adequado


### 4.4 Validações e Restrições

**Funcionários:**
- CPF único (não permite duplicação)
- Email único (não permite duplicação)
- Data de admissão não pode ser futura
- Salário base deve ser maior que zero
- Campos obrigatórios: nome, CPF, cargo, departamento, empresa

**Holerites:**
- Não pode gerar holerite duplicado (mesmo funcionário, mesmo período)
- Salário líquido não pode ser negativo
- Valores devem ter no máximo 2 casas decimais
- Data de pagamento não pode ser anterior ao período

**Itens Personalizados:**
- Data início obrigatória
- Data fim deve ser posterior à data início
- Valor deve ser maior que zero
- Descrição obrigatória

**Notificações:**
- Título obrigatório
- Mensagem obrigatória
- Tipo deve ser válido (info, success, warning, error)

---

## 5. Interface do Usuário

### 5.1 Design System

**Cores:**
- **Primary:** Azul (#3B82F6)
- **Success:** Verde (#10B981)
- **Warning:** Amarelo (#F59E0B)
- **Error:** Vermelho (#EF4444)
- **Gray:** Tons de cinza para textos e bordas

**Tipografia:**
- **Font:** Inter (Google Fonts)
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px, 32px

**Componentes:**
- Botões: Primary, Secondary, Ghost, Danger
- Inputs: Text, Number, Select, Textarea, Date
- Cards: Elevação sutil, bordas arredondadas
- Modais: Overlay escuro, centralizado
- Badges: Contador, Status
- Tooltips: Informações adicionais

**Responsividade:**
- Mobile First
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adaptativo
- Menu hambúrguer em mobile

### 5.2 Navegação

**Menu Principal (Admin):**
- Dashboard
- Funcionários
- Holerites
- Relatórios (futuro)
- Configurações (futuro)

**Menu Principal (Funcionário):**
- Meus Dados
- Meus Holerites

**Header:**
- Logo Qualitec
- Nome do usuário
- Avatar
- Notificações (sino com badge)
- Logout

**Footer:**
- Copyright
- Versão do sistema
- Links úteis

### 5.3 Feedback ao Usuário

**Notificações Toast:**
- Sucesso: Verde, ícone de check
- Erro: Vermelho, ícone de X
- Aviso: Amarelo, ícone de alerta
- Info: Azul, ícone de informação
- Duração: 3-5 segundos
- Posição: Canto superior direito

**Loading States:**
- Spinners em botões
- Skeleton screens em listas
- Progress bars em uploads
- Overlay em operações longas

**Confirmações:**
- Modal de confirmação para ações destrutivas
- Botões: Cancelar (secundário) e Confirmar (danger)
- Texto explicativo claro

**Validações:**
- Inline validation em formulários
- Mensagens de erro abaixo dos campos
- Destaque visual em campos com erro
- Scroll automático para primeiro erro

---

## 6. Segurança

### 6.1 Autenticação

**Supabase Auth:**
- JWT tokens
- Refresh tokens
- Session management
- Password hashing (bcrypt)

**Políticas de Senha:**
- Mínimo 6 caracteres
- Sem requisitos de complexidade (por enquanto)
- Recuperação via email

**Sessão:**
- Timeout: 24 horas
- Renovação automática
- Logout em todas as abas

### 6.2 Autorização

**Perfis:**
- **Admin:** Acesso total
- **Funcionário:** Acesso limitado aos próprios dados

**RLS (Row Level Security):**
- Políticas no Supabase
- Funcionários veem apenas seus dados
- Admins veem todos os dados
- Queries automáticas com filtros

**Middleware:**
- Verificação de autenticação em rotas protegidas
- Redirecionamento para login se não autenticado
- Verificação de perfil admin em rotas administrativas

### 6.3 Proteção de Dados

**LGPD:**
- Dados pessoais criptografados
- Consentimento para uso de dados
- Direito ao esquecimento (soft delete)
- Logs de acesso (futuro)

**Backup:**
- Backup automático do Supabase
- Retenção: 7 dias
- Restore point-in-time

**Auditoria:**
- Logs de alterações importantes
- Sistema de notificações registra ações
- Histórico de edições (futuro)

---

## 7. Performance

### 7.1 Otimizações

**Frontend:**
- Code splitting automático (Nuxt)
- Lazy loading de componentes
- Imagens otimizadas
- Cache de assets estáticos
- Minificação de CSS/JS

**Backend:**
- Queries otimizadas com índices
- Paginação em listagens
- Cache de dados estáticos
- Compressão gzip

**Banco de Dados:**
- Índices em campos de busca
- Queries com select específico
- Evitar N+1 queries
- Connection pooling

### 7.2 Monitoramento

**Vercel Analytics:**
- Tempo de carregamento
- Core Web Vitals
- Erros de runtime
- Uso de recursos

**Logs:**
- Erros do servidor
- Queries lentas
- Falhas de autenticação
- Envios de email


---

## 6. Fluxos de Trabalho

### 6.1 Cadastro de Funcionário

1. Admin acessa "Funcionários"
2. Clica em "Novo Funcionário"
3. Preenche dados em abas:
   - Dados Básicos
   - Dados Profissionais
   - Dados Financeiros
   - Benefícios
   - Itens Personalizados
4. Sistema valida CPF único
5. Salva funcionário
6. Opção de criar acesso ao sistema
7. Email enviado com credenciais

### 6.2 Geração de Holerites

#### 6.2.1 Adiantamento (Automático)
1. Cron job executa no 5º dia útil
2. Busca funcionários CLT ativos
3. Para cada funcionário:
   - Calcula 40% do salário
   - Define período (15 até último dia do mês anterior)
   - Cria holerite tipo "adiantamento"
   - Status: "gerado"
4. Notificação criada para admin

#### 6.2.2 Folha Mensal (Manual)
1. Admin acessa "Holerites"
2. Clica em "Gerar Holerites"
3. Seleciona:
   - Tipo: Folha Mensal
   - Competência: Mês/Ano
   - Funcionários (todos ou específicos)
4. Sistema gera para cada funcionário:
   - Busca dados do funcionário
   - Busca itens personalizados vigentes
   - Calcula proventos
   - Calcula descontos (INSS, IRRF, etc.)
   - Desconta adiantamento (se houver)
   - Calcula salário líquido
   - Salva holerite
5. Notificações criadas
6. Admin pode enviar por email

### 6.3 Envio de Holerite

1. Admin seleciona holerite(s)
2. Clica em "Enviar Email"
3. Sistema:
   - Gera HTML do holerite
   - Monta email personalizado
   - Envia via Resend
   - Atualiza status para "enviado"
   - Registra data de envio
   - Cria notificação
4. Funcionário recebe email
5. Acessa link e visualiza holerite
6. Sistema registra visualização

### 6.4 Consulta de Holerite (Funcionário)

1. Funcionário faz login
2. Acessa "Holerites"
3. Visualiza lista de holerites
4. Clica em um holerite
5. Modal exibe detalhes:
   - Proventos detalhados
   - Descontos detalhados
   - Salário líquido
6. Opções:
   - Baixar HTML
   - Baixar PDF
   - Fechar
7. Sistema registra visualização


---

## 7. Melhorias e Correções Implementadas

### 7.1 Fevereiro 2026

#### 7.1.1 Sistema de Notificações
- Implementado sistema completo de notificações
- Badge com contador de não lidas
- Drawer lateral com listagem
- Ordenação por data (mais recentes primeiro)
- Detalhamento de campos alterados
- Limite de 50 notificações

#### 7.1.2 Correções de Holerites
- Corrigido cálculo de período para emails
- Adiantamento: Exibe "15/[mês] - [último dia]"
- Folha mensal: Exibe "[Mês por extenso]"
- Corrigido mês de referência no modal
- Corrigido duplicação de descontos personalizados
- Corrigido cálculo de salário líquido

#### 7.1.3 Campo FGTS
- Adicionado campo FGTS editável
- Cálculo automático (8% do salário base)
- Exibição no holerite e email
- Validação de valores

#### 7.1.4 Validações de Cadastro
- CPF único no sistema
- Email único no sistema
- Validação ao salvar e enviar acesso
- Mensagens de erro claras

#### 7.1.5 Itens Personalizados
- Sistema de benefícios/descontos recorrentes
- Vigência com data início e fim
- Aplicação automática em holerites
- Exibição detalhada no modal
- Não duplicação no cálculo

### 7.2 Problemas Conhecidos e Soluções

#### 7.2.1 Duplicação de Descontos
**Problema:** Descontos personalizados sendo contados duas vezes no modal.

**Causa:** Modal buscava itens personalizados e somava ao total_descontos que já os incluía.

**Solução:** Modal agora usa apenas o total_descontos do banco, exibindo itens personalizados apenas para detalhamento.

#### 7.2.2 Período Incorreto em Emails
**Problema:** Emails mostrando período errado para adiantamentos.

**Causa:** Lógica de formatação não considerava o tipo de holerite.

**Solução:** Implementada lógica específica para cada tipo:
- Adiantamento: Período completo (15/[mês] - [último dia])
- Folha mensal: Mês por extenso

#### 7.2.3 Total de Descontos Incorreto
**Problema:** Holerites com total_descontos incluindo valores "fantasma".

**Causa:** Itens personalizados removidos mas total não recalculado.

**Solução:** Script de correção que recalcula o total baseado apenas nos campos reais.


---

## 8. Integrações

### 8.1 Email (Resend)

**Configuração:**
- API Key: Variável de ambiente
- Domínio verificado: qualitec.com.br
- Remetente: noreply@qualitec.com.br

**Templates:**
- Credenciais de acesso
- Holerite disponível
- Recuperação de senha
- Notificações importantes

**Limites:**
- 100 emails/dia (plano gratuito)
- 3.000 emails/mês (plano gratuito)
- Upgrade conforme necessidade

### 8.2 Consulta CNPJ (Receita Federal)

**API:**
- Endpoint: https://publica.cnpj.ws/cnpj/[cnpj]
- Método: GET
- Sem autenticação
- Rate limit: 3 requisições/minuto

**Dados Retornados:**
- Razão social
- Nome fantasia
- CNPJ
- Endereço completo
- Situação cadastral
- Atividade principal

**Uso:**
- Preenchimento automático ao cadastrar empresa
- Validação de CNPJ

### 8.3 Supabase

**Serviços Utilizados:**
- **Database:** PostgreSQL
- **Auth:** Autenticação e autorização
- **Storage:** Armazenamento de arquivos (futuro)
- **Realtime:** Atualizações em tempo real (futuro)

**Configuração:**
- URL: Variável de ambiente
- Anon Key: Variável de ambiente
- Service Role Key: Variável de ambiente (apenas servidor)

---

## 9. Deploy e Infraestrutura

### 9.1 Vercel

**Configuração:**
- Framework: Nuxt 3
- Node version: 18.x
- Build command: `npm run build`
- Output directory: `.output`

**Variáveis de Ambiente:**
```
SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
SUPABASE_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
RESEND_API_KEY=[resend_key]
BASE_URL=https://rh.qualitec.com.br
```

**Domínio:**
- Produção: rh.qualitec.com.br
- Preview: [branch].vercel.app

**Deploy:**
- Automático no push para main
- Preview em pull requests
- Rollback instantâneo

### 9.2 Supabase

**Plano:**
- Free tier (por enquanto)
- Upgrade conforme crescimento

**Limites:**
- 500 MB de database
- 1 GB de bandwidth/mês
- 50.000 usuários ativos/mês

**Backup:**
- Automático diário
- Retenção: 7 dias
- Restore via dashboard

---

## 10. Roadmap

### 10.1 Fase 1 - MVP (Concluída)
- ✅ Cadastro de funcionários
- ✅ Geração de holerites
- ✅ Envio de holerites por email
- ✅ Portal do funcionário
- ✅ Sistema de notificações
- ✅ Dashboard básico

### 10.2 Fase 2 - Melhorias (Em Andamento)
- ✅ Itens personalizados
- ✅ Disponibilização automática
- ✅ Sistema de contador diário
- ✅ Edição de holerites
- ✅ FGTS editável
- ⏳ Geração de PDF
- ⏳ Relatórios gerenciais

### 10.3 Fase 3 - Expansão (Planejada)
- ⏳ Controle de ponto
- ⏳ Gestão de férias
- ⏳ Gestão de benefícios
- ⏳ Integração com contabilidade
- ⏳ App mobile
- ⏳ Assinatura digital de documentos

### 10.4 Fase 4 - Avançado (Futuro)
- ⏳ BI e Analytics
- ⏳ Inteligência artificial para previsões
- ⏳ Integração com bancos
- ⏳ Portal de recrutamento
- ⏳ Avaliação de desempenho
- ⏳ Treinamentos online

---

## 11. Métricas de Sucesso

### 11.1 KPIs Operacionais
- Tempo médio de geração de holerites: < 5 segundos
- Taxa de sucesso de envio de emails: > 95%
- Tempo de resposta da API: < 500ms
- Uptime: > 99%

### 11.2 KPIs de Usuário
- Taxa de adoção pelos funcionários: > 80%
- Satisfação dos usuários: > 4/5
- Tempo médio de cadastro de funcionário: < 3 minutos
- Redução de erros em folha: > 50%

### 11.3 KPIs de Negócio
- Redução de tempo de processamento: > 70%
- Economia de papel: > 90%
- ROI: Positivo em 6 meses
- Escalabilidade: Suportar 500+ funcionários

---

## 12. Suporte e Manutenção

### 12.1 Documentação

**Documentação Técnica:**
- PRD (este documento)
- Guias de API
- Diagramas de arquitetura
- Fluxogramas de processos
- Changelog

**Documentação de Usuário:**
- Manual do administrador
- Manual do funcionário
- FAQs
- Vídeos tutoriais (futuro)

### 12.2 Suporte

**Canais:**
- Email: suporte@qualitec.com.br
- WhatsApp: (11) 99999-9999
- Sistema de tickets (futuro)

**SLA:**
- Resposta inicial: 24 horas
- Resolução de bugs críticos: 48 horas
- Resolução de bugs menores: 7 dias
- Implementação de melhorias: 30 dias

### 12.3 Manutenção

**Rotinas:**
- Backup diário automático
- Atualização de dependências mensal
- Revisão de segurança trimestral
- Otimização de performance semestral

**Monitoramento:**
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry - futuro)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase Dashboard)

---

## 13. Glossário

**Termos Técnicos:**
- **RLS:** Row Level Security - Segurança em nível de linha
- **JWT:** JSON Web Token - Token de autenticação
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **SSR:** Server-Side Rendering
- **SPA:** Single Page Application

**Termos de RH:**
- **CLT:** Consolidação das Leis do Trabalho
- **PJ:** Pessoa Jurídica
- **INSS:** Instituto Nacional do Seguro Social
- **IRRF:** Imposto de Renda Retido na Fonte
- **FGTS:** Fundo de Garantia do Tempo de Serviço
- **PIS/PASEP:** Programa de Integração Social / Programa de Formação do Patrimônio do Servidor Público

**Termos do Sistema:**
- **Holerite:** Contracheque, demonstrativo de pagamento
- **Adiantamento:** Pagamento antecipado de parte do salário
- **Folha Mensal:** Pagamento completo do mês
- **Item Personalizado:** Benefício ou desconto temporário
- **Disponibilização:** Tornar holerite visível para o funcionário

---

## 14. Contatos

**Equipe de Desenvolvimento:**
- Desenvolvedor Principal: [Nome]
- Email: dev@qualitec.com.br

**Stakeholders:**
- Silvana (Administradora)
- Email: silvana@qualitec.com.br

**Suporte:**
- Email: suporte@qualitec.com.br
- Telefone: (11) 99999-9999

---

## 15. Histórico de Versões

**Versão 2.0 - 10/02/2026**
- Adição de itens personalizados
- Sistema de disponibilização automática
- Correção de bugs em holerites
- Melhorias no sistema de notificações
- FGTS editável
- Atualização completa do PRD

**Versão 1.0 - 03/02/2026**
- Lançamento inicial do sistema
- Cadastro de funcionários
- Geração de holerites
- Portal do funcionário
- Sistema de notificações básico

---

**Documento mantido por:** Equipe de Desenvolvimento Qualitec  
**Última atualização:** 10 de Fevereiro de 2026  
**Próxima revisão:** 10 de Março de 2026

---

## 8. Roadmap e Funcionalidades Futuras

### 8.1 Curto Prazo (1-3 meses)

#### 8.1.1 Geração de PDF
- Implementar geração de PDF dos holerites
- Layout profissional e imprimível
- Download direto pelo funcionário

#### 8.1.2 Relatórios
- Relatório de folha de pagamento mensal
- Relatório de custos por departamento
- Relatório de benefícios
- Exportação para Excel

#### 8.1.3 Histórico de Alterações
- Log completo de alterações em funcionários
- Log de alterações em holerites
- Auditoria de ações administrativas

#### 8.1.4 Melhorias de UX
- Loading states mais claros
- Feedback visual aprimorado
- Animações suaves
- Tour guiado para novos usuários

### 8.2 Médio Prazo (3-6 meses)

#### 8.2.1 Gestão de Férias
- Cadastro de períodos de férias
- Cálculo de férias e 1/3
- Abono pecuniário
- Calendário de férias

#### 8.2.2 Ponto Eletrônico
- Registro de entrada/saída
- Cálculo de horas extras
- Banco de horas
- Relatórios de frequência

#### 8.2.3 Gestão de Documentos
- Upload de documentos (RG, CPF, etc.)
- Controle de validade
- Assinatura digital
- Armazenamento seguro

#### 8.2.4 Dashboard Avançado
- Gráficos de custos
- Análise de turnover
- Indicadores de RH
- Comparativos mensais

### 8.3 Longo Prazo (6-12 meses)

#### 8.3.1 Mobile App
- App nativo para iOS e Android
- Notificações push
- Acesso offline
- Biometria

#### 8.3.2 Integração Contábil
- Exportação para sistemas contábeis
- Integração com eSocial
- SEFIP automático
- DIRF automática

#### 8.3.3 Portal de Benefícios
- Gestão de vale-alimentação
- Gestão de plano de saúde
- Parcerias e descontos
- Marketplace de benefícios

#### 8.3.4 IA e Automação
- Sugestões de reajuste salarial
- Detecção de anomalias
- Chatbot para dúvidas
- Análise preditiva


---

## 9. Métricas e KPIs

### 9.1 Métricas de Uso

#### 9.1.1 Funcionários
- Total de funcionários ativos
- Funcionários CLT vs PJ
- Taxa de crescimento mensal
- Turnover rate

#### 9.1.2 Holerites
- Holerites gerados por mês
- Taxa de envio automático
- Taxa de visualização
- Tempo médio de visualização

#### 9.1.3 Sistema
- Tempo de resposta das APIs
- Uptime do sistema
- Erros e exceções
- Uso de recursos

### 9.2 Métricas de Negócio

#### 9.2.1 Custos
- Folha de pagamento total
- Custo médio por funcionário
- Custos com benefícios
- Custos com encargos

#### 9.2.2 Eficiência
- Tempo de processamento de folha
- Redução de erros manuais
- Tempo economizado em tarefas
- ROI do sistema

### 9.3 Satisfação

#### 9.3.1 Usuários
- NPS (Net Promoter Score)
- Taxa de adoção
- Feedback qualitativo
- Tickets de suporte

---

## 10. Suporte e Manutenção

### 10.1 Documentação

#### 10.1.1 Técnica
- Arquitetura do sistema
- APIs e endpoints
- Banco de dados
- Fluxos de dados

#### 10.1.2 Usuário
- Manual do administrador
- Manual do funcionário
- FAQs
- Vídeos tutoriais

### 10.2 Suporte

#### 10.2.1 Canais
- Email: suporte@qualitec.com.br
- WhatsApp: (11) 99999-9999
- Chat no sistema (futuro)

#### 10.2.2 SLA
- Crítico: 2 horas
- Alto: 8 horas
- Médio: 24 horas
- Baixo: 72 horas

### 10.3 Manutenção

#### 10.3.1 Preventiva
- Backup diário automático
- Monitoramento de performance
- Atualização de dependências
- Testes de segurança

#### 10.3.2 Corretiva
- Hotfixes para bugs críticos
- Patches de segurança
- Correções de dados
- Rollback quando necessário

---

## 11. Segurança e Compliance

### 11.1 LGPD

#### 11.1.1 Dados Pessoais
- Consentimento explícito
- Direito ao esquecimento
- Portabilidade de dados
- Transparência no uso

#### 11.1.2 Segurança
- Criptografia em trânsito (HTTPS)
- Criptografia em repouso
- Senhas hasheadas (bcrypt)
- Tokens JWT seguros

### 11.2 Auditoria

#### 11.2.1 Logs
- Todas as ações registradas
- Timestamp e usuário
- IP de origem
- Dados alterados

#### 11.2.2 Compliance
- Conformidade com CLT
- Conformidade com eSocial
- Conformidade com LGPD
- Auditorias periódicas

---

## 12. Glossário

**Adiantamento:** Pagamento antecipado de 40% do salário, realizado quinzenalmente.

**CLT:** Consolidação das Leis do Trabalho - Regime de contratação com carteira assinada.

**Competência:** Mês/ano de referência do holerite.

**FGTS:** Fundo de Garantia do Tempo de Serviço - 8% do salário depositado mensalmente.

**Holerite:** Documento que detalha proventos, descontos e salário líquido do funcionário.

**INSS:** Instituto Nacional do Seguro Social - Contribuição previdenciária obrigatória.

**IRRF:** Imposto de Renda Retido na Fonte - Imposto sobre a renda.

**Item Personalizado:** Benefício ou desconto recorrente configurado individualmente.

**PJ:** Pessoa Jurídica - Regime de contratação como prestador de serviços.

**Proventos:** Valores que o funcionário recebe (salário, bônus, etc.).

**RLS:** Row Level Security - Segurança em nível de linha no banco de dados.

**Salário Líquido:** Valor final que o funcionário recebe após descontos.

---

## 13. Contatos

**Empresa:** Qualitec - Speed Gestão e Serviços Administrativos LTDA  
**CNPJ:** 28.135.413/0001-00  
**Endereço:** São Paulo, SP  

**Equipe de Desenvolvimento:**
- Desenvolvimento: [Nome]
- Design: [Nome]
- QA: [Nome]
- DevOps: [Nome]

**Stakeholders:**
- Product Owner: Silvana (Administradora)
- Usuários Finais: Funcionários da Qualitec

---

**Última Atualização:** 10 de Fevereiro de 2026  
**Versão do Documento:** 2.0  
**Status:** Aprovado e em Produção
