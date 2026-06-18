/**
 * Script para atualizar os valores do holerite do Leonardo no banco
 * Inclui os itens personalizados no cálculo
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function atualizarHolerite() {
  console.log('🔧 Atualizando valores do holerite do Leonardo...\n')
  
  try {
    // 1. Buscar holerite mais recente do Leonardo
    const respHolerite = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.156&order=created_at.desc&limit=1&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const holerites = await respHolerite.json()
    if (!holerites || holerites.length === 0) {
      console.error('❌ Nenhum holerite encontrado!')
      return
    }
    
    const holerite = holerites[0]
    console.log(`📋 Holerite ID: ${holerite.id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    
    // 2. Buscar itens personalizados
    const respItens = await fetch(
      `${SUPABASE_URL}/rest/v1/holerite_itens_personalizados?funcionario_id=eq.156&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const itens = await respItens.json()
    console.log(`\n📋 Itens personalizados encontrados: ${itens.length}`)
    
    // Filtrar itens vigentes
    const periodoInicio = new Date(holerite.periodo_inicio)
    const periodoFim = new Date(holerite.periodo_fim)
    
    const itensVigentes = itens.filter(item => {
      const dataInicio = new Date(item.data_inicio)
      const dataFim = item.data_fim ? new Date(item.data_fim) : null
      
      return dataInicio <= periodoFim && (!dataFim || dataFim >= periodoInicio)
    })
    
    console.log(`   Itens vigentes no período: ${itensVigentes.length}`)
    
    // Separar descontos
    const descontos = itensVigentes.filter(item => item.tipo === 'desconto')
    console.log(`   Descontos: ${descontos.length}`)
    
    // Calcular total de descontos personalizados
    let totalDescontosPersonalizados = 0
    descontos.forEach(d => {
      console.log(`   - ${d.descricao}: R$ ${d.valor.toFixed(2)}`)
      totalDescontosPersonalizados += Number(d.valor)
    })
    
    // 3. Calcular novos totais
    const totalProventos = Number(holerite.total_proventos) || 0
    const descontosBase = Number(holerite.inss || 0) + Number(holerite.irrf || 0) + Number(holerite.adiantamento || 0)
    const totalDescontos = descontosBase + totalDescontosPersonalizados
    const salarioLiquido = totalProventos - totalDescontos
    
    console.log(`\n💰 CÁLCULO:`)
    console.log(`   Total Proventos: R$ ${totalProventos.toFixed(2)}`)
    console.log(`   Descontos Base: R$ ${descontosBase.toFixed(2)}`)
    console.log(`   Descontos Personalizados: R$ ${totalDescontosPersonalizados.toFixed(2)}`)
    console.log(`   Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
    console.log(`   Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)
    
    // 4. Atualizar no banco
    console.log(`\n🔄 Atualizando no banco...`)
    
    const respUpdate = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?id=eq.${holerite.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          total_descontos: totalDescontos,
          salario_liquido: salarioLiquido
        })
      }
    )
    
    if (!respUpdate.ok) {
      const error = await respUpdate.text()
      console.error('❌ Erro ao atualizar:', error)
      return
    }
    
    console.log(`\n✅ HOLERITE ATUALIZADO COM SUCESSO!`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos} → R$ ${totalDescontos.toFixed(2)}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido} → R$ ${salarioLiquido.toFixed(2)}`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

atualizarHolerite()
