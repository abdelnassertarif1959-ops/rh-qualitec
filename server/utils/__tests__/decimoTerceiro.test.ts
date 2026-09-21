import { test } from 'node:test'
import assert from 'node:assert/strict'
import { avosDecimo, calcularDecimo, irrfDecimo2026 } from '../decimoTerceiro.ts'
import { gerarDecimoHTML } from '../decimoHTML.ts'

const entrada = { ano: 2026, parcela: 2 as const, remuneracao: 4000, avos: 12, dependentes: 0, primeiraBruta: 2000 }
const pensao = { ativa: true, incide: true, tipo: 'percentual', percentual: 40, valorFixo: 0, base: 'bruto' }

test('avos respeitam quinze dias e admissão fora do exercício', () => {
  assert.equal(avosDecimo('2026-01-17', 2026), 12)
  assert.equal(avosDecimo('2026-01-18', 2026), 11)
  assert.equal(avosDecimo('2026-02-14', 2026), 11)
  assert.equal(avosDecimo('2026-02-15', 2026), 10)
  assert.equal(avosDecimo('2027-01-01', 2026), 0)
  assert.throws(() => avosDecimo('2026-02-30', 2026))
})
test('primeira parcela não antecipa tributos nem presume retenção de pensão', () => {
  const c = calcularDecimo({ ...entrada, parcela: 1, pensao })
  assert.equal(c.liquido, 2000)
  assert.equal(c.inss + c.irrf + c.pensao, 0)
  assert.equal(c.fgts, 160)
})
test('Leonardo: 40% sobre bruto e compensação da primeira parcela', () => {
  const c = calcularDecimo({ ...entrada, pensao })
  assert.equal(c.pensao, 1600)
  assert.equal(c.inss, 368.6)
  assert.equal(c.irrf, 0)
  assert.equal(c.liquido, 31.4)
})
test('pensão retida na primeira não é repetida nem reduz o adiantamento bruto', () => {
  const c = calcularDecimo({ ...entrada, pensao, pensaoPrimeira: 800 })
  assert.equal(c.pensao, 800)
  assert.equal(c.adiantamento, 2000)
  assert.equal(c.liquido, 831.4)
})
test('ajuste manual zero é respeitado e incidência desativada não desconta', () => {
  assert.equal(calcularDecimo({ ...entrada, pensao, pensaoManual: 0 }).pensao, 0)
  assert.equal(calcularDecimo({ ...entrada, pensao: { ...pensao, incide: false } }).pensao, 0)
  assert.equal(calcularDecimo({ ...entrada, parcela: 1, pensaoManual: 800 }).liquido, 1200)
})
test('IRRF 2026 compara deduções e aplica redução também no 13º', () => {
  const c = irrfDecimo2026(6000, 649.6, 0, 0)
  assert.equal(c.metodo, 'legal')
  assert.equal(c.valor, 382.88)
  assert.equal(irrfDecimo2026(4000, 368.6, 0, 0).metodo, 'simplificado')
  assert.equal(irrfDecimo2026(4000, 368.6, 0, 0).valor, 0)
})
test('configuração ambígua, valores inválidos e saldo negativo exigem revisão', () => {
  assert.throws(() => calcularDecimo({ ...entrada, ano: 2027 }))
  assert.throws(() => calcularDecimo({ ...entrada, avos: 0 }))
  assert.throws(() => calcularDecimo({ ...entrada, remuneracao: NaN }))
  assert.throws(() => calcularDecimo({ ...entrada, pensaoManual: 3000 }))
  assert.throws(() => calcularDecimo({ ...entrada, pensao: { ...pensao, base: 'liquido' } }))
  assert.throws(() => calcularDecimo({ ...entrada, pensao: { ...pensao, incide: null } }))
})
test('impressão usa valores armazenados e escapa dados cadastrais', () => {
  const html = gerarDecimoHTML({ decimo_dados: { avos: 12, remuneracao: 4000 }, decimo_parcela: 2, decimo_ano: 2026, total_proventos: 4000, pensao_alimenticia: 1600, salario_liquido: 31.4 }, { nome_completo: '<script>teste</script>' }, {})
  assert.ok(html.includes('2ª parcela / 2026'))
  assert.ok(html.includes('1.600,00'))
  assert.ok(html.includes('31,40'))
  assert.ok(!html.includes('<script>'))
})
