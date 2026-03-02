# Sistema de Avisos e Comentários - Completo
**Data:** 12/02/2026  
**Status:** ✅ FUNCIONANDO

## Resumo

Sistema completo de avisos e comentários implementado com sucesso para admin e funcionários.

## Funcionalidades Implementadas

### Para Admin (`/admin/avisos`)
✅ Criar novos avisos  
✅ Ver lista de avisos  
✅ Deletar avisos  
✅ Ver comentários de cada aviso  
✅ Responder comentários  
✅ Deletar qualquer comentário  

### Para Funcionários (`/dashboard`)
✅ Ver avisos na caixa de avisos  
✅ Clicar para abrir modal  
✅ Ver detalhes do aviso  
✅ Ver todos os comentários  
✅ Adicionar comentários  
✅ Editar seus próprios comentários  
✅ Deletar seus próprios comentários  

## Estrutura de Arquivos

```
app/
├── pages/
│   ├── dashboard.vue                    # Dashboard funcionário (com CaixaAvisos)
│   └── admin/
│       └── avisos.vue                   # Painel admin (com ModalAvisos)
├── components/
│   └── avisos/
│       ├── CaixaAvisos.vue             # Caixa no dashboard funcionário
│       ├── ModalAvisos.vue             # Modal principal (usado por ambos)
│       ├── AvisoCard.vue               # Card individual
│       ├── AvisoDetalhes.vue           # Detalhes de um aviso
│       ├── AvisoForm.vue               # Formulário criar/editar
│       ├── AvisosCard.vue              # Card container
│       ├── AvisosLista.vue             # Lista de avisos
│       └── ComentariosModal.vue        # Modal alternativo (não usado)
└── composables/
    └── useAvisos.ts                     # Lógica de avisos e comentários

server/api/avisos/
├── index.get.ts                         # GET /api/avisos
├── index.post.ts                        # POST /api/avisos
├── [id].delete.ts                       # DELETE /api/avisos/:id
├── [id]/comentarios.get.ts              # GET /api/avisos/:id/comentarios
├── [id]/comentarios.post.ts             # POST /api/avisos/:id/comentarios
└── [id]/comentarios/[comentarioId].delete.ts  # DELETE comentário

database/
├── 44-criar-sistema-avisos.sql          # Tabelas e políticas RLS
└── 45-corrigir-permissoes-comentarios-avisos.sql  # Correção permissões
```

## Componentes e Uso

### 1. CaixaAvisos (Dashboard Funcionário)

```vue
<AvisosCaixaAvisos class="mb-8" />
```

**Funcionalidades:**
- Mostra até 3 avisos mais recentes
- Botão "Ver todos" se houver mais de 3
- Clique no aviso abre modal
- Mostra contador de comentários

### 2. ModalAvisos (Modal Principal)

```vue
<AvisosModalAvisos 
  :aberto="modalAberto"
  :aviso-selecionado="avisoSelecionado"
  @fechar="fecharModal"
/>
```

**Props:**
- `aberto`: boolean - controla visibilidade
- `avisoSelecionado`: object | null - aviso para mostrar detalhes
- `@fechar`: evento quando modal fecha

**Funcionalidades:**
- Teleport para body (z-index 9999)
- Mostra detalhes do aviso
- Lista todos os comentários
- Formulário para adicionar comentário
- Loading states
- Formatação de datas relativas

### 3. Painel Admin

```vue
<!-- Em app/pages/admin/avisos.vue -->
<button @click="abrirComentarios(aviso.id)">
  Ver comentários
</button>

<AvisosModalAvisos 
  :aberto="modalComentariosAberto"
  :aviso-selecionado="avisoAtualParaComentarios"
  @fechar="fecharComentarios"
/>
```

## APIs

### GET /api/avisos
Retorna todos os avisos ativos com informações do criador

```typescript
{
  success: true,
  avisos: [
    {
      id: 'uuid',
      titulo: 'string',
      descricao: 'string',
      criado_por: number,
      criado_em: 'timestamp',
      ativo: boolean,
      criador: {
        id: number,
        nome_completo: 'string',
        avatar: 'string'
      }
    }
  ]
}
```

### POST /api/avisos
Cria novo aviso (apenas admin)

```typescript
// Request
{
  titulo: 'string',
  descricao: 'string'
}

// Response
{
  success: true,
  message: 'Aviso criado com sucesso',
  aviso: { ... }
}
```

