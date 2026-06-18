import bcrypt from 'bcryptjs'

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json'
}

async function main() {
  // Buscar todos com senha em texto puro (não começa com $2b$)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?select=id,nome_completo,senha,senha_hash&status=eq.ativo`, { headers })
  const lista = await res.json()

  let corrigidos = 0
  for (const func of lista) {
    const senhaTexto = func.senha
    const hashAtual = func.senha_hash || ''

    // Pular se já tem hash bcrypt válido E a senha em texto bate com o hash
    if (hashAtual.startsWith('$2b$') || hashAtual.startsWith('$2a$')) {
      const bate = senhaTexto ? await bcrypt.compare(senhaTexto, hashAtual) : false
      if (bate) continue // já está correto
    }

    // Precisa atualizar: usar a senha em texto puro para gerar novo hash
    if (!senhaTexto) {
      console.log(`⚠️  ${func.nome_completo} (id: ${func.id}) — sem senha em texto, pulando`)
      continue
    }

    const novoHash = await bcrypt.hash(senhaTexto, 12)
    const upd = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?id=eq.${func.id}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ senha_hash: novoHash })
    })

    if (upd.ok) {
      console.log(`✅ ${func.nome_completo} (id: ${func.id}) — hash atualizado para senha: "${senhaTexto}"`)
      corrigidos++
    } else {
      console.log(`❌ Erro ao atualizar ${func.nome_completo}:`, await upd.text())
    }
  }

  console.log(`\nConcluído! ${corrigidos} funcionários corrigidos de ${lista.length} total.`)
}

main().catch(console.error)
