/**
 * calcularFerias.ts
 * Cálculo de remuneração de férias conforme CLT 2026
 *
 * Base legal:
 * - Art. 7º, XVII CF/88 — 1/3 constitucional
 * - Arts. 129–153 CLT — férias anuais remuneradas
 * - Tabela INSS 2026 progressiva (portaria vigente)
 * - Tabela IRRF 2026 (RIR 2024 atualizado)
 */

// ─── Tabela INSS Progressiva 2026 ──────────────────────────────────────────
const FAIXAS_INSS_2026 = [
  { ate: 1518.00,  aliquota: 0.075 },
  { ate: 2793.88,  aliquota: 0.09  },
  { ate: 4190.83,  aliquota: 0.12  },
  { ate: 8157.41,  aliquota: 0.14  },
]

// ─── Tabela IRRF 2026 ───────────────────────────────────────────────────────
const FAIXAS_IRRF_2026 = [
  { ate: 2259.20,  aliquota: 0,     deducao: 0       },
  { ate: 2826.65,  aliquota: 0.075, deducao: 169.44  },
  { ate: 3751.05,  aliquota: 0.15,  deducao: 381.44  },
  { ate: 4664.68,  aliquota: 0.225, deducao: 662.77  },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00  },
]

const DEDUCAO_DEPENDENTE_IRRF = 189.59 // por dependente (2026)

export interface ResultadoCalculo {
  /** Dias de férias a pagar (excluindo abono) */
  diasFerias: number
  /** Dias de abono pecuniário (vendidos) */
  diasAbono: number
  /** Salário por dia (salário_base / 30) */
  salarioDia: number
  /** Remuneração bruta das férias = (salário_dia × diasFerias) */
  valorRemuneracao: number
  /** 1/3 constitucional sobre a remuneração de férias */
  valorUmTerco: number
  /** Abono pecuniário = salário_dia × diasAbono × (1 + 1/3) */
  valorAbonoPecuniario: number
  /** Total bruto = remuneração + 1/3 + abono */
  valorBruto: number
  /** INSS incidente (calculado sobre valorBruto) */
  inss: number
  /** Base de cálculo do IRRF (bruto - inss - deduções por dependentes) */
  baseIRRF: number
  /** IRRF incidente */
  irrf: number
  /** Líquido = bruto - inss - irrf */
  valorLiquido: number
  /** Alíquota efetiva INSS */
  aliquotaINSS: number
  /** Faixa IRRF descritiva */
  faixaIRRF: string
}

/**
 * Calcula INSS progressivo 2026 sobre base de cálculo
 */
export function calcularINSS(base: number): { valor: number; aliquota: number } {
  if (base <= 0) return { valor: 0, aliquota: 0 }

  let inssTotal = 0
  let faixaAnterior = 0

  for (const faixa of FAIXAS_INSS_2026) {
    if (base <= faixaAnterior) break
    const baseNaFaixa = Math.min(base, faixa.ate) - faixaAnterior
    inssTotal += baseNaFaixa * faixa.aliquota
    faixaAnterior = faixa.ate
    if (base <= faixa.ate) break
  }

  const aliquota = base > 0 ? inssTotal / base : 0
  return { valor: Number(inssTotal.toFixed(2)), aliquota: Number(aliquota.toFixed(4)) }
}

/**
 * Calcula IRRF 2026 sobre base de cálculo (já descontado INSS e dependentes)
 */
export function calcularIRRF(
  baseCalculo: number,
  numeroDependentes: number = 0
): { valor: number; aliquota: number; faixa: string; base: number } {
  const deducaoDependentes = numeroDependentes * DEDUCAO_DEPENDENTE_IRRF
  const base = Math.max(0, baseCalculo - deducaoDependentes)

  for (const faixa of FAIXAS_IRRF_2026) {
    if (base <= faixa.ate) {
      const irrf = Math.max(0, base * faixa.aliquota - faixa.deducao)
      const aliquotaDesc = faixa.aliquota === 0
        ? 'Isento'
        : `${(faixa.aliquota * 100).toFixed(1)}%`
      return {
        valor: Number(irrf.toFixed(2)),
        aliquota: faixa.aliquota,
        faixa: aliquotaDesc,
        base: Number(base.toFixed(2)),
      }
    }
  }

  return { valor: 0, aliquota: 0, faixa: 'Isento', base }
}

/**
 * Calcula remuneração completa de férias CLT 2026
 *
 * @param salarioBase - Salário base mensal do funcionário
 * @param diasFerias - Número de dias de férias a gozar (máx 30, descontado abono)
 * @param diasAbono - Dias de abono pecuniário (0 a 10)
 * @param numeroDependentes - Dependentes para dedução IRRF
 */
