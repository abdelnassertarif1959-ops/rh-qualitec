# Sistema de Avisos e Comentários

**Data de Criação:** 12/02/2026  
**Versão:** 1.0.0

## Visão Geral

Sistema completo para comunicação entre administradores e funcionários através de avisos/recados com suporte a comentários e emojis.

## Funcionalidades

### Para Administradores
- ✅ Criar avisos com título e descrição
- ✅ Suporte a emojis nas mensagens
- ✅ Deletar avisos (soft delete)
- ✅ Visualizar e deletar comentários
- ✅ Página dedicada em `/admin/avisos`

### Para Funcionários
- ✅ Visualizar todos os avisos ativos
- ✅ Comentar em avisos
- ✅ Deletar próprios comentários
- ✅ Caixa de avisos no dashboard
- ✅ Suporte a emojis nos comentários

## Estrutura do Banco de Dados

### Tabela: `avisos`
```sql
- id (UUID, PK)
- titulo (VARCHAR 200)
- descricao (TEXT)
- criado_por (UUID, FK -> usuarios)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
- ativo (BOOLEAN) - soft delete
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

## APIs Disponíveis

### Avisos

#### GET `/api/avisos`
Lista todos os avisos ativos com informações do criador.

**Resposta:**
```json
{
  "success": true,
  "avisos": [
    {
      "id": "uuid",
      "titulo": "Título do aviso",
      "descricao": "Descrição completa",
      "criado_em": "2026-02-12T10:00:00Z",
      "criador": {
        "id": "uuid",
        "nome_completo": "Admin",
        "avatar": "url"
      }
    }
  ]
}
```

#### POST `/api/avisos`
Cria novo aviso (apenas admin).

**Body:**
```json
{
  "titulo": "Título do aviso",
  "descricao": "Descrição completa com emojis 🎉"
}
```

**Validações:**
- Título: obrigatório, máx 200 caracteres
- Descrição: obrigatória
- Usuário deve ser admin

#### DELETE `/api/avisos/:id`
Deleta aviso (soft delete, apenas admin).

### Comentários

#### GET `/api/avisos/:id/comentarios`
Lista comentários de um aviso.

**Resposta:**
```json
{
  "success": true,
  "comentarios": [
    {
      "id": "uuid",
      "comentario": "Texto do comentário",
      "criado_em": "2026-02-12T10:30:00Z",
      "autor": {
        "id": "uuid",
        "nome_completo": "Funcionário",
        "avatar": "url",
        "tipo_usuario": "funcionario"
      }
    }
  ]
}
```

#### POST `/api/avisos/:id/comentarios`
Adiciona comentário em um aviso.

**Body:**
```json
{
  "comentario": "Texto do comentário com emoji 👍"
}
```

**Validações:**
- Comentário: obrigatório
- Aviso deve estar ativo
- Usuário deve estar autenticado

#### DELETE `/api/avisos/comentarios/:id`
Deleta comentário (admin ou autor).

## Segurança (RLS)

### Avisos
- **SELECT:** Todos podem ver avisos ativos
- **INSERT:** Apenas admin
- **UPDATE:** Apenas admin
- **DELETE:** Apenas admin

### Comentários
- **SELECT:** Todos podem ver comentários de avisos ativos
- **INSERT:** Usuários autenticados em avisos ativos
- **UPDATE:** Apenas o autor
- **DELETE:** Admin ou autor

## Componentes

### `useAvisos` (Composable)
Gerencia estado e operações de avisos e comentários.

**Métodos:**
- `fetchAvisos()` - Busca avisos
- `criarAviso(titulo, descricao)` - Cria aviso
- `deletarAviso(id)` - Deleta aviso
- `fetchComentarios(avisoId)` - Busca comentários
- `adicionarComentario(avisoId, comentario)` - Adiciona comentário
- `deletarComentario(id)` - Deleta comentário

### `AvisoCard.vue`
Card individual de aviso com:
- Avatar e nome do criador
- Título e descrição
- Data relativa (ex: "2h atrás")
- Botão de comentários
- Botão deletar (apenas admin)

### `ComentariosModal.vue`
Modal para visualizar e adicionar comentários:
- Lista de comentários com avatares
- Form para novo comentário
- Botão deletar (admin ou autor)
- Scroll infinito

### `CaixaAvisos.vue`
Widget para dashboard do funcionário:
- Expansível/colapsável
- Badge com contador
- Preview dos avisos
- Integração com modal de comentários

## Páginas

### `/admin/avisos`
Página administrativa para gerenciar avisos:
- Lista todos os avisos
- Botão criar novo aviso
- Modal de criação com validação
- Acesso aos comentários
- Deletar avisos

## Como Usar

### 1. Executar Migration
```bash
# No Supabase SQL Editor
psql -f database/44-criar-sistema-avisos.sql
```

### 2. Admin: Criar Aviso
1. Acessar `/admin/avisos`
2. Clicar em "Novo Aviso"
3. Preencher título e descrição (pode usar emojis)
4. Clicar em "Criar Aviso"

### 3. Funcionário: Ver Avisos
1. No dashboard, localizar "Caixa de Avisos"
2. Expandir para ver todos os avisos
3. Clicar em "comentários" para interagir

### 4. Comentar
1. Abrir modal de comentários
2. Escrever comentário (pode usar emojis)
3. Clicar em "Enviar"

### 5. Deletar
- **Aviso:** Apenas admin, botão no card
- **Comentário:** Admin ou autor, botão no comentário

## Exemplos de Uso

### Aviso de Reunião
```
Título: 📅 Reunião Geral - Sexta 15h
Descrição: Pessoal, teremos reunião geral na sexta-feira às 15h no auditório. 
Presença obrigatória! Vamos discutir as metas do trimestre. ☕
```

### Aviso de Feriado
```
Título: 🎉 Feriado Prolongado
Descrição: Lembrando que na próxima segunda-feira (15/02) será feriado. 
Retornamos na terça-feira. Bom descanso a todos! 🏖️
```

### Aviso Importante
```
Título: ⚠️ Manutenção no Sistema
Descrição: O sistema ficará em manutenção no sábado das 8h às 12h. 
Durante este período não será possível acessar o portal. 🔧
```

## Melhorias Futuras

- [ ] Notificações push para novos avisos
- [ ] Marcar avisos como lidos
- [ ] Fixar avisos importantes no topo
- [ ] Filtrar avisos por data
- [ ] Buscar em avisos
- [ ] Anexar arquivos em avisos
- [ ] Reações (curtir) em comentários
- [ ] Menções (@usuario) em comentários
- [ ] Editar avisos e comentários

## Troubleshooting

### Avisos não aparecem
- Verificar se RLS está habilitado
- Verificar se avisos estão com `ativo = true`
- Verificar logs do Supabase

### Não consigo comentar
- Verificar autenticação
- Verificar se aviso está ativo
- Verificar permissões RLS

### Erro ao deletar
- Admin: verificar tipo_usuario
- Funcionário: verificar se é autor do comentário
