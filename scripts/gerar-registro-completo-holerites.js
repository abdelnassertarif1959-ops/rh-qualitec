/**
 * Script para gerar registro completo de todos os holerites do banco
 * Busca todos os holerites com funcionários e itens personalizados
 * Salva em arquivo JSON e Markdown para backup
 */

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

import fs from 'fs'
import path from 'path'

async function gerarRegistroCompleto() {
  console.log('📋 Gerando registro completo de todos os holerites...\n')
  
  try {
    // 1. Buscar todos os holerites com dados dos funcionários
    console.log('🔍 Buscando holerites do banco...')
    const respHolerites = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?select=*,funcionarios(id,nome_completo,cpf,tipo_contrato,salario_base,numero_dependentes,pensao_alimenticia)&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const holerites = await respHolerites.json()
    
    if (!Array.isArray(holerites)) {
      console.error('❌ Erro ao buscar holerites:', holerites)
      return
    }
    
    console.log(`✅ ${holerites.length} holerites encontrados\n`)
    
    // 2. Buscar todos os itens personalizados
    console.log('🔍 Buscando itens personalizados...')
    const respItens = await fetch(
      `${SUPABASE_URL}/rest/v1/holerite_itens_personalizados?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    
    const itensPersonalizados = await respItens.json()
    console.log(`✅ ${itensPersonalizados.length} itens personalizados encontrados\n`)
    
    // 3. Organizar dados por funcionário
    const registroPorFuncionario = {}
    
    for (const holerite of holerites) {
      const funcId = holerite.funcionario_id
      const funcNome = holerite.funcionarios?.nome_completo || 'Desconhecido'
      
      if (!registroPorFuncionario[funcId]) {
        registroPorFuncionario[funcId] = {
          funcionario: holerite.funcionarios,
          holerites: [],
          itens_personalizados: []
        }
      }
      
      registroPorFuncionario[funcId].holerites.push(holerite)
    }
    
    // 4. Adicionar itens personalizados aos funcionários
    for (const item of itensPersonalizados) {
      const funcId = item.funcionario_id
      if (registroPorFuncionario[funcId]) {
        registroPorFuncionario[funcId].itens_personalizados.push(item)
      }
    }
    
    // 5. Gerar relatório em Markdown
    let markdown = `# Registro Completo de Holerites - ${new Date().toLocaleString('pt-BR')}\n\n`
    markdown += `**Total de Funcionários:** ${Object.keys(registroPorFuncionario).length}\n`
    markdown += `**Total de Holerites:** ${holerites.length}\n`
    markdown += `**Total de Itens Personalizados:** ${itensPersonalizados.length}\n\n`
    markdown += `---\n\n`
    
    // Ordenar funcionários por nome
    const funcionariosOrdenados = Object.values(registroPorFuncionario).sort((a, b) => {
      const nomeA = a.funcionario?.nome_completo || ''
      const nomeB = b.funcionario?.nome_completo || ''
      return nomeA.localeCompare(nomeB)
    })
    
    for (const registro of funcionariosOrdenados) {
      const func = registro.funcionario
      
      markdown += `## ${func?.nome_completo || 'Funcionário Desconhecido'}\n\n`
      markdown += `**ID:** ${func?.id}\n`
      markdown += `**CPF:** ${func?.cpf || 'N/A'}\n`
      markdown += `**Tipo Contrato:** ${func?.tipo_contrato || 'N/A'}\n`
      markdown += `**Salário Base:** R$ ${(func?.salario_base || 0).toFixed(2)}\n`
      markdown += `**Dependentes:** ${func?.numero_dependentes || 0}\n`
      markdown += `**Pensão Alimentícia:** R$ ${(func?.pensao_alimenticia || 0).toFixed(2)}\n\n`
      
      // Itens Personalizados
      if (registro.itens_personalizados.length > 0) {
        markdown += `### 📋 Itens Personalizados (${registro.itens_personalizados.length})\n\n`
        for (const item of registro.itens_personalizados) {
          markdown += `- **${item.descricao}** (${item.tipo})\n`
          markdown += `  - Valor: R$ ${item.valor.toFixed(2)}\n`
          markdown += `  - Vigência: ${item.vigencia_tipo}\n`
          markdown += `  - Período: ${item.data_inicio} ${item.data_fim ? `até ${item.data_fim}` : '(sem fim)'}\n`
          if (item.observacoes) {
            markdown += `  - Obs: ${item.observacoes}\n`
          }
          markdown += `\n`
        }
      }
      
      // Holerites
      markdown += `### 📄 Holerites (${registro.holerites.length})\n\n`
      
      for (const holerite of registro.holerites) {
        const isAdiantamento = new Date(holerite.periodo_inicio).getDate() === 15
        const tipo = isAdiantamento ? '💰 ADIANTAMENTO' : '📄 FOLHA MENSAL'
        
        markdown += `#### ${tipo} - ID ${holerite.id}\n\n`
        markdown += `**Período:** ${holerite.periodo_inicio} a ${holerite.periodo_fim}\n`
        markdown += `**Data Pagamento:** ${holerite.data_pagamento || 'N/A'}\n`
        markdown += `**Status:** ${holerite.status}\n`
        markdown += `**Criado em:** ${new Date(holerite.created_at).toLocaleString('pt-BR')}\n\n`
        
        // Proventos
        markdown += `**PROVENTOS:**\n`
        markdown += `- Salário Base: R$ ${(holerite.salario_base || 0).toFixed(2)}\n`
        if (holerite.bonus) markdown += `- Bônus: R$ ${holerite.bonus.toFixed(2)}\n`
        if (holerite.horas_extras) markdown += `- Horas Extras: R$ ${holerite.horas_extras.toFixed(2)}\n`
        if (holerite.adicional_noturno) markdown += `- Adicional Noturno: R$ ${holerite.adicional_noturno.toFixed(2)}\n`
        if (holerite.adicional_periculosidade) markdown += `- Adicional Periculosidade: R$ ${holerite.adicional_periculosidade.toFixed(2)}\n`
        if (holerite.adicional_insalubridade) markdown += `- Adicional Insalubridade: R$ ${holerite.adicional_insalubridade.toFixed(2)}\n`
        if (holerite.comissoes) markdown += `- Comissões: R$ ${holerite.comissoes.toFixed(2)}\n`
        markdown += `- **TOTAL PROVENTOS: R$ ${(holerite.total_proventos || 0).toFixed(2)}**\n\n`
        
        // Descontos
        markdown += `**DESCONTOS:**\n`
        if (holerite.inss) markdown += `- INSS: R$ ${holerite.inss.toFixed(2)} (Base: R$ ${(holerite.base_inss || 0).toFixed(2)}, Alíquota: ${(holerite.aliquota_inss || 0)}%)\n`
        if (holerite.irrf) markdown += `- IRRF: R$ ${holerite.irrf.toFixed(2)} (Base: R$ ${(holerite.base_irrf || 0).toFixed(2)}, Alíquota: ${(holerite.aliquota_irrf || 0).toFixed(2)}%)\n`
        if (holerite.fgts) markdown += `- FGTS: R$ ${holerite.fgts.toFixed(2)}\n`
        if (holerite.vale_transporte) markdown += `- Vale Transporte: R$ ${holerite.vale_transporte.toFixed(2)}\n`
        if (holerite.cesta_basica_desconto) markdown += `- Cesta Básica (Desconto): R$ ${holerite.cesta_basica_desconto.toFixed(2)}\n`
        if (holerite.plano_saude) markdown += `- Plano Saúde: R$ ${holerite.plano_saude.toFixed(2)}\n`
        if (holerite.plano_odontologico) markdown += `- Plano Odontológico: R$ ${holerite.plano_odontologico.toFixed(2)}\n`
        if (holerite.adiantamento) markdown += `- Adiantamento: R$ ${holerite.adiantamento.toFixed(2)}\n`
        if (holerite.pensao_alimenticia) markdown += `- Pensão Alimentícia: R$ ${holerite.pensao_alimenticia.toFixed(2)}\n`
        if (holerite.faltas) markdown += `- Faltas: R$ ${holerite.faltas.toFixed(2)}\n`
        if (holerite.outros_descontos) markdown += `- Outros Descontos: R$ ${holerite.outros_descontos.toFixed(2)}\n`
        
        // Descontos Personalizados (JSONB)
        if (holerite.descontos_personalizados && Array.isArray(holerite.descontos_personalizados) && holerite.descontos_personalizados.length > 0) {
          markdown += `\n**Descontos Personalizados (JSONB):**\n`
          for (const desc of holerite.descontos_personalizados) {
            markdown += `- ${desc.tipo || desc.descricao}: R$ ${(desc.valor || 0).toFixed(2)}\n`
          }
        }
        
        markdown += `- **TOTAL DESCONTOS: R$ ${(holerite.total_descontos || 0).toFixed(2)}**\n\n`
        
        // Líquido
        markdown += `**💰 SALÁRIO LÍQUIDO: R$ ${(holerite.salario_liquido || 0).toFixed(2)}**\n\n`
        
        if (holerite.observacoes) {
          markdown += `**Observações:** ${holerite.observacoes}\n\n`
        }
        
        markdown += `---\n\n`
      }
      
      markdown += `\n\n`
    }
    
    // 6. Salvar arquivos
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const jsonFilename = `REGISTRO-HOLERITES-${timestamp}.json`
    const mdFilename = `REGISTRO-HOLERITES-${timestamp}.md`
    
    // Salvar JSON
    const jsonData = {
      data_geracao: new Date().toISOString(),
      total_funcionarios: Object.keys(registroPorFuncionario).length,
      total_holerites: holerites.length,
      total_itens_personalizados: itensPersonalizados.length,
      funcionarios: registroPorFuncionario
    }
    
    fs.writeFileSync(jsonFilename, JSON.stringify(jsonData, null, 2), 'utf8')
    console.log(`✅ Arquivo JSON salvo: ${jsonFilename}`)
    
    // Salvar Markdown
    fs.writeFileSync(mdFilename, markdown, 'utf8')
    console.log(`✅ Arquivo Markdown salvo: ${mdFilename}`)
    
    // 7. Resumo
    console.log(`\n📊 RESUMO:`)
    console.log(`   Funcionários: ${Object.keys(registroPorFuncionario).length}`)
    console.log(`   Holerites: ${holerites.length}`)
    console.log(`   Itens Personalizados: ${itensPersonalizados.length}`)
    console.log(`\n✅ Registro completo gerado com sucesso!`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

gerarRegistroCompleto()
