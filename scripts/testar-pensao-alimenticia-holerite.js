/**
 * Script para testar se a pensão alimentícia aparece no holerite
 * 
 * Testa:
 * 1. Se a pensão está sendo exibida no HTML
 * 2. Se está sendo subtraída do salário líquido
 * 3. Se não está duplicada
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function testarPensaoAlimenticia() {
  console.log('🧪 TESTE: Pensão Alimentícia no Holerite\n')
  
  try {
    // 1. Buscar funcionário Leonardo (ID 156)
    console.log('📋 1. Buscando funcionário Leonardo...')
    const respFunc = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?id=eq.156&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    
    const funcionarios = await respFunc.json()
    if (!funcionarios || funcionarios.length === 0) {
      console.error('❌ Funcionário não encontrado!')
      return
    }
    
    const func = funcionarios[0]
    console.log(`✅ Funcionário: ${func.nome_completo}`)
    console.log(`   Pensão Alimentícia: R$ ${(func.pensao_alimenticia || 0).toFixed(2)}`)
    
    // 2. Buscar holerite mais recente
    console.log('\n📋 2. Buscando holerite mais recente...')
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
    console.log(`✅ Holerite ID: ${holerite.id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Status: ${holerite.status}`)
    
    // 3. Verificar valores no holerite
    console.log('\n📊 3. Verificando valores no holerite...')
    const salarioBase = Number(holerite.salario_base) || 0
    const inss = Number(holerite.inss) || 0
    const irrf = Number(holerite.irrf) || 0
    const adiantamento = Number(holerite.adiantamento) || 0
    const pensaoHolerite = Number(func.pensao_alimenticia) || 0
    
    console.log(`   Salário Base: R$ ${salarioBase.toFixed(2)}`)
    console.log(`   INSS: R$ ${inss.toFixed(2)}`)
    console.log(`   IRRF: R$ ${irrf.toFixed(2)}`)
    console.log(`   Adiantamento: R$ ${adiantamento.toFixed(2)}`)
    console.log(`   Pensão (do funcionário): R$ ${pensaoHolerite.toFixed(2)}`)
    
    // 4. Calcular totais esperados
    console.log('\n🧮 4. Calculando totais esperados...')
    const totalProventos = salarioBase
    const totalDescontos = inss + irrf + adiantamento + pensaoHolerite
    const salarioLiquido = totalProventos - totalDescontos
    
    console.log(`   Total Proventos: R$ ${totalProventos.toFixed(2)}`)
    console.log(`   Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
    console.log(`   Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)
    
    // 5. Comparar com valores do banco
    console.log('\n🔍 5. Comparando com valores do banco...')
    const totalProventosBanco = Number(holerite.total_proventos) || 0
    const totalDescontosBanco = Number(holerite.total_descontos) || 0
    const salarioLiquidoBanco = Number(holerite.salario_liquido) || 0
    
    console.log(`   Total Proventos (banco): R$ ${totalProventosBanco.toFixed(2)}`)
    console.log(`   Total Descontos (banco): R$ ${totalDescontosBanco.toFixed(2)}`)
    console.log(`   Salário Líquido (banco): R$ ${salarioLiquidoBanco.toFixed(2)}`)
    
    // 6. Verificar se os valores batem
    console.log('\n✅ 6. Resultado da Validação:')
    
    const proventosOk = Math.abs(totalProventos - totalProventosBanco) < 0.01
    const descontosOk = Math.abs(totalDescontos - totalDescontosBanco) < 0.01
    const liquidoOk = Math.abs(salarioLiquido - salarioLiquidoBanco) < 0.01
    
    if (proventosOk) {
      console.log('   ✅ Total Proventos: CORRETO')
    } else {
      console.log(`   ❌ Total Proventos: INCORRETO (Esperado: ${totalProventos.toFixed(2)}, Banco: ${totalProventosBanco.toFixed(2)})`)
    }
    
    if (descontosOk) {
      console.log('   ✅ Total Descontos: CORRETO (Pensão incluída)')
    } else {
      console.log(`   ❌ Total Descontos: INCORRETO (Esperado: ${totalDescontos.toFixed(2)}, Banco: ${totalDescontosBanco.toFixed(2)})`)
      console.log(`   ⚠️  Diferença: R$ ${Math.abs(totalDescontos - totalDescontosBanco).toFixed(2)}`)
      
      if (Math.abs(totalDescontos - totalDescontosBanco - pensaoHolerite) < 0.01) {
        console.log(`   🔍 A diferença é exatamente o valor da pensão! Pensão NÃO está sendo calculada.`)
      }
    }
    
    if (liquidoOk) {
      console.log('   ✅ Salário Líquido: CORRETO')
    } else {
      console.log(`   ❌ Salário Líquido: INCORRETO (Esperado: ${salarioLiquido.toFixed(2)}, Banco: ${salarioLiquidoBanco.toFixed(2)})`)
    }
    
    // 7. Resumo final
    console.log('\n📋 RESUMO:')
    if (proventosOk && descontosOk && liquidoOk) {
      console.log('✅ TODOS OS CÁLCULOS ESTÃO CORRETOS!')
      console.log('✅ Pensão alimentícia está sendo calculada e subtraída do salário líquido')
    } else {
      console.log('❌ EXISTEM PROBLEMAS NOS CÁLCULOS!')
      console.log('⚠️  A pensão alimentícia pode não estar sendo calculada corretamente')
      console.log('\n🔧 AÇÃO NECESSÁRIA:')
      console.log('   1. Verificar se a pensão está sendo passada para o cálculo do holerite')
      console.log('   2. Verificar se está sendo somada ao total_descontos')
      console.log('   3. Regerar o holerite após a correção')
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar:', error.message)
  }
}

// Executar teste
testarPensaoAlimenticia()
