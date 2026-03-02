# Servidores MCP Configurados

Este documento lista todos os servidores MCP (Model Context Protocol) configurados no projeto e suas respectivas ferramentas disponíveis.

## 📋 Resumo dos Servidores

| Servidor | Status | Ferramentas | Descrição |
|----------|--------|-------------|-----------|
| **TestSprite** | ✅ Ativo | 8 tools | Testes automatizados e análise de código |
| **Serena** | ✅ Ativo | 21 tools | Análise inteligente de código e memória do projeto |
| **Shadcn UI** | ✅ Ativo | 12 tools | Componentes UI para Vue/React/Svelte |
| **Context7** | ✅ Ativo | 2 tools | Documentação e consulta de bibliotecas |
| **Fetch** | ✅ Ativo | 1 tool | Busca e fetch de conteúdo web |
| **Supabase** | ✅ Ativo | Via Power | Integração com banco Supabase |

---

## 🧪 TestSprite MCP Server

**Comando:** `npx @testsprite/testsprite-mcp@latest`
**Propósito:** Testes automatizados, análise de código e geração de relatórios

### 🔧 Ferramentas Disponíveis:

#### `testsprite_bootstrap`
- **Função:** Inicializa o TestSprite no projeto
- **Uso:** Configuração inicial para testes automatizados
- **Parâmetros:** localPort, type, projectPath, testScope

#### `testsprite_generate_code_summary`
- **Função:** Analisa e resume a estrutura do código
- **Uso:** Gera relatório completo da arquitetura do projeto
- **Parâmetros:** projectRootPath

#### `testsprite_generate_standardized_prd`
- **Função:** Gera documento de requisitos padronizado (PRD)
- **Uso:** Cria especificações técnicas do projeto
- **Parâmetros:** projectPath

#### `testsprite_generate_frontend_test_plan`
- **Função:** Cria plano de testes para frontend
- **Uso:** Gera estratégia de testes para interface
- **Parâmetros:** projectPath, needLogin

#### `testsprite_generate_backend_test_plan`
- **Função:** Cria plano de testes para backend
- **Uso:** Gera estratégia de testes para APIs
- **Parâmetros:** projectPath

#### `testsprite_generate_code_and_execute`
- **Função:** Gera e executa testes automaticamente
- **Uso:** Execução completa de suíte de testes
- **Parâmetros:** projectName, projectPath, testIds, additionalInstruction

#### `testsprite_rerun_tests`
- **Função:** Re-executa testes existentes
- **Uso:** Validação após mudanças no código
- **Parâmetros:** projectPath

### 🎯 Casos de Uso:
- Análise de qualidade de código
- Geração de testes automatizados
- Validação de funcionalidades
- Relatórios de cobertura

---

## 🧠 Serena MCP Server

**Comando:** `uvx serena start-mcp-server --context ide-assistant --project-from-cwd`
**Propósito:** Análise inteligente de código, navegação e memória do projeto

### 🔧 Ferramentas Disponíveis:

#### 📁 **Navegação e Busca**

##### `list_dir`
- **Função:** Lista arquivos e diretórios
- **Uso:** Explorar estrutura do projeto
- **Parâmetros:** relative_path, recursive, skip_ignored_files

##### `find_file`
- **Função:** Encontra arquivos por padrão
- **Uso:** Localizar arquivos específicos
- **Parâmetros:** file_mask, relative_path

##### `search_for_pattern`
- **Função:** Busca padrões dentro dos arquivos
- **Uso:** Encontrar código específico no projeto
- **Parâmetros:** substring_pattern, relative_path, context_lines_before/after

#### 🔍 **Análise de Código**

##### `get_symbols_overview`
- **Função:** Visão geral dos símbolos em um arquivo
- **Uso:** Entender estrutura de classes, funções, etc.
- **Parâmetros:** relative_path, depth

##### `find_symbol`
- **Função:** Encontra símbolos específicos
- **Uso:** Localizar funções, classes, variáveis
- **Parâmetros:** name_path_pattern, relative_path, include_body

##### `find_referencing_symbols`
- **Função:** Encontra referências a um símbolo
- **Uso:** Ver onde uma função/classe é usada
- **Parâmetros:** name_path, relative_path

#### ✏️ **Edição de Código**

