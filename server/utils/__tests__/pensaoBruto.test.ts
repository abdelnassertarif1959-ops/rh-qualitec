import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularPensaoPercentual, calcularPensaoDecimo } from '../../../shared/pensao.ts'
import { calcularRemuneracaoFerias } from '../calcularFerias.ts'
const regras = { base: 'bruto' as const, ferias: true, terco: true, decimo: true }

test('40% sobre o bruto não reduz INSS nem IRRF', () => {
  assert.equal(calcularPensaoPercentual(40, 4000, 368.60, 100, 'bruto'), 1600)
  assert.equal(calcularPensaoPercentual(40, 0), 0)
})
test('férias incluem remuneração e terço e excluem abono não autorizado', () => {
  const calc = calcularRemuneracaoFerias(3000, 20, 10, 0, { ativa: true, tipo: 'percentual', percentual: 40, valorFixo: 0, regras })
  assert.equal(calc.pensaoAlimenticia, 1066.67)
  assert.equal(calc.valorLiquido, Math.round((calc.valorBruto - calc.inss - calc.irrf - 1066.67) * 100) / 100)
})
test('incidências de férias podem ser desmarcadas', () => {
  const calc = calcularRemuneracaoFerias(3000, 30, 0, 0, { ativa: true, tipo: 'percentual', percentual: 40, valorFixo: 0, regras: { ...regras, ferias: false, terco: false } })
  assert.equal(calc.pensaoAlimenticia, 0)
})
test('regra do décimo usa o bruto informado e respeita incidência', () => {
  assert.equal(calcularPensaoDecimo(4000, 40, regras, 368.60, 100), 1600)
  assert.equal(calcularPensaoDecimo(2000, 40, regras), 800)
  assert.equal(calcularPensaoDecimo(4000, 40, { ...regras, decimo: false }), 0)
})
test('valor fixo permite ajuste manual sem percentual', () => {
  const calc = calcularRemuneracaoFerias(3000, 30, 0, 0, { ativa: true, tipo: 'fixo', percentual: 40, valorFixo: 950, regras })
  assert.equal(calc.pensaoAlimenticia, 950)
})
