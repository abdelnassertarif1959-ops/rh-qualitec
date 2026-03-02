/**
 * Script para debug completo do holerite do Leonardo
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function debug() {
  console.log('🔍 DEBUG COMPLETO - Holerite Leonardo\n')
  console.log('=' .repeat(80))
  
  try {
    // 1. Buscar holerite completo
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
    
    console.log('\n📄 DADOS COMPLETOS DO HOLERITE')
    console.log('-'.repeat(80))
    console.log(JSON.stringify(holerite, null, 2))
    
    console.log('\n💰 ANÁLISE DOS DESCONTOS')
    console.log('-'.repeat(80))
    console.log(`INSS: R$ ${(holerite.inss || 0).toFixed(2)}`)
    console.log(`IRRF: R$ ${(holerite.irrf || 0).toFixed(2)}`)
    console.log(`Vale Transporte: R$ ${(holerite.vale_transporte || 0).toFixed(2)}`)
    console.log(`Cesta Básica: R$ ${(holerite.cesta_basica || 0).toFixed(2)}`)
    console.log(`Pensão Alimentícia (campo): R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`Adiantamento: R$ ${(holerite.adiantamento || 0).toFixed(2)}`)
    
    console.log('\n📋 DESCONTOS PERSONALIZADOS (JSON)')
    console.log('-'.repeat(80))
    if (holerite.descontos_personalizados) {
      console.log(JSON.stringify(holerite.descontos_personalizados, null, 2))
    } else {
      console.log('Nenhum desconto personalizado no JSON')
    }
    
    console.log('\n📊 BENEFÍCIOS (JSON)')
    console.log('-'.repeat(80))
    if (holerite.beneficios) {
      console.log(JSON.stringify(holerite.beneficios, null, 2))
    } else {
      console.log('Nenhum benefício no JSON')
    }
    
    // Calcular total manualmente
    let totalCalculado = 0
    totalCalculado += (holerite.inss || 0)
    totalCalculado += (holerite.irrf || 0)
    totalCalculado += (holerite.vale_transporte || 0)
    totalCalculado += (holerite.cesta_basica || 0)
    totalCalculado += (holerite.pensao_alimenticia || 0)
    totalCalculado += (holerite.adiantamento || 0)
    
    // Adicionar descontos dos benefícios
    if (holerite.beneficios && Array.isArray(holerite.beneficios)) {
      holerite.beneficios.forEach(b => {
        if (b.desconto) {
          totalCalculado += b.desconto
        }
      })
    }
    
    // Adicionar descontos personalizados
    if (holerite.descontos_personalizados && Array.isArray(holerite.descontos_personalizados)) {
      holerite.descontos_personalizados.forEach(d => {
        totalCalculado += (d.valor || 0)
      })
    }
    
    console.log('\n🧮 CÁLCULO MANUAL')
    console.log('-'.repeat(80))
    console.log(`Total Calculado: R$ ${totalCalculado.toFixed(2)}`)
    console.log(`Total no Banco: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
    console.log(`Diferença: R$ ${Math.abs(totalCalculado - (holerite.total_descontos || 0)).toFixed(2)}`)
    
    const salarioLiquidoCalculado = (holerite.total_proventos || 0) - totalCalculado
    console.log(`\nSalário Líquido Calculado: R$ ${salarioLiquidoCalculado.toFixed(2)}`)
    console.log(`Salário Líquido no Banco: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

debug()
