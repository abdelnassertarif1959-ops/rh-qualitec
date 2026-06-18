# Correção: Excluir Notificações no Layout - 11/02/2026

## Problema Identificado
O usuário estava visualizando as notificações no **drawer do layout** (`app/layouts/default.vue`), não nos componentes `AdminNotificationPanel.vue` ou `AdminNotificationModal.vue`.

## Solução Implementada

### 1. Botão de Exclusão Individual
Adicionado ícone de lixeira ao lado de cada notificação no drawer:

```vue
<!-- Botão de excluir -->
<button
  @click.stop="excluirNotificacao(notificacao.id)"
  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
  title="Excluir notificação"
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
</button>
```

### 2. Botão "Excluir todas lidas"
Adicionado botão vermelho no header do drawer, ao lado de "Marcar todas como lidas":

```vue
<button 
  v-if="notificacoes.some(n => n.lida)"
  @click="excluirTodasLidas"
  :disabled="isMarkingAllRead"
  class="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
>
  Excluir todas lidas
</button>
```

### 3. Funções Implementadas

#### excluirNotificacao()
```typescript
const excluirNotificacao = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
    return
  }
  
  try {
    await $fetch(`/api/notificacoes/${id}/excluir`, {
      method: 'DELETE'
    })
    
    // Remover da lista local
    const index = notificacoes.value.findIndex((n: any) => n.id === id)
    if (index > -1) {
      notificacoes.value.splice(index, 1)
    }
    
    // Atualizar contador
    await refreshNotifications()
    
    console.log('🔔 [LAYOUT] Notificação excluída com sucesso')
  } catch (error) {
    console.error('🔔 [LAYOUT] Erro ao excluir notificação:', error)
    alert('Erro ao excluir notificação. Tente novamente.')
  }
}
```

#### excluirTodasLidas()
```typescript
const excluirTodasLidas = async () => {
  const lidas = notificacoes.value.filter((n: any) => n.lida)
  
  if (lidas.length === 0) {
    alert('Não há notificações lidas para excluir.')
    return
  }
  
  if (!confirm(`Tem certeza que deseja excluir ${lidas.length} notificação(ões) lida(s)?`)) {
    return
  }
  
  try {
    isMarkingAllRead.value = true
    
    // Excluir todas as lidas
    await Promise.all(
      lidas.map((notificacao: any) => 
        $fetch(`/api/notificacoes/${notificacao.id}/excluir`, {
          method: 'DELETE'
        })
      )
    )
    
    // Remover da lista local
    notificacoes.value = notificacoes.value.filter((n: any) => !n.lida)
    
    // Atualizar contador
    await refreshNotifications()
    
    console.log('🔔 [LAYOUT] Todas as notificações lidas foram excluídas')
  } catch (error) {
    console.error('🔔 [LAYOUT] Erro ao excluir notificações:', error)
    alert('Erro ao excluir notificações. Tente novamente.')
  } finally {
    isMarkingAllRead.value = false
  }
}
```

## Localização dos Botões

### No Drawer (Mobile e Desktop)
```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notificações                                  X  │
│ 3 notificações (1 não lida)                        │
│                                                     │
│ [Todos os tipos ▼] [Marcar todas como lidas]      │
│                    [Excluir todas lidas]           │
├─────────────────────────────────────────────────────┤
│ ⚠️ Alteração de Dados                          🗑️  │
│ ANTONIO BARBOSA DA SILVA teve seus dados...        │
│ 11/02/2026, 09:39 ⚙️ Alteração de Dados           │
├─────────────────────────────────────────────────────┤
│ 🔐 Login no Sistema                      •     🗑️  │
│ SILVANA BARDUCHI fez login no sistema...           │
│ 11/02/2026, 09:41 🔐 Login                         │
└─────────────────────────────────────────────────────┘
```

## Como Testar

### 1. Abrir o Drawer de Notificações
- Clique no ícone de notificações no header (sino)
- O drawer deve abrir do lado direito

### 2. Excluir Notificação Individual
- Passe o mouse sobre uma notificação
- Clique no ícone de lixeira 🗑️
- Confirme a exclusão
- A notificação deve desaparecer

### 3. Excluir Todas as Lidas
- Marque algumas notificações como lidas (clique nelas)
- Clique no botão vermelho "Excluir todas lidas"
- Confirme a exclusão
- Todas as notificações lidas devem desaparecer

## Funcionalidades

### Exclusão Individual
- ✅ Botão de lixeira sempre visível
- ✅ Confirmação antes de excluir
- ✅ Exclusão no banco de dados
- ✅ Atualização automática da lista
- ✅ Atualização do contador de notificações

### Exclusão em Lote
- ✅ Botão "Excluir todas lidas" no header
- ✅ Só aparece se houver notificações lidas
- ✅ Confirmação com contagem
- ✅ Exclusão paralela (rápida)
- ✅ Atualização automática da lista
- ✅ Atualização do contador de notificações

## Arquivo Modificado
- `app/layouts/default.vue`

## API Utilizada
- `DELETE /api/notificacoes/[id]/excluir`

## Status
✅ Implementado e pronto para teste

## Próximos Passos
1. Reiniciar o servidor de desenvolvimento
2. Limpar cache do navegador
3. Testar exclusão individual
4. Testar exclusão em lote
5. Verificar no banco de dados
