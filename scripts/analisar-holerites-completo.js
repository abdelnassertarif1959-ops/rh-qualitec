import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function analisarHolerites() {
  try {
    console.log('📊 ANÁLISE COMPLETA DOS HOLERITES\n')
    console.log('='.repeat(80))
    
    // Buscar holerites mais recentes
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (errorHol || !holerites || holerites.length === 0) {
      console.error('❌ Erro ao buscar holerites:', errorHol)
      return
    }
    
    console.log(`\n📄 Analisando ${holerites.length} holerites mais recentes:\n`)
    
    for (const holerite of holerites) {
      // Buscar dados do funcionário
      const { data: funcionario } = await supabase
        .from('funcionarios')
        .select('id, nome_completo, tipo_contrato')
        .eq('id', holerite.funcionario_id)
        .single()
      
      console.log('\n' + '='.repeat(80))
      console.log(`\n🆔 HOLERITE ID: ${holerite.id}`)
      console.log(`👤 Funcionário: ${funcionario?.nome_completo || 'N/A'} (ID: ${holerite.funcionario_id})`)
      console.log(`📋 Tipo Contrato: ${funcionario?.tipo_contrato || 'N/A'}`)
      console.log(`📅 Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      console.log(`💰 Tipo: ${holerite.observacoes || 'Folha Mensal'}`)
      
      // PROVENTOS
      console.log('\n💵 PROVENTOS:')
      console.log('─'.repeat(80))
      
      let totalProventos = 0
      
      if (holerite.salario_base > 0) {
        const diasTrabalhados = holerite.dias_trabalhados || 30
        const valorDia = holerite.salario_base / 30
        const salarioProporcional = valorDia * diasTrabalhados
        totalProventos += salarioProporcional
        
        console.log(`   8781 | DIAS NORMAIS                    | Ref: ${diasTrabalhados.toFixed(2).padStart(8)} | R$ ${salarioProporcional.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.bonus > 0) {
        totalProventos += holerite.bonus
        console.log(`   100  | BÔNUS                           |              | R$ ${holerite.bonus.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.horas_extras > 0) {
        totalProventos += holerite.horas_extras
        console.log(`   200  | HORAS EXTRAS                    |              | R$ ${holerite.horas_extras.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.adicional_noturno > 0) {
        totalProventos += holerite.adicional_noturno
        console.log(`   300  | ADICIONAL NOTURNO               |              | R$ ${holerite.adicional_noturno.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.adicional_periculosidade > 0) {
        totalProventos += holerite.adicional_periculosidade
        console.log(`   400  | ADICIONAL PERICULOSIDADE        |              | R$ ${holerite.adicional_periculosidade.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.adicional_insalubridade > 0) {
        totalProventos += holerite.adicional_insalubridade
        console.log(`   500  | ADICIONAL INSALUBRIDADE         |              | R$ ${holerite.adicional_insalubridade.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.comissoes > 0) {
        totalProventos += holerite.comissoes
        console.log(`   600  | COMISSÕES                       |              | R$ ${holerite.comissoes.toFixed(2).padStart(12)}`)
      }
      
      console.log('─'.repeat(80))
      console.log(`   TOTAL PROVENTOS:                                          R$ ${totalProventos.toFixed(2).padStart(12)}`)
      
      // DESCONTOS
      console.log('\n📉 DESCONTOS:')
      console.log('─'.repeat(80))
      
      let totalDescontos = 0
      
      if (holerite.inss > 0) {
        totalDescontos += holerite.inss
        const referencia = holerite.inss_referencia || (holerite.aliquota_inss ? holerite.aliquota_inss.toFixed(2) : '')
        console.log(`   998  | I.N.S.S.                        | Ref: ${referencia.padStart(8)} | R$ ${holerite.inss.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.irrf > 0) {
        totalDescontos += holerite.irrf
        console.log(`   999  | I.R.R.F.                        |              | R$ ${holerite.irrf.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.adiantamento > 0) {
        totalDescontos += holerite.adiantamento
        console.log(`   910  | ADIANTAMENTO SALARIAL           |              | R$ ${holerite.adiantamento.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.pensao_alimenticia > 0) {
        totalDescontos += holerite.pensao_alimenticia
        console.log(`   915  | PENSÃO ALIMENTÍCIA              |              | R$ ${holerite.pensao_alimenticia.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.vale_transporte > 0) {
        totalDescontos += holerite.vale_transporte
        console.log(`   920  | VALE TRANSPORTE                 |              | R$ ${holerite.vale_transporte.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.cesta_basica_desconto > 0) {
        totalDescontos += holerite.cesta_basica_desconto
        console.log(`   930  | CESTA BÁSICA                    |              | R$ ${holerite.cesta_basica_desconto.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.plano_saude > 0) {
        totalDescontos += holerite.plano_saude
        console.log(`   940  | PLANO DE SAÚDE                  |              | R$ ${holerite.plano_saude.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.plano_odontologico > 0) {
        totalDescontos += holerite.plano_odontologico
        console.log(`   950  | PLANO ODONTOLÓGICO              |              | R$ ${holerite.plano_odontologico.toFixed(2).padStart(12)}`)
      }
      
      if (holerite.faltas > 0) {
        totalDescontos += holerite.faltas
        console.log(`   965  | FALTAS                          |              | R$ ${holerite.faltas.toFixed(2).padStart(12)}`)
      }
      
      console.log('─'.repeat(80))
      console.log(`   TOTAL DESCONTOS:                                          R$ ${totalDescontos.toFixed(2).padStart(12)}`)
      
      // RESUMO
      const salarioLiquido = totalProventos - totalDescontos
      console.log('\n💼 RESUMO FINANCEIRO:')
      console.log('─'.repeat(80))
      console.log(`   Total Proventos:     R$ ${totalProventos.toFixed(2).padStart(12)}`)
      console.log(`   Total Descontos:     R$ ${totalDescontos.toFixed(2).padStart(12)}`)
      console.log(`   ─────────────────────────────────────`)
      console.log(`   SALÁRIO LÍQUIDO:     R$ ${salarioLiquido.toFixed(2).padStart(12)}`)
      
      // CONFIGURAÇÕES
      console.log('\n⚙️  CONFIGURAÇÕES:')
      console.log('─'.repeat(80))
      console.log(`   Dias Trabalhados: ${holerite.dias_trabalhados || 30}`)
      console.log(`   INSS Tipo: ${holerite.inss_tipo || 'percentual'}`)
      console.log(`   INSS Percentual: ${(holerite.inss_percentual || 0).toFixed(2)}%`)
      console.log(`   INSS Referência: ${holerite.inss_referencia || 'N/A'}`)
      console.log(`   Pensão Tipo: ${holerite.pensao_tipo || 'N/A'}`)
      console.log(`   Pensão Percentual: ${(holerite.pensao_percentual || 0).toFixed(2)}%`)
      console.log(`   FGTS: R$ ${(holerite.fgts || 0).toFixed(2)}`)
      
      // BASES DE CÁLCULO
      const isPJ = funcionario?.tipo_contrato === 'PJ'
      const isAdiantamento = holerite.observacoes?.includes('Adiantamento')
      const mostrarBases = !isPJ && !isAdiantamento
      
      if (mostrarBases) {
        console.log('\n📊 BASES DE CÁLCULO:')
        console.log('─'.repeat(80))
        console.log(`   Salário Base:        R$ ${(holerite.salario_base || 0).toFixed(2).padStart(12)}`)
        console.log(`   Base INSS:           R$ ${(holerite.base_inss || holerite.salario_base || 0).toFixed(2).padStart(12)}`)
        console.log(`   Base FGTS:           R$ ${(holerite.salario_base || 0).toFixed(2).padStart(12)}`)
        console.log(`   FGTS do Mês:         R$ ${(holerite.fgts || 0).toFixed(2).padStart(12)}`)
        console.log(`   Base IRRF:           R$ ${(totalProventos - (holerite.inss || 0)).toFixed(2).padStart(12)}`)
        console.log(`   Faixa IRRF:          ${holerite.faixa_irrf || '0,00'}`)
      } else {
        console.log('\n📊 BASES DE CÁLCULO: Não aplicável (PJ ou Adiantamento)')
      }
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('\n✅ Análise concluída!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

analisarHolerites()
