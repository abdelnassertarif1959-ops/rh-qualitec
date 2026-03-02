/**
 * Processamento de mensagens WebSocket de notificações
 * Gerencia os diferentes tipos de mensagens recebidas
 */

import type { WebSocketMessage } from './useNotificationWebSocket'

export const useNotificationWebSocketMessages = () => {
  const { incrementCount, decrementCount, refresh } = useNotificationCount()

  /**
   * Processa mensagens do WebSocket
   */
  const handleWebSocketMessage = (message: WebSocketMessage): void => {
    console.log('📨 [WS] Mensagem recebida:', message)

    switch (message.type) {
      case 'notification_count_update':
        handleCountUpdate(message)
        break

      case 'new_notification':
        handleNewNotification(message)
        break

      case 'notification_read':
        handleNotificationRead(message)
        break

      default:
        console.warn('⚠️ [WS] Tipo de mensagem desconhecido:', message.type)
    }
  }

  /**
   * Processa atualização de contagem
   */
  const handleCountUpdate = (message: WebSocketMessage): void => {
    if (typeof message.data.unreadCount === 'number') {
      console.log(`📊 [WS] Contagem atualizada via WebSocket: ${message.data.unreadCount}`)
      // Fazer refresh para garantir consistência
      refresh()
    }
  }

  /**
   * Processa nova notificação
   */
  const handleNewNotification = (message: WebSocketMessage): void => {
    console.log('🔔 [WS] Nova notificação recebida')
    incrementCount(1)
    
    // Opcional: mostrar toast/notificação visual
    // showNotificationToast(message.data.notification)
  }

  /**
   * Processa notificação marcada como lida
   */
  const handleNotificationRead = (message: WebSocketMessage): void => {
    console.log('✅ [WS] Notificação marcada como lida')
    decrementCount(1)
  }

  return {
    handleWebSocketMessage,
    handleCountUpdate,
    handleNewNotification,
    handleNotificationRead
  }
}
