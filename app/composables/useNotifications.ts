interface Notification {
  id: string
  title: string
  message?: string
  variant: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  show: boolean
}

// Estado global das notificações
const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  // Função para adicionar notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'show'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    const newNotification: Notification = {
      id,
      show: true,
      duration: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto remover após duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  // Função para remover notificação
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value[index].show = false
      // Remover da lista após animação
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }
  
  // Função para limpar todas as notificações
  const clearNotifications = () => {
    notifications.value.forEach(n => n.show = false)
    setTimeout(() => {
      notifications.value.splice(0)
    }, 300)
  }
  
  // Funções de conveniência com verificação de permissão
  const notifySuccess = (title: string, message?: string, duration?: number) => {
    // CORREÇÃO: Só mostrar notificações administrativas para admins
    if (isAdminNotification(title)) {
      const { isAdmin } = useAuth()
      if (!isAdmin.value) {
        console.log('🔕 [NOTIFICATIONS] Notificação administrativa bloqueada para funcionário:', title)
        return
      }
    }
    return addNotification({ title, message, variant: 'success', duration })
  }
  
  const notifyError = (title: string, message?: string, duration?: number) => {
    return addNotification({ title, message, variant: 'error', duration })
  }
  
  const notifyWarning = (title: string, message?: string, duration?: number) => {
    // CORREÇÃO: Só mostrar notificações administrativas para admins
    if (isAdminNotification(title)) {
      const { isAdmin } = useAuth()
      if (!isAdmin.value) {
        console.log('🔕 [NOTIFICATIONS] Notificação administrativa bloqueada para funcionário:', title)
        return
      }
    }
    return addNotification({ title, message, variant: 'warning', duration })
  }
  
  const notifyInfo = (title: string, message?: string, duration?: number) => {
    // CORREÇÃO: Só mostrar notificações administrativas para admins
    if (isAdminNotification(title)) {
      const { isAdmin } = useAuth()
      if (!isAdmin.value) {
        console.log('🔕 [NOTIFICATIONS] Notificação administrativa bloqueada para funcionário:', title)
        return
      }
    }
    return addNotification({ title, message, variant: 'info', duration })
  }
  
  // Função para verificar se é notificação administrativa
  const isAdminNotification = (title: string): boolean => {
    const adminKeywords = [
      'Holerites Gerados',
      'Holerites Disponibilizados',
      'Folhas mensais Gerados',
      'Adiantamentos Gerados',
      'gerados',
      'disponibilizados',
      'Admin',
      'Sistema'
    ]
    
    return adminKeywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  }
}