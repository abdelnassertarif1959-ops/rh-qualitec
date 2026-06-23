/**
 * calcularFerias.ts
 * Cálculo de remuneração de férias conforme CLT 2026
 *
 * Base legal:
 * - Art. 7º, XVII CF/88 — 1/3 constitucional
 * - Arts. 129–153 CLT — férias anuais remuneradas
 * - Tabela INSS 2026 progressiva (salário mínimo R$ 1.621,00, teto R$ 8.475,55)
 * - Tabela IRRF 2026 (RIR 2024 atualizado) com redutor Lei 15.270/2025
 */

// ─── Valores Padrão CLT 2026 ────────────────────────────────────────────────
const DEFAULT_FAIXAS_INSS = [
  { ate: 1621.00,  aliquota: 0.075 },
  { ate: 2902.84,  aliquota: 0.09  },
  { ate: 4354.27,  aliquota: 0.12  },
  { ate: 8475.55,  aliquota: 0.14  },
]

const DEFAULT_DEDUCAO_DEPENDENTE_IRRF = 189.59 // por dependente (2026)

const DEFAULT_FAIXAS_IRRF = [
  { limite: 2428.80, aliquota: 0.00,  parcelaDeducao: 0.00,   aliquotaDesc: 'Isento' },
  { limite: 3051.00, aliquota: 0.075, parcelaDeducao: 182.16,  aliquotaDesc: '7.5%' },
  { limite: 4052.00, aliquota: 0.15,  parcelaDeducao: 394.16,  aliquotaDesc: '15.0%' },
  { limite: 5050.00, aliquota: 0.225, parcelaDeducao: 675.49,  aliquotaDesc: '22.5%' },
  { limite: null as number | null, aliquota: 0.275, parcelaDeducao: 896.00,  aliquotaDesc: '27.5%' }
]

const DEFAULT_PARAMETROS_IRRF = {
  limiteIsencaoRedutor: 5000.00,
  limiteMaxRedutor: 7350.00,
  redutorCoeficienteA: 978.62,
  redutorCoeficienteB: 0.133145
}

export interface TaxConfig {
  inssFaixas?: { ate: number; aliquota: number }[]
  irrfFaixas?: { limite: number | null; aliquota: number; parcelaDeducao: number; aliquotaDesc: string }[]
  irrfParametros?: {
    limiteIsencaoRedutor: number
    limiteMaxRedutor: number
    redutorCoeficienteA: number
    redutorCoeficienteB: number
  }
  deducaoDependente?: number
}

export interface ResultadoCalculo {
  /** Dias de férias a pagar (gozo) */
  diasFerias: number
  /** Dias de abono pecuniário (vendidos) */
  diasAbono: number
  /** Salário por dia (salário_base / 30) */
  salarioDia: number
  /** Remuneração de férias = (salário_dia × diasFerias) */
  valorRemuneracao: number
  /** 1/3 constitucional sobre a remuneração de férias */
  valorUmTerco: number
  /** Abono pecuniário = salário_dia × diasAbono (isento conforme CLT Art. 143) */
  valorAbonoPecuniario: number
  /** Total bruto = remuneração + 1/3 + abono */
  valorBruto: number
  /** INSS incidente (calculado sobre valorRemuneracao + valorUmTerco) */
  inss: number
  /** Base de cálculo do IRRF (remuneração + 1/3 - inss - pensão - dependentes) */
  baseIRRF: number
  /** IRRF incidente */
  irrf: number
  /** Pensão Alimentícia deduzida */
  pensaoAlimenticia: number
  /** Líquido = bruto - inss - irrf - pensaoAlimenticia */
  valorLiquido: number
  /** Alíquota efetiva INSS */
  aliquotaINSS: number
  /** Faixa IRRF descritiva */
  faixaIRRF: string
}

/**
 * Calcula INSS progressivo 2026 sobre base de cálculo
 */
export function calcularINSS(base: number, faixas = DEFAULT_FAIXAS_INSS): { valor: number; aliquota: number } {
  if (base <= 0) return { valor: 0, aliquota: 0 }

  // Teto máximo de contribuição INSS 2026 (limite da última faixa)
  const teto = faixas[faixas.length - 1].ate
  const baseCalculo = Math.min(base, teto)
  
  let inssTotal = 0
  let faixaAnterior = 0

  for (const faixa of faixas) {
    if (baseCalculo <= faixaAnterior) break
    const baseNaFaixa = Math.min(baseCalculo, faixa.ate) - faixaAnterior
    inssTotal += baseNaFaixa * faixa.aliquota
    faixaAnterior = faixa.ate
    if (baseCalculo <= faixa.ate) break
  }

  const aliquota = base > 0 ? inssTotal / base : 0
  return { valor: Number(inssTotal.toFixed(2)), aliquota: Number(aliquota.toFixed(4)) }
}