##### `replace_symbol_body`
- **Função:** Substitui o corpo de um símbolo
- **Uso:** Modificar implementação de funções/classes
- **Parâmetros:** name_path, relative_path, body

##### `insert_after_symbol`
- **Função:** Insere código após um símbolo
- **Uso:** Adicionar novas funcionalidades
- **Parâmetros:** name_path, relative_path, body

##### `insert_before_symbol`
- **Função:** Insere código antes de um símbolo
- **Uso:** Adicionar imports, comentários, etc.
- **Parâmetros:** name_path, relative_path, body

##### `rename_symbol`
- **Função:** Renomeia símbolos em todo o projeto
- **Uso:** Refatoração segura de nomes
- **Parâmetros:** name_path, relative_path, new_name

#### 🧠 **Memória do Projeto**

##### `write_memory`
- **Função:** Salva informações sobre o projeto
- **Uso:** Documentar decisões, arquitetura, etc.
- **Parâmetros:** memory_file_name, content

##### `read_memory`
- **Função:** Lê informações salvas
- **Uso:** Recuperar contexto do projeto
- **Parâmetros:** memory_file_name

##### `list_memories`
- **Função:** Lista todas as memórias salvas
- **Uso:** Ver histórico de informações
- **Parâmetros:** Nenhum

##### `delete_memory`
- **Função:** Remove uma memória
- **Uso:** Limpar informações obsoletas
- **Parâmetros:** memory_file_name

##### `edit_memory`
- **Função:** Edita uma memória existente
- **Uso:** Atualizar informações
- **Parâmetros:** memory_file_name, needle, repl, mode

#### 🚀 **Gerenciamento e Análise**

##### `check_onboarding_performed`
- **Função:** Verifica se projeto foi configurado
- **Uso:** Validar setup inicial
- **Parâmetros:** Nenhum

##### `onboarding`
- **Função:** Configura projeto pela primeira vez
- **Uso:** Setup inicial do Serena
- **Parâmetros:** Nenhum

##### `think_about_collected_information`
- **Função:** Analisa informações coletadas
- **Uso:** Reflexão sobre dados obtidos
- **Parâmetros:** Nenhum

##### `think_about_task_adherence`
- **Função:** Verifica aderência à tarefa
- **Uso:** Validar se está no caminho certo
- **Parâmetros:** Nenhum

##### `think_about_whether_you_are_done`
- **Função:** Avalia se tarefa foi concluída
- **Uso:** Determinar próximos passos
- **Parâmetros:** Nenhum

##### `initial_instructions`
- **Função:** Mostra manual de instruções
- **Uso:** Guia de uso do Serena
- **Parâmetros:** Nenhum

### 🎯 Casos de Uso:
- Navegação inteligente no código
- Refatoração segura
- Análise de dependências
- Documentação automática
- Memória persistente do projeto

---

## 🎨 Shadcn UI MCP Server

**Comando:** `npx @jpisnice/shadcn-ui-mcp-server --framework vue --github-api-key [TOKEN]`
**Propósito:** Acesso a componentes UI do Shadcn para Vue, React, Svelte

### 🔧 Ferramentas Disponíveis:

#### `get_component`
- **Função:** Obtém código-fonte de um componente
- **Uso:** Baixar componente específico (ex: button, card)
- **Exemplo:** "Mostre o componente button do shadcn-vue"

#### `get_component_demo`
- **Função:** Obtém exemplo de uso do componente
- **Uso:** Ver como implementar o componente
- **Exemplo:** "Como usar o componente card?"

#### `list_components`
- **Função:** Lista todos os componentes disponíveis
- **Uso:** Ver catálogo completo
- **Exemplo:** "Liste todos os componentes Vue disponíveis"

#### `get_component_metadata`
- **Função:** Obtém metadados do componente
- **Uso:** Ver dependências, props, etc.
- **Exemplo:** "Quais são as dependências do dialog?"

#### `get_directory_structure`
- **Função:** Mostra estrutura do repositório
- **Uso:** Navegar pela organização dos componentes
- **Exemplo:** "Mostre a estrutura do shadcn-vue"

#### `get_block`
- **Função:** Obtém blocos completos (templates)
- **Uso:** Baixar templates prontos (dashboard, login, etc.)
- **Exemplo:** "Obtenha o bloco dashboard-01"

