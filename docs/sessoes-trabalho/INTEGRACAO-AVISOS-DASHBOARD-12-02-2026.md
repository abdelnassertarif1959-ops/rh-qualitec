# Integração do Sistema de Avisos - Dashboard e Menu
**Data**: 12/02/2026

## Alterações Realizadas

### 1. Menu Admin - Sidebar Desktop
**Arquivo**: `app/components/layout/LayoutSidebar.vue`

Adicionado link para página de avisos no menu admin:
```vue
<LayoutNavLink to="/admin/avisos" icon="megaphone">Avisos</LayoutNavLink>
```

### 2. Menu Mobile
**Arquivo**: `app/components/layout/LayoutMobileMenu.vue`

Adicionado link para página de avisos no menu mobile:
```vue
<LayoutNavLink to="/admin/avisos" icon="megaphone" @click="$emit('close')">Avisos</LayoutNavLink>
```

### 3. Componente Caixa de Avisos
**Arquivo**: `app/components/avisos/CaixaAvisos.vue`

Criado componente para exibir avisos no dashboard do funcionário com:
- Lista dos 3 avisos mais recentes
- Contador de comentários
- Formatação de data relativa (Hoje, Ontem, X dias atrás)
- Botão "Ver todos" quando há mais de 3 avisos
- Modal para visualizar avisos completos
- Estado de carregamento
- Estado vazio (quando não há avisos)

### 4. Dashboard do Funcionário
**Arquivo**: `app/pages/dashboard.vue`

Adicionado componente de avisos logo após os cards de atalho:
```vue
<!-- Caixa de Avisos (para funcionários) -->
<AvisosCaixaAvisos v-if="!isAdmin" class="mb-8" />
```

## Estrutura de Navegação

### Para Administradores
- Menu Sidebar: "Avisos" → `/admin/avisos`
- Menu Mobile: "Avisos" → `/admin/avisos`
- Página completa para gerenciar avisos (criar, editar, deletar)

### Para Funcionários
- Dashboard: Caixa de avisos com últimos 3 avisos
- Clique no aviso: Abre modal com detalhes e comentários
- Botão "Ver todos": Abre modal com lista completa de avisos
- Pode comentar em qualquer aviso

## Funcionalidades Implementadas

### Caixa de Avisos (Funcionários)
✅ Exibe últimos 3 avisos
✅ Mostra título e descrição (limitada a 2 linhas)
✅ Contador de comentários
✅ Data relativa (Hoje, Ontem, X dias atrás)
✅ Clique para abrir modal com detalhes
✅ Botão "Ver todos" quando há mais de 3 avisos
✅ Estado de carregamento
✅ Estado vazio com mensagem amigável

### Página Admin (/admin/avisos)
✅ Criar novos avisos
✅ Listar todos os avisos
✅ Editar avisos existentes
✅ Deletar avisos
✅ Ver comentários de cada aviso
✅ Deletar comentários (admin pode deletar qualquer comentário)

### Modal de Avisos
✅ Visualizar aviso completo
✅ Ver todos os comentários
✅ Adicionar novo comentário
✅ Deletar próprio comentário
✅ Suporte a emojis em títulos, descrições e comentários

## Próximos Passos

1. ✅ Reiniciar servidor de desenvolvimento
2. ⏳ Testar criação de avisos no admin
3. ⏳ Testar visualização de avisos no dashboard do funcionário
4. ⏳ Testar sistema de comentários
5. ⏳ Validar permissões (admin vs funcionário)

## Observações

- Avisos são visíveis para todos os funcionários
- Apenas admin pode criar/editar/deletar avisos
- Funcionários podem apenas comentar
- Admin pode deletar qualquer comentário
- Funcionários podem deletar apenas seus próprios comentários
- Sistema usa soft delete (campo `ativo`) para avisos
