/**
 * Script standalone para corrigir os totais dos holerites
 */

import { config } from 'dotenv'
config()

async function corrigirTotaisHolerites() {
  console.log('🔧 [CORRIGIR-TOTAIS] Iniciando correção dos totais dos holerites...')
  
  try {
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Configurações do Supabase não encontradas')
    }

    console.log('🔗 Conectando ao Supabase:', supabaseUrl.substring(0, 30) + '...')

    // Buscar todos os holerites
    const response = await fetch(`${supabaseUrl}/rest/v1/holerites?select=*`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar holerites: ${response.status}`)
    }

    const holerites = await response.json()
    console.log(`📊 [CORRIGIR-TOTAIS] Encontrados ${holerites.length} holerites`)

    let corrigidos = 0
    let erros = 0

    for (const holerite of holerites) {
      try {
        // Calcular totais corretos
        const totalProventos = 
          Number(holerite.salario_base || 0) +
          Number(holerite.bonus || 0) +
          Number(holerite.horas_extras || 0) +
          Number(holerite.adicional_noturno || 0) +
          Number(holerite.adicional_periculosidade || 0) +
          Number(holerite.adicional_insalubridade || 0) +
          Number(holerite.comissoes || 0)

        const totalDescontos = 
          Number(holerite.inss || 0) +
          Number(holerite.irrf || 0) +
          Number(holerite.vale_transporte || 0) +
          Number(holerite.cesta_basica_desconto || 0) +
          Number(holerite.plano_saude || 0) +
          Number(holerite.plano_odontologico || 0) +
          Number(holerite.adiantamento || 0) +
          Number(holerite.faltas || 0)

        const salarioLiquido = totalProventos - totalDescontos

        // Verificar se precisa corrigir
        const totalDescontosAtual = Number(holerite.total_descontos || 0)
        const salarioLiquidoAtual = Number(holerite.salario_liquido || 0)

        const precisaCorrigir = 
          Math.abs(totalDescontosAtual - totalDescontos) > 0.01 ||
          Math.abs(salarioLiquidoAtual - salarioLiquido) > 0.01

        if (precisaCorrigir) {
          console.log(`🔧 [CORRIGIR-TOTAIS] Corrigindo holerite ID ${holerite.id}:`)
          console.log(`   Total Descontos: ${totalDescontosAtual} → ${totalDescontos}`)
          console.log(`   Salário Líquido: ${salarioLiquidoAtual} → ${salarioLiquido}`)
          console.log(`   Adiantamento: ${holerite.adiantamento || 0}`)

          // Atualizar no banco
          const updateResponse = await fetch(`${supabaseUrl}/rest/v1/holerites?id=eq.${holerite.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              total_proventos: totalProventos,
              total_descontos: totalDescontos,
              salario_liquido: salarioLiquido
            })
          })

          if (!updateResponse.ok) {
            throw new Error(`Erro ao atualizar holerite ${holerite.id}: ${updateResponse.status}`)
          }

          corrigidos++
        }
      } catch (error) {
        console.error(`❌ [CORRIGIR-TOTAIS] Erro ao processar holerite ${holerite.id}:`, error)
        erros++
      }
    }

    console.log(`✅ [CORRIGIR-TOTAIS] Correção concluída:`)
    console.log(`   📊 Total de holerites: ${holerites.length}`)
    console.log(`   ✅ Corrigidos: ${corrigidos}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log(`   ✨ Já corretos: ${holerites.length - corrigidos - erros}`)

  } catch (error) {
    console.error('❌ [CORRIGIR-TOTAIS] Erro geral:', error)
    throw error
  }
}

// Executar
corrigirTotaisHolerites()
  .then(() => {
    console.log('🎉 [CORRIGIR-TOTAIS] Script executado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 [CORRIGIR-TOTAIS] Falha na execução:', error)
    process.exit(1)
  })