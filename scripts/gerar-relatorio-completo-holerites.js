/**
 * Script para gerar relatório completo de todos os holerites
 * Busca todos os holerites do banco com detalhes completos
 * Inclui itens personalizados de cada funcionário
 */

import fs from 'fs'

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function gerarRelatorioCompleto() {
  console.log('📊 Gerando relatório completo de holerites...\n')
  
  const relatorio = {
    data_geracao: new Date().toISOString(),
    total_holerites: 0,
    holerites: []
  }
  
  try {
    // 1. Buscar todos os holerites com dados do funcionário
    const respHolerites = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?select=*,funcionarios(id,nome_completo,tipo_contrato,numero_dependentes,pensao_alimenticia)&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    if (!respHolerites.ok) {
      const error = await respHolerites.text()
      throw new Error(`Erro ao buscar holerites: ${error}`)
    }
    
    const holerites = await respHolerites.json()
    
    if (!Array.isArray(holerites)) {
      throw new Error(`Resposta inválida: ${JSON.stringify(holerites)}`)
    }
    
    console.log(`📋 Total de holerites encontrados: ${holerites.length}\n`)
    
    relatorio.total_holerites = holerites.length
    
    // 2. Para cada holerite, buscar itens personalizados
    for (const holerite of holerites) {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`📄 HOLERITE ID: ${holerite.id}`)
      console.log(`${'='.repeat(80)}`)
      
      const funcionario = holerite.funcionarios
      console.log(`👤 Funcionário: ${funcionario?.nome_completo || 'N/A'}`)
      console.log(`   Tipo Contrato: ${funcionario?.tipo_contrato || 'N/A'}`)
      console.log(`   Dependentes: ${funcionario?.numero_dependentes || 0}`)
      console.log(`   Pensão Alimentícia: R$ ${(funcionario?.pensao_alimenticia || 0).toFixed(2)}`)
      
      console.log(`\n📅 Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      console.log(`💰 Data Pagamento: ${holerite.data_pagamento || 'N/A'}`)
      console.log(`📊 Status: ${holerite.status}`)
      
      // Buscar itens personalizados
      const respItens = await fetch(
        `${SUPABASE_URL}/rest/v1/holerite_itens_personalizados?funcionario_id=eq.${holerite.funcionario_id}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      
      const itens = await respItens.json()
      
      // Filtrar itens vigentes no período do holerite
      const periodoInicio = new Date(holerite.periodo_inicio)
      const periodoFim = new Date(holerite.periodo_fim)
      
      const itensVigentes = itens.filter(item => {
        const dataInicio = new Date(item.data_inicio)
        const dataFim = item.data_fim ? new Date(item.data_fim) : null
        return dataInicio <= periodoFim && (!dataFim || dataFim >= periodoInicio)
      })
      
      const beneficios = itensVigentes.filter(item => item.tipo === 'beneficio')
      const descontos = itensVigentes.filter(item => item.tipo === 'desconto')
      
      console.log(`\n💵 PROVENTOS:`)
      console.log(`   Salário Base: R$ ${(holerite.salario_base || 0).toFixed(2)}`)
      if (holerite.bonus) console.log(`   Bônus: R$ ${holerite.bonus.toFixed(2)}`)
      if (holerite.horas_extras) console.log(`   Horas Extras: R$ ${holerite.horas_extras.toFixed(2)}`)
      if (holerite.adicional_noturno) console.log(`   Adicional Noturno: R$ ${holerite.adicional_noturno.toFixed(2)}`)
      if (holerite.adicional_periculosidade) console.log(`   Adicional Periculosidade: R$ ${holerite.adicional_periculosidade.toFixed(2)}`)
      if (holerite.adicional_insalubridade) console.log(`   Adicional Insalubridade: R$ ${holerite.adicional_insalubridade.toFixed(2)}`)
      if (holerite.comissoes) console.log(`   Comissões: R$ ${holerite.comissoes.toFixed(2)}`)
      
      if (beneficios.length > 0) {
        console.log(`\n   📋 Benefícios Personalizados (${beneficios.length}):`)
        beneficios.forEach(b => {
          console.log(`      - ${b.descricao}: R$ ${b.valor.toFixed(2)}`)
        })
      }
      
      console.log(`\n   ✅ TOTAL PROVENTOS: R$ ${(holerite.total_proventos || 0).toFixed(2)}`)
      
      console.log(`\n💸 DESCONTOS:`)
      if (holerite.inss) console.log(`   INSS: R$ ${holerite.inss.toFixed(2)} (${(holerite.aliquota_inss || 0).toFixed(2)}%)`)
      if (holerite.irrf) console.log(`   IRRF: R$ ${holerite.irrf.toFixed(2)} (${(holerite.aliquota_irrf || 0).toFixed(2)}%)`)
      if (holerite.fgts) console.log(`   FGTS: R$ ${holerite.fgts.toFixed(2)}`)
      if (holerite.vale_transporte) console.log(`   Vale Transporte: R$ ${holerite.vale_transporte.toFixed(2)}`)
      if (holerite.cesta_basica_desconto) console.log(`   Cesta Básica (Desconto): R$ ${holerite.cesta_basica_desconto.toFixed(2)}`)
      if (holerite.plano_saude) console.log(`   Plano Saúde: R$ ${holerite.plano_saude.toFixed(2)}`)
      if (holerite.plano_odontologico) console.log(`   Plano Odontológico: R$ ${holerite.plano_odontologico.toFixed(2)}`)
      if (holerite.adiantamento) console.log(`   Adiantamento: R$ ${holerite.adiantamento.toFixed(2)}`)
      if (holerite.faltas) console.log(`   Faltas: R$ ${holerite.faltas.toFixed(2)}`)
      if (holerite.pensao_alimenticia) console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia.toFixed(2)}`)
      if (holerite.outros_descontos) console.log(`   Outros Descontos: R$ ${holerite.outros_descontos.toFixed(2)}`)
      
      if (descontos.length > 0) {
        console.log(`\n   📋 Descontos Personalizados (${descontos.length}):`)
        descontos.forEach(d => {
          console.log(`      - ${d.descricao}: R$ ${d.valor.toFixed(2)}`)
        })
      }
      
      console.log(`\n   ❌ TOTAL DESCONTOS: R$ ${(holerite.total_descontos || 0).toFixed(2)}`)
      
      console.log(`\n💰 SALÁRIO LÍQUIDO: R$ ${(holerite.salario_liquido || 0).toFixed(2)}`)
      
      if (holerite.observacoes) {
        console.log(`\n📝 Observações: ${holerite.observacoes}`)
      }
      
      // Adicionar ao relatório
      relatorio.holerites.push({
        id: holerite.id,
        funcionario: {
          id: funcionario?.id,
          nome: funcionario?.nome_completo,
          tipo_contrato: funcionario?.tipo_contrato,
          dependentes: funcionario?.numero_dependentes,
          pensao_alimenticia: funcionario?.pensao_alimenticia
        },
        periodo: {
          inicio: holerite.periodo_inicio,
          fim: holerite.periodo_fim,
          data_pagamento: holerite.data_pagamento
        },
        status: holerite.status,
        proventos: {
          salario_base: holerite.salario_base,
          bonus: holerite.bonus,
          horas_extras: holerite.horas_extras,
          adicional_noturno: holerite.adicional_noturno,
          adicional_periculosidade: holerite.adicional_periculosidade,
          adicional_insalubridade: holerite.adicional_insalubridade,
          comissoes: holerite.comissoes,
          beneficios_personalizados: beneficios.map(b => ({
            descricao: b.descricao,
            valor: b.valor
          })),
          total: holerite.total_proventos
        },
        descontos: {
          inss: holerite.inss,
          aliquota_inss: holerite.aliquota_inss,
          irrf: holerite.irrf,
          aliquota_irrf: holerite.aliquota_irrf,
          fgts: holerite.fgts,
          vale_transporte: holerite.vale_transporte,
          cesta_basica_desconto: holerite.cesta_basica_desconto,
          plano_saude: holerite.plano_saude,
          plano_odontologico: holerite.plano_odontologico,
          adiantamento: holerite.adiantamento,
          faltas: holerite.faltas,
          pensao_alimenticia: holerite.pensao_alimenticia,
          outros_descontos: holerite.outros_descontos,
          descontos_personalizados: descontos.map(d => ({
            descricao: d.descricao,
            valor: d.valor
          })),
          total: holerite.total_descontos
        },
        salario_liquido: holerite.salario_liquido,
        observacoes: holerite.observacoes,
        created_at: holerite.created_at,
        updated_at: holerite.updated_at
      })
    }
    
    // 3. Salvar relatório em arquivo JSON
    const nomeArquivo = `RELATORIO-COMPLETO-HOLERITES-${new Date().toISOString().split('T')[0]}.json`
    fs.writeFileSync(nomeArquivo, JSON.stringify(relatorio, null, 2))
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`✅ RELATÓRIO GERADO COM SUCESSO!`)
    console.log(`${'='.repeat(80)}`)
    console.log(`📁 Arquivo: ${nomeArquivo}`)
    console.log(`📊 Total de holerites: ${relatorio.total_holerites}`)
    console.log(`📅 Data de geração: ${new Date().toLocaleString('pt-BR')}`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

gerarRelatorioCompleto()
