// Composable de login - Lógica de autenticação
export const useAuthLogin = () => {
  const performLogin = async (email: string, senha: string) => {
    try {
      console.log('🔐 [AUTH-LOGIN] Iniciando login...')
      
      // Obter token CSRF
      const csrfToken = useCookie('csrf-token').value
      
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, senha },
        headers: {
          'X-CSRF-Token': csrfToken || ''
        }
      })
      
      if (response.success && response.user) {
        console.log('✅ [AUTH-LOGIN] Login bem-sucedido')
        
        // Salvar tokens em cookies (já feito pelo servidor)
        // Os tokens JWT são automaticamente salvos em cookies httpOnly
        
        // Salvar dados do usuário
        const { saveUserToStorage } = useAuthStorage()
        const user = {
          id: response.user.id,
          nome: response.user.nome,
          email: response.user.email,
          tipo: response.user.tipo,
          cargo: response.user.cargo,
          departamento: response.user.departamento,
          foto: response.user.foto,
          avatar: response.user.avatar
        }
        
        saveUserToStorage(user)
        
        return {
          success: true,
          message: 'Login realizado com sucesso',
          user
        }
      }
      
      return {
        success: false,
        message: 'Erro ao fazer login'
      }
      
    } catch (error: any) {
      console.error('❌ [AUTH-LOGIN] Erro no login:', error)
      
      const message = error.data?.statusMessage || error.message || 'Erro ao fazer login'
      
      return {
        success: false,
        message
      }
    }
  }
  
  return {
    performLogin
  }
}
