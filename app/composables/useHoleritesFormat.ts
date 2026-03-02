// Formatação de datas e valores para holerites
export const useHoleritesFormat = () => {
  // Função para formatar data para exibição
  const formatarData = (data: Date | string): string => {
    let dataObj: Date
    
    if (typeof data === 'string') {
      // Se for string, adicionar T00:00:00 para evitar problemas de timezone
      dataObj = new Date(data + 'T00:00:00')
    } else {
      dataObj = data
    }
    
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Função para formatar data e hora para exibição
  const formatarDataHora = (data: Date): string => {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Função para formatar valor monetário
  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Função para formatar período (ex: "01/01/2024 a 31/01/2024")
  const formatarPeriodo = (inicio: Date | string, fim: Date | string): string => {
    return `${formatarData(inicio)} a ${formatarData(fim)}`
  }

  // Função para formatar mês/ano (ex: "Janeiro/2024")
  const formatarMesAno = (mes: number, ano: number): string => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return `${meses[mes - 1]}/${ano}`
  }

  // Função para formatar mês/ano curto (ex: "01/2024")
  const formatarMesAnoCurto = (mes: number, ano: number): string => {
    return `${mes.toString().padStart(2, '0')}/${ano}`
  }

  // Função para formatar porcentagem
  const formatarPorcentagem = (valor: number): string => {
    return `${valor.toFixed(2)}%`
  }

  return {
    formatarData,
    formatarDataHora,
    formatarValor,
    formatarPeriodo,
    formatarMesAno,
    formatarMesAnoCurto,
    formatarPorcentagem
  }
}