#### `list_blocks`
- **Função:** Lista todos os blocos disponíveis
- **Uso:** Ver templates disponíveis
- **Exemplo:** "Mostre todos os blocos de dashboard"

#### `apply_theme`
- **Função:** Aplica tema TweakCN ao projeto
- **Uso:** Personalizar cores e estilos
- **Exemplo:** "Aplique o tema cyberpunk"

#### `list_themes`
- **Função:** Lista temas disponíveis
- **Uso:** Ver opções de personalização
- **Exemplo:** "Mostre todos os temas disponíveis"

#### `get_theme`
- **Função:** Obtém detalhes de um tema específico
- **Uso:** Ver configurações do tema
- **Exemplo:** "Mostre detalhes do tema modern"

### 🎯 Casos de Uso:
- Implementação rápida de UI
- Consistência visual
- Componentes acessíveis
- Templates prontos
- Documentação integrada

### 🔑 Configuração:
- **Framework:** Vue (configurado para unovue/shadcn-vue)
- **Token GitHub:** Configurado para 5.000 requests/hora
- **Rate Limit:** Sem limitações (com token)

---

## � Context7 MCP Server

**Comando:** Integrado via Kiro Powers
**Propósito:** Consulta de documentação e bibliotecas de programação

### 🔧 Ferramentas Disponíveis:

#### `resolve_library_id`
- **Função:** Resolve nome de biblioteca para ID do Context7
- **Uso:** Encontrar ID correto para consultas
- **Parâmetros:** libraryName, query
- **Exemplo:** "Encontre a biblioteca React"

#### `query_docs`
- **Função:** Consulta documentação de bibliotecas
- **Uso:** Obter informações atualizadas sobre APIs
- **Parâmetros:** libraryId, query
- **Exemplo:** "Como usar hooks no React?"

### 🎯 Casos de Uso:
- Consulta de documentação atualizada
- Exemplos de código de bibliotecas
- Resolução de dúvidas sobre APIs
- Melhores práticas de desenvolvimento

---

## 🌐 Chrome DevTools MCP Server

**Comando:** Integrado via Kiro
**Propósito:** Automação de browser, testes E2E e debugging

### 🔧 Ferramentas Disponíveis:

#### 🖱️ **Interação com Página**

##### `click`
- **Função:** Clica em elementos da página
- **Uso:** Automação de cliques
- **Parâmetros:** uid, dblClick, includeSnapshot

##### `fill`
- **Função:** Preenche campos de formulário
- **Uso:** Automação de entrada de dados
- **Parâmetros:** uid, value, includeSnapshot

##### `fill_form`
- **Função:** Preenche múltiplos campos
- **Uso:** Automação de formulários completos
- **Parâmetros:** elements[], includeSnapshot

##### `hover`
- **Função:** Passa mouse sobre elemento
- **Uso:** Testar interações hover
- **Parâmetros:** uid, includeSnapshot

##### `press_key`
- **Função:** Pressiona teclas
- **Uso:** Atalhos de teclado e navegação
- **Parâmetros:** key, includeSnapshot

##### `drag`
- **Função:** Arrasta elementos
- **Uso:** Testar drag & drop
- **Parâmetros:** from_uid, to_uid, includeSnapshot

##### `upload_file`
- **Função:** Faz upload de arquivos
- **Uso:** Testar upload de arquivos
- **Parâmetros:** uid, filePath, includeSnapshot

#### 🧭 **Navegação**

##### `navigate_page`
- **Função:** Navega para URLs
- **Uso:** Carregar páginas para teste
- **Parâmetros:** url, type, timeout, ignoreCache

##### `new_page`
- **Função:** Cria nova aba
- **Uso:** Abrir múltiplas páginas
- **Parâmetros:** url, background, timeout

##### `close_page`
- **Função:** Fecha aba
- **Uso:** Gerenciar abas abertas
- **Parâmetros:** pageId

##### `select_page`
- **Função:** Seleciona aba ativa
- **Uso:** Alternar entre abas
- **Parâmetros:** pageId, bringToFront

##### `list_pages`
- **Função:** Lista todas as abas
- **Uso:** Ver páginas abertas
- **Parâmetros:** Nenhum

#### 📸 **Captura e Análise**

##### `take_screenshot`
- **Função:** Captura screenshot
- **Uso:** Documentar estado da página
- **Parâmetros:** filePath, format, fullPage, quality, uid

