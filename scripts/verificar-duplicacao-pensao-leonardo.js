/**
 * Script para verificar duplicação da pensão alimentícia do Leonardo
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function verificar() {
  console.log('🔍 VERIFICANDO DUPLICAÇÃO - Pensão Alimentícia Leonardo\n')
  console.log('=' .repeat(80))
  
  try {
    // 1. Buscar holerite do Leonardo
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
    
    console.log('\n📄 HOLERITE NO BANCO')
    console.log('-'.repeat(80))
    console.log(`ID: ${holerite.id}`)
    console.log(`Pensão Alimentícia (campo): R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`Total Descontos: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
    console.log(`Salário Líquido: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
    
    // 2. Buscar itens personalizados
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
    
    console.log('\n📋 ITENS PERSONALIZADOS')
    console.log('-'.repeat(80))
    if (itens && itens.length > 0) {
      itens.forEach((item, index) => {
        console.log(`${index + 1}. ${item.descricao}`)
        console.log(`   Tipo: ${item.tipo}`)
        console.log(`   Valor: R$ ${(item.valor || 0).toFixed(2)}`)
        console.log(`   Vigência: ${item.data_inicio} até ${item.data_fim || 'indeterminado'}`)
        console.log(`   Recorrente: ${item.recorrente ? 'Sim' : 'Não'}`)
        console.log()
      })
      
      // Verificar se tem pensão alimentícia duplicada
      const pensaoItens = itens.filter(item => 
        item.descricao.toUpperCase().includes('PENSÃO') || 
        item.descricao.toUpperCase().includes('PENSAO')
      )
      
      if (pensaoItens.length > 0) {
        console.log('\n⚠️  PENSÃO ENCONTRADA NOS ITENS PERSONALIZADOS!')
        console.log('-'.repeat(80))
        pensaoItens.forEach(item => {
          console.log(`Descrição: ${item.descricao}`)
          console.log(`Valor: R$ ${(item.valor || 0).toFixed(2)}`)
        })
        
        if (holerite.pensao_alimenticia && holerite.pensao_alimenticia > 0) {
          console.log('\n❌ DUPLICAÇÃO DETECTADA!')
          console.log(`A pensão está sendo contada DUAS VEZES:`)
          console.log(`1. Campo pensao_alimenticia: R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
          console.log(`2. Item personalizado: R$ ${(pensaoItens[0].valor || 0).toFixed(2)}`)
          console.log(`\nTotal duplicado: R$ ${((holerite.pensao_alimenticia || 0) + (pensaoItens[0].valor || 0)).toFixed(2)}`)
        }
      }
    } else {
      console.log('Nenhum item personalizado encontrado')
    }
    
    // 3. Análise do problema
    console.log('\n🔍 ANÁLISE DO PROBLEMA')
    console.log('-'.repeat(80))
    console.log('O sistema está somando:')
    console.log(`1. holerite.pensao_alimenticia = R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
    console.log(`2. Item personalizado "PENSÃO ALIMENTÍCIA" = R$ 962,00`)
    console.log(`\nResultado: Pensão sendo descontada DUAS VEZES!`)
    
    console.log('\n💡 SOLUÇÃO')
    console.log('-'.repeat(80))
    console.log('Opção 1: Zerar o campo pensao_alimenticia no holerite (deixar só o item personalizado)')
    console.log('Opção 2: Remover o item personalizado (deixar só o campo pensao_alimenticia)')
    console.log('Opção 3: Ajustar o código do modal para não somar itens personalizados que já estão no holerite')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificar()
