export function validarIrrfManual(valor: unknown): number | null {
  if (valor == null || valor === '') return null
  const texto = String(valor).trim().replace(',', '.')
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(texto)) throw Object.assign(new Error('Informe um IRRF válido, em reais, com até duas casas decimais.'), { statusCode: 400 })
  const numero = Number(texto)
  if (!Number.isFinite(numero) || numero > 9999999999.99) throw Object.assign(new Error('Valor de IRRF inválido.'), { statusCode: 400 })
  return numero
}

export function aplicarIrrfManual<T extends { valorBruto: number; inss: number; pensaoAlimenticia: number; irrf: number; valorLiquido: number; faixaIRRF: string }>(calc: T, valor: unknown): T {
  const irrf = validarIrrfManual(valor)
  if (irrf === null) return calc
  const liquido = Math.round((calc.valorBruto - calc.inss - calc.pensaoAlimenticia - irrf) * 100) / 100
  if (liquido < 0) throw Object.assign(new Error('O IRRF informado excede o saldo das férias após os demais descontos.'), { statusCode: 400 })
  return { ...calc, irrf, valorLiquido: liquido, faixaIRRF: 'Valor manual' }
}

export function validarInssManual(valor: unknown): number | null {
  try { return validarIrrfManual(valor) }
  catch (e: any) { throw Object.assign(new Error(e.message.replaceAll('IRRF', 'INSS')), { statusCode: 400 }) }
}