##### `take_snapshot`
- **Função:** Captura snapshot textual
- **Uso:** Analisar estrutura da página
- **Parâmetros:** filePath, verbose

##### `evaluate_script`
- **Função:** Executa JavaScript
- **Uso:** Testar funcionalidades customizadas
- **Parâmetros:** function, args[]

#### 🔍 **Debugging e Monitoramento**

##### `list_console_messages`
- **Função:** Lista mensagens do console
- **Uso:** Debug de erros JavaScript
- **Parâmetros:** types[], pageIdx, pageSize

##### `get_console_message`
- **Função:** Obtém mensagem específica
- **Uso:** Analisar erro específico
- **Parâmetros:** msgid

##### `list_network_requests`
- **Função:** Lista requisições de rede
- **Uso:** Analisar tráfego HTTP
- **Parâmetros:** resourceTypes[], pageIdx, pageSize

##### `get_network_request`
- **Função:** Obtém requisição específica
- **Uso:** Analisar request/response
- **Parâmetros:** reqid, requestFilePath, responseFilePath

#### ⚡ **Performance**

##### `performance_start_trace`
- **Função:** Inicia gravação de performance
- **Uso:** Analisar performance da página
- **Parâmetros:** reload, autoStop, filePath

##### `performance_stop_trace`
- **Função:** Para gravação de performance
- **Uso:** Finalizar análise
- **Parâmetros:** filePath

##### `performance_analyze_insight`
- **Função:** Analisa insights de performance
- **Uso:** Obter recomendações
- **Parâmetros:** insightSetId, insightName

#### 🎛️ **Configuração**

##### `emulate`
- **Função:** Emula dispositivos/condições
- **Uso:** Testar responsividade
- **Parâmetros:** viewport, userAgent, networkConditions, geolocation

##### `resize_page`
- **Função:** Redimensiona viewport
- **Uso:** Testar diferentes resoluções
- **Parâmetros:** width, height

##### `handle_dialog`
- **Função:** Gerencia diálogos do browser
- **Uso:** Aceitar/rejeitar alerts
- **Parâmetros:** action, promptText

##### `wait_for`
- **Função:** Aguarda texto aparecer
- **Uso:** Sincronização de testes
- **Parâmetros:** text, timeout

### 🎯 Casos de Uso:
- Testes E2E automatizados
- Debugging de aplicações web
- Análise de performance
- Testes de responsividade
- Automação de tarefas repetitivas

---

## 🌍 Fetch MCP Server

**Comando:** `npx -y mcp-server-fetch-typescript`
**Propósito:** Busca e conversão de conteúdo web em múltiplos formatos

### 🔧 Ferramentas Disponíveis:

#### `get_raw_text`
- **Função:** Obtém texto bruto diretamente de URLs
- **Uso:** Buscar conteúdo de arquivos JSON, XML, CSV, TSV ou texto
- **Parâmetros:** url (obrigatório)
- **Exemplo:** "Obtenha o texto bruto de https://api.example.com/data.json"

#### `get_rendered_html`
- **Função:** Busca HTML completamente renderizado
- **Uso:** Obter conteúdo de SPAs e aplicações modernas
- **Parâmetros:** url (obrigatório)
- **Tecnologia:** Playwright para renderização headless
- **Exemplo:** "Obtenha o HTML renderizado de https://app.example.com"

#### `get_markdown`
- **Função:** Converte conteúdo web para Markdown
- **Uso:** Preservar estrutura de documentos web
- **Parâmetros:** url (obrigatório)
- **Recursos:** Suporte a tabelas e listas de definição
- **Exemplo:** "Converta https://docs.example.com para Markdown"

#### `get_markdown_summary`
- **Função:** Extrai e converte conteúdo principal
- **Uso:** Obter artigos limpos sem navegação/rodapé
- **Parâmetros:** url (obrigatório)
- **Ideal para:** Artigos, posts de blog, documentação
- **Exemplo:** "Extraia o conteúdo principal de https://blog.example.com/post"

### 🎯 Casos de Uso:
- Obter dados de APIs públicas (JSON, XML)
- Extrair conteúdo de documentações online
- Converter páginas web para Markdown
- Arquivar conteúdo web estruturado
- Processar SPAs e aplicações JavaScript

