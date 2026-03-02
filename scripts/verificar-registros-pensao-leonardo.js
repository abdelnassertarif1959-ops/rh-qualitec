/**
 * Script para verificar registros de pensão alimentícia do Leonardo
 * 
 * Objetivo: Identificar se existem múltiplos registros de pensão
 * e qual valor está sendo usado em cada contexto
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarRegistrosPensao() {
  console.log('🔍 Verificando registros de pensão alimentícia do Leonardo...\n')
  
  const funcionarioId = 156
  
  try {
    // 1. Buscar todos os registros de pensão
    const { data: registros, error } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', funcionarioId)
      .eq('tipo', 'desconto')
      .ilike('descricao', '%pensao%')
      .order('data_inicio', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar registros:', error.message)
      return
    }
    
    if (!registros || registros.length === 0) {
      console.log('⚠️ Nenhum registro de pensão encontrado')
      return
    }
    
    console.log(`📋 Total de registros encontrados: ${registros.length}\n`)
    
    // 2. Exibir cada registro
    registros.forEach((registro, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📄 REGISTRO ${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`ID:              ${registro.id}`)
      console.log(`Descrição:       ${registro.descricao}`)
      console.log(`Valor:           R$ ${Number(registro.valor).toFixed(2)}`)
      console.log(`Data Início:     ${registro.data_inicio}`)
      console.log(`Data Fim:        ${registro.data_fim || 'Sem data fim (ATIVO)'}`)
      console.log(`Vigência:        ${registro.vigencia_tipo}`)
      console.log(`Observações:     ${registro.observacoes || 'Nenhuma'}`)
      
      // Verificar se está ativo
      const hoje = new Date()
      const dataInicio = new Date(registro.data_inicio)
      const dataFim = registro.data_fim ? new Date(registro.data_fim) : null
      
      const estaAtivo = dataInicio <= hoje && (!dataFim || dataFim >= hoje)
      
      if (estaAtivo) {
        console.log(`Status:          ✅ ATIVO`)
      } else {
        console.log(`Status:          ❌ INATIVO`)
      }
    })
    
    // 3. Identificar registros ativos
    const hoje = new Date()
    const registrosAtivos = registros.filter(r => {
      const dataInicio = new Date(r.data_inicio)
      const dataFim = r.data_fim ? new Date(r.data_fim) : null
      return dataInicio <= hoje && (!dataFim || dataFim >= hoje)
    })
    
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📊 RESUMO`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`Total de registros:  ${registros.length}`)
    console.log(`Registros ativos:    ${registrosAtivos.length}`)
    
    if (registrosAtivos.length > 1) {
      console.log(`\n⚠️ ATENÇÃO: Existem ${registrosAtivos.length} registros ativos!`)
      console.log(`Isso pode causar valores diferentes em cada contexto.\n`)
      
      console.log(`Valores ativos:`)
      registrosAtivos.forEach(r => {
        console.log(`  • ID ${r.id}: R$ ${Number(r.valor).toFixed(2)}`)
      })
      
      console.log(`\n💡 RECOMENDAÇÃO:`)
      console.log(`1. Manter apenas 1 registro ativo`)
      console.log(`2. Finalizar registros antigos com data_fim`)
      console.log(`3. Regerar holerite do Leonardo`)
    } else if (registrosAtivos.length === 1) {
      console.log(`\n✅ Apenas 1 registro ativo (correto)`)
      console.log(`Valor: R$ ${Number(registrosAtivos[0].valor).toFixed(2)}`)
      
      console.log(`\n💡 PRÓXIMO PASSO:`)
      console.log(`Regerar holerite do Leonardo para aplicar este valor`)
    } else {
      console.log(`\n⚠️ Nenhum registro ativo!`)
      console.log(`Todos os registros têm data_fim definida`)
    }
    
    // 4. Buscar holerite atual do Leonardo
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📄 HOLERITE ATUAL`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    
    const { data: holerite } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionarioId)
      .order('periodo_inicio', { ascending: false })
      .limit(1)
      .single()
    
    if (holerite) {
      console.log(`ID:                ${holerite.id}`)
      console.log(`Período:           ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      console.log(`Salário Base:      R$ ${Number(holerite.salario_base).toFixed(2)}`)
      console.log(`Total Proventos:   R$ ${Number(holerite.total_proventos).toFixed(2)}`)
      console.log(`Total Descontos:   R$ ${Number(holerite.total_descontos).toFixed(2)}`)
      console.log(`Salário Líquido:   R$ ${Number(holerite.salario_liquido).toFixed(2)}`)
      console.log(`Status:            ${holerite.status}`)
      
      // Verificar se pensão está incluída
      if (registrosAtivos.length > 0) {
        const pensaoEsperada = registrosAtivos.reduce((sum, r) => sum + Number(r.valor), 0)
        const descontosAtuais = Number(holerite.total_descontos)
        
        console.log(`\n🔍 ANÁLISE:`)
        console.log(`Pensão esperada:   R$ ${pensaoEsperada.toFixed(2)}`)
        console.log(`Descontos atuais:  R$ ${descontosAtuais.toFixed(2)}`)
        
        if (descontosAtuais >= pensaoEsperada) {
          console.log(`✅ Pensão parece estar incluída nos descontos`)
        } else {
          console.log(`❌ Pensão NÃO está incluída nos descontos`)
          console.log(`\n💡 AÇÃO NECESSÁRIA: Regerar holerite`)
        }
      }
    } else {
      console.log(`⚠️ Nenhum holerite encontrado`)
    }
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

// Executar
verificarRegistrosPensao()
