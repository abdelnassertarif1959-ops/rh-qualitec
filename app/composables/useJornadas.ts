// Composable para gerenciar jornadas de trabalho - Core
export interface JornadaTrabalho {
  id: string
  nome: string
  descricao: string
  horas_semanais: number
  horas_mensais: number
  ativa: boolean
  padrao: boolean
  created_at: string
  updated_at: string
  horarios?: JornadaHorario[]
}

export interface JornadaHorario {
  id: string
  jornada_id: string
  dia_semana: number
  entrada: string
  saida: string
  intervalo_inicio?: string
  intervalo_fim?: string
  horas_brutas: number
  horas_intervalo: number
  horas_liquidas: number
  trabalha: boolean
}

export const useJornadas = () => {
  const jornadas = ref<JornadaTrabalho[]>([])
  const loading = ref(false)
  const error = ref('')

  const carregarJornadas = async () => {
    console.log('📡 [useJornadas] Carregando jornadas...')
    loading.value = true
    error.value = ''

    try {
      const response = await $fetch('/api/jornadas')
      console.log('✅ [useJornadas] Resposta recebida:', response)
      
      if (response.success && response.data) {
        jornadas.value = response.data
        console.log('✅ [useJornadas] Jornadas carregadas:', jornadas.value.length)
        return { success: true, message: 'Jornadas carregadas com sucesso!' }
      }

      console.log('⚠️ [useJornadas] Resposta sem sucesso')
      return { success: false, message: 'Erro ao carregar jornadas' }
    } catch (err: any) {
      error.value = err.data?.message || 'Erro ao carregar jornadas'
      console.error('❌ [useJornadas] Erro ao carregar jornadas:', err)
      
      // Fallback para dados de exemplo em caso de erro
      jornadas.value = [
        {
          id: '1',
          nome: 'Jornada 42h45min',
          descricao: 'Jornada personalizada: Segunda a quinta 8h45min, sexta 7h45min',
          horas_semanais: 42.75,
          horas_mensais: 185.25,
          ativa: true,
          padrao: true,
          created_at: '2026-01-13T10:00:00Z',
          updated_at: '2026-01-13T10:00:00Z',
          horarios: []
        }
      ]
      
      console.log('🔧 [useJornadas] Usando dados de fallback')
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const salvarJornada = async (jornada: Partial<JornadaTrabalho>): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    try {
      const response = await $fetch('/api/jornadas', {
        method: 'POST',
        body: jornada
      })

      if (response.success) {
        await carregarJornadas()
        return { success: true, message: response.message || 'Jornada salva com sucesso!' }
      }

      return { success: false, message: 'Erro ao salvar jornada' }
    } catch (err: any) {
      console.error('Erro ao salvar jornada:', err)
      return { success: false, message: err.data?.message || 'Erro ao salvar jornada' }
    } finally {
      loading.value = false
    }
  }

  const obterJornada = (id: string): JornadaTrabalho | undefined => {
    return jornadas.value.find(j => j.id === id)
  }

  const obterJornadaPadrao = (): JornadaTrabalho | undefined => {
    return jornadas.value.find(j => j.padrao && j.ativa)
  }

  const opcoesJornadas = computed(() => {
    return jornadas.value
      .filter(j => j.ativa)
      .map(j => ({
        value: j.id,
        label: `${j.nome} (${j.horas_semanais}h semanais)`
      }))
  })

  return {
    jornadas,
    loading: readonly(loading),
    error: readonly(error),
    opcoesJornadas,
    carregarJornadas,
    salvarJornada,
    obterJornada,
    obterJornadaPadrao
  }
}