# PRD — Sistema de RH Qualitec
> **Product Requirements Document**  
> Versão: 1.0 | Data: 2026-06-17 | Status: **Produção**

---

## 1. Visão Geral do Produto

### 1.1 Nome e Propósito

**rh-qualitec** é um sistema interno de gestão de Recursos Humanos desenvolvido para o grupo de empresas **Qualitec / Speed / Quali**. O sistema digitaliza e centraliza todos os processos de RH — desde o cadastro de funcionários e geração automática de holerites até comunicação interna e gestão de documentos — substituindo processos manuais em planilhas e papel.

### 1.2 Público-Alvo

| Perfil | Descrição |
|---|---|
| **Administrador (RH/Gerência)** | Usuário com acesso total; gerencia funcionários, gera holerites, envia comunicados |
| **Funcionário** | Acesso restrito ao próprio perfil; visualiza holerites, dados pessoais, avisos e documentos |

### 1.3 Objetivo de Negócio

- Centralizar a gestão de pessoal de 3 empresas do grupo em uma única plataforma
- Automatizar o cálculo de holerites (INSS, IRRF, adiantamentos, pensão alimentícia)
- Garantir conformidade fiscal com a legislação vigente (Lei 15.270/2025 — tabela IRRF 2026)
- Fornecer canal de comunicação interno entre RH e colaboradores
- Digitalizar o envio e armazenamento de documentos de funcionários

---

## 2. Contexto e Infraestrutura

### 2.1 Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework** | Nuxt.js (SSR) | `^4.2.2` |
| **Frontend** | Vue.js | `^3.5.26` |
| **CSS** | Tailwind CSS | via `@nuxtjs/tailwindcss ^6.14.0` |
| **Linguagem** | TypeScript | — |
| **Backend** | Nuxt Nitro (API Routes) | — |
| **Banco de Dados** | Supabase (PostgreSQL 17.6) | — |
| **Autenticação** | JWT customizado + cookies httpOnly | `jsonwebtoken ^9.0.3` |
| **E-mail** | Nodemailer + Skymail SMTP | `^7.0.12` |
| **Animações** | motion-v | `^2.0.0-beta.4` |
| **Ícones** | Heroicons Vue | `^2.2.0` |
| **Geração PDF** | pdfkit | `^0.13.0` |
| **Runtime Node** | Node.js | `20.x` |

### 2.2 Infraestrutura de Deploy

```
┌──────────────────────────────────────────────────┐
│                   VERCEL (Serverless)              │
│                                                    │
│  ┌─────────────────┐    ┌───────────────────────┐ │
│  │   Nuxt SSR App   │    │   Nitro API Routes    │ │
│  │  (Frontend/SSR)  │◄──►│  /api/**              │ │
│  └─────────────────┘    │  maxDuration: 30s      │ │
│                          └───────────┬───────────┘ │
└──────────────────────────────────────┼─────────────┘
                                       │
                             ┌─────────▼─────────┐
                             │    SUPABASE         │
                             │  PostgreSQL 17.6    │
                             │  Região: us-east-1  │
                             │  Projeto: rqryspx…  │
                             └────────────────────┘
```

**URL de produção:** `https://rhqualitec.vercel.app`  
**ID do projeto Supabase:** `rqryspxfvfzfghrfqtbm`  
**Região:** `us-east-1` (AWS)

### 2.3 Configurações de Segurança (HTTP Headers)

Configurados via `nuxt.config.ts` para **todas as rotas (`/**`)**:

| Header | Valor |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |

### 2.4 Jobs Agendados (Cron — Vercel)

| Endpoint | Schedule | Descrição |
|---|---|---|
| `/api/cron/verificar-disponibilizacao-adiantamentos` | `0 0 * * *` | Libera adiantamentos automaticamente no dia 17 |
| `/api/cron/verificar-aniversariantes-diario` | `0 9 * * *` | Verifica e notifica aniversariantes do dia |
| `/api/cron/incrementar-contador-diario` | `0 12 * * *` | Incrementa contador de acessos diários |
| `/api/cron/gerar-adiantamentos-dia-20` | `0 6 * * *` | Processa adiantamentos no dia 20 |

---

## 3. Módulos e Funcionalidades

### 3.1 Autenticação e Segurança

**Mecanismo:** JWT customizado (não usa Supabase Auth diretamente).

