import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verificar() {
  console.log('🔍 Buscando holerite do Samuel...\n')
  
  // Buscar funcionário Samuel
  const { data: funcionario, error: errFunc } = await supabase
    .from('funcionarios')
    .select('id, nome_completo')
    .ilike('nome_completo', '%samuel%')
    .single()
  
  if (errFunc) {
    console.error('❌ Erro ao buscar funcionário:', errFunc)
    return
  }
  
  console.log('✅ Funcionário:', funcionario.nome_completo)
  console.log('   ID:', funcionario.id)
  
  // Buscar holerite mais recente
  const { data: holerite, error: errHol } = await supabase
    .from('holerites')
    .select('*')
    .eq('funcionario_id', funcionario.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (errHol) {
    console.error('❌ Erro ao buscar holerite:', errHol)
    return
  }
  
  console.log('\n📄 Holerite encontrado:')
  console.log('   ID:', holerite.id)
  console.log('   periodo_inicio:', holerite.periodo_inicio)
  console.log('   periodo_fim:', holerite.periodo_fim)
  console.log('   competencia:', holerite.competencia)
  console.log('   mes_referencia:', holerite.mes_referencia)
  console.log('   tipo:', holerite.tipo)
  
  // Calcular o que deveria aparecer no email
  const periodoInicio = new Date(holerite.periodo_inicio + 'T00:00:00')
  const ano = periodoInicio.getFullYear()
  const mes = periodoInicio.getMonth() // 0-11
  
  console.log('\n🔍 Análise:')
  console.log('   Data periodo_inicio:', periodoInicio.toLocaleDateString('pt-BR'))
  console.log('   Mês extraído (0-11):', mes)
  console.log('   Ano:', ano)
  
  // Mês de referência (mês trabalhado = mês anterior ao pagamento)
  const mesReferencia = new Date(ano, mes - 1, 1)
  const mesReferenciaStr = mesReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  console.log('\n✅ O que DEVERIA aparecer no email:')
  console.log('   Referência:', mesReferenciaStr)
  console.log('   Período: 01/01/2026 a 31/01/2026')
  
  // O que está aparecendo atualmente
  const mesAtual = new Date(ano, mes, 1)
  const mesAtualStr = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  console.log('\n❌ O que está aparecendo ERRADO:')
  console.log('   Referência:', mesAtualStr)
  console.log('   Período: 01/02/2026 a 28/02/2026')
}

verificar()