export function calcularRemuneracaoFerias(
  salarioBase: number,
  diasFerias: number,
  diasAbono: number = 0,
  numeroDependentes: number = 0
): ResultadoCalculo {
  const salarioDia = salarioBase / 30

  // Remuneração das férias = proporção dos dias
  const valorRemuneracao = salarioDia * diasFerias

  // 1/3 constitucional sobre a remuneração de férias
  const valorUmTerco = valorRemuneracao / 3

  // Abono pecuniário = salário proporcional aos dias de abono + 1/3 sobre o abono
  // (Súmula TST 328 — abono inclui o 1/3)
  const valorAbonoPecuniario = diasAbono > 0
    ? salarioDia * diasAbono * (1 + 1 / 3)
    : 0

  // Total bruto = férias + 1/3 + abono (o abono pecuniário é isento de IRRF e INSS, mas incide INSS sobre as férias normais)
  // Nota: INSS e IRRF incidem sobre (férias + 1/3), mas NÃO sobre o abono pecuniário (Lei 7.713/88, art. 6º, V)
  const baseInss = valorRemuneracao + valorUmTerco
  const valorBruto = baseInss + valorAbonoPecuniario

  // INSS sobre (remuneração + 1/3), não sobre o abono
  const { valor: inss, aliquota: aliquotaINSS } = calcularINSS(baseInss)

  // Base IRRF = (férias + 1/3) − INSS
  const baseIRRF = baseInss - inss

  // IRRF com dedução de dependentes
  const { valor: irrf, faixa: faixaIRRF, base: baseIRRFReal } = calcularIRRF(baseIRRF, numeroDependentes)

  // Líquido = total bruto − INSS − IRRF
  const valorLiquido = valorBruto - inss - irrf

  return {
    diasFerias,
    diasAbono,
    salarioDia: Number(salarioDia.toFixed(2)),
    valorRemuneracao: Number(valorRemuneracao.toFixed(2)),
    valorUmTerco: Number(valorUmTerco.toFixed(2)),
    valorAbonoPecuniario: Number(valorAbonoPecuniario.toFixed(2)),
    valorBruto: Number(valorBruto.toFixed(2)),
    inss: Number(inss.toFixed(2)),
    baseIRRF: Number(baseIRRFReal.toFixed(2)),
    irrf: Number(irrf.toFixed(2)),
    valorLiquido: Number(valorLiquido.toFixed(2)),
    aliquotaINSS: Number(aliquotaINSS.toFixed(4)),
    faixaIRRF,
  }
}

/**
 * Calcula os períodos aquisitivos de um funcionário a partir da admissão
 * Retorna array de períodos (o mais recente primeiro)
 */
export function calcularPeriodosAquisitivos(dataAdmissao: Date, hoje: Date = new Date()) {
  const periodos = []
  let inicio = new Date(dataAdmissao)

  for (let i = 0; i < 10; i++) {
    const fim = new Date(inicio)
    fim.setFullYear(fim.getFullYear() + 1)
    fim.setDate(fim.getDate() - 1)

    // Período concessivo = 12 meses após o fim do aquisitivo
    const concessivoFim = new Date(fim)
    concessivoFim.setFullYear(concessivoFim.getFullYear() + 1)

    periodos.push({
      numero: i + 1,
      inicio: new Date(inicio),
      fim: new Date(fim),
      concessivoFim: new Date(concessivoFim),
      concluido: fim < hoje,
      vencendo: concessivoFim <= hoje && fim < hoje,
    })

    // Próximo período começa no dia seguinte ao fim do atual
    inicio = new Date(fim)
    inicio.setDate(inicio.getDate() + 1)

    // Parar se o início do próximo período for no futuro
    if (inicio > hoje) break
  }

  return periodos.reverse() // mais recente primeiro
}

/**
 * Calcula quantos dias de férias o funcionário tem direito proporcional
 * (para admitidos há menos de 12 meses)
 */
export function calcularDireitoFeriasProporcionais(dataAdmissao: Date, hoje: Date = new Date()): number {
  const mesesTrabalhados = Math.floor(
    (hoje.getTime() - dataAdmissao.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )
  if (mesesTrabalhados < 12) {
    // 2.5 dias por mês trabalhado (antes de completar 1 ano)
    return Math.floor(Math.min(mesesTrabalhados, 12) * 2.5)
  }
  return 30
}
