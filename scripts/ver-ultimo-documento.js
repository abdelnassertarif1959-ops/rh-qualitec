// Ver último documento inserido
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function ver() {
  const { data } = await supabase
    .from('funcionario_documentos')
    .select('id, nome_original, criado_em, data_referencia')
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  console.log('\n📄 Último documento inserido:')
  console.log(`Nome: ${data.nome_original}`)
  console.log(`Criado: ${new Date(data.criado_em).toLocaleString('pt-BR')}`)
  console.log(`Data Ref: ${data.data_referencia || '(NULL)'}`)
  
  if (data.data_referencia) {
    const dataRef = new Date(data.data_referencia + 'T00:00:00')
    const dataCriacao = new Date(data.criado_em)
    console.log(`\nData Ref formatada: ${dataRef.toLocaleDateString('pt-BR')}`)
    console.log(`Data Criação formatada: ${dataCriacao.toLocaleDateString('pt-BR')}`)
    console.log(`\n${dataRef.toLocaleDateString('pt-BR') === dataCriacao.toLocaleDateString('pt-BR') ? '⚠️ MESMA DATA' : '✅ DATAS DIFERENTES'}`)
  }
}

ver().catch(console.error)
