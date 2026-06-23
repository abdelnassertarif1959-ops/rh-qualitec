import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'
import { calcularRemuneracaoFerias, carregarTaxConfigDoBanco } from '../../../utils/calcularFerias'
import { gerarHoleriteHTML } from '../../../utils/holeriteHTML'

// POST /api/ferias/[id]/gerar-holerite — Gera holerite de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAdmin(event)
    const supabase = serverSupabaseServiceRole(event)
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

    const feriasId = Number(getRouterParam(event, 'id'))
    if (!feriasId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' })

    // Buscar período de férias com dados do funcionário
    const { data: ferias, error: errFerias } = await supabase
      .from('funcionario_ferias')
      .select('*')
      .eq('id', feriasId)
      .single()

    if (errFerias || !ferias) throw createError({ statusCode: 404, statusMessage: 'Período de férias não encontrado' })

    // Buscar funcionário
    const funcRes = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${ferias.funcionario_id}&select=*`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    )
    const funcionarios = await funcRes.json()
    if (!funcionarios?.length) throw createError({ statusCode: 404, statusMessage: 'Funcionário não encontrado' })
    const funcionario = funcionarios[0]

    // Buscar cargo
    let cargoNome = 'Não informado'
    if (funcionario.cargo_id) {
      const r = await fetch(`${supabaseUrl}/rest/v1/cargos?id=eq.${funcionario.cargo_id}&select=nome`, {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }
      })
      const c = await r.json()
      if (c?.length) cargoNome = c[0].nome
    }

    // Buscar departamento
    let departamentoNome = 'Não informado'
    if (funcionario.departamento_id) {
      const r = await fetch(`${supabaseUrl}/rest/v1/departamentos?id=eq.${funcionario.departamento_id}&select=nome`, {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }
      })
      const d = await r.json()
      if (d?.length) departamentoNome = d[0].nome
    }

    // Buscar empresa
    const empRes = await fetch(`${supabaseUrl}/rest/v1/empresas?id=eq.${funcionario.empresa_id}&select=*`, {
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }
    })
    const empresas = await empRes.json()
    if (!empresas?.length) throw createError({ statusCode: 404, statusMessage: 'Empresa não encontrada' })
    const empresa = empresas[0]

    funcionario.cargo_nome = cargoNome
    funcionario.departamento_nome = departamentoNome
    funcionario.numero_dependentes = funcionario.numero_dependentes || 0

    // Recalcular os valores se necessário
    const salarioBase = Number(funcionario.salario_base) || 0
    const diasFerias = ferias.dias_corridos

    const taxConfig = await carregarTaxConfigDoBanco(supabase)

    const calc = calcularRemuneracaoFerias(
      salarioBase,
      diasFerias,
      ferias.abono_pecuniario ? ferias.dias_abono : 0,
      funcionario.numero_dependentes,
      {
        ativa: funcionario.pensao_config_ativa || false,
        tipo: (funcionario.pensao_config_tipo as 'percentual' | 'fixo') || 'percentual',
        percentual: Number(funcionario.pensao_config_percentual) || 0,
        valorFixo: Number(funcionario.pensao_config_valor_fixo) || 0,
      },
      taxConfig
    )

    // Criar registro de holerite do tipo 'ferias'
    // O período do holerite de férias = data_inicio até data_fim das férias
    const { data: novoHolerite, error: errHolerite } = await supabase
      .from('holerites')
      .insert({
        funcionario_id: ferias.funcionario_id,
        periodo_inicio: ferias.data_inicio,
        periodo_fim: ferias.data_fim,
        data_pagamento: ferias.data_pagamento || ferias.data_inicio,
        salario_base: salarioBase,
        dias_trabalhados: diasFerias,
        // Proventos de férias
        total_proventos: calc.valorBruto,
        // Descontos
        inss: calc.inss,
        irrf: calc.irrf,
        pensao_alimenticia: calc.pensaoAlimenticia,
        total_descontos: calc.inss + calc.irrf + calc.pensaoAlimenticia,
        salario_liquido: calc.valorLiquido,
        // INSS config
        inss_tipo: 'progressivo',
        inss_percentual: calc.aliquotaINSS * 100,
        inss_referencia: 'Tabela INSS 2026',
        faixa_irrf: calc.faixaIRRF,
        // Identificador especial de férias nos benefícios (jsonb)
        beneficios: {
          ferias: {
            dias_ferias: diasFerias,
            dias_abono: ferias.dias_abono || 0,
            valor_remuneracao: calc.valorRemuneracao,
            valor_um_terco: calc.valorUmTerco,
            valor_abono_pecuniario: calc.valorAbonoPecuniario,
          }
        },
        status: 'gerado',
        observacoes: `Recibo de Férias — ${diasFerias} dias (${new Date(ferias.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(ferias.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')})${ferias.abono_pecuniario ? ` + ${ferias.dias_abono} dias de abono pecuniário` : ''}`,
      })
      .select()
      .single()

    if (errHolerite) {
      console.error('[gerar-holerite ferias] Erro ao criar holerite:', errHolerite)
      throw createError({ statusCode: 500, statusMessage: errHolerite.message })
    }

    // Vincular o holerite ao registro de férias
    await supabase
      .from('funcionario_ferias')
      .update({
        holerite_id: novoHolerite.id,
        valor_remuneracao: calc.valorRemuneracao,
        valor_um_terco: calc.valorUmTerco,
        valor_abono_pecuniario: calc.valorAbonoPecuniario,
        valor_bruto: calc.valorBruto,
        inss: calc.inss,
        irrf: calc.irrf,
        pensao_alimenticia: calc.pensaoAlimenticia,
        valor_liquido: calc.valorLiquido,
      })
      .eq('id', feriasId)

    return {
      success: true,
      holerite_id: novoHolerite.id,
      calculo: calc,
      message: 'Holerite de férias gerado com sucesso',
    }
  } catch (error: any) {
    console.error('[POST /api/ferias/[id]/gerar-holerite] Erro:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao gerar holerite de férias' })
  }
})
