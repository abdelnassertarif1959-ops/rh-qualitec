/**
 * Script para corrigir o total de descontos do Leonardo
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function corrigir() {
  console.log('🔧 CORRIGINDO TOTAL DE DESCONTOS - Leonardo\n')
  console.log('=' .repeat(80))
  
  try {
    // 1. Buscar holerite
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
    const holerite = holerites[0]
    
    console.log('\n📄 VALORES ATUAIS')
    console.log('-'.repeat(80))
    console.log(`Total Proventos: R$ ${holerite.total_proventos.toFixed(2)}`)
    console.log(`Total Descontos (ERRADO): R$ ${holerite.total_descontos.toFixed(2)}`)
    console.log(`Salário Líquido (ERRADO): R$ ${holerite.salario_liquido.toFixed(2)}`)
    
    // 2. Calcular total correto
    let totalDescontosCorreto = 0
    
    // Descontos fixos
    totalDescontosCorreto += (holerite.inss || 0)
    totalDescontosCorreto += (holerite.irrf || 0)
    totalDescontosCorreto += (holerite.vale_transporte || 0)
    totalDescontosCorreto += (holerite.cesta_basica || 0)
    totalDescontosCorreto += (holerite.cesta_basica_desconto || 0)
    totalDescontosCorreto += (holerite.plano_saude || 0)
    totalDescontosCorreto += (holerite.plano_odontologico || 0)
    totalDescontosCorreto += (holerite.adiantamento || 0)
    totalDescontosCorreto += (holerite.faltas || 0)
    totalDescontosCorreto += (holerite.outros_descontos || 0)
    totalDescontosCorreto += (holerite.pensao_alimenticia || 0)
    
    // Descontos de benefícios
    if (holerite.beneficios && Array.isArray(holerite.beneficios)) {
      holerite.beneficios.forEach(b => {
        if (b.desconto) {
          totalDescontosCorreto += b.desconto
        }
      })
    }
    
    // Descontos personalizados
    if (holerite.descontos_personalizados && Array.isArray(holerite.descontos_personalizados)) {
      holerite.descontos_personalizados.forEach(d => {
        totalDescontosCorreto += (d.valor || 0)
      })
    }
    
    const salarioLiquidoCorreto = holerite.total_proventos - totalDescontosCorreto
    
    console.log('\n✅ VALORES CORRETOS')
    console.log('-'.repeat(80))
    console.log(`Total Descontos (CORRETO): R$ ${totalDescontosCorreto.toFixed(2)}`)
    console.log(`Salário Líquido (CORRETO): R$ ${salarioLiquidoCorreto.toFixed(2)}`)
    
    console.log('\n📊 DIFERENÇA')
    console.log('-'.repeat(80))
    console.log(`Descontos: R$ ${(holerite.total_descontos - totalDescontosCorreto).toFixed(2)} a menos`)
    console.log(`Líquido: R$ ${(salarioLiquidoCorreto - holerite.salario_liquido).toFixed(2)} a mais`)
    
    // 3. Atualizar no banco
    console.log('\n🔄 ATUALIZANDO NO BANCO...')
    console.log('-'.repeat(80))
    
    const updateResp = await fetch(
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
          total_descontos: totalDescontosCorreto,
          salario_liquido: salarioLiquidoCorreto,
          updated_at: new Date().toISOString()
        })
      }
    )
    
    if (updateResp.ok) {
      const updated = await updateResp.json()
      console.log('✅ Holerite atualizado com sucesso!')
      console.log('\n📄 VALORES FINAIS')
      console.log('-'.repeat(80))
      console.log(`Total Proventos: R$ ${updated[0].total_proventos.toFixed(2)}`)
      console.log(`Total Descontos: R$ ${updated[0].total_descontos.toFixed(2)}`)
      console.log(`Salário Líquido: R$ ${updated[0].salario_liquido.toFixed(2)}`)
    } else {
      console.error('❌ Erro ao atualizar:', await updateResp.text())
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

corrigir()
