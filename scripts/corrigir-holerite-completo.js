/**
 * Script para corrigir o holerite com ambos os problemas:
 * 1. Recalcular totais (incluir adiantamento nos descontos)
 * 2. Corrigir data de disponibilização (5º dia útil do mês de referência)
 */

// Função para calcular o 5º dia útil do mês
function calcular5oDiaUtil(ano, mes) {
  let diasUteis = 0
  let data = new Date(ano, mes - 1, 1) // Primeiro dia do mês
  
  while (diasUteis < 5) {
    const diaSemana = data.getDay()
    
    // Se for dia útil (segunda=1 a sexta=5)
    if (diaSemana >= 1 && diaSemana <= 5) {
      diasUteis++
    }
    
    // Se ainda não chegou no 5º dia útil, avança para o próximo dia
    if (diasUteis < 5) {
      data.setDate(data.getDate() + 1)
    }
  }
  
  return data
}

async function corrigirHoleriteCompleto() {
  console.log('🔧 [CORREÇÃO] Iniciando correção completa do holerite...')
  
  try {
    // Buscar o holerite atual
    const response = await fetch('http://localhost:3000/api/holerites/meus-holerites?funcionarioId=93')
    const holerites = await response.json()
    
    if (holerites.length === 0) {
      console.log('❌ [CORREÇÃO] Nenhum holerite encontrado')
      return
    }
    
    const holerite = holerites[0]
    console.log(`🔍 [CORREÇÃO] Analisando holerite ID ${holerite.id}:`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Data atual: ${holerite.data_pagamento}`)
    console.log(`   Total descontos atual: ${holerite.total_descontos}`)
    console.log(`   Salário líquido atual: ${holerite.salario_liquido}`)
    console.log(`   Adiantamento: ${holerite.adiantamento}`)
    
    // CORREÇÃO 1: Recalcular totais
    const totalProventos = holerite.total_proventos || holerite.salario_base || 0
    const totalDescontos = (holerite.inss || 0) + 
                          (holerite.irrf || 0) + 
                          (holerite.vale_transporte || 0) + 
                          (holerite.cesta_basica_desconto || 0) + 
                          (holerite.plano_saude || 0) + 
                          (holerite.plano_odontologico || 0) + 
                          (holerite.adiantamento || 0) + 
                          (holerite.faltas || 0) + 
                          (holerite.outros_descontos || 0)
    
    const salarioLiquido = totalProventos - totalDescontos
    
    console.log(`\n📊 [CORREÇÃO] Novos cálculos:`)
    console.log(`   Total proventos: ${totalProventos}`)
    console.log(`   Total descontos: ${totalDescontos} (incluindo adiantamento ${holerite.adiantamento})`)
    console.log(`   Salário líquido: ${salarioLiquido}`)
    
    // CORREÇÃO 2: Calcular data correta (5º dia útil do mês de referência)
    const periodoFim = new Date(holerite.periodo_fim)
    const ano = periodoFim.getFullYear()
    const mes = periodoFim.getMonth() + 1
    
    const dataCorreta = calcular5oDiaUtil(ano, mes)
    const dataCorretaISO = dataCorreta.toISOString().split('T')[0]
    
    console.log(`\n📅 [CORREÇÃO] Data de disponibilização:`)
    console.log(`   Mês de referência: ${mes}/${ano}`)
    console.log(`   Data atual: ${holerite.data_pagamento}`)
    console.log(`   Data correta: ${dataCorretaISO} (5º dia útil de ${mes}/${ano})`)
    
    // Aplicar as correções
    console.log(`\n🔧 [CORREÇÃO] Aplicando correções...`)
    
    const updateResponse = await fetch(`http://localhost:3000/api/holerites/${holerite.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        total_descontos: totalDescontos,
        salario_liquido: salarioLiquido,
        data_pagamento: dataCorretaISO
      })
    })
    
    if (updateResponse.ok) {
      console.log(`✅ [CORREÇÃO] Holerite ${holerite.id} corrigido com sucesso!`)
      console.log(`   ✅ Totais recalculados`)
      console.log(`   ✅ Data de disponibilização corrigida`)
      
      // Verificar o resultado
      console.log(`\n🔍 [CORREÇÃO] Verificando resultado...`)
      const verificacaoResponse = await fetch('http://localhost:3000/api/holerites/meus-holerites?funcionarioId=93')
      const holeriteCorrigido = await verificacaoResponse.json()
      
      if (holeriteCorrigido.length > 0) {
        const h = holeriteCorrigido[0]
        console.log(`   Total descontos: ${h.total_descontos}`)
        console.log(`   Salário líquido: ${h.salario_liquido}`)
        console.log(`   Data pagamento: ${h.data_pagamento}`)
      }
      
    } else {
      console.error(`❌ [CORREÇÃO] Erro ao corrigir holerite:`, await updateResponse.text())
    }
    
  } catch (error) {
    console.error('💥 [CORREÇÃO] Erro:', error)
  }
}

// Executar correção
corrigirHoleriteCompleto()