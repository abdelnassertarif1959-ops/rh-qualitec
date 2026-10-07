import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import vm from 'node:vm'
import { createRequire } from 'node:module'
const bundle = await build({ entryPoints:['server/api/holerites/gerar.post.ts'], bundle:true, write:false, platform:'node', format:'cjs', plugins:[{name:'isolamento',setup(b){
 b.onResolve({filter:/^(#supabase\/server|.*authMiddleware|.*notifications)$/},a=>({path:a.path,namespace:'mock'}))
 b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:a.path.includes('authMiddleware')?'export const requireAdmin = async () => ({nome_completo:"Admin"})':a.path.includes('notifications')?'export const notificarGeracaoHolerites = async () => {}':'export const serverSupabaseServiceRole = () => globalThis.db'}))
}}] })
test('gerar novamente atualiza somente adiantamento e totais, uma única vez', async () => {
 let h={id:1581,status:'gerado',observacoes:'Folha mensal',updated_at:'2026-09-08',adiantamento:0,total_proventos:4000,total_descontos:1449.61,salario_liquido:2550.39}
 const writes=[]
 const periodos=[]
 const db={from(tabela){
  let buscaAdvance=false, alteracao
  const q={select(){return q},eq(k,v){if(k==='periodo_inicio')periodos.push(v);return q},gte(){return q},lte(){return q},not(){return q},is(){return q},in(){return q},ilike(){buscaAdvance=true;return q},update(v){alteracao=v;return q},
   maybeSingle(){if(alteracao){writes.push(alteracao);h={...h,...alteracao}}return Promise.resolve({data:h})},
   then(f){return Promise.resolve({data:tabela==='funcionarios'?[{id:156,nome_completo:'Teste',salario_base:4000}]:tabela==='holerite_itens_personalizados'?[]:buscaAdvance?[{total_proventos:1600,status:'enviado'}]:[]}).then(f)}}
  return q
 }}
 const mod={exports:{}}
 class DataTeste extends Date {constructor(...args){super(...(args.length?args:['2026-10-06T12:00:00-03:00']))}}
 vm.runInNewContext(bundle.outputFiles[0].text,{module:mod,exports:mod.exports,require:createRequire(import.meta.url),db,Date:DataTeste,console:{log(){},error(){}},defineEventHandler:f=>f,readBody:async()=>({tipo:'mensal'}),createError:e=>Object.assign(new Error(e.message),e)})
 const primeira=await mod.exports.default({})
 assert.equal(primeira.total_atualizados,1)
 assert.equal(h.salario_liquido,950.39)
 assert.equal(periodos[0],'2026-09-01')
 assert.deepEqual(Object.keys(writes[0]).sort(),['adiantamento','salario_liquido','total_descontos'])
 const segunda=await mod.exports.default({})
 assert.equal(segunda.total_atualizados,0)
 assert.equal(writes.length,1)
})
