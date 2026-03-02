/**
 * Script para corrigir a data de disponibilização de um holerite específico
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

async function corrigirHoleriteEspecifico() {
  console.log('🔧 [CORREÇÃO] Corrigindo holerite ID 1111...')
  
  try {
    // Para holerite de fevereiro/2026, a data correta é 06/02/2026
    const dataCorreta = '2026-02-06'
    
    console.log(`📅 [CORREÇÃO] Atualizando data de pagamento para: ${dataCorreta}`)
    
    const updateResponse = await fetch(`http://localhost:3000/api/holerites/1111`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data_pagamento: dataCorreta
      })
    })
    
    if (updateResponse.ok) {
      console.log(`✅ [CORREÇÃO] Holerite 1111 corrigido com sucesso!`)
      console.log(`   Data anterior: 2026-03-06`)
      console.log(`   Data corrigida: ${dataCorreta}`)
    } else {
      console.error(`❌ [CORREÇÃO] Erro ao corrigir holerite:`, await updateResponse.text())
    }
    
  } catch (error) {
    console.error('💥 [CORREÇÃO] Erro:', error)
  }
}

// Executar correção
corrigirHoleriteEspecifico()