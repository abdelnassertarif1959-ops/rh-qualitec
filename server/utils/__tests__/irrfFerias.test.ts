import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validarIrrfManual, aplicarIrrfManual } from '../../../shared/irrfFerias.ts'

const calculo = { valorBruto: 4000, inss: 368.6, pensaoAlimenticia: 0, irrf: 0, valorLiquido: 3631.4, faixaIRRF: 'Isento' }
test('IRRF de 135,83 substitui o automático e reduz o líquido exatamente uma vez', () => {
  const c = aplicarIrrfManual(calculo, '135,83')
  assert.equal(c.irrf, 135.83)
  assert.equal(c.valorLiquido, 3495.57)
  assert.equal(c.faixaIRRF, 'Valor manual')
  assert.deepEqual(aplicarIrrfManual(c, 135.83), c)
  assert.equal(calculo.irrf, 0)
})
test('vazio preserva automático; zero explícito substitui imposto', () => {
  assert.equal(aplicarIrrfManual(calculo, null), calculo)
  assert.equal(validarIrrfManual(''), null)
  assert.equal(aplicarIrrfManual({ ...calculo, irrf: 200, valorLiquido: 3431.4 }, 0).valorLiquido, 3631.4)
})
test('rejeita valores negativos, inválidos, excesso de casas e saldo negativo', () => {
  for (const v of [-1, NaN, Infinity, true, 'abc', '135,833', '1.234,56']) assert.throws(() => validarIrrfManual(v))
  assert.throws(() => aplicarIrrfManual(calculo, 4000), /excede/)
})
test('preserva INSS e pensão ao substituir IRRF', () => {
  const c = aplicarIrrfManual({ ...calculo, pensaoAlimenticia: 500 }, 135.83)
  assert.equal(c.inss, 368.6)
  assert.equal(c.pensaoAlimenticia, 500)
  assert.equal(c.valorLiquido, 2995.57)
})
