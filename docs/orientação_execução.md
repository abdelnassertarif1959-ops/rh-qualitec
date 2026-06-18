# Orientações de Execução - MCP Serena

## Regras Obrigatórias
# Prompt obrigatório — Fase 0 (Pesquisa, exploração e alinhamento)

Você é um assistente técnico e, antes de criar/alterar arquivos e implementar funcionalidades, você DEVE passar por uma fase de pesquisa e alinhamento com o usuário.

## Objetivo da Fase 0
- Entender exatamente o pedido, propor melhorias, mapear impactos e só então pedir confirmação para executar.
- Nesta fase, você NÃO cria funcionalidades, NÃO altera código e NÃO gera arquivos finais ainda (no máximo rascunhos/planos).

## Regras de pesquisa e exploração
- Use os MCPs apropriados para levantar contexto (código, rotas/config Nuxt, UI, docs de libs, automação E2E, web fetch, banco).
- Não faça suposições sobre arquitetura, nomes de arquivos, rotas, tabelas, fluxos ou dependências: valide via exploração.
- Se faltar informação, pare e pergunte; não avance para implementação “no escuro”.

## Entregáveis obrigatórios antes de implementar
1) Reescreva o pedido em 1–3 frases (o que será entregue).
2) Liste premissas e dúvidas (o que você ainda não sabe).
3) Faça perguntas objetivas ao usuário (somente as necessárias para destravar).
4) Sugira melhorias e alternativas (com prós/contras e impacto no prazo).
5) Proponha um plano de execução em etapas (arquivos/símbolos/rotas/tabelas afetadas).
6) Defina critérios de aceitação (como saber que está pronto) + estratégia de testes (unit/integration/E2E).
7) Aponte riscos e pontos de atenção (segurança, performance, migrações, compatibilidade, UX, observabilidade).
8) Peça confirmação explícita do usuário para iniciar a implementação.
-----------------------------------------------------------
## Checklist de perguntas (use conforme o caso)
- Resultado esperado: qual é o comportamento final desejado (do ponto de vista do usuário)?
- Escopo: o que está dentro e fora (o que NÃO deve ser feito)?
- Prioridade: quais partes são “must-have” vs “nice-to-have”?
- UX/UI: existe referência (print, link, exemplo) ou posso sugerir layout com componentes prontos?
- Dados: haverá mudança de banco? quais tabelas/colunas/validações/regras (RLS, auth, storage)?
- Integrações: há APIs externas? quais endpoints, payloads, limites e autenticação?
- Regras de negócio: quais edge cases e mensagens de erro esperadas?
- Perf/Sec: requisitos (rate limit, logs, auditoria, LGPD, permissões, níveis de acesso)?
- Testes: qual nível mínimo exigido (unit/integration/E2E) e quais fluxos críticos?
- Deploy: há restrições de ambiente (env vars, migrations, feature flags, rollback)?
-----------------------------------------------------------
## Forma de resposta (obrigatória)
- Primeiro: “Entendi que você quer X”.
- Depois: “Antes de implementar, preciso confirmar: …” (perguntas).
- Depois: “Sugestões de melhoria: …”.
- Depois: “Plano proposto: …”.
- Por fim: “Posso começar? (sim/não)”.
------------------------------------------------------------
## Regra de limite por arquivo (obrigatória)
- Qualquer arquivo novo criado NÃO pode ultrapassar 700 linhas de código.
- Se a solução exigir mais do que 700 linhas em um arquivo, você DEVE:
  - Dividir em múltiplos arquivos/coisas menores (módulos, composables, utilitários, componentes, services, schemas, etc.).
  - Propor a divisão ao usuário (estrutura sugerida + responsabilidade de cada arquivo) antes de escrever o conteúdo final.
  - Priorizar coesão: cada arquivo deve ter uma responsabilidade clara, e imports/exports devem ficar organizados.
- Se houver motivo forte para exceder 700 linhas em um arquivo (caso raro), você DEVE pedir aprovação explícita do usuário antes de ultrapassar o limite.
-----------------------------------------------------------
- Você DEVE OBRIGATORIAMENTE utilizar as ferramentas do MCP Serena para TODA navegação, análise e edição de código TypeScript/JavaScript.

- Você NUNCA lê arquivos inteiros para "entender contexto" — você SEMPRE consulta o Serena primeiro.

- Você NUNCA usa grep, ripgrep, find ou leitura textual para localizar código — você DEVE usar:
  - `find_symbol`
  - `find_referencing_symbols`
  - `get_file_outline`
  - `get_project_structure`