---

## 🗄️ Supabase MCP Server

**Comando:** Via Kiro Power `supabase-hosted`
**Propósito:** Integração completa com banco de dados Supabase

### 🔧 Ferramentas Disponíveis:

#### Via Kiro Power System:
- **Ativação:** `kiroPowers activate supabase-hosted`
- **Uso:** Acesso completo às funcionalidades do Supabase
- **Ferramentas:** Disponíveis após ativação do power

#### Funcionalidades Principais:
- **Database:** Operações CRUD no PostgreSQL
- **Auth:** Gerenciamento de autenticação
- **Storage:** Upload e gerenciamento de arquivos
- **Realtime:** Subscriptions em tempo real
- **RLS:** Row Level Security

### 🎯 Casos de Uso:
- Operações de banco de dados
- Gerenciamento de usuários
- Upload de arquivos
- Notificações em tempo real
- Segurança de dados

---

## 🚀 Nuxt MCP Server

**Integração:** Módulo `nuxt-mcp-dev` integrado ao servidor de desenvolvimento
**Endpoint:** `http://localhost:3000/__mcp/sse`
**Propósito:** Contexto específico do projeto Nuxt

### � Funcionalidades:

#### Integração Automática
- **Função:** Expõe informações do projeto Nuxt
- **Uso:** Contexto automático sobre rotas, componentes, etc.
- **Acesso:** Via Server-Sent Events (SSE)

#### Informações Disponíveis:
- Estrutura de rotas do projeto
- Componentes Vue disponíveis
- Configurações do Nuxt
- Módulos instalados
- Estrutura do projeto

### 🎯 Casos de Uso:
- Desenvolvimento assistido por IA
- Navegação inteligente no projeto
- Sugestões contextuais
- Debugging assistido

---

## 🔧 Como Usar os MCPs

### 1. **Comandos Diretos**
```
"Liste todos os componentes shadcn disponíveis"
"Encontre a função de login no projeto"
"Gere um relatório de testes para o frontend"
"Consulte a documentação do React no Context7"
"Abra uma nova aba no Chrome e navegue para localhost:3000"
```

### 2. **Análise de Código**
```
"Analise a estrutura do arquivo auth.ts"
"Encontre onde a função calcularSalario é usada"
"Mostre visão geral dos componentes Vue"
"Capture um screenshot da página atual"
```

### 3. **Modificação de Código**
```
"Renomeie a função antiga para nova em todo o projeto"
"Adicione logging na função de login"
"Substitua a implementação desta função"
"Ative o power do Supabase e consulte a tabela funcionarios"
```

### 4. **Memória e Documentação**
```
"Salve informações sobre a arquitetura do sistema"
"Leia as memórias sobre a estrutura do banco"
"Liste todas as informações salvas"
"Busque conteúdo da API externa"
```

### 5. **Testes e Automação**
```
"Execute testes E2E na página de login"
"Preencha o formulário de cadastro automaticamente"
"Analise a performance da página dashboard"
"Monitore requisições de rede durante o login"
```

---

## 📊 Status dos Servidores

### ✅ Ativos e Funcionando:
- **TestSprite:** Conectado com API key
- **Serena:** Conectado via uvx
- **Shadcn UI:** Conectado com token GitHub
- **Context7:** Conectado para consultas de docs
- **Chrome DevTools:** Conectado para automação
- **Fetch:** Conectado para busca web
- **Supabase:** Integrado via Kiro Power
- **Nuxt MCP:** Integrado ao dev server
- **Shadcn UI:** Conectado com token GitHub
- **Context7:** Integrado via Kiro Powers
- **Chrome DevTools:** Integrado via Kiro
- **Fetch:** Integrado via Kiro
- **Supabase:** Via Kiro Power supabase-hosted
- **Nuxt MCP:** Integrado ao dev server

### 🔧 Configurações:
- **Auto-aprovação:** Habilitada para ferramentas comuns
- **Rate Limits:** Otimizados com tokens
- **Frameworks:** Configurados para Vue/Nuxt
- **Contexto:** Projeto-específico
- **Integração:** Kiro Powers para serviços avançados

---

## 🚀 Próximos Passos

