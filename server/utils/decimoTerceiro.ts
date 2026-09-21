import { calcularINSS2026 } from './inss2026.ts'

export const moeda = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
export function validarData(data: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !Number.isFinite(Date.parse(data)) || new Date(data).toISOString().slice(0, 10) !== data) throw new Error('Data inválida')
  return data
}
export function avosDecimo(admissao: string, ano: number) {
  validarData(admissao)
  let avos = 0
  for (let mes = 0; mes < 12; mes++) {
    const inicio = Date.UTC(ano, mes, 1)
    const fim = Date.UTC(ano, mes + 1, 0)
    if ((fim - Math.max(inicio, Date.parse(admissao))) / 86400000 + 1 >= 15) avos++
  }
  return avos
}

/** Tributação exclusiva do 13º, tabela 2026; nunca somar à folha mensal. */
export function irrfDecimo2026(bruto: number, inss: number, pensao: number, dependentes: number) {
  const deducaoLegal = inss + pensao + dependentes * 189.59
  const deducao = Math.max(607.20, deducaoLegal)
  const base = moeda(Math.max(0, bruto - deducao))
  const faixas = [[2428.80, 0, 0], [2826.65, .075, 182.16], [3751.05, .15, 394.16], [4664.68, .225, 675.49], [Infinity, .275, 908.73]]
  const faixa = faixas.find(f => base <= f[0])!
  const imposto = moeda(Math.max(0, base * faixa[1] - faixa[2]))
  const reducao = bruto <= 5000 ? Math.min(imposto, 312.89) : bruto <= 7350 ? Math.max(0, moeda(978.62 - .133145 * bruto)) : 0
  return { base, valor: moeda(Math.max(0, imposto - reducao)), deducao, metodo: deducaoLegal >= 607.20 ? 'legal' : 'simplificado' }
}

export interface EntradaDecimo {
  ano: number; parcela: 1 | 2; remuneracao: number; avos: number; dependentes: number
  primeiraBruta?: number; pensaoPrimeira?: number; pensaoManual?: number
  pensao?: { ativa: boolean; incide: boolean | null; tipo: string; percentual: number; valorFixo: number; base: string | null }
}
export function calcularDecimo(e: EntradaDecimo) {
  if (e.ano !== 2026) throw new Error('Tabelas do 13º disponíveis para 2026. Atualize as tabelas antes de gerar outro ano.')
  if (![1, 2].includes(e.parcela) || !Number.isInteger(e.avos) || e.avos < 1 || e.avos > 12) throw new Error('Informe parcela e avos válidos (1 a 12)')
  if (!Number.isInteger(e.dependentes) || e.dependentes < 0) throw new Error('Dependentes inválidos')
  for (const n of [e.remuneracao, e.primeiraBruta ?? 0, e.pensaoPrimeira ?? 0, e.pensaoManual ?? 0]) {
    if (!Number.isFinite(n) || n < 0) throw new Error('Valores financeiros inválidos')
  }
  if (e.remuneracao <= 0) throw new Error('Informe a remuneração de referência')
  const totalDireito = moeda(e.remuneracao * e.avos / 12)
  const proventos = e.parcela === 1 ? moeda(totalDireito / 2) : totalDireito
  const adiantamento = e.parcela === 2 ? e.primeiraBruta ?? 0 : 0
  const inss = e.parcela === 2 ? calcularINSS2026(totalDireito).valor : 0
  let pensaoTotal = 0
  if (e.parcela === 2 && e.pensao?.ativa && e.pensaoManual === undefined) {
    if (e.pensao.incide === null) throw new Error('Confirme a incidência da pensão no 13º no cadastro ou informe o desconto manual justificado')
    if (e.pensao.incide) {
      if (e.pensao.tipo === 'fixo') pensaoTotal = e.pensao.valorFixo
      else {
        if (e.pensao.base !== 'bruto') throw new Error('Pensão sobre líquido exige revisão: informe o desconto manual do 13º com justificativa')
        if (!Number.isFinite(e.pensao.percentual) || e.pensao.percentual < 0 || e.pensao.percentual > 100) throw new Error('Percentual de pensão inválido')
        pensaoTotal = moeda(totalDireito * e.pensao.percentual / 100)
      }
    }
  }
  // Manual é o desconto desta parcela. Na segunda, deduzir o que já foi retido na primeira.
  const pensao = e.pensaoManual ?? (e.parcela === 1 ? 0 : moeda(Math.max(0, pensaoTotal - (e.pensaoPrimeira ?? 0))))
  const pensaoAnual = pensao + (e.parcela === 2 ? e.pensaoPrimeira ?? 0 : 0)
  if (!Number.isFinite(pensao) || pensao < 0 || pensaoAnual > totalDireito) throw new Error('Pensão superior ao direito do 13º; revise os valores')
  const irrf = e.parcela === 2 ? irrfDecimo2026(totalDireito, inss, pensaoAnual, e.dependentes) : { base: 0, valor: 0, deducao: 0, metodo: 'sem_retencao' }
  const descontos = moeda(inss + irrf.valor + pensao + adiantamento)
  const liquido = moeda(proventos - descontos)
  if (liquido < 0) throw new Error('Os descontos excedem o saldo desta parcela. Revise o adiantamento e a pensão; o sistema não oculta saldo negativo.')
  return { ano: e.ano, parcela: e.parcela, avos: e.avos, remuneracao: e.remuneracao, totalDireito, proventos, adiantamento, inss, irrf: irrf.valor, baseIRRF: irrf.base, deducaoIRRF: irrf.deducao, metodoIRRF: irrf.metodo, pensao, descontos, liquido, fgts: moeda(Math.max(0, proventos - adiantamento) * .08) }
}
