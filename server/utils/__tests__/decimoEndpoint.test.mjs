import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createRequire } from 'node:module'

// Executa o endpoint real com autenticação e banco isolados: não cria documentos reais.
const bundle = await build({ entryPoints: ['server/api/holerites/decimo-terceiro.post.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', plugins: [{ name: 'mock-services', setup(b) {
  b.onResolve({ filter: /^(#supabase\/server|.*authMiddleware)$/ }, a => ({ path: a.path, namespace: 'mock' }))
  b.onLoad({ filter: /.*/, namespace: 'mock' }, a => ({ contents: a.path.includes('authMiddleware') ? 'export const requireAdmin = globalThis.checkAdmin' : 'export const serverSupabaseServiceRole = () => globalThis.db' }))
} }] })

function ambiente({ admin = true, existentes = [] } = {}) {
  const funcionario = { id: 156, nome_completo: 'Funcionário de teste', salario_base: 4000, data_admissao: '2026-01-05', tipo_contrato: 'CLT', numero_dependentes: 0, pensao_config_ativa: true, pensao_config_tipo: 'percentual', pensao_config_percentual: 40, pensao_config_regras: { base: 'bruto', decimo: true } }
  const inserts = []
  const modulo = { exports: {} }
  const erro = e => Object.assign(new Error(e.message), e)
  const db = { from(tabela) {
    let insert = false
    const q = { select() { return q }, eq() { return q }, insert(row) { inserts.push(row); insert = true; return q }, single() { return Promise.resolve({ data: insert ? { id: 999 } : funcionario }) }, then(resolve) { return Promise.resolve({ data: existentes }).then(resolve) } }
    return q
  } }
  const context = { module: modulo, exports: modulo.exports, require: createRequire(import.meta.url), db,
    checkAdmin: async () => { if (!admin) throw erro({ statusCode: 403, message: 'Acesso negado' }) },
    defineEventHandler: f => f, readBody: async e => e.body, createError: erro }
  vm.runInNewContext(bundle.outputFiles[0].text, context)
  const run = body => modulo.exports.default({ body })
  return { run, inserts, funcionario }
}
const body = { funcionario_id: 156, ano: 2026, parcela: 1, data_pagamento: '2026-11-30' }

test('endpoint bloqueia não administrador antes de gravar', async () => {
  const a = ambiente({ admin: false })
  await assert.rejects(a.run(body), e => e.statusCode === 403)
  assert.equal(a.inserts.length, 0)
})
test('prévia não grava; confirmação grava uma parcela com valores conferidos', async () => {
  const a = ambiente()
  const preview = await a.run(body)
  assert.equal(a.inserts.length, 0)
  await a.run({ ...body, confirmar: true, conferencia: true, assinatura: preview.assinatura })
  assert.equal(a.inserts.length, 1)
  assert.equal(a.inserts[0].salario_liquido, 2000)
  assert.equal(a.inserts[0].decimo_parcela, 1)
})
test('alteração cadastral invalida a prévia antes da gravação', async () => {
  const a = ambiente()
  const preview = await a.run(body)
  a.funcionario.salario_base = 5000
  await assert.rejects(a.run({ ...body, confirmar: true, conferencia: true, assinatura: preview.assinatura }), e => e.statusCode === 409)
  assert.equal(a.inserts.length, 0)
})
test('duplicidade e segunda sem primeira são recusadas', async () => {
  const a = ambiente({ existentes: [{ id: 1, decimo_parcela: 1 }] })
  await assert.rejects(a.run(body), e => e.statusCode === 409)
  await assert.rejects(ambiente().run({ ...body, parcela: 2 }), /primeira parcela/)
  assert.equal(a.inserts.length, 0)
})
test('ajuste manual requer justificativa e respeita zero explícito', async () => {
  const a = ambiente()
  await assert.rejects(a.run({ ...body, pensao_manual: 0 }), /justificativa/)
  const preview = await a.run({ ...body, pensao_manual: 0, justificativa: 'Conferido conforme ofício' })
  assert.equal(preview.calculo.pensao, 0)
})
