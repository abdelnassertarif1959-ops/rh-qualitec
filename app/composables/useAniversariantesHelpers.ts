// Helpers para formatação e cálculos de aniversariantes
export const useAniversariantesHelpers = () => {
  // Função para formatar data de aniversário
  const formatarDataAniversario = (dataString: string) => {
    // CORRIGIDO: Usar split para evitar problemas de timezone
    const [ano, mes, dia] = dataString.split('-').map(Number)
    const data = new Date(ano, mes - 1, dia)
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long' 
    })
  }

  // Função para calcular idade
  const calcularIdade = (dataString: string) => {
    const hoje = new Date()
    // CORRIGIDO: Usar split para evitar problemas de timezone
    const [ano, mes, dia] = dataString.split('-').map(Number)
    const nascimento = new Date(ano, mes - 1, dia)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    
    const mesAtual = hoje.getMonth()
    const diaAtual = hoje.getDate()
    const mesNascimento = nascimento.getMonth()
    const diaNascimento = nascimento.getDate()
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--
    }
    
    return idade
  }

  return {
    formatarDataAniversario,
    calcularIdade
  }
}
