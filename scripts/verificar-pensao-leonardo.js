/**
 * Script para verificar a pensão alimentícia do Leonardo no banco
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function verificarPensao() {
  console.log('🔍 Verificando pensão alimentícia do Leonardo...\n')
  
  try {
    // Buscar funcionário Leonardo
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?id=eq.156&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    
    const funcionarios = await resp.json()
    if (!funcionarios || funcionarios.length === 0) {
      console.error('❌ Funcionário não encontrado!')
      return
    }
    
    const func = funcionarios[0]
    console.log(`👤 Funcionário: ${func.nome_completo}`)
    console.log(`📋 ID: ${func.id}`)
    console.log(`💰 Salário Base: R$ ${(func.salario_base || 0).toFixed(2)}`)
    console.log(`👨‍👩‍👧‍👦 Dependentes: ${func.numero_dependentes || 0}`)
    console.log(`💸 Pensão Alimentícia: R$ ${(func.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`📝 Descontos Personalizados:`, func.descontos_personalizados || [])
    
    if (!func.pensao_alimenticia || func.pensao_alimenticia === 0) {
      console.log('\n⚠️  PENSÃO ALIMENTÍCIA ESTÁ ZERADA NO BANCO!')
      console.log('📝 Você precisa editar o funcionário e salvar a pensão alimentícia.')
    } else {
      console.log('\n✅ Pensão alimentícia está cadastrada no banco!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarPensao()
