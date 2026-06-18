// Script para verificar CPF duplicado
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarCPF() {
  console.log('🔍 Verificando CPF 43396431218...\n')

  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, cpf, email_login, created_at')
      .eq('cpf', '43396431218')

    if (error) {
      console.error('❌ Erro ao buscar:', error)
      return
    }

    if (!data || data.length === 0) {
      console.log('✅ CPF não encontrado no banco')
      return
    }

    console.log(`📊 Encontrados ${data.length} registro(s) com este CPF:\n`)
    
    data.forEach((func, index) => {
      console.log(`${index + 1}. ID: ${func.id}`)
      console.log(`   Nome: ${func.nome_completo}`)
      console.log(`   CPF: ${func.cpf}`)
      console.log(`   Email: ${func.email_login}`)
      console.log(`   Criado em: ${func.created_at}`)
      console.log('')
    })

    // Verificar também o Umberto
    console.log('🔍 Verificando CPF do Umberto (12345678901)...\n')
    
    const { data: umberto, error: erroUmberto } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, cpf, email_login, created_at')
      .eq('cpf', '12345678901')

    if (erroUmberto) {
      console.error('❌ Erro ao buscar Umberto:', erroUmberto)
      return
    }

    if (!umberto || umberto.length === 0) {
      console.log('✅ CPF do Umberto não encontrado (pode cadastrar)')
      return
    }

    console.log(`📊 Encontrados ${umberto.length} registro(s) do Umberto:\n`)
    
    umberto.forEach((func, index) => {
      console.log(`${index + 1}. ID: ${func.id}`)
      console.log(`   Nome: ${func.nome_completo}`)
      console.log(`   CPF: ${func.cpf}`)
      console.log(`   Email: ${func.email_login}`)
      console.log(`   Criado em: ${func.created_at}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarCPF()
