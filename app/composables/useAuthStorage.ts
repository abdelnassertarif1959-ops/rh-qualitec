// Gerenciamento de localStorage para autenticação
import type { User } from './useAuth'

export const useAuthStorage = () => {
  // Recuperar usuário do localStorage
  const getUserFromStorage = (): User | null => {
    if (!process.client) return null
    
    try {
      const stored = localStorage.getItem('auth-user')
      const parsed = stored ? JSON.parse(stored) : null
      console.log('🔐 [STORAGE] Usuário recuperado:', parsed?.nome || 'NENHUM')
      return parsed
    } catch (error) {
      console.error('🔐 [STORAGE] Erro ao recuperar usuário:', error)
      return null
    }
  }

  // Salvar usuário no localStorage
  const saveUserToStorage = (user: User): boolean => {
    if (!process.client) return false
    
    try {
      localStorage.setItem('auth-user', JSON.stringify(user))
      console.log('🔐 [STORAGE] Usuário salvo:', user.nome)
      return true
    } catch (error) {
      console.error('🔐 [STORAGE] Erro ao salvar usuário:', error)
      return false
    }
  }

  // Remover usuário do localStorage
  const removeUserFromStorage = (): boolean => {
    if (!process.client) return false
    
    try {
      localStorage.removeItem('auth-user')
      console.log('🔐 [STORAGE] localStorage limpo')
      return true
    } catch (error) {
      console.error('🔐 [STORAGE] Erro ao limpar localStorage:', error)
      return false
    }
  }

  // Limpar todos os estados globais
  const clearAllStates = () => {
    if (!process.client) return
    
    try {
      // Limpar notificações
      if (typeof useState === 'function') {
        const notificationsOpen = useState('notifications-open', () => false)
        notificationsOpen.value = false
      }
      console.log('🔐 [STORAGE] Estados globais limpos')
    } catch (error) {
      console.error('🔐 [STORAGE] Erro ao limpar estados:', error)
    }
  }

  return {
    getUserFromStorage,
    saveUserToStorage,
    removeUserFromStorage,
    clearAllStates
  }
}
