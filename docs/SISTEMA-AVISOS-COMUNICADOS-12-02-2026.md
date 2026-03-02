# Sistema de Avisos e Comunicados

**Data de Criação:** 12/02/2026  
**Status:** ✅ Implementado

## 📋 Visão Geral

Sistema completo de comunicação entre administrador e funcionários através de avisos/recados com suporte a comentários e emojis.

## 🎯 Funcionalidades

### Para Administradores
- ✅ Criar avisos com título e descrição
- ✅ Editar avisos existentes
- ✅ Deletar avisos (remove também todos os comentários)
- ✅ Deletar comentários de funcionários
- ✅ Suporte a emojis nas mensagens
- ✅ Visualizar todos os avisos e comentários

### Para Funcionários
- ✅ Visualizar todos os avisos ativos
- ✅ Comentar nos avisos
- ✅ Ver comentários de outros funcionários
- ✅ Suporte a emojis nos comentários
- ✅ Card de avisos no dashboard (últimos 3)

## 🗄️ Estrutura do Banco de Dados

### Tabela: `avisos`
```sql
- id (UUID, PK)
- titulo (VARCHAR 200)
- descricao (TEXT)
- criado_por (UUID, FK -> usuarios)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
- ativo (BOOLEAN)
```

### Tabela: `avisos_comentarios`
```sql
- id (UUID, PK)
- aviso_id (UUID, FK -> avisos)
- usuario_id (UUID, FK -> usuarios)
- comentario (TEXT)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

### Índices
- `idx_avisos_ativo` - Filtro por avisos ativos
- `idx_avisos_criado_em` - Ordenação por data
- `idx_avisos_comentarios_aviso_id` - Busca de comentários por aviso
- `idx_avisos_comentarios_criado_em` - Ordenação de comentários

## 🔒 Segurança (RLS)

### Políticas de Avisos
- **SELECT**: Todos podem visualizar avisos ativos
- **INSERT**: Apenas admin pode criar
- **UPDATE**: Apenas admin pode atualizar
- **DELETE**: Apenas admin pode deletar

### Políticas de Comentários
- **SELECT**: Todos podem visualizar
- **INSERT**: Usuários autenticados podem criar (próprio ID)
- **DELETE**: Apenas admin pode deletar

## 🔌 APIs

### Avisos

#### `GET /api/avisos`
Busca todos os avisos ativos com autor e contagem de comentários.
- **Auth**: Requerida
- **Response**: Array de avisos

#### `POST /api/avisos`
Cria novo aviso.
- **Auth**: Admin
- **Body**: `{ titulo, descricao }`
- **Validações**:
  - Título obrigatório (máx 200 chars)
  - Descrição obrigatória

#### `GET /api/avisos/:id`
Busca aviso específico.
- **Auth**: Requerida
- **Response**: Aviso com detalhes

#### `PATCH /api/avisos/:id`
Atualiza aviso.
- **Auth**: Admin
- **Body**: `{ titulo?, descricao?, ativo? }`

#### `DELETE /api/avisos/:id`
Deleta aviso e todos os comentários (cascade).
- **Auth**: Admin

### Comentários

#### `GET /api/avisos/:id/comentarios`
Busca comentários de um aviso.
- **Auth**: Requerida
- **Response**: Array de comentários com dados do usuário

#### `POST /api/avisos/:id/comentarios`
Cria comentário em um aviso.
- **Auth**: Requerida
- **Body**: `{ comentario }`
- **Validações**:
  - Comentário obrigatório
  - Aviso deve existir e estar ativo

#### `DELETE /api/avisos/:id/comentarios/:comentarioId`
Deleta comentário.
- **Auth**: Admin

## 🎨 Componentes Vue

### `AvisosCard.vue`
Card para dashboard do funcionário mostrando últimos 3 avisos.
- Exibe título, descrição (truncada) e contagem de comentários
- Botão "Ver todos" abre modal
- Click no aviso abre detalhes

### `AvisosModal.vue`
Modal principal que contém lista ou detalhes.
- Overlay com backdrop
- Navegação entre lista e detalhes
- Responsivo

### `AvisosLista.vue`
Lista todos os avisos.
- Botão "Criar Novo Aviso" (apenas admin)
- Cards clicáveis para cada aviso
- Botão deletar (apenas admin)
- Mostra autor, data e contagem de comentários

### `AvisoForm.vue`
Formulário para criar/editar aviso.
- Campo título (máx 200 chars com contador)
- Campo descrição (textarea)
- Suporte a emojis
- Validações client-side

### `AvisoDetalhes.vue`
Visualização completa do aviso com comentários.
- Botão voltar
- Conteúdo completo do aviso
- Formulário para novo comentário
- Lista de comentários com timestamps relativos
- Botão deletar comentário (apenas admin)

## 📦 Composable

### `useAvisos.ts`

#### Estado
```typescript
- avisos: Ref<Aviso[]>
- avisoAtual: Ref<Aviso | null>
- comentarios: Ref<AvisoComentario[]>
- loading: Ref<boolean>
- error: Ref<string | null>
```

#### Métodos
```typescript
- buscarAvisos(): Promise<Aviso[]>
- buscarAviso(id): Promise<Aviso>
- criarAviso(data): Promise<Aviso>
- atualizarAviso(id, data): Promise<Aviso>
- deletarAviso(id): Promise<boolean>
- buscarComentarios(avisoId): Promise<AvisoComentario[]>
- criarComentario(avisoId, comentario): Promise<AvisoComentario>
- deletarComentario(avisoId, comentarioId): Promise<boolean>
- limpar(): void
```

## 🚀 Como Usar

### 1. Executar Migration
```bash
# No Supabase SQL Editor
psql -f database/44-criar-sistema-avisos.sql
```

### 2. Adicionar Card no Dashboard do Funcionário
```vue
<template>
  <div class="dashboard">
    <!-- Outros cards -->
    <AvisosCard />
  </div>
