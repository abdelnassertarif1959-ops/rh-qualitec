import bcrypt from 'bcryptjs'

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function main() {
  // Buscar todos os funcionários com senha no formato MIGRAR_
  const res = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?select=id,nome_completo,senha_hash&senha_hash=like.MIGRAR_*`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  })
  const lista = await res.json()
  console.log(`Encontrados ${lista.length} funcionários com senha não migrada:`)

  for (const func of lista) {
    const senhaTexto = func.senha_hash.replace('MIGRAR_', '')
    const hash = await bcrypt.hash(senhaTexto, 12)
    
    const upd = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?id=eq.${func.id}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ senha_hash: hash })
    })
    
    if (upd.ok) {
      console.log(`✅ ${func.nome_completo} (id: ${func.id}) — senha: "${senhaTexto}" → hash atualizado`)
    } else {
      console.log(`❌ Erro ao atualizar ${func.nome_completo}:`, await upd.text())
    }
  }
  console.log('Concluído!')
}

main().catch(console.error)
