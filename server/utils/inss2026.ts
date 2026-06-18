/**
 * Cálculo do INSS 2026 - Tabela Atualizada
 * Base: Salário mínimo R$ 1.621,00 (reajuste de 3,9%)
 * Teto máximo: R$ 8.475,55
 */

interface FaixaINSS {
  limite: number
  aliquota: number
  parcelaDeducao: number
}

// Tabela INSS 2026 - Faixas progressivas
const FAIXAS_INSS_2026: FaixaINSS[] = [
  { limite: 1621.00, aliquota: 0.075, parcelaDeducao: 0.00 },      // 7,5%
  { limite: 2902.84, aliquota: 0.09, parcelaDeducao: 24.31 },     // 9%
  { limite: 4354.27, aliquota: 0.12, parcelaDeducao: 111.40 },    // 12%
  { limite: 8475.55, aliquota: 0.14, parcelaDeducao: 198.49 }     // 14%
]

export interface CalculoINSS {
  valor: number
  aliquotaEfetiva: number
  aliquotaFaixa: number
  baseCalculo: number
  faixaAplicada: number
  detalhamento?: {
    faixa: number
    limite: number
    aliquota: number
    valorFaixa: number
  }[]
}

/**
 * Calcula o INSS usando o método progressivo por faixas
 * @param salarioBruto Salário bruto do funcionário
 * @returns Objeto com detalhes do cálculo
 */
export function calcularINSS2026(salarioBruto: number): CalculoINSS {
  if (salarioBruto <= 0) {
    return {
      valor: 0,
      aliquotaEfetiva: 0,
      aliquotaFaixa: 0,
      baseCalculo: 0,
      faixaAplicada: 0
    }
  }

  // Limitar ao teto máximo
  const baseCalculo = Math.min(salarioBruto, FAIXAS_INSS_2026[FAIXAS_INSS_2026.length - 1].limite)
  
  let inssTotal = 0
  let faixaAplicada = 0
  const detalhamento: any[] = []
  let salarioRestante = baseCalculo

  // Cálculo progressivo por faixas
  for (let i = 0; i < FAIXAS_INSS_2026.length && salarioRestante > 0; i++) {
    const faixa = FAIXAS_INSS_2026[i]
    const limiteAnterior = i > 0 ? FAIXAS_INSS_2026[i - 1].limite : 0
    const valorFaixa = Math.min(salarioRestante, faixa.limite - limiteAnterior)
    
    if (valorFaixa > 0) {
      const inssDestaFaixa = valorFaixa * faixa.aliquota
      inssTotal += inssDestaFaixa
      faixaAplicada = i + 1
      
      detalhamento.push({
        faixa: i + 1,
        limite: faixa.limite,
        aliquota: faixa.aliquota * 100,
        valorFaixa: Math.round(inssDestaFaixa * 100) / 100
      })
      
      salarioRestante -= valorFaixa
    }
  }

  // Arredondar para 2 casas decimais
  const valorFinal = Math.round(inssTotal * 100) / 100
  const aliquotaEfetiva = Math.round((valorFinal / salarioBruto) * 10000) / 100
  
  // Determinar alíquota da faixa (para exibição no holerite)
  let aliquotaFaixa = 0
  if (faixaAplicada === 1) aliquotaFaixa = 7.5
  else if (faixaAplicada === 2) aliquotaFaixa = 9.0
  else if (faixaAplicada === 3) aliquotaFaixa = 12.0
  else if (faixaAplicada === 4) aliquotaFaixa = 14.0

  return {
    valor: valorFinal,
    aliquotaEfetiva,
    aliquotaFaixa,
    baseCalculo,
    faixaAplicada,
    detalhamento
  }
}

/**
 * Método simplificado usando fórmula rápida
 * @param salarioBruto Salário bruto
 * @returns Valor do INSS
 */
export function calcularINSSRapido(salarioBruto: number): number {
  if (salarioBruto <= 0) return 0

  const baseCalculo = Math.min(salarioBruto, 8475.55)
  
  // Identificar faixa e aplicar fórmula: (Salário × Alíquota) - Parcela a Deduzir
  for (const faixa of FAIXAS_INSS_2026) {
    if (baseCalculo <= faixa.limite) {
      const inss = (baseCalculo * faixa.aliquota) - faixa.parcelaDeducao
      return Math.round(inss * 100) / 100
    }
  }

  // Fallback para teto máximo
  const ultimaFaixa = FAIXAS_INSS_2026[FAIXAS_INSS_2026.length - 1]
  const inss = (8475.55 * ultimaFaixa.aliquota) - ultimaFaixa.parcelaDeducao
  return Math.round(inss * 100) / 100
}

/**
 * Validar se os dois métodos retornam o mesmo resultado
 * @param salarioBruto Salário para teste
 * @returns Boolean indicando se os métodos são consistentes
 */
export function validarCalculoINSS(salarioBruto: number): boolean {
  const metodoProgressivo = calcularINSS2026(salarioBruto).valor
  const metodoRapido = calcularINSSRapido(salarioBruto)
  
  // Tolerância de 1 centavo para arredondamentos
  return Math.abs(metodoProgressivo - metodoRapido) <= 0.01
}