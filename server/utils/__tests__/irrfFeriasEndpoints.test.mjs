import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createRequire } from 'node:module'

async function ambiente(rota, { admin = true, manual = 135.83, vinculo = null, inssManual = null } = {}) {
  const bundle = await build({ entryPoints: [rota], bundle: true, write: false, platform: 'node', format: 'cjs', plugins: [{ name: 'servicos-isolados', setup(b) {
    b.onResolve({ filter: /^(#supabase\/server|.*authMiddleware|.*calcularFerias|.*holeriteHTML)$/ }, a => ({ path: a.path, namespace: 'mock' }))
    b.onLoad({ filter: /.*/, namespace: 'mock' }, a => ({ contents: a.path.includes('authMiddleware') ? 'export const requireAuth = globalThis.auth; export const requireAdmin = globalThis.auth' : a.path.includes('calcularFerias') ? 'export const carregarTaxConfigDoBanco = async () => ({}); export const calcularRemuneracaoFerias = (...args) => ({valorBruto:4000,inss:args[6] ?? 368.6,pensaoAlimenticia:0,irrf:0,valorLiquido:3631.4,faixaIRRF:"Isento",aliquotaINSS:.09})' : a.path.includes('holeriteHTML') ? 'export const gerarHoleriteHTML = () => ""' : 'export const serverSupabaseServiceRole = () => globalThis.db' }))
  } }] })
  const funcionario = { id: 10, salario_base: 3000, numero_dependentes: 0 }
  const ferias = { id: 20, funcionario_id: 10, data_inicio: '2026-10-01', data_fim: '2026-10-30', data_pagamento: '2026-09-29', dias_corridos: 30, status: 'programado', irrf_manual: manual, inss_manual: inssManual, funcionarios: funcionario, holerite_id: vinculo }
  const gravacoes = []
  const db = { from(tabela) {
    let valores
    const q = { select() { return q }, eq() { return q }, insert(v) { valores = v; gravacoes.push({ tabela, v }); return q }, update(v) { valores = v; gravacoes.push({ tabela, v }); return q }, single() { return Promise.resolve({ data: valores ? { ...valores, id: 25 } : tabela === 'funcionarios' ? funcionario : ferias }) }, then(resolve) { return Promise.resolve({ data: valores }).then(resolve) } }
    return q
  } }
  const modulo = { exports: {} }
  vm.runInNewContext(bundle.outputFiles[0].text, { module: modulo, exports: modulo.exports, require: createRequire(import.meta.url), db, console: { log() {}, error() {} }, auth: async () => ({ id: 10, tipo_acesso: admin ? 'admin' : 'funcionario' }), defineEventHandler: f => f, readBody: async e => e.body, getRouterParam: () => '20', createError: e => Object.assign(new Error(e.message || e.statusMessage), e), useRuntimeConfig: () => ({ public: { supabaseUrl: 'https://teste.invalid', supabaseKey: 'teste' } }), fetch: async url => ({ json: async () => url.includes('funcionarios') ? [funcionario] : [{ id: 1, nome: 'Empresa teste' }] }) })
  return { run: body => modulo.exports.default({ body }), gravacoes }
}
const post = 'server/api/ferias/index.post.ts'
const put = 'server/api/ferias/[id]/index.put.ts'
const gerar = 'server/api/ferias/[id]/gerar-holerite.post.ts'
const body = { funcionario_id: 10, periodo_aquisitivo_inicio: '2025-01-01', periodo_aquisitivo_fim: '2025-12-31', data_inicio: '2026-10-01', data_fim: '2026-10-30', data_pagamento: '2026-09-29', irrf_manual: '135,83' }
test('cadastro persiste IRRF manual e líquido correto', async () => {
  const a = await ambiente(post)
  await a.run(body)
  assert.equal(a.gravacoes[0].v.irrf_manual, 135.83)
  assert.equal(a.gravacoes[0].v.irrf, 135.83)
  assert.equal(a.gravacoes[0].v.valor_liquido, 3495.57)
})
test('funcionário não pode informar IRRF manual', async () => {
  const a = await ambiente(post, { admin: false })
  await assert.rejects(a.run(body), e => e.statusCode === 403)
  assert.equal(a.gravacoes.length, 0)
})
test('edição sem campo preserva IRRF; null restaura automático', async () => {
  const a = await ambiente(put)
  await a.run({ observacoes: 'Conferido' })
  assert.equal(a.gravacoes[0].v.irrf, 135.83)
  await a.run({ irrf_manual: null })
  assert.equal(a.gravacoes[1].v.irrf, 0)
  assert.equal(a.gravacoes[1].v.irrf_manual, null)
})
test('recibo usa IRRF salvo e mantém o líquido ao vincular férias', async () => {
  const a = await ambiente(gerar)
  await a.run({})
  const recibo = a.gravacoes.find(g => g.tabela === 'holerites').v
  assert.equal(recibo.irrf, 135.83)
  assert.equal(recibo.salario_liquido, 3495.57)
  assert.equal(a.gravacoes.find(g => g.tabela === 'funcionario_ferias').v.irrf, 135.83)
})
test('bloqueia alteração do IRRF se o recibo já foi emitido', async () => {
  const a = await ambiente(put, { vinculo: 99 })
  await assert.rejects(a.run({ irrf_manual: 200 }), e => e.statusCode === 409)
  assert.equal(a.gravacoes.length, 0)
})

test('INSS manual persiste, é preservado na edição e utilizado no recibo', async () => {
  const a = await ambiente(post)
  await a.run({ ...body, inss_manual: '566,83' })
  assert.equal(a.gravacoes[0].v.inss_manual, 566.83)
  assert.equal(a.gravacoes[0].v.inss, 566.83)
  const b = await ambiente(put, { inssManual: 566.83 })
  await b.run({ observacoes: 'Conferido' })
  assert.equal(b.gravacoes[0].v.inss_manual, 566.83)
  assert.equal(b.gravacoes[0].v.inss, 566.83)
  const c = await ambiente(gerar, { inssManual: 566.83 })
  await c.run({})
  assert.equal(c.gravacoes.find(g => g.tabela === 'holerites').v.inss, 566.83)
})
test('INSS manual restrito ao admin e bloqueado após emitir recibo', async () => {
  const a = await ambiente(post, { admin: false })
  await assert.rejects(a.run({ ...body, irrf_manual: null, inss_manual: 566.83 }), e => e.statusCode === 403)
  const b = await ambiente(put, { vinculo: 99, inssManual: 566.83 })
  await assert.rejects(b.run({ inss_manual: 500 }), e => e.statusCode === 409)
})
