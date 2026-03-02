interface Aniversariante {
  id: string
  nome_completo: string
  data_nascimento: string
  avatar?: string
  dia?: number
  cargo?: string
  departamento?: string
}

// Estado global dos aniversariantes
const aniversariantes = ref<Aniversariante[]>([])
const loading = ref(false)
const lastFetch = ref<Date | null>(null)

export const useAniversariantes = () => {
  // Função para buscar aniversariantes
  const fetchAniversariantes = async (forceRefresh = false) => {
    // Evitar múltiplas chamadas desnecessárias
    if (!forceRefresh && lastFetch.value) {
      const agora = new Date()
      const diffMinutos = (agora.getTime() - lastFetch.value.getTime()) / (1000 * 60)
      if (diffMinutos < 5) { // Cache por 5 minutos
        return aniversariantes.value
      }
    }

    loading.value = true
    try {
      const data = await $fetch('/api/dashboard/aniversariantes')
      aniversariantes.value = Array.isArray(data) ? data : []
      lastFetch.value = new Date()
      
      console.log(`📅 Aniversariantes carregados: ${aniversariantes.value.length}`)
      return aniversariantes.value
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error)
      aniversariantes.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    aniversariantes: readonly(aniversariantes),
    loading: readonly(loading),
    
    // Funções
    fetchAniversariantes
  }
}