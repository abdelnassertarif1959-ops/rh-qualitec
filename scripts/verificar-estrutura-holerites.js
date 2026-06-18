import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarEstrutura() {
  console.log('🔍 Buscando um holerite de exemplo...\n')

  const { data: holerites, error } = await supabase
    .from('holerites')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Erro:', error)
    return
  }

  if (holerites && holerites.length > 0) {
    console.log('📋 Colunas disponíveis:')
    console.log(Object.keys(holerites[0]).join(', '))
    console.log('\n📊 Exemplo de holerite:')
    console.log(JSON.stringify(holerites[0], null, 2))
  }
}

verificarEstrutura()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
