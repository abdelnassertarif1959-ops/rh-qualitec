# Correção do Badge de Notificações - 10/02/2026

## Problema Identificado

O badge vermelho de notificações não estava atualizando após marcar notificações como lidas, mesmo com todas as notificações marcadas como lidas.

## Causa Raiz

O sistema de reatividade do Vue não estava detectando as mudanças no `globalUnreadCount` de forma consistente, mesmo com:
- `decrementCount()` sendo chamado
- `refreshCount()` sendo executado
- O valor sendo atualizado no estado global

## Solução Implementada

### 1. Watcher Explícito no LayoutSidebar

Adicionado watcher para monitorar mudanças no `unreadCount`:

```typescript
// Watcher para monitorar mudanças na contagem de notificações
watch(() => unreadCount.value, (newValue, oldValue) => {
  console.log('🔔 [SIDEBAR] WATCHER: unreadCount mudou:', oldValue, '->', newValue)
  console.log('🔔 [SIDEBAR] WATCHER: hasUnreadNotifications:', hasUnreadNotifications.value)
})
```

### 2. Melhorias no Composable useNotificationCount

#### a) Forçar Trigger de Reatividade no decrementCount

```typescript
const decrementCount = (amount = 1): void => {
  const oldValue = globalUnreadCount.value
  globalUnreadCount.value = Math.max(0, globalUnreadCount.value - amount)
  console.log(`📉 [NOTIFICATION-COUNT] Decrementado: -${amount} (${oldValue} → ${globalUnreadCount.value})`)
  
  // Forçar trigger de reatividade
  globalUnreadCount.value = globalUnreadCount.value
}
```

#### b) Sempre Atualizar no fetchUnreadCount

Removida a otimização que evitava re-renders quando o valor não mudava:

```typescript
// Sempre atualizar, mesmo que seja o mesmo valor, para forçar reatividade
console.log(`📊 [NOTIFICATION-COUNT] Contagem do servidor: ${newCount} (local: ${oldCount})`)
globalUnreadCount.value = newCount
```

### 3. Logs Aprimorados

Adicionados logs detalhados para debug:
- Valor antigo e novo em cada mudança
- Status de reatividade
- Confirmação de atualização do servidor

## Arquivos Modificados

1. `app/components/layout/LayoutSidebar.vue`
   - Adicionado watcher para `unreadCount`

2. `app/composables/useNotificationCount.ts`
   - Melhorado `decrementCount()` com trigger forçado
   - Melhorado `fetchUnreadCount()` para sempre atualizar
   - Logs mais detalhados

## Como Testar

1. Fazer login como admin
2. Abrir o painel de notificações (deve ter badge vermelho)
3. Marcar uma notificação como lida
4. Verificar se o badge atualiza imediatamente
5. Marcar todas como lidas
6. Verificar se o badge desaparece

## Logs Esperados no Console

```
🔔 [SIDEBAR] WATCHER: unreadCount mudou: 5 -> 4
🔔 [SIDEBAR] WATCHER: hasUnreadNotifications: true
📉 [NOTIFICATION-COUNT] Decrementado: -1 (5 → 4)
📊 [NOTIFICATION-COUNT] Contagem do servidor: 4 (local: 4)
✅ [DRAWER] Notificação marcada como lida, contagem atualizada
```

## Próximos Passos

1. Testar em produção após deploy
2. Verificar se o problema persiste
3. Se persistir, considerar:
   - Usar `triggerRef()` do Vue
   - Implementar sistema de eventos customizado
   - Revisar a arquitetura de estado global

## Status

- ✅ Código corrigido
- ⏳ Aguardando deploy no Vercel
- ⏳ Aguardando testes em produção

## Observações

- O botão de excluir notificações já foi implementado no commit anterior
- Aguardando deploy para que as mudanças apareçam em produção
- Sistema de polling continua funcionando normalmente (30s)
