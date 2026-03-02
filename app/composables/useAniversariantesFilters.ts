// Filtros para aniversariantes
export const useAniversariantesFilters = () => {
  const { aniversariantes } = useAniversariantes()

  // Função para obter aniversariantes do dia
  const getAniversariantesHoje = () => {
    const hoje = new Date()
    const diaHoje = hoje.getDate()
    
    return aniversariantes.value.filter(aniversariante => {
      // CORRIGIDO: Usar split para evitar problemas de timezone
      const [ano, mes, dia] = aniversariante.data_nascimento.split('-').map(Number)
      return dia === diaHoje
    })
  }

  // Função para obter próximos aniversariantes (próximos 7 dias)
  const getProximosAniversariantes = () => {
    const hoje = new Date()
    const diaHoje = hoje.getDate()
    const mesAtual = hoje.getMonth()
    const anoAtual = hoje.getFullYear()
    
    return aniversariantes.value.filter(aniversariante => {
      // CORRIGIDO: Usar split para evitar problemas de timezone
      const [ano, mes, dia] = aniversariante.data_nascimento.split('-').map(Number)
      const diaNascimento = dia
      
      // Próximos 7 dias
      for (let i = 1; i <= 7; i++) {
        const dataFutura = new Date(anoAtual, mesAtual, diaHoje + i)
        if (dataFutura.getDate() === diaNascimento) {
          return true
        }
      }
      return false
    })
  }

  // Computed para verificar se há aniversariantes hoje
  const temAniversarianteHoje = computed(() => {
    return getAniversariantesHoje().length > 0
  })

  // Computed para verificar se há aniversariantes no mês
  const temAniversarianteMes = computed(() => {
    return aniversariantes.value.length > 0
  })

  // Computed para contar aniversariantes
  const totalAniversariantes = computed(() => {
    return aniversariantes.value.length
  })

  return {
    getAniversariantesHoje,
    getProximosAniversariantes,
    temAniversarianteHoje,
    temAniversarianteMes,
    totalAniversariantes
  }
}