1. **Explorar Ferramentas:** Teste diferentes comandos dos MCPs
2. **Criar Memórias:** Documente decisões importantes com Serena
3. **Usar Componentes:** Implemente UI com Shadcn
4. **Executar Testes:** Valide código com TestSprite
5. **Refatorar Código:** Use Serena para melhorias
6. **Consultar Docs:** Use Context7 para documentação atualizada
7. **Automatizar Testes:** Use Chrome DevTools para E2E
8. **Buscar Conteúdo:** Use Fetch para informações externas
9. **Gerenciar Banco:** Use Supabase Power para operações de dados

---

*Documentação atualizada com todos os MCPs configurados - Última atualização: 03/02/2026*
2. **Criar Memórias:** Documente decisões importantes com Serena
3. **Usar Componentes:** Implemente UI com Shadcn
4. **Executar Testes:** Valide código com TestSprite
5. **Refatorar Código:** Use Serena para melhorias
6. **Consultar Docs:** Use Context7 para documentação atualizada
7. **Automatizar Testes:** Configure testes E2E com Chrome DevTools
8. **Integrar APIs:** Use Fetch para dados externos
9. **Gerenciar Banco:** Ative Supabase Power para operações de BD

---

*Documentação gerada automaticamente - Última atualização: 03/02/2026*

---

## 📚 Context7 MCP Server

**Comando:** `npx @context7/mcp-server@latest`
**Propósito:** Consulta de documentação atualizada de bibliotecas e frameworks

### 🔧 Ferramentas Disponíveis:

#### `resolve_library_id`
- **Função:** Resolve nome de biblioteca para ID do Context7
- **Uso:** Encontrar ID correto para consultas
- **Parâmetros:** libraryName, query
- **Exemplo:** "Encontre o ID para React"

#### `query_docs`
- **Função:** Consulta documentação de bibliotecas
- **Uso:** Obter informações atualizadas sobre APIs
- **Parâmetros:** libraryId, query
- **Exemplo:** "Como usar hooks no React?"

### 🎯 Casos de Uso:
- Consulta de documentação atualizada
- Exemplos de código de bibliotecas
- Resolução de dúvidas sobre APIs
- Melhores práticas atuais

---

## 🌐 Chrome DevTools MCP Server

**Comando:** `npx @modelcontextprotocol/server-chrome-devtools`
**Propósito:** Automação de browser, testes E2E e debugging

### 🔧 Ferramentas Disponíveis:

#### 🖱️ **Interação com Página**

##### `click`
- **Função:** Clica em elementos da página
- **Uso:** Automação de cliques
- **Parâmetros:** uid, dblClick, includeSnapshot

##### `fill`
- **Função:** Preenche campos de formulário
- **Uso:** Automação de entrada de dados
- **Parâmetros:** uid, value, includeSnapshot

##### `fill_form`
- **Função:** Preenche múltiplos campos
- **Uso:** Automação de formulários completos
- **Parâmetros:** elements[], includeSnapshot

##### `hover`
- **Função:** Passa mouse sobre elemento
- **Uso:** Testar interações hover
- **Parâmetros:** uid, includeSnapshot

##### `press_key`
- **Função:** Pressiona teclas
- **Uso:** Atalhos de teclado e navegação
- **Parâmetros:** key, includeSnapshot

##### `drag`
- **Função:** Arrasta elementos
- **Uso:** Testar drag & drop
- **Parâmetros:** from_uid, to_uid, includeSnapshot

##### `upload_file`
- **Função:** Faz upload de arquivos
- **Uso:** Testar upload de arquivos
- **Parâmetros:** uid, filePath, includeSnapshot

#### 🧭 **Navegação**

##### `navigate_page`
- **Função:** Navega para URLs
- **Uso:** Controlar navegação do browser
- **Parâmetros:** url, type, timeout, ignoreCache

##### `new_page`
- **Função:** Cria nova aba
- **Uso:** Abrir novas páginas
- **Parâmetros:** url, background, timeout

##### `close_page`
- **Função:** Fecha aba
- **Uso:** Gerenciar abas abertas
- **Parâmetros:** pageId

##### `select_page`
- **Função:** Seleciona aba ativa
- **Uso:** Alternar entre abas
- **Parâmetros:** pageId, bringToFront

##### `list_pages`
- **Função:** Lista todas as abas
- **Uso:** Ver abas abertas
- **Parâmetros:** Nenhum

#### 📸 **Captura e Análise**

