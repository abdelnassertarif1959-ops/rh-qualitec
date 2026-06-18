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

async function verificarDatas() {
  console.log('🔍 Verificando datas dos holerites...\n')

  const { data: holerites, error } = await supabase
    .from('holerites')
    .select(`
      id,
      periodo_inicio,
      periodo_fim,
      salario_base,
      adiantamento,
      observacoes,
      funcionarios (
        nome_completo
      )
    `)
    .order('periodo_inicio', { ascending: false })
  
  if (error) {
    console.error('❌ Erro:', error)
    return
  }

  console.log(`📊 Total: ${holerites.length} holerites\n`)
  console.log('='.repeat(100))

  holerites.forEach((h, index) => {
    const dataInicio = new Date(h.periodo_inicio)
    const diaInicio = dataInicio.getDate()
    
    let tipo = 'OUTRO'
    if (diaInicio === 1) tipo = 'MENSAL'
    else if (diaInicio === 15) tipo = 'ADIANTAMENTO'
    
    console.log(`\n${index + 1}. ID: ${h.id} | ${tipo}`)
    console.log(`   👤 ${h.funcionarios?.nome_completo || 'N/A'}`)
    console.log(`   📅 Início: ${h.periodo_inicio} (dia ${diaInicio})`)
    console.log(`   📅 Fim: ${h.periodo_fim}`)
    console.log(`   💰 Salário Base: R$ ${(h.salario_base || 0).toFixed(2)}`)
    console.log(`   💸 Adiantamento: R$ ${(h.adiantamento || 0).toFixed(2)}`)
    console.log(`   📝 Obs: ${h.observacoes || 'N/A'}`)
  })

  console.log('\n' + '='.repeat(100))
  
  const porDia = {}
  holerites.forEach(h => {
    const dia = new Date(h.periodo_inicio).getDate()
    porDia[dia] = (porDia[dia] || 0) + 1
  })
  
  console.log('\n📊 DISTRIBUIÇÃO POR DIA DE INÍCIO:')
  Object.keys(porDia).sort((a, b) => a - b).forEach(dia => {
    console.log(`   Dia ${dia}: ${porDia[dia]} holerites`)
  })
}

verificarDatas()
  .then(() => {
    console.log('\n✅ Verificação concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })
