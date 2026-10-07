import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ajustarAdiantamentoFolha, buscarAdiantamentoCompetencia } from '../adiantamentoFolha.ts'
const h = { status: 'gerado', observacoes: 'Folha mensal', adiantamento: 0, total_proventos: 4000, total_descontos: 1449.61 }
test('inclui 1600 preservando demais descontos e sem duplicar', () => {
 const a = ajustarAdiantamentoFolha(h, 1600)!
 assert.equal(a.salario_liquido, 950.39)
 assert.equal(a.total_descontos, 3049.61)
 assert.equal(ajustarAdiantamentoFolha({ ...h, ...a }, 1600), null)
})
test('preserva liberados e documentos especiais; bloqueia saldo negativo', () => {
 assert.throws(() => ajustarAdiantamentoFolha({ ...h, status: 'enviado' }, 1600))
 assert.equal(ajustarAdiantamentoFolha({ ...h, decimo_ano: 2026 }, 1600), null)
 assert.equal(ajustarAdiantamentoFolha({ ...h, observacoes: 'Recibo de Férias' }, 1600), null)
 assert.throws(() => ajustarAdiantamentoFolha(h, 5000))
 assert.throws(() => ajustarAdiantamentoFolha({ ...h, adiantamento: 1600 }, 0))
})
function db(data: any[], error: any = null) {
 const q: any = { select: () => q, eq: () => q, gte: () => q, lte: () => q, ilike: () => q, is: () => q, then: (f: any) => Promise.resolve({ data, error }).then(f) }
 return { from: () => q }
}
test('usa bruto mesmo quando houve empréstimo de 500 no adiantamento', async () => {
 assert.equal(await buscarAdiantamentoCompetencia(db([{total_proventos:1600,salario_liquido:1100,status:'enviado'}]),156,'2026-09-01'),1600)
})
test('consulta com erro e adiantamentos duplicados não viram folha sem desconto', async () => {
 await assert.rejects(buscarAdiantamentoCompetencia(db([],{}),156,'2026-09-01'))
 await assert.rejects(buscarAdiantamentoCompetencia(db([{total_proventos:1600},{total_proventos:1600}]),156,'2026-09-01'))
 assert.equal(await buscarAdiantamentoCompetencia(db([{total_proventos:1600,status:'cancelado'}]),156,'2026-09-01'),0)
 assert.equal(await buscarAdiantamentoCompetencia(db([],{}),169,'2026-09-01'),0)
})
