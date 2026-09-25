import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularRemuneracaoFerias } from '../calcularFerias.ts'
import { aplicarIrrfManual, validarInssManual } from '../../../shared/irrfFerias.ts'

test('Maciel: bruto 5466,67, INSS 566,83, IRRF 135,83 e líquido 4764,01', () => {
  const calc = calcularRemuneracaoFerias(4100, 30, 0, 0, undefined, undefined, validarInssManual('566,83'))
  const c = aplicarIrrfManual(calc, '135,83')
  assert.equal(c.valorBruto, 5466.67)
  assert.equal(c.inss, 566.83)
  assert.equal(c.irrf, 135.83)
  assert.equal(c.valorLiquido, 4764.01)
  assert.deepEqual(aplicarIrrfManual(c, '135,83'), c)
})
test('vazio preserva automático e zero explícito é respeitado', () => {
  assert.equal(calcularRemuneracaoFerias(4100, 30).inss, 566.85)
  assert.equal(calcularRemuneracaoFerias(4100, 30, 0, 0, undefined, undefined, 0).inss, 0)
  assert.equal(validarInssManual(''), null)
})
test('INSS inválido e superior ao bruto são recusados', () => {
  for (const v of [-1, '566,833', NaN, true]) assert.throws(() => validarInssManual(v), /INSS/)
  assert.throws(() => calcularRemuneracaoFerias(4100, 30, 0, 0, undefined, undefined, 6000), /INSS/)
})