- **Login:** E-mail + senha via `/api/auth/login.post.ts`; hash bcrypt/bcryptjs na senha
- **Sessão:** Access token (JWT) + Refresh token armazenados em cookies `httpOnly` (`maxAge: 24h`)
- **Estado no cliente:** `useState` do Nuxt + `localStorage` (via `useAuthStorage`)
- **Middleware de rota:** `auth.ts` protege todas as páginas exceto `/login`
- **Middleware admin:** `admin.ts` para rotas exclusivas de administrador
- **CSRF Protection:** Token CSRF via `/api/csrf-token.get.ts` + `csrfMiddleware.ts`
- **Reset de senha:** Fluxo completo de recuperação por e-mail com token expirado

**Níveis de acesso:**

| Tipo | Acesso |
|---|---|
| `admin` | Total: funcionários, holerites, avisos, documentos, empresas, etc. |
| `funcionario` | Restrito: próprios dados, holerites, arquivos, código de ética |

---

### 3.2 Gestão de Funcionários

**Rota Admin:** `/admin/funcionarios`  
**APIs:** `/api/funcionarios/*`

#### Funcionalidades:
- **CRUD completo** de funcionários (criar, listar, editar, excluir)
- Cadastro de dados pessoais: nome, CPF, RG, data nascimento, sexo, telefone, e-mail
- Dados profissionais: empresa, departamento, cargo, tipo contrato (CLT/PJ), data admissão
- Dados bancários: banco, agência, conta, tipo conta, forma pagamento, chave PIX
- Configuração de INSS: tipo (percentual/fixo), alíquota, valor fixo
- Configuração de pensão alimentícia: ativa/inativa, tipo, percentual/valor
- Número de dependentes (para dedução IRRF)
- Avatar/foto de perfil (seleção por ícone pré-definido)
- Flag `receber_avisos_email`: controla se funcionário recebe notificações por e-mail
- **Envio de acesso:** Geração e envio de credenciais ao funcionário por e-mail

**Dados do Grupo:**
- 3 empresas cadastradas: Qualitec (CNPJ 09.117.117/0001-24), Speed (46.732.564/0001-10), Quali (28.135.413/0001-00)
- 13 funcionários ativos
- 8 departamentos: Financeiro, Administrativo, Produção, TI, Estoque, Expedição, Montagem, Teste
- 16 cargos cadastrados

---

### 3.3 Holerites

**Rota Admin:** `/admin/holerites`  
**Rota Funcionário:** `/holerites`  
**APIs:** `/api/holerites/*`

#### Tipos de Holerite:

| Tipo | Regra | Pagamento |
|---|---|---|
| **Adiantamento** | 40% do salário bruto, período: dia 15 ao último dia do mês | Dia 20 (ou dia útil anterior) |
| **Folha Mensal** | Salário bruto − todos os descontos | 5º dia útil do mês de referência |

#### Cálculo de Descontos (CLT):

**INSS:**
- Configurável por funcionário: percentual ou valor fixo
- Implementação em `server/utils/inss2026.ts`

**IRRF (Lei 15.270/2025 — Tabela 2026):**

| Base de Cálculo | Alíquota | Parcela a Deduzir |
|---|---|---|
| Até R$ 2.428,80 | Isento | — |
| R$ 2.428,81 a R$ 3.051,00 | 7,5% | R$ 182,16 |
| R$ 3.051,01 a R$ 4.052,00 | 15% | R$ 394,16 |
| R$ 4.052,01 a R$ 5.050,00 | 22,5% | R$ 675,49 |
| Acima de R$ 5.050,00 | 27,5% | R$ 896,00 |

**Redutor Lei 15.270/2025:**
- Base ≤ R$ 5.000: IRRF zerado (isenção total)
- Base entre R$ 5.000,01 e R$ 7.350: fórmula linear `978,62 − (0,133145 × base)`
- Base > R$ 7.350: sem redutor

**Deduções da base IRRF:**
- INSS pago
- Dependentes (R$ 189,59/dependente)
- Pensão alimentícia
- Gastos com saúde (sem limite em 2026)

**Itens Personalizados (por funcionário):**
- Benefícios ou descontos adicionais configuráveis
- Vigência: única (específica) ou recorrente
- Armazenados em `holerite_itens_personalizados`

**Funcionários PJ:** sem desconto de INSS e IRRF.

#### Features adicionais:
- Geração em lote para todos os funcionários ativos
- Regeação (substitui holerite existente do mesmo período)
- Visualização de holerite em HTML renderizado (`holeriteHTML.ts` — 33KB de template)
- Download em PDF (`holeritePDF.ts` via pdfkit)
- Envio por e-mail individual (`/api/holerites/enviar-email.post.ts`)
- Disponibilização automática de adiantamentos (cron dia 17)
- Histórico de meses disponíveis por funcionário