##### `take_screenshot`
- **Função:** Captura screenshot
- **Uso:** Documentar estado da página
- **Parâmetros:** filePath, format, fullPage, quality, uid

##### `take_snapshot`
- **Função:** Captura snapshot textual
- **Uso:** Analisar estrutura da página
- **Parâmetros:** filePath, verbose

##### `evaluate_script`
- **Função:** Executa JavaScript
- **Uso:** Interagir com página via JS
- **Parâmetros:** function, args[]

#### 🔍 **Debugging e Monitoramento**

##### `list_console_messages`
- **Função:** Lista mensagens do console
- **Uso:** Debug de JavaScript
- **Parâmetros:** types[], pageIdx, pageSize

##### `get_console_message`
- **Função:** Obtém mensagem específica
- **Uso:** Analisar erros detalhadamente
- **Parâmetros:** msgid

##### `list_network_requests`
- **Função:** Lista requisições de rede
- **Uso:** Analisar tráfego HTTP
- **Parâmetros:** resourceTypes[], pageIdx, pageSize

##### `get_network_request`
- **Função:** Obtém requisição específica
- **Uso:** Analisar request/response
- **Parâmetros:** reqid, requestFilePath, responseFilePath

#### ⚡ **Performance**

##### `performance_start_trace`
- **Função:** Inicia trace de performance
- **Uso:** Analisar performance da página
- **Parâmetros:** reload, autoStop, filePath

##### `performance_stop_trace`
- **Função:** Para trace de performance
- **Uso:** Finalizar análise
- **Parâmetros:** filePath

##### `performance_analyze_insight`
- **Função:** Analisa insights de performance
- **Uso:** Obter métricas detalhadas
- **Parâmetros:** insightSetId, insightName

#### 🛠️ **Configuração**

##### `emulate`
- **Função:** Emula dispositivos/condições
- **Uso:** Testar responsividade
- **Parâmetros:** viewport, userAgent, networkConditions, geolocation

##### `resize_page`
- **Função:** Redimensiona viewport
- **Uso:** Testar diferentes resoluções
- **Parâmetros:** width, height

##### `handle_dialog`
- **Função:** Gerencia diálogos do browser
- **Uso:** Aceitar/rejeitar alerts
- **Parâmetros:** action, promptText

##### `wait_for`
- **Função:** Aguarda texto aparecer
- **Uso:** Sincronização de testes
- **Parâmetros:** text, timeout

### 🎯 Casos de Uso:
- Testes E2E automatizados
- Debugging de aplicações web
- Análise de performance
- Captura de evidências
- Automação de tarefas repetitivas

---

## 🌐 Fetch MCP Server

**Comando:** `npx @modelcontextprotocol/server-fetch`
**Propósito:** Busca e fetch de conteúdo da web

### 🔧 Ferramentas Disponíveis:

#### `fetch`
- **Função:** Faz fetch de URLs da internet
- **Uso:** Obter conteúdo de páginas web
- **Parâmetros:** url, max_length, raw, start_index
- **Exemplo:** "Busque o conteúdo de https://example.com"

### 🎯 Casos de Uso:
- Obter conteúdo de documentações online
- Buscar informações atualizadas
- Integrar dados externos
- Validar APIs públicas

---

## 🗄️ Supabase Power

**Integração:** Via Kiro Powers (`supabase-hosted`)
**Propósito:** Integração completa com banco Supabase

### 🔧 Funcionalidades Disponíveis:

#### Gerenciamento de Banco
- **Função:** Operações CRUD no Supabase
- **Uso:** Manipular dados do projeto
- **Recursos:** Postgres, Auth, Storage, Realtime

#### Autenticação
- **Função:** Sistema de auth integrado
- **Uso:** Login, registro, sessões
- **Recursos:** RLS, políticas de segurança

#### Storage
- **Função:** Armazenamento de arquivos
- **Uso:** Upload/download de assets
- **Recursos:** Buckets, políticas de acesso

#### Realtime
- **Função:** Atualizações em tempo real
- **Uso:** Notificações, sync de dados
- **Recursos:** Subscriptions, webhooks

### 🎯 Casos de Uso:
- Operações de banco de dados
- Autenticação de usuários
- Upload de arquivos
- Notificações em tempo real
- Políticas de segurança (RLS)