/**
 * Calcula IRRF 2026 sobre base de cálculo com redutor da Lei 15.270/2025
 */
export function calcularIRRF(
  baseCalculo: number,
  numeroDependentes: number = 0,
  faixas = DEFAULT_FAIXAS_IRRF,
  parametros = DEFAULT_PARAMETROS_IRRF,
  deducaoDependenteValor = DEFAULT_DEDUCAO_DEPENDENTE_IRRF
): { valor: number; aliquota: number; faixa: string; base: number } {
  const deducaoDependentes = numeroDependentes * deducaoDependenteValor
  const base = Math.max(0, baseCalculo - deducaoDependentes)

  // 1. Calcular imposto base pela tabela progressiva
  let impostoTabela = 0
  let aliquota = 0
  let aliquotaDesc = 'Isento'

  for (const faixa of faixas) {
    if (faixa.limite === null || base <= faixa.limite) {
      impostoTabela = (base * faixa.aliquota) - faixa.parcelaDeducao
      aliquota = faixa.aliquota
      aliquotaDesc = faixa.aliquotaDesc
      break
    }
  }
  impostoTabela = Math.max(0, impostoTabela)

  // 2. Calcular redutor progressivo da Lei 15.270/2025
  let redutor = 0
  if (base <= parametros.limiteIsencaoRedutor) {
    redutor = impostoTabela // Zera o imposto
  } else if (base <= parametros.limiteMaxRedutor) {
    redutor = parametros.redutorCoeficienteA - (parametros.redutorCoeficienteB * base)
  }

  const valorFinal = Math.max(0, impostoTabela - redutor)

  if (valorFinal === 0) {
    aliquotaDesc = 'Isento'
    aliquota = 0
  }

  return {
    valor: Number(valorFinal.toFixed(2)),
    aliquota,
    faixa: aliquotaDesc,
    base: Number(base.toFixed(2)),
  }
}

/**
 * Calcula remuneração completa de férias CLT 2026
 *
 * @param salarioBase - Salário base mensal do funcionário
 * @param diasFerias - Número de dias de férias a gozar (diasCorridos)
 * @param diasAbono - Dias de abono pecuniário (0 a 10)
 * @param numeroDependentes - Dependentes para dedução IRRF
 * @param pensaoConfig - Configurações de pensão alimentícia do funcionário
 * @param config - Opcional. Sobrescrita de tabelas legais vinda do banco
 */
export function calcularRemuneracaoFerias(
  salarioBase: number,
  diasFerias: number,
  diasAbono: number = 0,
  numeroDependentes: number = 0,
  pensaoConfig: {
    ativa: boolean
    tipo: 'percentual' | 'fixo'
    percentual: number
    valorFixo: number
  } = { ativa: false, tipo: 'percentual', percentual: 0, valorFixo: 0 },
  config?: TaxConfig
): ResultadoCalculo {
  const salarioDia = salarioBase / 30

  // 1. Remuneração de férias = proporcional aos dias de gozo
  const valorRemuneracao = Number((salarioDia * diasFerias).toFixed(2))

  // 2. 1/3 constitucional sobre a remuneração de férias
  const valorUmTerco = Number((valorRemuneracao / 3).toFixed(2))

  // 3. Abono pecuniário = proporcional aos dias de abono (venda de férias)
  // Sem incidência de 1/3 constitucional no item do abono em si, conforme o exemplo de referência.
  const valorAbonoPecuniario = diasAbono > 0
    ? Number((salarioDia * diasAbono).toFixed(2))
    : 0

  // 4. Base de incidência do INSS e IRRF = (Férias + 1/3). O abono pecuniário é isento de encargos (CLT Art. 143)
  const baseInss = Number((valorRemuneracao + valorUmTerco).toFixed(2))
  const valorBruto = Number((baseInss + valorAbonoPecuniario).toFixed(2))

  // INSS progressivo
  const { valor: inss, aliquota: aliquotaINSS } = calcularINSS(baseInss, config?.inssFaixas)

  // 5. Calcular Pensão Alimentícia
  let pensaoAlimenticia = 0
  if (pensaoConfig.ativa) {
    if (pensaoConfig.tipo === 'fixo') {
      pensaoAlimenticia = pensaoConfig.valorFixo
    } else {
      // Pensão calculada sobre rendimento líquido (baseInss - INSS)
      const salarioLiquidoBase = baseInss - inss
      pensaoAlimenticia = (salarioLiquidoBase * (pensaoConfig.percentual || 0)) / 100
    }
  }
  pensaoAlimenticia = Number(pensaoAlimenticia.toFixed(2))

  // 6. Base IRRF = (Férias + 1/3) − INSS − pensão alimentícia
  const baseIRRF = Math.max(0, baseInss - inss - pensaoAlimenticia)

  // IRRF com dedução de dependentes
  const { valor: irrf, faixa: faixaIRRF, base: baseIRRFReal } = calcularIRRF(
    baseIRRF,
    numeroDependentes,
    config?.irrfFaixas,
    config?.irrfParametros,
    config?.deducaoDependente
  )

  // 7. Líquido = total bruto − INSS − IRRF − pensão alimentícia
  const valorLiquido = Number((valorBruto - inss - irrf - pensaoAlimenticia).toFixed(2))

  return {
    diasFerias,
    diasAbono,
    salarioDia: Number(salarioDia.toFixed(2)),
    valorRemuneracao,
    valorUmTerco,
    valorAbonoPecuniario,
    valorBruto,
    inss,
    baseIRRF: Number(baseIRRFReal.toFixed(2)),
    irrf,
    pensaoAlimenticia,
    valorLiquido,
    aliquotaINSS: Number(aliquotaINSS.toFixed(4)),
    faixaIRRF,
  }
}

