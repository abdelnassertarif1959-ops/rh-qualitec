/**
 * Script para encontrar onde estão os R$ 962,00 da pensão
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function encontrar() {
  console.log('🔍 PROCURANDO OS R$ 962,00 DA PENSÃO\n')
  console.log('=' .repeat(80))
  
  try {
    // Buscar holerite
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
    
    console.log('\n🔎 PROCURANDO CAMPOS COM VALOR 962')
    console.log('-'.repeat(80))
    
    // Verificar todos os campos do holerite
    for (const [key, value] of Object.entries(holerite)) {
      if (typeof value === 'number' && Math.abs(value - 962) < 0.01) {
        console.log(`✅ ENCONTRADO! Campo: ${key} = R$ ${value.toFixed(2)}`)
      }
    }
    
    console.log('\n🔎 VERIFICANDO CAMPOS DE DESCONTO')
    console.log('-'.repeat(80))
    
    const camposDesconto = [
      'inss', 'irrf', 'vale_transporte', 'cesta_basica', 'cesta_basica_desconto',
      'plano_saude', 'plano_odontologico', 'adiantamento', 'faltas', 
      'outros_descontos', 'pensao_alimenticia'
    ]
    
    let totalDescontos = 0
    camposDesconto.forEach(campo => {
      const valor = holerite[campo] || 0
      if (valor > 0) {
        console.log(`${campo}: R$ ${valor.toFixed(2)}`)
        totalDescontos += valor
      }
    })
    
    console.log(`\nTotal dos campos de desconto: R$ ${totalDescontos.toFixed(2)}`)
    console.log(`Total no banco: R$ ${holerite.total_descontos.toFixed(2)}`)
    console.log(`Diferença (pensão escondida): R$ ${(holerite.total_descontos - totalDescontos).toFixed(2)}`)
    
    // Verificar se há um campo pensao_alimenticia que não está sendo exibido
    console.log('\n🔎 VERIFICANDO CAMPO PENSAO_ALIMENTICIA')
    console.log('-'.repeat(80))
    console.log(`Valor: R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
    
    if (!holerite.pensao_alimenticia || holerite.pensao_alimenticia === 0) {
      console.log('\n⚠️  O campo pensao_alimenticia está zerado!')
      console.log('Mas o total_descontos inclui R$ 962,00 a mais.')
      console.log('\n💡 POSSIBILIDADES:')
      console.log('1. O valor está em outro campo não listado')
      console.log('2. O total_descontos foi calculado incluindo a pensão, mas o campo foi zerado depois')
      console.log('3. Há um campo JSON ou array que contém esse valor')
    }
    
    // Verificar se há itens personalizados ativos
    console.log('\n🔎 VERIFICANDO ITENS PERSONALIZADOS ATIVOS')
    console.log('-'.repeat(80))
    
    const itensResp = await fetch(
      `${SUPABASE_URL}/rest/v1/itens_personalizados_holerite?funcionario_id=eq.156&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const itens = await itensResp.json()
    
    if (itens && itens.length > 0) {
      console.log(`Encontrados ${itens.length} itens personalizados:`)
      itens.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.descricao}`)
        console.log(`   Tipo: ${item.tipo}`)
        console.log(`   Valor: R$ ${(item.valor || 0).toFixed(2)}`)
        console.log(`   Vigência: ${item.data_inicio} até ${item.data_fim || 'indeterminado'}`)
        console.log(`   Recorrente: ${item.recorrente ? 'Sim' : 'Não'}`)
        
        // Verificar se está vigente no período do holerite
        const periodoInicio = new Date(holerite.periodo_inicio)
        const periodoFim = new Date(holerite.periodo_fim)
        const dataInicio = new Date(item.data_inicio)
        const dataFim = item.data_fim ? new Date(item.data_fim) : null
        
        const vigente = dataInicio <= periodoFim && (!dataFim || dataFim >= periodoInicio)
        console.log(`   Vigente no período: ${vigente ? 'SIM' : 'NÃO'}`)
        
        if (vigente && Math.abs(item.valor - 962) < 0.01) {
          console.log(`   ⚠️  ESTE ITEM TEM O VALOR DA PENSÃO!`)
        }
      })
    } else {
      console.log('Nenhum item personalizado encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

encontrar()
