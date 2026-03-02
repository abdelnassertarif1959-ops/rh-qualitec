# Configuração MCP - Nuxt e shadcn/ui

## Servidores MCP Configurados

### 1. shadcn/ui MCP Server
**Status**: ✅ Já configurado
**Funcionalidades**:
- Acesso a componentes shadcn/ui para Vue
- Listagem de componentes disponíveis
- Obtenção de código fonte dos componentes
- Exemplos de uso (demos)
- Blocos pré-construídos
- Temas personalizados

**Ferramentas disponíveis**:
- `get_component` - Obter código de um componente específico
- `list_components` - Listar todos os componentes disponíveis
- `get_component_demo` - Obter exemplo de uso
- `get_component_metadata` - Metadados do componente
- `get_block` - Obter blocos pré-construídos
- `list_blocks` - Listar blocos disponíveis
- `apply_theme` - Aplicar temas
- `list_themes` - Listar temas disponíveis

### 2. Nuxt MCP Server
**Status**: ✅ Recém configurado
**Funcionalidades**:
- Análise da estrutura do projeto Nuxt
- Leitura de arquivos do projeto
- Acesso à configuração do Nuxt
- Busca em arquivos

**Ferramentas disponíveis**:
- `read_file` - Ler arquivos do projeto
- `list_files` - Listar arquivos
- `get_project_structure` - Estrutura do projeto
- `search_files` - Buscar em arquivos
- `get_nuxt_config` - Configuração do Nuxt
- `get_package_json` - Informações do package.json

### 3. Nuxt Docs MCP Server
**Status**: ✅ Recém configurado
**Funcionalidades**:
- Acesso à documentação oficial do Nuxt
- Busca na documentação
- Páginas de referência

**Ferramentas disponíveis**:
- `list_documentation_pages` - Listar páginas da documentação
- `get_documentation_page` - Obter página específica
- `search_documentation` - Buscar na documentação

## Como Usar

### Testando os MCPs

1. **Testar shadcn/ui**:
   ```
   Listar componentes disponíveis para Vue
   ```

2. **Testar Nuxt MCP**:
   ```
   Mostrar a estrutura do meu projeto Nuxt
   ```

3. **Testar Nuxt Docs**:
   ```
   Buscar documentação sobre composables no Nuxt
   ```

### Comandos Úteis

#### Para shadcn/ui:
- "Mostrar o componente Button do shadcn/ui"
- "Listar todos os blocos disponíveis"
- "Aplicar um tema dark ao projeto"

#### Para Nuxt:
- "Analisar minha configuração do Nuxt"
- "Mostrar a estrutura de pastas do projeto"
- "Buscar por 'composable' nos arquivos"

#### Para Nuxt Docs:
- "Encontrar documentação sobre middleware"
- "Listar páginas sobre autenticação"
- "Buscar informações sobre deployment"

## Instalação Manual (se necessário)

Se algum MCP não funcionar, você pode instalar manualmente:

```bash
# Para o Nuxt MCP
npm install -g nuxt-mcp

# Para o servidor de docs (via uvx)
uvx mcp-server-nuxt-docs@latest
```

## Verificação

Para verificar se os MCPs estão funcionando:

1. Reinicie o Kiro
2. Teste cada MCP com comandos simples
3. Verifique se as ferramentas estão respondendo

## Troubleshooting

### Problemas Comuns:

1. **MCP não responde**:
   - Verifique se o `uvx` está instalado
   - Reinicie o Kiro
   - Verifique a configuração no arquivo `.kiro/settings/mcp.json`

2. **Erro de permissão**:
   - Execute como administrador se necessário
   - Verifique as variáveis de ambiente

3. **Timeout**:
   - Alguns MCPs podem demorar na primeira execução
   - Aguarde alguns segundos e tente novamente

## Próximos Passos

Com esses MCPs configurados, você pode:

1. **Desenvolvimento mais rápido**: Acesso direto a componentes e documentação
2. **Melhor qualidade**: Exemplos e melhores práticas sempre à mão
3. **Menos pesquisa**: Documentação integrada no seu fluxo de trabalho

## Comandos de Teste Rápido

Execute estes comandos para testar cada MCP:

```
1. "Liste os componentes shadcn/ui disponíveis"
2. "Mostre a estrutura do meu projeto Nuxt"
3. "Busque documentação sobre composables no Nuxt"
```

Se todos responderem, sua configuração está perfeita! 🎉