### GET /api/avisos/:id/comentarios
Retorna comentários de um aviso

```typescript
{
  success: true,
  comentarios: [
    {
      id: 'uuid',
      aviso_id: 'uuid',
      funcionario_id: number,
      comentario: 'string',
      criado_em: 'timestamp',
      autor: {
        id: number,
        nome_completo: 'string',
        avatar: 'string',
        tipo_acesso: 'string'
      }
    }
  ]
}
```

### POST /api/avisos/:id/comentarios
Adiciona comentário (funcionários autenticados)

```typescript
// Request
{
  comentario: 'string'
}

// Response
{
  success: true,
  message: 'Comentário adicionado com sucesso',
  comentario: { ... }
}
```

## Permissões RLS

### Tabela `avisos`
- **SELECT**: Todos podem ver avisos ativos
- **INSERT**: Apenas admin pode criar
- **UPDATE**: Apenas admin pode editar
- **DELETE**: Apenas admin pode deletar

### Tabela `avisos_comentarios`
- **SELECT**: Todos podem ver comentários de avisos ativos
- **INSERT**: Funcionários autenticados podem comentar
- **UPDATE**: Funcionários podem editar seus próprios
- **DELETE**: Admin pode deletar qualquer, funcionários seus próprios

## Fluxo de Uso

### Funcionário

1. Acessa `/dashboard`
2. Vê caixa de avisos com últimos avisos
3. Clica em um aviso
4. Modal abre com detalhes
5. Vê comentários existentes
6. Escreve novo comentário
7. Clica em "Comentar"
8. Comentário aparece na lista
9. Fecha modal

### Admin

1. Acessa `/admin/avisos`
2. Clica em "Novo Aviso"
3. Preenche título e descrição
4. Clica em "Criar Aviso"
5. Aviso aparece na lista
6. Clica em "Ver comentários"
7. Modal abre com comentários
8. Pode responder comentários
9. Pode deletar comentários
10. Pode deletar o aviso inteiro

## Próximas Melhorias (Futuro)

### Sistema de Notificações para Comentários

Para implementar notificações quando houver novos comentários:

1. **Adicionar trigger no banco:**
```sql
CREATE OR REPLACE FUNCTION notificar_novo_comentario()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar notificação para o admin quando funcionário comentar
  IF EXISTS (
    SELECT 1 FROM funcionarios 
    WHERE id = NEW.funcionario_id 
    AND tipo_acesso = 'funcionario'
  ) THEN
    INSERT INTO notificacoes (
      usuario_id,
      tipo,
      titulo,
      mensagem,
      link
    )
    SELECT 
      f.id,
      'novo_comentario_aviso',
      'Novo comentário em aviso',
      'Um funcionário comentou em um aviso',
      '/admin/avisos'
    FROM funcionarios f
    WHERE f.tipo_acesso = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificar_novo_comentario
AFTER INSERT ON avisos_comentarios
FOR EACH ROW
EXECUTE FUNCTION notificar_novo_comentario();
```

2. **Atualizar contador de notificações**
3. **Adicionar badge no menu "Avisos"**
4. **Mostrar notificação em tempo real via WebSocket**

## Testes

### Teste Manual - Funcionário

```bash
# 1. Login como funcionário
# 2. Ir para /dashboard
# 3. Ver caixa de avisos
# 4. Clicar em um aviso
# 5. Modal deve abrir
# 6. Escrever comentário
# 7. Clicar em "Comentar"
# 8. Comentário deve aparecer
# 9. Fechar modal
```

### Teste Manual - Admin

```bash
# 1. Login como admin
# 2. Ir para /admin/avisos
# 3. Clicar em "Novo Aviso"
# 4. Preencher e criar
# 5. Aviso deve aparecer na lista
# 6. Clicar em "Ver comentários"
# 7. Modal deve abrir
# 8. Adicionar comentário
# 9. Comentário deve aparecer
# 10. Deletar comentário
# 11. Comentário deve sumir
```

### Teste de Permissões

```bash
node scripts/testar-permissoes-avisos.js
```

## Conclusão

✅ Sistema completo e funcional  
✅ Admin pode gerenciar avisos  
✅ Funcionários podem comentar  
✅ Permissões RLS configuradas  
✅ Modal funcionando em ambos os perfis  
✅ Pronto para produção  

**Próximo passo:** Implementar notificações para novos comentários! 🔔
