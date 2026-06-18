/**
 * Script para corrigir holerites mensais de FEVEREIRO/2026
 * Adiciona desconto de adiantamento de fevereiro automaticamente
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function corrigirHoleritesFevereiro() {
  console.log('🔧 Iniciando correção de holerites mensais de FEVEREIRO/2026...\n')
  
  // Buscar holerites mensais de fevereiro (período 01/02 a 28/02 ou 29/02)
  const { data: holerites, error } = await supabase
    .from('holerites')
    .select('*')
    .eq('periodo_inicio', '2026-02-01')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Erro ao buscar holerites:', error)
    return
  }
  
  if (!holerites || holerites.length === 0) {
    console.log('ℹ️ Nenhum holerite mensal de fevereiro encontrado')
    return
  }
  
  console.log(`📊 Encontrados ${holerites.length} holerite(s) mensal(is) de fevereiro\n`)
  
  let corrigidos = 0
  let erros = 0
  let jaCorretos = 0
  
  for (const holerite of holerites) {
    try {
      console.log(`\n🔄 Processando holerite ID: ${holerite.id}`)
      
      // Buscar funcionário
      const { data: funcionario } = await supabase
        .from('funcionarios')
        .select('nome_completo')
        .eq('id', holerite.funcionario_id)
        .single()
      
      const nomeFuncionario = funcionario?.nome_completo || 'Desconhecido'
      console.log(`   Funcionário: ${nomeFuncionario}`)
      console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      
      // Buscar adiantamentos de fevereiro (15/02 a 28/02 ou 29/02)
      const dataInicioAdiantamento = '2026-02-15'
      
      console.log(`   Buscando adiantamentos em: ${dataInicioAdiantamento}`)
      
      const { data: adiantamentos } = await supabase
        .from('holerites')
        .select('id, salario_base, salario_liquido, periodo_inicio, periodo_fim, observacoes')
        .eq('funcionario_id', holerite.funcionario_id)
        .eq('periodo_inicio', dataInicioAdiantamento)
      
      if (!adiantamentos || adiantamentos.length === 0) {
        console.log(`   ℹ️ Nenhum adiantamento de fevereiro encontrado`)
        continue
      }
      
      console.log(`   📊 Encontrado(s) ${adiantamentos.length} adiantamento(s):`)
      
      let totalAdiantamentos = 0
      adiantamentos.forEach((adiant, index) => {
        const valor = adiant.salario_liquido || adiant.salario_base || 0
        totalAdiantamentos += valor
        console.log(`      ${index + 1}. ID: ${adiant.id}`)
        console.log(`         Valor: R$ ${valor.toFixed(2)}`)
        console.log(`         Período: ${adiant.periodo_inicio} a ${adiant.periodo_fim}`)
      })
      
      console.log(`   💰 Total de adiantamentos: R$ ${totalAdiantamentos.toFixed(2)}`)
      
      // Verificar se já tem desconto de adiantamento
      const adiantamentoAtual = holerite.adiantamento || 0
      
      if (Math.abs(adiantamentoAtual - totalAdiantamentos) < 0.01) {
        console.log(`   ✅ Holerite já está correto (adiantamento: R$ ${adiantamentoAtual.toFixed(2)})`)
        jaCorretos++
        continue
      }
      
      console.log(`   🔧 Corrigindo desconto de adiantamento:`)
      console.log(`      Atual: R$ ${adiantamentoAtual.toFixed(2)}`)
      console.log(`      Correto: R$ ${totalAdiantamentos.toFixed(2)}`)
      console.log(`      Diferença: R$ ${(totalAdiantamentos - adiantamentoAtual).toFixed(2)}`)
      
      // Recalcular totais
      const totalProventos = holerite.total_proventos || holerite.salario_base || 0
      const outrosDescontos = (holerite.inss || 0) + 
                             (holerite.irrf || 0) + 
                             (holerite.vale_transporte || 0) +
                             (holerite.cesta_basica_desconto || 0) +
                             (holerite.plano_saude || 0) +
                             (holerite.plano_odontologico || 0) +
                             (holerite.pensao_alimenticia || 0) +
                             (holerite.faltas || 0) +
                             (holerite.outros_descontos || 0)
      
      // Somar descontos personalizados se existirem
      let descontosPersonalizados = 0
      if (holerite.descontos_personalizados && Array.isArray(holerite.descontos_personalizados)) {
        descontosPersonalizados = holerite.descontos_personalizados.reduce((sum, d) => {
          return sum + (Number(d.valor) || 0)
        }, 0)
      }
      
      const totalDescontos = outrosDescontos + totalAdiantamentos + descontosPersonalizados
      const salarioLiquido = totalProventos - totalDescontos
      
      console.log(`   📊 Novos valores:`)
      console.log(`      Total Proventos: R$ ${totalProventos.toFixed(2)}`)
      console.log(`      Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
      console.log(`      - INSS: R$ ${(holerite.inss || 0).toFixed(2)}`)
      console.log(`      - IRRF: R$ ${(holerite.irrf || 0).toFixed(2)}`)
      console.log(`      - Adiantamento: R$ ${totalAdiantamentos.toFixed(2)} ⬅️ CORRIGIDO`)
      console.log(`      - Pensão: R$ ${(holerite.pensao_alimenticia || 0).toFixed(2)}`)
      console.log(`      - Descontos Personalizados: R$ ${descontosPersonalizados.toFixed(2)}`)
      console.log(`      - Outros: R$ ${(outrosDescontos - (holerite.inss || 0) - (holerite.irrf || 0) - (holerite.pensao_alimenticia || 0)).toFixed(2)}`)
      console.log(`      Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)
      console.log(`      Diferença no líquido: R$ ${(salarioLiquido - (holerite.salario_liquido || 0)).toFixed(2)}`)
      
      // Atualizar holerite
      const novaObservacao = totalAdiantamentos > 0 
        ? `Folha mensal - Desconto de adiantamento: R$ ${totalAdiantamentos.toFixed(2)}`
        : 'Folha mensal'
      
      const { error: updateError } = await supabase
        .from('holerites')
        .update({
          adiantamento: totalAdiantamentos,
          total_descontos: totalDescontos,
          salario_liquido: salarioLiquido,
          observacoes: novaObservacao
        })
        .eq('id', holerite.id)
      
      if (updateError) {
        console.error(`   ❌ Erro ao atualizar:`, updateError.message)
        erros++
      } else {
        console.log(`   ✅ Holerite corrigido com sucesso!`)
        corrigidos++
      }
      
    } catch (error) {
      console.error(`   ❌ Erro ao processar holerite ${holerite.id}:`, error.message)
      erros++
    }
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 RESUMO DA CORREÇÃO - FEVEREIRO/2026`)
  console.log(`${'='.repeat(60)}`)
  console.log(`✅ Holerites corrigidos: ${corrigidos}`)
  console.log(`✓  Já estavam corretos: ${jaCorretos}`)
  console.log(`❌ Erros: ${erros}`)
  console.log(`📋 Total processados: ${holerites.length}`)
  console.log(`${'='.repeat(60)}\n`)
}

// Executar
corrigirHoleritesFevereiro()
  .then(() => {
    console.log('✅ Script finalizado')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
