# Guia de Teste - Excluir Notificações - 11/02/2026

## Status
✅ Código implementado e atualizado
✅ Botões de exclusão agora sempre visíveis
✅ API de exclusão já existente e funcional

## O que foi alterado

### 1. AdminNotificationPanel.vue
- Botão de lixeira agora SEMPRE VISÍVEL (não precisa hover)
- Ícone de lixeira cinza que fica vermelho no hover
- Confirmação antes de excluir

### 2. AdminNotificationModal.vue
- Botão de lixeira em cada notificação SEMPRE VISÍVEL
- Botão "Excluir todas lidas" no header (vermelho)
- Confirmação antes de excluir

## Como Testar

### Teste 1: Verificar se os botões aparecem
1. Abra o sistema e faça login como admin
2. Clique no ícone de notificações no header
3. **VERIFIQUE**: Você deve ver um ícone de lixeira (🗑️) ao lado de cada notificação
4. O ícone deve estar sempre visível (não precisa passar o mouse)

### Teste 2: Excluir notificação individual no painel
1. No painel de notificações (dropdown)
2. Clique no ícone de lixeira de uma notificação
3. Confirme a exclusão
4. **RESULTADO ESPERADO**: 
   - Notificação desaparece da lista
   - Notificação é removida do banco de dados

### Teste 3: Excluir notificação individual no modal
1. Clique em "Ver todas as notificações"
2. Clique no ícone de lixeira de uma notificação
3. Confirme a exclusão
4. **RESULTADO ESPERADO**: 
   - Notificação desaparece da lista
   - Notificação é removida do banco de dados

### Teste 4: Excluir todas as notificações lidas
1. Marque algumas notificações como lidas (clique nelas)
2. Abra o modal "Ver todas as notificações"
3. Clique no botão vermelho "Excluir todas lidas" no header
4. Confirme a exclusão
5. **RESULTADO ESPERADO**: 
   - Todas as notificações lidas desaparecem
   - Notificações não lidas permanecem
   - Registros removidos do banco de dados

### Teste 5: Cancelar exclusão
1. Clique no ícone de lixeira
2. Clique em "Cancelar" na confirmação
3. **RESULTADO ESPERADO**: 
   - Notificação permanece na lista
   - Nada é excluído

## Troubleshooting

### Problema: Botões não aparecem
**Solução**: 
1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Faça um hard refresh (Ctrl + F5)
3. Reinicie o servidor de desenvolvimento

### Problema: Erro ao excluir
**Verificar**:
1. Console do navegador (F12) para ver erros
2. Logs do servidor
3. Se a API `/api/notificacoes/[id]/excluir` está respondendo

### Problema: Notificação não desaparece
**Verificar**:
1. Se a exclusão foi confirmada
2. Se há erro no console
3. Se o banco de dados foi atualizado

## Comandos Úteis

### Reiniciar servidor de desenvolvimento
```bash
# Parar o servidor (Ctrl + C)
# Iniciar novamente
npm run dev
```

### Verificar notificações no banco
```sql
-- No Supabase SQL Editor
SELECT id, titulo, mensagem, lida, created_at 
FROM notificacoes 
ORDER BY created_at DESC 
LIMIT 10;
```

### Limpar cache do navegador
- Chrome/Edge: Ctrl + Shift + Delete
- Firefox: Ctrl + Shift + Delete
- Safari: Cmd + Option + E

## Aparência dos Botões

### No Painel (Dropdown)
```
┌─────────────────────────────────────────┐
│ 🔔 Notificação                    🗑️   │
│ Mensagem da notificação                 │
│ Há 2 horas                              │
└─────────────────────────────────────────┘
```

### No Modal
```
┌─────────────────────────────────────────────────────┐
│ 🔔 Todas as Notificações                            │
│ [Filtros] [Marcar todas como lidas] [Excluir todas lidas] [X] │
├─────────────────────────────────────────────────────┤
│ 🔔 Notificação                    [Ver detalhes] 🗑️│
│ Mensagem da notificação                             │
│ 11/02/2026 14:30                                    │
└─────────────────────────────────────────────────────┘
```

## Cores e Estados

### Botão de Exclusão Individual
- **Normal**: Cinza claro (text-gray-400)
- **Hover**: Vermelho (text-red-600) com fundo vermelho claro (bg-red-50)
- **Tamanho**: 4x4 (painel) ou 5x5 (modal)

### Botão "Excluir todas lidas"
- **Cor**: Vermelho (bg-red-600)
- **Hover**: Vermelho escuro (bg-red-700)
- **Localização**: Header do modal, ao lado de "Marcar todas como lidas"

## Próximos Passos

1. ✅ Testar no ambiente local
2. ⏳ Fazer commit das alterações
3. ⏳ Deploy para produção
4. ⏳ Testar em produção

## Arquivos Modificados
- `app/components/admin/AdminNotificationPanel.vue`
- `app/components/admin/AdminNotificationModal.vue`

## Notas Importantes
- Os botões agora estão SEMPRE VISÍVEIS (não precisa hover)
- Confirmação obrigatória antes de excluir
- Exclusão remove do banco de dados permanentemente
- Não há opção de "desfazer" após exclusão