---

### 3.4 Avisos e Comunicação Interna

**Rota Admin:** `/admin/avisos`  
**Rota Funcionário:** Dashboard  
**APIs:** `/api/avisos/*`

#### Funcionalidades:
- Admin cria avisos com título, descrição e emoji picker
- Funcionários visualizam e comentam nos avisos
- Popup de boas-vindas ao fazer login (admin: criar aviso; funcionário: ver avisos dos últimos 7 dias)
- Controle de `avisos_visualizados` por sessão (`sessionStorage`)
- 4 avisos ativos (holerites, feriados, normas)

---

### 3.5 Portal do Funcionário — Meus Dados

**Rota:** `/meus-dados`

- Visualização e edição de dados pessoais
- Dados bancários editáveis
- Foto/avatar de perfil
- Informações de empresa, cargo e departamento (somente leitura)
- Consulta de CNPJ automática via Receita Federal (`/api/consulta-cnpj.post.ts`)

---

### 3.6 Gestão de Documentos

**Rota Admin:** `/admin/documentos`  
**Rota Funcionário:** `/arquivos`

- Funcionários fazem upload de documentos (atestados, declarações, etc.)
- Admin visualiza documentos de todos os funcionários
- Contador de documentos "recentes" (últimas 48h) exibido no dashboard admin
- 11 tipos de documento cadastrados (`documento_tipos`)
- 45 documentos armazenados atualmente

---

### 3.7 Código de Ética

**Rota Admin:** `/admin/codigo-etica`  
**Rota Funcionário:** `/codigo-etica`

- Um código de ética por empresa
- Funcionário confirma leitura (registro em `codigo_etica_confirmacoes`)
- Admin pode publicar/editar o documento com logo da empresa (armazenada em base64)

---

### 3.8 Notificações

**APIs:** `/api/notificacoes/*`, `/api/notifications/*`

- Sistema interno de notificações para usuários
- 64 notificações registradas no banco
- WebSocket para notificações em tempo real (`useNotificationWebSocket.ts`)
- Painel de notificações no dashboard do admin
- Badge de contagem (`useNotificationCount.ts`)

---

### 3.9 Gestão Administrativa (Admin)

#### Módulos exclusivos do administrador:

| Módulo | Rota | Descrição |
|---|---|---|
| Funcionários | `/admin/funcionarios` | CRUD completo |
| Holerites | `/admin/holerites` | Geração, edição, envio |
| Avisos | `/admin/avisos` | Criação e gestão de comunicados |
| Documentos | `/admin/documentos` | Visualização de uploads dos funcionários |
| Empresas | `/admin/empresas` | Gestão das 3 empresas do grupo |
| Departamentos | `/admin/departamentos` | CRUD de departamentos |
| Cargos | `/admin/cargos` | CRUD de cargos |
| Código de Ética | `/admin/codigo-etica` | Publicação por empresa |

#### Dashboard Admin:
- Total de funcionários ativos
- Total de departamentos
- Folha de pagamento mensal (soma dos salários)
- Aniversariantes do mês
- Painel de notificações
- Card de envio de e-mail individual

---

## 4. Banco de Dados

### 4.1 Diagrama Simplificado de Entidades

```
empresas (3)
    │
    └──► funcionarios (13 ativos)
              │
              ├──► funcionario_beneficios (1:1)
              ├──► funcionario_documentos (N)
              ├──► funcionario_dependentes (N)
              ├──► funcionario_historico_cargos (N)
              ├──► funcionario_historico_salarios (N)
              ├──► funcionario_ferias (N)
              ├──► funcionario_ponto (N)
              ├──► holerites (85 registros)
              │         └──► holerite_itens_personalizados
              ├──► avisos_comentarios (N)
              ├──► codigo_etica_confirmacoes (N)
              ├──► notificacoes (64 registros)
              └──► auditoria_funcionarios (N)

departamentos (8) ──► funcionarios
cargos (16) ──► funcionarios
avisos (4) ──► avisos_comentarios
codigo_etica (3) ──► codigo_etica_confirmacoes
feriados (8) [independente]
beneficios (6) [independente — catálogo]
```

### 4.2 Tabelas — Resumo

