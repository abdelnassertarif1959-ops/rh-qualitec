import { calcularINSS2026 } from './inss2026'

const moeda = (valor: number) => Math.round((valor + Number.EPSILON) * 100) / 100

function diasEntre(inicio: string, fim: string): number {
  const a = Date.parse(`${inicio}T00:00:00Z`)
  const b = Date.parse(`${fim}T00:00:00Z`)
  return Math.max(0, Math.floor((b - a) / 86400000) + 1)
}

function maxData(a: string, b: string) { return a > b ? a : b }
function minData(a: string, b: string) { return a < b ? a : b }

export async function buscarConciliacaoFeriasFolha(
  db: any,
  funcionarioId: number,
  salarioBase: number,
  periodoInicio: string,
  periodoFim: string,
  tipoContrato: string
) {
  const { data: ferias, error } = await db.from('funcionario_ferias')
    .select('id,data_inicio,data_fim,dias_corridos,holerite_id,status')
    .eq('funcionario_id', funcionarioId)
    .lte('data_inicio', periodoFim)
    .gte('data_fim', periodoInicio)
  if (error) throw new Error('Não foi possível consultar férias da competência; folha não gerada')

  const ativas = (ferias || []).filter((f: any) =>
    !['cancelada', 'cancelado', 'estornada', 'estornado', 'rejeitada'].includes(String(f.status || '').toLowerCase())
  )
  if (!ativas.length) return null

  if (ativas.some((f: any) => !f.holerite_id)) {
    throw new Error('Existe férias na competência sem recibo vinculado; confira o recibo antes de gerar a folha')
  }
  const idsRecibos = [...new Set(ativas.map((f: any) => Number(f.holerite_id)))]
  const { data: recibos, error: erroRecibos } = await db.from('holerites')
    .select('id,inss,irrf,pensao_alimenticia,total_proventos,inss_percentual')
    .in('id', idsRecibos)
  if (erroRecibos) throw new Error('Não foi possível consultar recibos de férias; folha não gerada')
  const recibosPorId = new Map<number, any>((recibos || []).map((r: any) => [Number(r.id), r] as [number, any]))

  const diasMes = diasEntre(periodoInicio, periodoFim)
  const partes = ativas.map((f: any) => {
    const recibo: any = recibosPorId.get(Number(f.holerite_id))
    const diasRecibo = Number(f.dias_corridos) || diasEntre(f.data_inicio, f.data_fim)
    const diasGozoMes = diasEntre(maxData(f.data_inicio, periodoInicio), minData(f.data_fim, periodoFim))
    if (!recibo || diasRecibo <= 0 || diasGozoMes <= 0) {
      throw new Error('Dados do recibo de férias inválidos; folha não gerada')
    }
    return { recibo, diasRecibo, diasGozoMes }
  })

  const diasFerias = partes.reduce((s: number, p: any) => s + p.diasGozoMes, 0)
  if (diasFerias > diasMes) throw new Error('Períodos de férias sobrepostos na competência; confira os registros')
  const diasNormais = diasMes - diasFerias
  const salarioDia = Number(salarioBase) / 30
  const salarioNormal = moeda(salarioDia * diasNormais)
  let remuneracaoFerias = 0
  let tercoFerias = 0
  let inssFerias = 0
  let irrfFerias = 0
  let pensaoFerias = 0

  for (const p of partes) {
    const fracao = p.diasGozoMes / p.diasRecibo
    const remuneracaoParte = moeda(salarioDia * p.diasGozoMes)
    const tercoParte = moeda((Number(salarioBase) / 3) * fracao)
    remuneracaoFerias += remuneracaoParte
    tercoFerias += tercoParte
    const baseFeriasParte = remuneracaoParte + tercoParte
    const aliquotaSalva = Number(p.recibo.inss_percentual)
    const aliquotaINSS = Number.isFinite(aliquotaSalva) && aliquotaSalva > 0
      ? aliquotaSalva
      : (Number(p.recibo.total_proventos) > 0 ? Number(p.recibo.inss || 0) / Number(p.recibo.total_proventos) * 100 : 0)
    inssFerias += moeda(baseFeriasParte * aliquotaINSS / 100)
    irrfFerias += moeda(Number(p.recibo.irrf || 0) * fracao)
    pensaoFerias += moeda(Number(p.recibo.pensao_alimenticia || 0) * fracao)
  }
  remuneracaoFerias = moeda(remuneracaoFerias)
  tercoFerias = moeda(tercoFerias)
  inssFerias = moeda(inssFerias)
  irrfFerias = moeda(irrfFerias)
  pensaoFerias = moeda(pensaoFerias)

  const proventosFerias = moeda(remuneracaoFerias + tercoFerias)
  const totalProventos = moeda(salarioNormal + proventosFerias)
  const inssNormal = tipoContrato === 'PJ' ? 0 : calcularINSS2026(salarioNormal).valor
  const inssTotalCompetencia = tipoContrato === 'PJ' ? 0 : calcularINSS2026(totalProventos).valor
  const inssDiferencaFerias = moeda(Math.max(0, inssTotalCompetencia - inssNormal - inssFerias))
  const adiantamentoFerias = moeda(Math.max(0, proventosFerias - inssFerias - irrfFerias - pensaoFerias))

  const beneficios = [
    { referencia: '931', descricao: '1/3 DAS FÉRIAS', valor: tercoFerias },
    { referencia: '8783', descricao: 'DIAS FÉRIAS', valor: remuneracaoFerias }
  ].filter((item) => item.valor > 0)
  const descontos = [
    { referencia: '937', descricao: 'ADIANTAMENTO DE FÉRIAS', valor: adiantamentoFerias },
    { referencia: '812', descricao: 'INSS FÉRIAS', valor: inssFerias },
    { referencia: '821', descricao: 'INSS DIFERENÇA FÉRIAS', valor: inssDiferencaFerias },
    { referencia: '942', descricao: 'IRRF FÉRIAS', valor: irrfFerias },
    { referencia: '943', descricao: 'PENSÃO ALIMENTÍCIA FÉRIAS', valor: pensaoFerias }
  ].filter((item) => item.valor > 0)

  return {
    diasTrabalhados: diasNormais,
    salarioNormal,
    totalProventos,
    baseInss: totalProventos,
    inssNormal,
    inssFerias,
    inssTotalCompetencia,
    inssDiferencaFerias,
    irrfFerias,
    pensaoFerias,
    beneficios,
    descontos
  }
}
