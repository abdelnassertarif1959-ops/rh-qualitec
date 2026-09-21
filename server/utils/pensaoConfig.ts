/** Atualizações parciais não devem apagar a obrigação nem presumir percentual. */
export function prepararAtualizacaoPensao(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  if (body.pensao_config_regras != null) {
    const regras = body.pensao_config_regras as Record<string, unknown>
    if (!regras || !['bruto', 'liquido'].includes(String(regras.base)) ||
        ['ferias', 'terco', 'decimo'].some(c => typeof regras[c] !== 'boolean')) {
      throw new Error('Informe a base e as incidências da pensão')
    }
    data.pensao_config_regras = { base: regras.base, ferias: regras.ferias, terco: regras.terco, decimo: regras.decimo }
  }
  for (const campo of ['pensao_config_ativa', 'pensao_config_recorrente']) {
    if (body[campo] === undefined) continue
    if (typeof body[campo] !== 'boolean') throw new Error(`${campo}: informe verdadeiro ou falso`)
    data[campo] = body[campo]
  }
  if (body.pensao_config_tipo !== undefined) {
    if (!['fixo', 'percentual'].includes(String(body.pensao_config_tipo))) {
      throw new Error('Tipo de pensão inválido')
    }
    data.pensao_config_tipo = body.pensao_config_tipo
  }
  for (const campo of ['pensao_config_percentual', 'pensao_config_valor_fixo']) {
    if (body[campo] === undefined) continue
    const raw = body[campo]
    const valor = Number(raw)
    if (raw === null || raw === '' || typeof raw === 'boolean' || !Number.isFinite(valor) || valor < 0 ||
        (campo === 'pensao_config_percentual' && valor > 100)) {
      throw new Error(`${campo}: valor inválido`)
    }
    data[campo] = valor
  }
  return data
}