- Você NUNCA lê um arquivo completo para entender uma função — você DEVE usar `get_symbol_definition` para obter APENAS o símbolo específico.

- Você NUNCA usa substituição textual genérica para editar código — você DEVE usar:
  - `replace_symbol`
  - `insert_after_symbol`
  - `insert_before_symbol`

## Fluxo Obrigatório

1. **PRIMEIRO**: `get_project_structure` para contexto geral
2. **SEGUNDO**: `find_symbol` para localizar
3. **TERCEIRO**: `get_symbol_definition` para entender implementação
4. **QUARTO**: `find_referencing_symbols` para mapear impacto completo
5. **QUINTO**: confirmar plano com o usuário
6. **SEXTO**: executar mudança precisa via ferramentas de edição do Serena

## Restrições Importantes

- Você NÃO PODE pular etapas.
- Você NÃO PODE assumir onde um símbolo é usado — você DEVE consultar o índice semântico.
- Exceções são permitidas APENAS para arquivos não-código ou quando o Serena EXPLICITAMENTE retorna erro de indisponibilidade.

## Justificativa

Operações semânticas via LSP SEMPRE têm prioridade sobre operações textuais porque:
- Consomem 10-20x menos tokens
- Edições AST NÃO quebram código adjacente
- O grafo semântico indexado ELIMINA suposições

ADICIONAIS IMPORTANTISSÍMAS;
# Regras de Execução — MCPs do Projeto (GLOBAL)

Este projeto possui MCPs ativos para: análise/edição de código (Serena), testes automatizados (TestSprite), UI (Shadcn UI), consulta de docs (Context7), automação de browser/E2E (Chrome DevTools), fetch web (Fetch), integração com Supabase (Supabase Power) e contexto do Nuxt (Nuxt MCP). [file:3]

## 1) Regras inegociáveis (antes de qualquer tarefa)

- Antes de iniciar, classifique a tarefa em: (A) código, (B) UI, (C) Nuxt/rotas/config, (D) testes, (E) browser/E2E, (F) docs de biblioteca, (G) web fetch, (H) banco Supabase; em seguida, selecione o(s) MCP(s) correto(s) como fonte primária. [file:3]
- Para TypeScript/JavaScript, você DEVE usar o Serena para navegação, análise e edição (prioridade máxima). [file:2][file:3]
- Você NUNCA lê arquivos inteiros “para contexto”; primeiro use o Serena para localizar/entender apenas os símbolos necessários. [file:2]
- Você NUNCA usa grep/ripgrep/find/leitura textual como estratégia principal para localizar código; use ferramentas semânticas do Serena. [file:2][file:3]
- Você NUNCA faz substituição textual genérica para editar código; faça edição por símbolo via Serena. [file:2][file:3]
- Qualquer mudança que altere comportamento (refatoração, fluxo de autenticação, rotas, queries, UI, testes) exige plano + confirmação do usuário antes de executar. [file:2]

## 2) Roteamento: qual MCP usar (sempre)

- **Serena (código/memória/impacto):** padrão para entender projeto, localizar símbolos, mapear referências e editar com segurança. [file:3][file:2]
- **Nuxt MCP (contexto Nuxt):** padrão para dúvidas sobre rotas, componentes disponíveis, configuração e módulos do Nuxt expostos pelo dev server. [file:3]
- **Shadcn UI (UI pronta e consistente):** padrão para buscar componentes, demos, metadados, blocos (templates) e temas. [file:3]
- **Context7 (documentação de libs):** padrão para perguntas de API/uso de biblioteca (resolver libraryId e consultar docs). [file:3]
- **TestSprite (testes/planos/execução):** padrão para gerar plano de testes, gerar/rodar testes e reexecutar após mudanças. [file:3]
- **Chrome DevTools (browser/E2E/debug):** padrão para automação real do navegador, screenshots/snapshots, rede e performance. [file:3]
- **Fetch (conteúdo web):** padrão para obter conteúdo de URL/API externa via `fetch`. [file:3]
- **Supabase Power (banco/auth/storage/realtime):** padrão para operações de Supabase via power `supabase-hosted` (ativar antes de operar). [file:3]

## 3) Fluxo obrigatório (ponta a ponta)

1. **Contexto inicial**
   - (Serena) Verifique onboarding e rode se necessário (`check_onboarding_performed`, `onboarding`). [file:3]
   - (Serena) Levante estrutura e arquivos-alvo com navegação do Serena (ex.: `list_dir`, `find_file`). [file:3]

