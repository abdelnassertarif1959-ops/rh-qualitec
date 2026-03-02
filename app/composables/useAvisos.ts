// Composable para gerenciar avisos e comentários
export const useAvisos = () => {
  const avisos = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar todos os avisos
  const fetchAvisos = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/avisos', {
        method: 'GET'
      })

      if (response.success) {
        avisos.value = response.avisos
      } else {
        error.value = (response as any).message || 'Erro ao buscar avisos'
      }
    } catch (err: any) {
      console.error('Erro ao buscar avisos:', err)
      error.value = err.message || 'Erro ao buscar avisos'
    } finally {
      loading.value = false
    }
  }

  // Buscar avisos (retorna array diretamente)
  const buscarAvisos = async () => {
    try {
      const response: any = await $fetch('/api/avisos', {
        method: 'GET'
      })

      if (response.success) {
        return response.avisos || []
      }
      return []
    } catch (err: any) {
      console.error('Erro ao buscar avisos:', err)
      return []
    }
  }

  // Criar novo aviso (apenas admin)
  const criarAviso = async (titulo: string, descricao: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔵 [AVISOS] === INÍCIO CRIAR AVISO ===')
      
      // Buscar usuário do estado global de autenticação
      const { user } = useAuth()
      console.log('🔵 [AVISOS] Usuário do useAuth:', user.value ? 'existe' : 'NÃO EXISTE')
      
      if (!user.value) {
        console.error('❌ [AVISOS] Usuário não autenticado')
        throw new Error('Usuário não autenticado')
      }
      
      console.log('🔵 [AVISOS] Dados do usuário:', {
        id: user.value.id,
        nome: user.value.nome,
        tipo: user.value.tipo,
        email: user.value.email
      })
      
      console.log('🔵 [AVISOS] Enviando requisição para API...')
      console.log('🔵 [AVISOS] Body:', { 
        titulo, 
        descricao: descricao.substring(0, 50) + '...', 
        criado_por: user.value.id 
      })
      
      const response = await $fetch('/api/avisos', {
        method: 'POST',
        body: { 
          titulo, 
          descricao,
          criado_por: user.value.id
        }
      })

      console.log('✅ [AVISOS] Resposta da API:', response)

      if (response) {
        // Adicionar novo aviso à lista
        avisos.value.unshift(response)
        console.log('✅ [AVISOS] Aviso criado com sucesso')
        return { success: true, message: 'Aviso criado com sucesso' }
      } else {
        console.error('❌ [AVISOS] Resposta vazia da API')
        error.value = 'Erro ao criar aviso'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('❌ [AVISOS] Erro ao criar aviso:', err)
      console.error('❌ [AVISOS] Erro detalhado:', {
        message: err.message,
        statusCode: err.statusCode,
        data: err.data,
        stack: err.stack
      })
      error.value = err.message || 'Erro ao criar aviso'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
      console.log('🔵 [AVISOS] === FIM CRIAR AVISO ===')
    }
  }

  // Deletar aviso (apenas admin)
  const deletarAviso = async (avisoId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/avisos/${avisoId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Remover aviso da lista
        avisos.value = avisos.value.filter(a => a.id !== avisoId)
        return { success: true, message: response.message }
      } else {
        error.value = response.message || 'Erro ao deletar aviso'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Erro ao deletar aviso:', err)
      error.value = err.message || 'Erro ao deletar aviso'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Buscar comentários de um aviso
  const fetchComentarios = async (avisoId: string) => {
    try {
      const response = await $fetch(`/api/avisos/${avisoId}/comentarios`, {
        method: 'GET'
      })

      if (response.success) {
        return { success: true, comentarios: response.comentarios }
      } else {
        return { success: false, message: (response as any).message || 'Erro ao buscar comentários', comentarios: [] }
      }
    } catch (err: any) {
      console.error('Erro ao buscar comentários:', err)
      return { success: false, message: err.message, comentarios: [] }
    }
  }

  // Adicionar comentário
  const adicionarComentario = async (avisoId: string, comentario: string) => {
    try {
      console.log('🔵 [AVISOS] === INÍCIO ADICIONAR COMENTÁRIO ===')
      console.log('🔵 [AVISOS] avisoId:', avisoId)
      console.log('🔵 [AVISOS] comentario:', comentario)
      
      // Buscar usuário do estado global de autenticação
      const { user } = useAuth()
      console.log('🔵 [AVISOS] Usuário:', user.value ? 'existe' : 'NÃO EXISTE')
      
      if (!user.value) {
        console.error('❌ [AVISOS] Usuário não autenticado')
        throw new Error('Usuário não autenticado')
      }
      
      console.log('🔵 [AVISOS] funcionario_id:', user.value.id)
      console.log('🔵 [AVISOS] Enviando requisição para API...')
      
      const response = await $fetch(`/api/avisos/${avisoId}/comentarios`, {
        method: 'POST',
        body: { 
          comentario,
          funcionario_id: user.value.id
        }
      })

      console.log('✅ [AVISOS] Resposta da API:', response)

      if (response) {
        console.log('✅ [AVISOS] Comentário adicionado com sucesso')
        return { success: true, message: 'Comentário adicionado', comentario: response }
      } else {
        console.error('❌ [AVISOS] Resposta vazia da API')
        return { success: false, message: 'Erro ao adicionar comentário' }
      }
    } catch (err: any) {
      console.error('❌ [AVISOS] Erro ao adicionar comentário:', err)
      console.error('❌ [AVISOS] Erro detalhado:', {
        message: err.message,
        statusCode: err.statusCode,
        data: err.data,
        stack: err.stack
      })
      return { success: false, message: err.message }
    } finally {
      console.log('🔵 [AVISOS] === FIM ADICIONAR COMENTÁRIO ===')
    }
  }

  // Deletar comentário
  const deletarComentario = async (comentarioId: string) => {
    try {
      const response = await $fetch(`/api/avisos/comentarios/${comentarioId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err: any) {
      console.error('Erro ao deletar comentário:', err)
      return { success: false, message: err.message }
    }
  }

  return {
    avisos,
    loading,
    error,
    fetchAvisos,
    buscarAvisos,
    criarAviso,
    deletarAviso,
    fetchComentarios,
    adicionarComentario,
    deletarComentario
  }
}
