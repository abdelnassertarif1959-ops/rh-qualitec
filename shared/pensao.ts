export interface RegrasPensao {
  base: 'bruto' | 'liquido'
  ferias: boolean
  terco: boolean
  decimo: boolean
}

/** Base explícita; abono pecuniário não é incluído sem previsão própria. */
export function calcularPensaoPercentual(percentual: number, bruto: number, inss = 0, irrf = 0, base: 'bruto' | 'liquido' = 'bruto') {
  if (![percentual, bruto, inss, irrf].every(Number.isFinite) || percentual < 0 || percentual > 100) {
    throw new Error('Valores inválidos para o cálculo da pensão')
  }
  const baseCalculo = Math.max(0, base === 'bruto' ? bruto : bruto - inss - irrf)
  return Math.round((baseCalculo * percentual / 100 + Number.EPSILON) * 100) / 100
}

export function basePensaoFerias(remuneracao: number, terco: number, regras: RegrasPensao) {
  return (regras.ferias ? remuneracao : 0) + (regras.terco ? terco : 0)
}

export function calcularPensaoDecimo(bruto: number, percentual: number, regras: RegrasPensao, inss = 0, irrf = 0) {
  return regras.decimo ? calcularPensaoPercentual(percentual, bruto, inss, irrf, regras.base) : 0
}
