// Diagnóstico: verifica se documentos têm titulo/descricao/tipo_id preenchidos
const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function diagnosticar() {
  // 1. Buscar documentos com join em documento_tipos
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/funcionario_documentos?select=id,nome_original,titulo,descricao,tipo_id,documento_tipos(nome)&order=criado_em.desc&limit=10`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  )
  const docs = await res.json()

  console.log('\n=== DOCUMENTOS NO BANCO ===')
  if (!Array.isArray(docs) || docs.length === 0) {
    console.log('Nenhum documento encontrado.')
    return
  }

  docs.forEach(d => {
    console.log(`\nID: ${d.id}`)
    console.log(`  nome_original : ${d.nome_original}`)
    console.log(`  titulo        : ${d.titulo ?? '(null)'}`)
    console.log(`  descricao     : ${d.descricao ?? '(null)'}`)
    console.log(`  tipo_id       : ${d.tipo_id ?? '(null)'}`)
    console.log(`  tipo nome     : ${d.documento_tipos?.nome ?? '(sem tipo vinculado)'}`)
  })

  const semTitulo = docs.filter(d => !d.titulo && !d.tipo_id)
  console.log(`\n=== RESUMO ===`)
  console.log(`Total: ${docs.length} | Sem título/tipo: ${semTitulo.length}`)

  if (semTitulo.length === docs.length) {
    console.log('\n⚠️  CAUSA IDENTIFICADA: Todos os documentos estão sem titulo, descricao e tipo_id.')
    console.log('   O v-if no componente nunca renderiza o bloco de tipo/título.')
    console.log('   Solução: o componente deve mostrar o nome do arquivo mesmo sem tipo, e o admin precisa preencher os campos ao fazer upload.')
  }

  // 2. Verificar se a tabela documento_tipos existe e tem dados
  const resT = await fetch(
    `${SUPABASE_URL}/rest/v1/documento_tipos?select=id,nome,ativo&order=id`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  )
  const tipos = await resT.json()
  console.log('\n=== TIPOS CADASTRADOS ===')
  if (Array.isArray(tipos) && tipos.length > 0) {
    tipos.forEach(t => console.log(`  [${t.id}] ${t.nome} (ativo: ${t.ativo})`))
  } else {
    console.log('Nenhum tipo cadastrado ou tabela não existe.')
  }
}

diagnosticar().catch(console.error)
