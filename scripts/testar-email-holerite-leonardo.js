// Script para testar o HTML do email do holerite do Leonardo
// Executa: node scripts/testar-email-holerite-leonardo.js

import { createClient } from '@supabase/supabase-js'
import { gerarHoleriteHTML } from '../server/utils/holeriteHTML.ts'
import fs from 'fs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarEmailLeonardo() {
  try {
    console.log('🔍 Buscando holerite do Leonardo...\n')
    
    // Buscar holerite do Leonardo (último holerite dele)
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select(`
        *,
        funcionario:funcionarios (
          id,
          nome_completo,
          email,
          cpf,
          data_admissao,
          tipo_contrato,
          numero_dependentes,
          cargo:cargos (nome),
          departamento:departamentos (nome),
          empresa:empresas (
            id,
            nome,
            nome_fantasia,
            cnpj,
            responsavel_nome,
            responsavel_cpf
          )
        )
      `)
      .ilike('funcionario.nome_completo', '%leonardo%')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (holeriteError) {
      throw holeriteError
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('❌ Nenhum holerite encontrado para Leonardo')
      return
    }
    
    const holerite = holerites[0]
    const funcionario = holerite.funcionario
    const empresa = funcionario.empresa
    
    console.log('✅ Holerite encontrado!')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Funcionário: ${funcionario.nome_completo}`)
    console.log(`   Email: ${funcionario.email}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)
    console.log(`   Dias Trabalhados: ${holerite.dias_trabalhados || 30}`)
    console.log('')
    
    // Calcular salário proporcional
    const salarioBase = Number(holerite.salario_base) || 0
    const diasTrabalhados = Number(holerite.dias_trabalhados) || 30
    const valorDia = salarioBase / 30
    const salarioProporcional = valorDia * diasTrabalhados
    
    console.log('💰 CÁLCULOS:')
    console.log(`   Salário Base: R$ ${salarioBase.toFixed(2)}`)
    console.log(`   Dias Trabalhados: ${diasTrabalhados}`)
    console.log(`   Valor do Dia: R$ ${valorDia.toFixed(2)}`)
    console.log(`   Salário Proporcional: R$ ${salarioProporcional.toFixed(2)}`)
    console.log(`   Total Proventos: R$ ${holerite.total_proventos}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido}`)
    console.log('')
    
    // Preparar dados do funcionário para o HTML
    const funcionarioFormatado = {
      id: funcionario.id,
      nome_completo: funcionario.nome_completo,
      email: funcionario.email,
      cpf: funcionario.cpf,
      data_admissao: funcionario.data_admissao,
      tipo_contrato: funcionario.tipo_contrato,
      numero_dependentes: funcionario.numero_dependentes,
      cargo_nome: funcionario.cargo?.nome,
      departamento_nome: funcionario.departamento?.nome
    }
    
    // Gerar HTML do holerite
    console.log('📄 Gerando HTML do holerite...\n')
    const html = gerarHoleriteHTML(holerite, funcionarioFormatado, empresa)
    
    // Salvar HTML em arquivo para visualização
    const nomeArquivo = `test-holerite-leonardo-${Date.now()}.html`
    fs.writeFileSync(nomeArquivo, html)
    
    console.log('✅ HTML gerado com sucesso!')
    console.log(`   Arquivo salvo: ${nomeArquivo}`)
    console.log('')
    console.log('🌐 Para visualizar:')
    console.log(`   1. Abra o arquivo ${nomeArquivo} no navegador`)
    console.log('   2. Verifique se os valores estão corretos:')
    console.log(`      - Dias Normais: ${diasTrabalhados.toFixed(2)}`)
    console.log(`      - Vencimentos: R$ ${salarioProporcional.toFixed(2)}`)
    console.log(`      - Total Vencimentos: R$ ${holerite.total_proventos}`)
    console.log(`      - Salário Líquido: R$ ${holerite.salario_liquido}`)
    console.log('')
    console.log('📧 Este é o HTML que será enviado no email!')
    console.log('')
    
    // Verificar se os valores estão corretos
    const totalProventosEsperado = salarioProporcional + 
      (Number(holerite.bonus) || 0) +
      (Number(holerite.horas_extras) || 0) +
      (Number(holerite.adicional_noturno) || 0) +
      (Number(holerite.adicional_periculosidade) || 0) +
      (Number(holerite.adicional_insalubridade) || 0) +
      (Number(holerite.comissoes) || 0)
    
    const diferencaProventos = Math.abs(totalProventosEsperado - Number(holerite.total_proventos))
    
    if (diferencaProventos > 0.01) {
      console.log('⚠️  ATENÇÃO: Total de proventos pode estar incorreto!')
      console.log(`   Esperado: R$ ${totalProventosEsperado.toFixed(2)}`)
      console.log(`   No banco: R$ ${holerite.total_proventos}`)
      console.log(`   Diferença: R$ ${diferencaProventos.toFixed(2)}`)
      console.log('')
      console.log('💡 Solução: Edite o holerite e salve novamente para recalcular')
    } else {
      console.log('✅ Valores estão corretos!')
      console.log('   O email pode ser enviado com segurança.')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.error(error)
  }
}

testarEmailLeonardo()