| Tabela | Registros | Propósito |
|---|---|---|
| `empresas` | 3 | Empresas do grupo |
| `funcionarios` | 13 | Colaboradores ativos |
| `departamentos` | 8 | Setores da empresa |
| `cargos` | 16 | Posições/funções |
| `holerites` | 85 | Contracheques gerados |
| `holerite_itens_personalizados` | 3 | Benefícios/descontos extras |
| `funcionario_beneficios` | 13 | Config. de benefícios por funcionário |
| `funcionario_documentos` | 45 | Arquivos enviados |
| `documento_tipos` | 11 | Tipos de documento |
| `avisos` | 4 | Comunicados internos |
| `avisos_comentarios` | 6 | Reações a comunicados |
| `notificacoes` | 64 | Notificações do sistema |
| `codigo_etica` | 3 | Código de ética por empresa |
| `feriados` | 8 | Feriados nacionais 2026 |
| `beneficios` | 6 | Catálogo de benefícios |
| `password_reset_tokens` | 8 | Tokens de redefinição de senha |
| `contador_diario` | 140 | Métricas de uso diário |
| Tabelas vazias | 10+ | Módulos futuros (ponto, férias, etc.) |

### 4.3 Vulnerabilidades Identificadas (RLS)

> ⚠️ **ATENÇÃO:** As seguintes tabelas estão com **Row Level Security (RLS) desabilitado** no Supabase:

| Tabela | Risco |
|---|---|
| `funcionarios` | **CRÍTICO** — dados pessoais e financeiros expostos |
| `contador_diario` | Médio — dados de acesso |
| `password_reset_tokens` | **CRÍTICO** — tokens de segurança |
| `password_reset_attempts` | Médio — dados de tentativas de login |
| `counter_5h` | Baixo — contadores internos |
| `counter_5h_log` | Baixo — logs internos |

---

## 5. Fluxos Principais

### 5.1 Fluxo de Login

```
[Usuário] → /login → POST /api/auth/login
    ↓
Verificação e-mail + bcrypt senha
    ↓
Geração Access Token (JWT 24h) + Refresh Token
    ↓
Cookies httpOnly setados
    ↓
Redirect → /dashboard
    ↓
[Admin] Popup criar aviso / [Funcionário] Popup avisos recentes
```

### 5.2 Fluxo de Geração de Holerite

```
[Admin] → /admin/holerites → POST /api/holerites/gerar
    ↓
Seleciona tipo: adiantamento | mensal
Seleciona funcionários (ou todos)
    ↓
Cálculo automático de datas:
  - Adiantamento: período 15→último dia, pagamento dia 20
  - Mensal: período 1→último dia, pagamento 5º dia útil
    ↓
Para cada funcionário:
  ├── Busca itens personalizados (recorrentes)
  ├── Verifica holerite existente (bloqueia ou recria)
  ├── Calcula INSS (percentual/fixo por configuração)
  ├── Calcula IRRF (tabela progressiva 2026 + redutor Lei 15.270)
  ├── Desconta adiantamento do mês anterior (se mensal)
  └── Persiste no banco (status: 'gerado')
    ↓
Notificação gerada
Status: 'gerado' → disponibilizado manualmente ou pelo cron (dia 17 para adiantamentos)
```

### 5.3 Fluxo de Reset de Senha

```
[Usuário] → /login → "Esqueci minha senha"
    ↓
POST /api/auth/forgot-password
E-mail com link de reset (token único, expiração)
    ↓
[Usuário] Clica no link → /reset-password?token=...
    ↓
POST /api/auth/reset-password
Nova senha → bcrypt → salva no banco
Token invalidado
```

---

## 6. Estrutura de Diretórios