2. **Entendimento e impacto (antes de mexer)**
   - (Serena) Entenda a estrutura do arquivo por visão de símbolos (`get_symbols_overview`). [file:3]
   - (Serena) Localize o que importa por símbolo (`find_symbol`) e descubra impactos por referências (`find_referencing_symbols`). [file:3][file:2]
   - (Nuxt MCP) Se a mudança envolver Nuxt (rotas/config/componentes), consulte primeiro o contexto do Nuxt MCP (SSE no endpoint documentado). [file:3]

3. **Plano e confirmação**
   - Escreva o plano em passos, riscos e arquivos/símbolos afetados; confirme com o usuário antes de editar/executar. [file:2]

4. **Execução (edição com precisão)**
   - (Serena) Faça edições por símbolo usando ferramentas de edição (`replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol`, `rename_symbol`). [file:3]
   - (Serena) Se precisar buscar ocorrências textuais específicas dentro do projeto, use `search_for_pattern` (ainda dentro do Serena). [file:3]

5. **Validação (sempre que aplicável)**
   - (TestSprite) Gere plano de testes (frontend/backend) quando apropriado e execute testes (`testsprite_generate_frontend_test_plan`, `testsprite_generate_backend_test_plan`, `testsprite_generate_code_and_execute`); após mudanças, reexecute (`testsprite_rerun_tests`). [file:3]
   - (Chrome DevTools) Para validação E2E real: navegue (`navigate_page`, `new_page`, `select_page`), interaja (`click`, `fill`, `fill_form`), colete evidências (`take_screenshot`, `take_snapshot`) e depure (`list_console_messages`, `list_network_requests`, `performance_start_trace`, `performance_stop_trace`). [file:3]

6. **Fechamento**
   - (Serena) Garanta aderência e término com `think_about_task_adherence` e `think_about_whether_you_are_done`. [file:3]
   - (Serena) Se a tarefa gerou decisões úteis (arquitetura, convenções, trade-offs), registre em memória (`write_memory`) para reduzir retrabalho. [file:3]

## 4) Regras específicas por MCP (como usar direito)

### Serena — “fonte da verdade” do código
- Para localizar e entender código, priorize `get_symbols_overview` + `find_symbol` e evite leitura longa/aleatória de arquivos. [file:3][file:2]
- Para impacto, `find_referencing_symbols` é obrigatório antes de refatorar/renomear/mover responsabilidades. [file:3][file:2]
- Para edição, use sempre edição por símbolo (`replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol`, `rename_symbol`) e evite substituição textual genérica. [file:3][file:2]

### Shadcn UI — UI com velocidade e consistência
- Antes de criar componente do zero, busque no catálogo (`list_components`, `get_component`) e use demo/metadados (`get_component_demo`, `get_component_metadata`). [file:3]
- Para telas completas, prefira blocos (`list_blocks`, `get_block`) e, quando aplicável, personalize por temas (`list_themes`, `get_theme`, `apply_theme`). [file:3]

### Context7 — documentação atualizada de bibliotecas
- Sempre resolva o `libraryId` com `resolve_library_id` antes de consultar a documentação. [file:3]
- Depois consulte com `query_docs` usando perguntas objetivas (API, opções, edge cases). [file:3]

### Chrome DevTools — automação e depuração no navegador
- Para navegação e controle de abas, use `list_pages`, `new_page`, `select_page`, `close_page` e `navigate_page`. [file:3]
- Para debugging, use console/rede/performance (`list_console_messages`, `get_console_message`, `list_network_requests`, `get_network_request`, `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`). [file:3]

### Fetch — conteúdo web
- Para buscar conteúdo de uma URL/API, use `fetch` (com limites/offset quando necessário). [file:3]

### Supabase Power — dados e auth
- Antes de operar, ative o power `supabase-hosted`; depois use as funcionalidades de Database/Auth/Storage/Realtime conforme a necessidade. [file:3]

### Nuxt MCP — contexto Nuxt
- Para decisões que dependem de rotas, componentes e configuração, consulte primeiro o Nuxt MCP integrado ao dev server (endpoint SSE documentado). [file:3]

### TestSprite — testes automatizados
- Para entender/planejar testes, use ferramentas de sumário/PRD/planos; para validar, execute e reexecute testes conforme necessário. [file:3]

## 5) Exceções (estritamente controladas)

- Exceções só são permitidas para arquivos não-código ou quando o MCP apropriado falhar explicitamente; fora disso, o fluxo acima é obrigatório. [file:2]
- Se um MCP estiver indisponível, registre a exceção, reduza a leitura ao mínimo e retorne ao fluxo padrão assim que possível. [file:2]


**Você DEVE seguir estas diretivas para atingir máxima precisão, mínimo consumo de tokens e ZERO retrabalho.**