</template>

<script setup>
import AvisosCard from '~/components/avisos/AvisosCard.vue'
</script>
```

### 3. Adicionar Página Admin (Opcional)
```vue
<!-- pages/admin/avisos.vue -->
<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Gerenciar Avisos</h1>
    <AvisosLista @selecionar="abrirAviso" />
  </div>
</template>
```

## 📱 Recursos

### Emojis
- ✅ Suporte completo a emojis UTF-8
- Funcionários podem usar emojis em comentários
- Admin pode usar emojis em avisos

### Timestamps Inteligentes
- "Agora" - menos de 1 minuto
- "Xmin atrás" - menos de 1 hora
- "Xh atrás" - menos de 24 horas
- "Xd atrás" - menos de 7 dias
- Data completa - mais de 7 dias

### Contadores
- Total de comentários por aviso
- Atualização automática ao adicionar/remover

## 🔄 Fluxo de Uso

### Admin cria aviso:
1. Acessa painel admin
2. Clica em "Criar Novo Aviso"
3. Preenche título e descrição (pode usar emojis)
4. Salva
5. Aviso aparece para todos os funcionários

### Funcionário comenta:
1. Vê card de avisos no dashboard
2. Clica em "Ver todos" ou em um aviso específico
3. Lê o aviso completo
4. Escreve comentário (pode usar emojis)
5. Clica em "Comentar"
6. Comentário aparece para todos

### Admin modera:
1. Visualiza todos os avisos e comentários
2. Pode deletar comentários inadequados
3. Pode deletar avisos antigos

## ⚠️ Observações

- Deletar aviso remove TODOS os comentários (cascade)
- Apenas avisos com `ativo = true` são exibidos
- RLS garante que apenas admin pode criar/editar/deletar avisos
- Funcionários só podem criar comentários, não deletar
- Suporte a caracteres especiais e emojis UTF-8

## 🎯 Próximas Melhorias (Opcional)

- [ ] Notificações push quando novo aviso é criado
- [ ] Marcar avisos como "lidos"
- [ ] Anexar arquivos aos avisos
- [ ] Reações (curtir) nos avisos
- [ ] Filtros por data/autor
- [ ] Busca em avisos
- [ ] Paginação para muitos avisos
