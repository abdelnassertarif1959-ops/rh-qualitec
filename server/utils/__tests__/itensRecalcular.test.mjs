import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createRequire } from 'node:module'

const bundle = await build({ entryPoints: ['server/api/holerites/[id]/recalcular.post.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', plugins: [{ name: 'servicos-isolados', setup(b) {
  b.onResolve({ filter: /^(#supabase\/server|.*authMiddleware)$/ }, a => ({ path: a.path, namespace: 'mock' }))
  b.onLoad({ filter: /.*/, namespace: 'mock' }, a => ({ contents: a.path.includes('authMiddleware') ? 'export const requireAdmin = async () => {}' : 'export const serverSupabaseServiceRole = () => globalThis.db' }))
} }] })
test('recálculo real persiste 500 de desconto sem duplicar em nova execução', async () => {
  let h = { id: 1, funcionario_id: 156, data_pagamento: '2026-09-18', created_at: '2026-09-24', salario_base: 1600, dias_trabalhados: 30, descontos_personalizados: [], total_descontos: 0, salario_liquido: 1600 }
  let erroConsulta = null
  const itens = [{ ativo: true, tipo: 'desconto', descricao: 'EMPRESTIMO', valor: 500, data_inicio: '2026-09-18', data_fim: '2026-09-18' }]
  const db = { from(tabela) {
    const q = { select() { return q }, eq() { return q }, update(dados) { h = { ...h, ...dados }; return q }, single() { return Promise.resolve({ data: h }) }, then(resolve) { return Promise.resolve({ data: itens, error: erroConsulta }).then(resolve) } }
    return q
  } }
  const modulo = { exports: {} }
  vm.runInNewContext(bundle.outputFiles[0].text, { module: modulo, exports: modulo.exports, require: createRequire(import.meta.url), db, console: { log() {} }, defineEventHandler: f => f, getRouterParam: () => '1', createError: e => Object.assign(new Error(e.message), e) })
  for (let i = 0; i < 2; i++) {
    await modulo.exports.default({})
    assert.equal(h.total_descontos, 500)
    assert.equal(h.salario_liquido, 1100)
    assert.equal(h.descontos_personalizados.length, 1)
  }
  erroConsulta = { message: 'indisponível' }
  await assert.rejects(modulo.exports.default({}), /carregar os itens/)
  assert.equal(h.salario_liquido, 1100)
})
