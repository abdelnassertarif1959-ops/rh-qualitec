/**
 * Script para diagnosticar o cálculo do holerite do Leonardo
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO COMPLETO - Holerite Leonardo\n')
  console.log('=' .repeat(80))
  
  try {
    // 1. Buscar holerite do Leonardo (ID 156)
    const holeriteResp = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.156&order=created_at.desc&limit=1&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const holerites = await holeriteResp.json()
    if (!holerites || holerites.length === 0) {
      console.error('❌ Holerite não encontrado!')
      return
    }
    
    const holerite = holerites[0]
    
    console.log('\n📄 DADOS DO HOLERITE NO BANCO')
    console.log('-'.repeat(80))
    console.log(`ID: ${holerite.id}`)
    console.log(`Funcionário ID: ${holerite.funcionario_id}`)
    console.log(`Competência: ${holerite.competencia}`)
    console.log(`Tipo: ${holerite.tipo}`)
    console.log(`Status: ${holerite.status}`)
    
    console.log('\n💰 VALORES ARMAZENADOS NO BANCO')
    console.log('-'.repeat(80))
    console.log(`Total Proventos: R$ ${(holerite.total_proventos || 0).toFixed(2)}`)
    console.log(`Total Descontos: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
    console.log(`Salário Líquido: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    
    console.log('\n📊 DETALHAMENTO DOS DESCONTOS')
    console.log('-'.repeat(80))
    console.log(`INSS: R$ ${(holerite.inss || 0).toFixed(2)}`)
    console.log(`IRRF: R$ ${(holerite.irrf || 0).toFixed(2)}`)
    console.log(`FGTS: R$ ${(holerite.fgts || 0).toFixed(2)}`)
    console.log(`Vale Transporte: R$ ${(holerite.vale_transporte || 0).toFixed(2)}`)
    console.log(`Cesta Básica: R$ ${(holerite.cesta_basica || 0).toFixed(2)}`)
    console.log(`Pensão Alimentícia: R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`Adiantamento: R$ ${(holerite.adiantamento || 0).toFixed(2)}`)
    
    console.log('\n🔧 ITENS PERSONALIZADOS')
    console.log('-'.repeat(80))
    if (holerite.itens_personalizados && holerite.itens_personalizados.length > 0) {
      holerite.itens_personalizados.forEach((item, index) => {
        console.log(`${index + 1}. ${item.descricao}: R$ ${(item.valor || 0).toFixed(2)} (${item.tipo})`)
      })
    } else {
      console.log('Nenhum item personalizado')
    }
    
    // 2. Calcular manualmente o que deveria ser
    console.log('\n🧮 CÁLCULO MANUAL ESPERADO')
    console.log('-'.repeat(80))
    
    const totalProventos = holerite.total_proventos || 0
    console.log(`Total Proventos: R$ ${totalProventos.toFixed(2)}`)
    
    // Somar todos os descontos
    let totalDescontosCalculado = 0
    totalDescontosCalculado += (holerite.inss || 0)
    totalDescontosCalculado += (holerite.irrf || 0)
    totalDescontosCalculado += (holerite.vale_transporte || 0)
    totalDescontosCalculado += (holerite.cesta_basica || 0)
    totalDescontosCalculado += (holerite.pensao_alimenticia || 0)
    totalDescontosCalculado += (holerite.adiantamento || 0)
    
    // Adicionar itens personalizados de desconto
    if (holerite.itens_personalizados && holerite.itens_personalizados.length > 0) {
      holerite.itens_personalizados.forEach(item => {
        if (item.tipo === 'desconto') {
          totalDescontosCalculado += (item.valor || 0)
          console.log(`  + ${item.descricao}: R$ ${(item.valor || 0).toFixed(2)}`)
        }
      })
    }
    
    console.log(`\nTotal Descontos Calculado: R$ ${totalDescontosCalculado.toFixed(2)}`)
    console.log(`Total Descontos no Banco: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
    
    const salarioLiquidoCalculado = totalProventos - totalDescontosCalculado
    console.log(`\nSalário Líquido Calculado: R$ ${salarioLiquidoCalculado.toFixed(2)}`)
    console.log(`Salário Líquido no Banco: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    
    // 3. Verificar diferenças
    console.log('\n⚠️  ANÁLISE DE DIFERENÇAS')
    console.log('-'.repeat(80))
    
    const difDescontos = Math.abs(totalDescontosCalculado - (holerite.total_descontos || 0))
    const difLiquido = Math.abs(salarioLiquidoCalculado - (holerite.salario_liquido || 0))
    
    if (difDescontos > 0.01) {
      console.log(`❌ DIFERENÇA nos descontos: R$ ${difDescontos.toFixed(2)}`)
    } else {
      console.log('✅ Total de descontos está correto')
    }
    
    if (difLiquido > 0.01) {
      console.log(`❌ DIFERENÇA no salário líquido: R$ ${difLiquido.toFixed(2)}`)
    } else {
      console.log('✅ Salário líquido está correto')
    }
    
    // 4. Verificar se o valor esperado é 813.42
    console.log('\n🎯 COMPARAÇÃO COM VALOR ESPERADO')
    console.log('-'.repeat(80))
    const valorEsperado = 813.42
    console.log(`Valor Esperado: R$ ${valorEsperado.toFixed(2)}`)
    console.log(`Valor no Banco: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    console.log(`Diferença: R$ ${Math.abs(valorEsperado - (holerite.salario_liquido || 0)).toFixed(2)}`)
    
    if (Math.abs(valorEsperado - (holerite.salario_liquido || 0)) > 0.01) {
      console.log('\n❌ O VALOR NO BANCO ESTÁ DIFERENTE DO ESPERADO!')
      console.log('\n🔍 POSSÍVEIS CAUSAS:')
      console.log('1. Itens personalizados duplicados ou incorretos')
      console.log('2. Pensão alimentícia sendo contada duas vezes')
      console.log('3. Adiantamento sendo contado duas vezes')
      console.log('4. Cálculo do total_descontos está incorreto')
    } else {
      console.log('\n✅ O valor no banco está correto!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

diagnosticar()
