import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO: Itens Personalizados vs Holerites\n')

  // 1. Buscar todos os itens personalizados
  const { data: itens } = await supabase
    .from('holerite_itens_personalizados')
    .select('*')
    .order('created_at', { ascending: false })

  console.log(`📋 Total de itens personalizados: ${itens?.length || 0}`)
  itens?.forEach(i => {
    console.log(`  [${i.id}] ${i.tipo.toUpperCase()} | ${i.descricao} | R$ ${i.valor} | func_id=${i.funcionario_id} | vigencia=${i.vigencia_tipo} | inicio=${i.data_inicio} | fim=${i.data_fim || 'null'} | ativo=${i.ativo}`)
  })

  // 2. Buscar holerites recentes
  const { data: holerites } = await supabase
    .from('holerites')
    .select('id, funcionario_id, periodo_inicio, periodo_fim, total_proventos, total_descontos, salario_liquido, beneficios, descontos_personalizados, tipo')
    .order('criado_em', { ascending: false })
    .limit(5)

  console.log(`\n📄 Últimos 5 holerites:`)
  holerites?.forEach(h => {
    console.log(`\n  [${h.id}] func_id=${h.funcionario_id} | tipo=${h.tipo}`)
    console.log(`    Período: ${h.periodo_inicio} → ${h.periodo_fim}`)
    console.log(`    Proventos: R$ ${h.total_proventos} | Descontos: R$ ${h.total_descontos} | Líquido: R$ ${h.salario_liquido}`)
    console.log(`    beneficios JSONB: ${JSON.stringify(h.beneficios)}`)
    console.log(`    descontos_personalizados JSONB: ${JSON.stringify(h.descontos_personalizados)}`)

    // Verificar se há itens para este funcionário no período
    const itensFunc = itens?.filter(i => i.funcionario_id === h.funcionario_id && i.ativo) || []
    if (itensFunc.length > 0) {
      console.log(`    ⚠️  Itens ativos para este funcionário:`)
      itensFunc.forEach(i => {
        const dentroDoperiodo = i.data_inicio <= h.periodo_fim && (!i.data_fim || i.data_fim >= h.periodo_inicio)
        console.log(`      → ${i.tipo} | ${i.descricao} | R$ ${i.valor} | dentro_periodo=${dentroDoperiodo}`)
      })
    }
  })
}

diagnosticar().catch(console.error)