```
rhhhh-main/
├── app/                        # Código do frontend (Nuxt)
│   ├── pages/                  # Páginas da aplicação
│   │   ├── login.vue           # Página de login
│   │   ├── dashboard.vue       # Dashboard principal
│   │   ├── holerites.vue       # Holerites do funcionário
│   │   ├── meus-dados.vue      # Perfil do funcionário (42KB)
│   │   ├── arquivos.vue        # Upload de documentos
│   │   ├── codigo-etica.vue    # Código de ética
│   │   └── admin/              # Módulos administrativos
│   │       ├── funcionarios.vue
│   │       ├── holerites.vue   # (42KB — mais complexa)
│   │       ├── avisos.vue
│   │       ├── documentos.vue
│   │       ├── empresas.vue
│   │       ├── departamentos.vue
│   │       ├── cargos.vue
│   │       └── codigo-etica.vue
│   ├── components/             # Componentes reutilizáveis
│   │   ├── admin/
│   │   ├── avisos/
│   │   ├── dashboard/
│   │   ├── funcionarios/
│   │   ├── holerites/
│   │   ├── layout/
│   │   └── ui/                 # Design system
│   ├── composables/            # Lógica reativa (37 arquivos)
│   ├── middleware/             # auth.ts, admin.ts
│   └── layouts/                # Layouts base
├── server/
│   ├── api/                    # Endpoints da API (Nitro)
│   │   ├── auth/               # Login, logout, reset, refresh
│   │   ├── funcionarios/       # CRUD funcionários
│   │   ├── holerites/          # Geração, edição, PDF
│   │   ├── avisos/             # CRUD avisos
│   │   ├── admin/              # APIs admin-only
│   │   ├── email/              # Envio de e-mails
│   │   ├── cron/               # Jobs agendados
│   │   ├── empresas/
│   │   ├── departamentos/
│   │   ├── cargos/
│   │   ├── notificacoes/
│   │   ├── codigo-etica/
│   │   └── dashboard/
│   └── utils/                  # Utilitários do servidor
│       ├── authMiddleware.ts   # Guard de autenticação
│       ├── inss2026.ts         # Cálculo INSS 2026
│       ├── holeriteHTML.ts     # Template HTML holerite (33KB)
│       ├── holeritePDF.ts      # Geração PDF
│       ├── email.ts            # Serviço de e-mail
│       ├── jwt.ts              # JWT helpers
│       ├── notifications.ts    # Sistema de notificações (15KB)
│       └── csrfMiddleware.ts   # Proteção CSRF
├── docs/                       # Documentação
├── backup/                     # Backups do banco
├── supabase/                   # Migrations do Supabase
├── nuxt.config.ts              # Configuração principal
├── vercel.json                 # Cron jobs e deploy
└── package.json
```

---

## 7. Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | URL pública do Supabase |
| `NUXT_PUBLIC_SUPABASE_KEY` | Chave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (server-side only) |
| `JWT_SECRET` | Secret do access token JWT |
| `JWT_REFRESH_SECRET` | Secret do refresh token JWT |
| `NUXT_EMAIL_USER` | Usuário SMTP (Skymail) |
| `NUXT_EMAIL_PASS` | Senha SMTP |
| `NUXT_ADMIN_KEY` | Chave para operações admin |
| `NUXT_PUBLIC_BASE_URL` | URL base da aplicação |
| `VERCEL_URL` | Detectado automaticamente pelo Vercel |

---

## 8. Funcionalidades Planejadas / Módulos Futuros

> Baseado em tabelas já criadas no banco mas ainda sem dados:

| Módulo | Tabela no BD | Status |
|---|---|---|
| Controle de Ponto | `funcionario_ponto` | ⬜ Não implementado |
| Gestão de Férias | `funcionario_ferias` | ⬜ Não implementado |
| Dependentes | `funcionario_dependentes` | ⬜ Não implementado |
| Histórico de Cargos | `funcionario_historico_cargos` | ⬜ Não implementado |
| Histórico de Salários | `funcionario_historico_salarios` | ⬜ Não implementado |
| Auditoria | `auditoria_funcionarios` | ⬜ Não implementado |
| Descontos extras | `funcionario_descontos` | ⬜ Não implementado |
| Config. Holerite Global | `configuracoes_holerites` | ⬜ Não implementado |

---

## 9. Recomendações e Riscos

### 9.1 Segurança — Ações Urgentes

> **CRÍTICO** — As tabelas `funcionarios` e `password_reset_tokens` estão sem RLS habilitado no Supabase.  
> Isso significa que qualquer cliente com a chave `anon` pode ler/escrever dados sensíveis.

**Ações recomendadas (prioridade ALTA):**

1. Habilitar RLS em `funcionarios` e criar políticas adequadas
2. Habilitar RLS em `password_reset_tokens`
3. Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no cliente

### 9.2 Observações Técnicas

- O sistema usa **autenticação JWT própria** (não Supabase Auth), o que dá controle total mas exige manutenção do fluxo de tokens
- A página `meus-dados.vue` tem 42KB — candidata a refatoração em componentes menores
- O arquivo `holeriteHTML.ts` (33KB) renderiza o holerite em HTML puro para exibição e PDF
- Existem vários arquivos de teste temporários (`login-backup.vue`, `test-*.vue`) que devem ser removidos em produção
- O `nuxt-mcp-dev` nas dependências é ferramenta de desenvolvimento, não deve ir para produção

---

## 10. Histórico de Versões do PRD

| Versão | Data | Autor | Alterações |
|---|---|---|---|
| 1.0 | 2026-06-17 | Antigravity AI | Versão inicial — análise completa do sistema em produção |
