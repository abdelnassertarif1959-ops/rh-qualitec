import { test } from 'node:test'
import assert from 'node:assert/strict'
import { prepararAtualizacaoPensao } from '../pensaoConfig.ts'

test('atualização de percentual preserva ativação, recorrência e histórico', () => {
  assert.deepEqual(prepararAtualizacaoPensao({ pensao_config_percentual: 40 }), {
    pensao_config_percentual: 40
  })
})
test('zero explícito não vira 30 nem desativa obrigação', () => {
  assert.deepEqual(prepararAtualizacaoPensao({ pensao_config_percentual: 0, pensao_alimenticia: 0 }), { pensao_config_percentual: 0 })
})
test('desativação exige campo explícito', () => {
  assert.deepEqual(prepararAtualizacaoPensao({ pensao_config_ativa: false }), { pensao_config_ativa: false })
  assert.deepEqual(prepararAtualizacaoPensao({ inss_config_tipo: 'fixo' }), {})
})
test('rejeita percentuais e valores inválidos', () => {
  for (const valor of [-1, 101, NaN, Infinity, '', null, true, 'erro']) {
    assert.throws(() => prepararAtualizacaoPensao({ pensao_config_percentual: valor }))
  }
  assert.throws(() => prepararAtualizacaoPensao({ pensao_config_tipo: 'outro' }))
})
