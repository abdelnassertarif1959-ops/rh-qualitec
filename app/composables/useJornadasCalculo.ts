// Cálculos e validação para jornadas de trabalho
import type { JornadaHorario } from './useJornadas'

export const useJornadasCalculo = () => {
  const { obterNomeDia } = useJornadasFormat()

  // Calcular total de horas da semana
  const calcularHorasSemanais = (horarios: JornadaHorario[]): number => {
    return horarios
      .filter(h => h.trabalha)
      .reduce((total, h) => total + h.horas_liquidas, 0)
  }

  // Calcular total de horas do mês
  const calcularHorasMensais = (horasSemanais: number): number => {
    return horasSemanais * 4.33 // Média de semanas por mês
  }

  // Calcular horas de um dia específico
  const calcularHorasDia = (entrada: string, saida: string, intervaloInicio?: string, intervaloFim?: string): number => {
    const [entradaH, entradaM] = entrada.split(':').map(Number)
    const [saidaH, saidaM] = saida.split(':').map(Number)
    
    const minutosEntrada = entradaH * 60 + entradaM
    const minutosSaida = saidaH * 60 + saidaM
    
    let minutosTrabalhados = minutosSaida - minutosEntrada
    
    // Subtrair intervalo se houver
    if (intervaloInicio && intervaloFim) {
      const [intervaloInicioH, intervaloInicioM] = intervaloInicio.split(':').map(Number)
      const [intervaloFimH, intervaloFimM] = intervaloFim.split(':').map(Number)
      
      const minutosIntervaloInicio = intervaloInicioH * 60 + intervaloInicioM
      const minutosIntervaloFim = intervaloFimH * 60 + intervaloFimM
      
      minutosTrabalhados -= (minutosIntervaloFim - minutosIntervaloInicio)
    }
    
    return minutosTrabalhados / 60 // Converter para horas decimais
  }

  // Validar horários de uma jornada
  const validarJornada = (horarios: JornadaHorario[]): { valida: boolean; erros: string[] } => {
    const erros: string[] = []

    horarios.forEach(horario => {
      if (!horario.trabalha) return

      // Validar se entrada é antes da saída
      if (horario.entrada >= horario.saida) {
        erros.push(`${obterNomeDia(horario.dia_semana)}: Horário de entrada deve ser anterior ao de saída`)
      }

      // Validar intervalo
      if (horario.intervalo_inicio && horario.intervalo_fim) {
        if (horario.intervalo_inicio >= horario.intervalo_fim) {
          erros.push(`${obterNomeDia(horario.dia_semana)}: Início do intervalo deve ser anterior ao fim`)
        }

        if (horario.intervalo_inicio <= horario.entrada || horario.intervalo_fim >= horario.saida) {
          erros.push(`${obterNomeDia(horario.dia_semana)}: Intervalo deve estar dentro do horário de trabalho`)
        }
      }
    })

    return {
      valida: erros.length === 0,
      erros
    }
  }

  // Verificar se jornada é válida para CLT (máximo 44h semanais)
  const isJornadaCLTValida = (horasSemanais: number): boolean => {
    return horasSemanais <= 44
  }

  // Calcular horas extras se ultrapassar limite
  const calcularHorasExtras = (horasSemanais: number, limiteHoras: number = 44): number => {
    return Math.max(0, horasSemanais - limiteHoras)
  }

  return {
    calcularHorasSemanais,
    calcularHorasMensais,
    calcularHorasDia,
    validarJornada,
    isJornadaCLTValida,
    calcularHorasExtras
  }
}
