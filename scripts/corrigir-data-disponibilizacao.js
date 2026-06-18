/**
 * Script para corrigir a data de disponibilização dos holerites existentes
 * Aplica a nova regra: 5º dia útil do mês de referência
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

async function corrigirDataDisponibilizacao() {
  try {
    console.log('🔧 Iniciando correção da data de disponibilização...')
    
    // Buscar holerite de fevereiro/2026
    const response = await fetch('http://localhost:3000/api/holerites/meus-holerites?funcionarioId=1')
    const holerites = await response.json()
    
    console.log(`📊 Encontrados ${holerites.length} holerites`)
    
    for (const holerite of holerites) {
      console.log(`\n📋 Processando holerite ID: ${holerite.id}`)
      console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      console.log(`   Data atual: ${holerite.data_pagamento}`)
      
      // Extrair mês e ano do período fim (mês de referência)
      const [ano, mes] = holerite.periodo_fim.split('-')
      const anoNum = parseInt(ano, 10)
      const mesNum = parseInt(mes, 10)
      
      // Calcular 5º dia útil do mês de referência
      const novaData = calcular5oDiaUtil(anoNum, mesNum)
      const novaDataFormatada = novaData.toISOString().split('T')[0]
      
      console.log(`   Nova data: ${novaDataFormatada} (5º dia útil de ${mesNum}/${anoNum})`)
      
      // Atualizar apenas se a data for diferente
      if (holerite.data_pagamento !== novaDataFormatada) {
        console.log(`   🔄 Atualizando data de pagamento...`)
        
        const updateResponse = await fetch(`http://localhost:3000/api/holerites/${holerite.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data_pagamento: novaDataFormatada
          })
        })
        
        if (updateResponse.ok) {
          console.log(`   ✅ Holerite ${holerite.id} atualizado com sucesso!`)
        } else {
          console.error(`   ❌ Erro ao atualizar holerite ${holerite.id}:`, await updateResponse.text())
        }
      } else {
        console.log(`   ✅ Data já está correta`)
      }
    }
    
    console.log('\n🎉 Correção concluída!')
    
  } catch (error) {
    console.error('💥 Erro durante a correção:', error)
  }
}

// Executar correção
corrigirDataDisponibilizacao()