/**
 * Carrega a configuração legal de impostos 2026 do banco de dados (tabelas administrativas)
 */
export async function carregarTaxConfigDoBanco(supabase: any, ano: number = 2026): Promise<TaxConfig> {
  try {
    // 1. Faixas INSS
    const { data: inssData } = await supabase
      .from('config_inss_faixas')
      .select('limite, aliquota, parcela_deducao')
      .eq('ano', ano)
      .order('faixa_numero', { ascending: true })

    // 2. Faixas IRRF
    const { data: irrfData } = await supabase
      .from('config_irrf_faixas')
      .select('limite, aliquota, parcela_deducao, aliquota_desc')
      .eq('ano', ano)
      .order('faixa_numero', { ascending: true })

    // 3. Parâmetros IRRF
    const { data: irrfParam } = await supabase
      .from('config_irrf_parametros')
      .select('limite_isencao_redutor, limite_max_redutor, redutor_coeficiente_a, redutor_coeficiente_b')
      .eq('ano', ano)
      .maybeSingle()

    // 4. Deduções Legais
    const { data: deducoesData } = await supabase
      .from('config_deducoes_legais')
      .select('chave, valor')
      .eq('ano', ano)

    const taxConfig: TaxConfig = {}

    if (inssData && inssData.length > 0) {
      taxConfig.inssFaixas = inssData.map((f: any) => ({ ate: Number(f.limite), aliquota: Number(f.aliquota) }))
    }

    if (irrfData && irrfData.length > 0) {
      taxConfig.irrfFaixas = irrfData.map((f: any) => ({
        limite: f.limite !== null ? Number(f.limite) : null,
        aliquota: Number(f.aliquota),
        parcelaDeducao: Number(f.parcela_deducao),
        aliquotaDesc: f.aliquota_desc
      }))
    }

    if (irrfParam) {
      taxConfig.irrfParametros = {
        limiteIsencaoRedutor: Number(irrfParam.limite_isencao_redutor),
        limiteMaxRedutor: Number(irrfParam.limite_max_redutor),
        redutorCoeficienteA: Number(irrfParam.redutor_coeficiente_a),
        redutorCoeficienteB: Number(irrfParam.redutor_coeficiente_b)
      }
    }

    if (deducoesData) {
      const depVal = deducoesData.find((d: any) => d.chave === 'dependente_irrf')?.valor
      if (depVal !== undefined) {
        taxConfig.deducaoDependente = Number(depVal)
      }
    }

    return taxConfig
  } catch (error) {
    console.error('[carregarTaxConfigDoBanco] Erro ao carregar configurações do banco:', error)
    return {}
  }
}

/**
 * Calcular períodos aquisitivos de um funcionário a partir da admissão
 */
export function calcularPeriodosAquisitivos(dataAdmissao: Date, hoje: Date = new Date()) {
  const periodos = []
  let inicio = new Date(dataAdmissao)

  for (let i = 0; i < 10; i++) {
    const fim = new Date(inicio)
    fim.setFullYear(fim.getFullYear() + 1)
    fim.setDate(fim.getDate() - 1)

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

    inicio = new Date(fim)
    inicio.setDate(inicio.getDate() + 1)

    if (inicio > hoje) break
  }

  return periodos.reverse()
}

/**
 * Calcular dias de férias proporcionais de direito
 */
export function calcularDireitoFeriasProporcionais(dataAdmissao: Date, hoje: Date = new Date()): number {
  const mesesTrabalhados = Math.floor(
    (hoje.getTime() - dataAdmissao.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )
  if (mesesTrabalhados < 12) {
    return Math.floor(Math.min(mesesTrabalhados, 12) * 2.5)
  }
  return 30
}
