// Script para verificar colunas da tabela holerites
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verificarColunas() {
  console.log('🔍 Verificando colunas da tabela holerites...\n')
  
  // Buscar um registro para ver as colunas
  const { data, error } = await supabase
    .from('holerites')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Erro:', error)
    return
  }
  
  if (data && data.length > 0) {
    const colunas = Object.keys(data[0])
    console.log('✅ Colunas encontradas:', colunas.length)
    console.log('\n📋 Lista de colunas:')
    colunas.forEach((col, i) => {
      console.log(`  ${i + 1}. ${col}`)
    })
  } else {
    console.log('⚠️ Nenhum registro encontrado na tabela')
  }
}

verificarColunas()
