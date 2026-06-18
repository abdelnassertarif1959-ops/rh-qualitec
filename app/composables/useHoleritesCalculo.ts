// Cálculos e períodos para holerites
export const useHoleritesCalculo = () => {
  // Função para calcular período de pagamento quinzenal
  const calcularPeriodoQuinzenal = (ano: number, mes: number, quinzena: 1 | 2): {
    inicio: Date
    fim: Date
    descricao: string
  } => {
    if (quinzena === 1) {
      // Primeira quinzena (Adiantamento): dia 15 ao último dia do mês
      const ultimoDia = new Date(ano, mes, 0).getDate()
      return {
        inicio: new Date(ano, mes - 1, 15),
        fim: new Date(ano, mes - 1, ultimoDia),
        descricao: `Adiantamento Salarial - 15 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
      }
    } else {
      // Segunda quinzena (Folha Mensal): dia 1 ao último dia do mês
      const ultimoDia = new Date(ano, mes, 0).getDate()
      return {
        inicio: new Date(ano, mes - 1, 1),
        fim: new Date(ano, mes - 1, ultimoDia),
        descricao: `Folha Mensal - 01 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
      }
    }
  }

  // Função para verificar se funcionário tem salário quinzenal
  const isSalarioQuinzenal = (funcionario: any): boolean => {
    return funcionario?.tipo_salario === 'quinzenal'
  }

  // Função para calcular valor quinzenal
  const calcularValorQuinzenal = (salarioMensal: number): number => {
    return salarioMensal / 2
  }

  // Função para calcular valor proporcional por dias trabalhados
  const calcularValorProporcional = (salarioMensal: number, diasTrabalhados: number, diasMes: number = 30): number => {
    return (salarioMensal / diasMes) * diasTrabalhados
  }

  // Função para obter último dia do mês
  const obterUltimoDiaMes = (ano: number, mes: number): number => {
    return new Date(ano, mes, 0).getDate()
  }

  // Função para calcular dias úteis entre duas datas
  const calcularDiasUteis = (dataInicio: Date, dataFim: Date): number => {
    const { isDiaUtil } = useHoleritesData()
    let diasUteis = 0
    const data = new Date(dataInicio)
    
    while (data <= dataFim) {
      if (isDiaUtil(data)) {
        diasUteis++
      }
      data.setDate(data.getDate() + 1)
    }
    
    return diasUteis
  }

  return {
    calcularPeriodoQuinzenal,
    isSalarioQuinzenal,
    calcularValorQuinzenal,
    calcularValorProporcional,
    obterUltimoDiaMes,
    calcularDiasUteis
  }
}
