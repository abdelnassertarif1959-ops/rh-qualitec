import { test } from 'node:test'
import assert from 'node:assert/strict'
import { itensVigentesNoPagamento } from '../../../shared/itensHolerite.ts'

const emprestimo = { ativo: true, tipo: 'desconto', valor: 500, vigencia_tipo: 'unico', data_inicio: '2026-09-18', data_fim: '2026-09-18' }
test('empréstimo único abate 500 do adiantamento pago dia 18 mesmo criado depois', () => {
  const h = { data_pagamento: '2026-09-18', created_at: '2026-09-24', bruto: 1600 }
  const itens = itensVigentesNoPagamento([emprestimo], h.data_pagamento)
  assert.equal(h.bruto - itens.reduce((s, i) => s + i.valor, 0), 1100)
})
test('desconto único não reaparece na folha seguinte nem em outro mês', () => {
  assert.equal(itensVigentesNoPagamento([emprestimo], '2026-10-07').length, 0)
  assert.equal(itensVigentesNoPagamento([emprestimo], '2026-10-18').length, 0)
})
test('itens desativados e pagamentos sem data não são aplicados', () => {
  assert.equal(itensVigentesNoPagamento([{ ...emprestimo, ativo: false }], '2026-09-18').length, 0)
  assert.equal(itensVigentesNoPagamento([emprestimo], null).length, 0)
})
test('recorrente respeita início e fim inclusive', () => {
  const item = { ...emprestimo, vigencia_tipo: 'recorrente', data_fim: '2026-10-18' }
  for (const data of ['2026-09-18', '2026-10-18']) assert.equal(itensVigentesNoPagamento([item], data).length, 1)
  for (const data of ['2026-09-17', '2026-10-19']) assert.equal(itensVigentesNoPagamento([item], data).length, 0)
})
