// Helpers e computed properties para empresas
import type { Empresa } from './useEmpresas'

export const useEmpresasHelpers = () => {
  const { empresas } = useEmpresas()

  // Obter empresa por ID
  const obterEmpresaPorId = (id: string): Empresa | undefined => {
    return empresas.value.find(e => e.id === id)
  }

  // Obter apenas empresas ativas
  const obterEmpresasAtivas = computed(() => {
    return empresas.value.filter(e => e.ativo)
  })

  // Obter opções para select/dropdown
  const obterOpcoesEmpresas = computed(() => {
    return empresas.value.map(e => ({
      value: e.id,
      label: e.nome
    }))
  })

  // Obter opções apenas de empresas ativas
  const obterOpcoesEmpresasAtivas = computed(() => {
    return empresas.value
      .filter(e => e.ativo)
      .map(e => ({
        value: e.id,
        label: e.nome
      }))
  })

  // Contar total de funcionários
  const totalFuncionarios = computed(() => {
    return empresas.value.reduce((total, e) => total + (e.funcionarios_count || 0), 0)
  })

  // Contar empresas ativas
  const totalEmpresasAtivas = computed(() => {
    return empresas.value.filter(e => e.ativo).length
  })

  return {
    obterEmpresaPorId,
    obterEmpresasAtivas,
    obterOpcoesEmpresas,
    obterOpcoesEmpresasAtivas,
    totalFuncionarios,
    totalEmpresasAtivas
  }
}
