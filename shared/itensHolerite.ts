// A vigência acompanha o pagamento, independentemente do dia em que o documento foi criado.
export function itensVigentesNoPagamento(itens: any[], dataPagamento: string | null | undefined) {
  if (!dataPagamento) return []
  const data = String(dataPagamento).slice(0, 10)
  return itens.filter(item => item.ativo === true && item.data_inicio <= data && (!item.data_fim || item.data_fim >= data))
}
