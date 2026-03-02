// Formatação para jornadas de trabalho
export const useJornadasFormat = () => {
  // Nomes dos dias da semana
  const diasSemana = [
    { id: 1, nome: 'Segunda-feira', abrev: 'Seg' },
    { id: 2, nome: 'Terça-feira', abrev: 'Ter' },
    { id: 3, nome: 'Quarta-feira', abrev: 'Qua' },
    { id: 4, nome: 'Quinta-feira', abrev: 'Qui' },
    { id: 5, nome: 'Sexta-feira', abrev: 'Sex' },
    { id: 6, nome: 'Sábado', abrev: 'Sáb' },
    { id: 7, nome: 'Domingo', abrev: 'Dom' }
  ]

  // Formatar horário
  const formatarHorario = (horario: string): string => {
    if (!horario || horario === '00:00') return '--'
    return horario.substring(0, 5) // Remove os segundos
  }

  // Formatar horas decimais para horas:minutos
  const formatarHorasDecimais = (horas: number): string => {
    if (horas === 0) return '0h'
    
    const horasInteiras = Math.floor(horas)
    const minutos = Math.round((horas - horasInteiras) * 60)
    
    if (minutos === 0) {
      return `${horasInteiras}h`
    }
    
    return `${horasInteiras}h${minutos.toString().padStart(2, '0')}min`
  }

  // Obter nome do dia da semana
  const obterNomeDia = (diaSemana: number): string => {
    const dia = diasSemana.find(d => d.id === diaSemana)
    return dia ? dia.nome : 'Desconhecido'
  }

  // Obter abreviação do dia da semana
  const obterAbrevDia = (diaSemana: number): string => {
    const dia = diasSemana.find(d => d.id === diaSemana)
    return dia ? dia.abrev : '?'
  }

  return {
    diasSemana,
    formatarHorario,
    formatarHorasDecimais,
    obterNomeDia,
    obterAbrevDia
  }
}
