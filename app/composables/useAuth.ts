// Composable de autenticação - Core
export interface User {
  id: number
  nome: string
  email: string
  tipo: 'admin' | 'funcionario'
  cargo?: string
  departamento?: string
  foto?: string
  avatar?: string
}

export const useAuth = () => {
  const { getUserFromStorage, saveUserToStorage, removeUserFromStorage, clearAllStates } = useAuthStorage()
  const { performLogin } = useAuthLogin()

  // Estado do usuário
  const user = useState<User | null>('auth-user', () => getUserFromStorage())
  
  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.tipo === 'admin')

  // Login
  const login = async (email: string, senha: string): Promise<{ success: boolean; message: string }> => {
    const result = await performLogin(email, senha)
    
    if (result.success && result.user) {
      user.value = result.user
    }
    
    return { success: result.success, message: result.message }
  }

  // Logout
  const logout = () => {
    console.log('🔐 [AUTH] Fazendo logout...')
    
    // Limpar estado do usuário
    user.value = null
    
    // Limpar localStorage e estados
    removeUserFromStorage()
    clearAllStates()
    
    // Forçar reload da página para limpar todos os estados
    if (process.client) {
      window.location.href = '/login'
      return
    }
    
    navigateTo('/login')
  }

  // Atualizar usuário
  const updateUser = (updatedData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedData }
      saveUserToStorage(user.value)
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser
  }
}
