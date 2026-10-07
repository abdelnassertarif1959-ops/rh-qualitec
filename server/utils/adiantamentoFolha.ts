const moeda = (n: number) => Math.round(n * 100) / 100
export function ajustarAdiantamentoFolha(h: any, valor: number) {
  if (!Number.isFinite(valor) || valor < 0) throw new Error('Adiantamento inválido')
  if (h.decimo_ano || !String(h.observacoes || '').toLowerCase().startsWith('folha mensal')) return null
  const anterior = Number(h.adiantamento || 0)
  if (moeda(anterior) === moeda(valor)) return null
  if (h.status !== 'gerado') throw new Error('Folha já liberada: revisão manual necessária')
  if (!valor && anterior > 0) throw new Error('Adiantamento já informado sem recibo correspondente: revise manualmente')
  const descontos = moeda(Number(h.total_descontos) - anterior + valor)
  const liquido = moeda(Number(h.total_proventos) - descontos)
  if (!Number.isFinite(liquido) || descontos < 0 || liquido < 0) throw new Error('Adiantamento incompatível com os totais da folha')
  return { adiantamento: moeda(valor), total_descontos: descontos, salario_liquido: liquido }
}
export async function buscarAdiantamentoCompetencia(db: any, funcionarioId: number, periodoInicio: string) {
  if (funcionarioId === 169) return 0
  const mes = periodoInicio.slice(0, 7)
  const [ano, numeroMes] = mes.split('-').map(Number)
  const fim = `${mes}-${new Date(Date.UTC(ano, numeroMes, 0)).getUTCDate()}`
  const { data, error } = await db.from('holerites').select('id,total_proventos,salario_base,status')
    .eq('funcionario_id', funcionarioId).gte('periodo_inicio', `${mes}-01`).lte('periodo_inicio', fim)
    .ilike('observacoes', 'Adiantamento%').is('decimo_ano', null)
  if (error) throw new Error('Falha ao consultar adiantamento; folha não alterada')
  const ativos = (data || []).filter((a: any) => !['cancelado', 'estornado'].includes(a.status))
  if (ativos.length > 1) throw new Error('Mais de um adiantamento na competência. Confira os registros')
  const valor = Number(ativos[0]?.total_proventos ?? ativos[0]?.salario_base ?? 0)
  if (!Number.isFinite(valor) || valor < 0) throw new Error('Valor de adiantamento inválido')
  return moeda(valor)
}
