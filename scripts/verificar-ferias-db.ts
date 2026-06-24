import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Connecting to Supabase at:', supabaseUrl)
  
  const { data: ferias, error } = await supabase
    .from('funcionario_ferias')
    .select('*')
    .order('data_inicio', { ascending: false })

  if (error) {
    console.error('Erro ao buscar férias:', error)
    return
  }

  console.log(`Sucesso! Encontradas ${ferias.length} férias:`)
  ferias.forEach(f => {
    console.log(`- ID: ${f.id} | Funcionario ID: ${f.funcionario_id} | Periodo: ${f.data_inicio} a ${f.data_fim} | Status: ${f.status} | Holerite ID: ${f.holerite_id}`)
  })
}

run()
