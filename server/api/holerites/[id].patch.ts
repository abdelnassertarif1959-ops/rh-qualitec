import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado editando holerite:', requestingUser.nome_completo)

  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite não fornecido'
      })
    }

    // Função auxiliar para converter valores vazios em 0 ou null
    const parseNumericValue = (value: any): number => {
      if (value === '' || value === null || value === undefined) return 0
      const parsed = Number(value)
      return isNaN(parsed) ? 0 : parsed
    }

    const parseStringValue = (value: any): string | null => {
      if (value === '' || value === null || value === undefined) return null
      return String(value)
    }

    // Construir objeto de atualização apenas com campos enviados
    const dadosParaAtualizar: any = {}

    // Campos editáveis (numéricos)
    if (body.salario_base !== undefined) dadosParaAtualizar.salario_base = parseNumericValue(body.salario_base)
    if (body.bonus !== undefined) dadosParaAtualizar.bonus = parseNumericValue(body.bonus)
    if (body.horas_extras !== undefined) dadosParaAtualizar.horas_extras = parseNumericValue(body.horas_extras)
    if (body.adicional_noturno !== undefined) dadosParaAtualizar.adicional_noturno = parseNumericValue(body.adicional_noturno)
    if (body.adicional_periculosidade !== undefined) dadosParaAtualizar.adicional_periculosidade = parseNumericValue(body.adicional_periculosidade)
    if (body.adicional_insalubridade !== undefined) dadosParaAtualizar.adicional_insalubridade = parseNumericValue(body.adicional_insalubridade)
    if (body.comissoes !== undefined) dadosParaAtualizar.comissoes = parseNumericValue(body.comissoes)
    if (body.inss !== undefined) dadosParaAtualizar.inss = parseNumericValue(body.inss)
    if (body.inss_referencia !== undefined) dadosParaAtualizar.inss_referencia = body.inss_referencia || null
    if (body.irrf !== undefined) dadosParaAtualizar.irrf = parseNumericValue(body.irrf)
    if (body.fgts !== undefined) dadosParaAtualizar.fgts = parseNumericValue(body.fgts)
    if (body.vale_transporte !== undefined) dadosParaAtualizar.vale_transporte = parseNumericValue(body.vale_transporte)
    if (body.cesta_basica_desconto !== undefined) dadosParaAtualizar.cesta_basica_desconto = parseNumericValue(body.cesta_basica_desconto)
    if (body.vale_refeicao_desconto !== undefined) dadosParaAtualizar.cesta_basica_desconto = parseNumericValue(body.vale_refeicao_desconto)
    if (body.plano_saude !== undefined) dadosParaAtualizar.plano_saude = parseNumericValue(body.plano_saude)
    if (body.plano_odontologico !== undefined) dadosParaAtualizar.plano_odontologico = parseNumericValue(body.plano_odontologico)
    if (body.adiantamento !== undefined) dadosParaAtualizar.adiantamento = parseNumericValue(body.adiantamento)
    if (body.faltas !== undefined) dadosParaAtualizar.faltas = parseNumericValue(body.faltas)
    if (body.pensao_alimenticia !== undefined) dadosParaAtualizar.pensao_alimenticia = parseNumericValue(body.pensao_alimenticia)
    if (body.desconto_afastamento !== undefined) dadosParaAtualizar.desconto_afastamento = parseNumericValue(body.desconto_afastamento)
    if (body.dias_trabalhados !== undefined) dadosParaAtualizar.dias_trabalhados = parseNumericValue(body.dias_trabalhados)

    // Configurações de INSS
    if (body.inss_tipo !== undefined) dadosParaAtualizar.inss_tipo = body.inss_tipo
    if (body.inss_percentual !== undefined) dadosParaAtualizar.inss_percentual = parseNumericValue(body.inss_percentual)

    // Configurações de Pensão Alimentícia
    if (body.pensao_tipo !== undefined) dadosParaAtualizar.pensao_tipo = body.pensao_tipo
    if (body.pensao_percentual !== undefined) dadosParaAtualizar.pensao_percentual = parseNumericValue(body.pensao_percentual)
    if (body.pensao_recorrente !== undefined) dadosParaAtualizar.pensao_recorrente = body.pensao_recorrente

    // Campos de texto
    if (body.observacoes !== undefined) dadosParaAtualizar.observacoes = parseStringValue(body.observacoes)
    if (body.data_pagamento !== undefined) dadosParaAtualizar.data_pagamento = parseStringValue(body.data_pagamento)
    if (body.status !== undefined) dadosParaAtualizar.status = body.status

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Nenhum campo para atualizar'
      })
    }

    // CORREÇÃO: Recalcular totais se algum valor foi alterado
    const camposQueAfetamCalculo = [
      'salario_base', 'dias_trabalhados', 'bonus', 'horas_extras', 'adicional_noturno',
      'adicional_periculosidade', 'adicional_insalubridade', 'comissoes',
      'inss', 'irrf', 'vale_transporte', 'cesta_basica_desconto',
      'plano_saude', 'plano_odontologico', 'adiantamento', 'faltas', 'pensao_alimenticia',
      'desconto_afastamento'
    ]

    const precisaRecalcular = camposQueAfetamCalculo.some(campo => dadosParaAtualizar[campo] !== undefined)

    if (precisaRecalcular) {
      // Buscar dados atuais do holerite para calcular totais
      const { data: holeriteAtual } = await supabase
        .from('holerites')
        .select('*')
        .eq('id', id)
        .single()

      if (holeriteAtual) {
        // Aplicar as alterações aos dados atuais
        const dadosAtualizados = { ...holeriteAtual, ...dadosParaAtualizar }

        // Buscar itens personalizados ativos pela DATA DE GERAÇÃO do holerite
        // Usa created_at (quando foi gerado/pago), não o período de competência (março, fev, etc.)
        const dataGeracao = holeriteAtual.created_at
          ? holeriteAtual.created_at.split('T')[0]
          : new Date().toISOString().split('T')[0]

        const { data: itensPersonalizados } = await (supabase as any)
          .from('holerite_itens_personalizados')
          .select('*')
          .eq('funcionario_id', holeriteAtual.funcionario_id)
          .eq('ativo', true)
          .lte('data_inicio', dataGeracao)
          .or(`data_fim.is.null,data_fim.gte.${dataGeracao}`)

        const beneficiosPersonalizados = (itensPersonalizados || []).filter((i: any) => i.tipo === 'beneficio')
        const descontosPersonalizados = (itensPersonalizados || []).filter((i: any) => i.tipo === 'desconto')

        const totalBeneficiosPersonalizados = beneficiosPersonalizados.reduce((acc: number, i: any) => acc + Number(i.valor || 0), 0)
        const totalDescontosPersonalizados = descontosPersonalizados.reduce((acc: number, i: any) => acc + Number(i.valor || 0), 0)

        console.log(`📋 Itens personalizados no recálculo: benefícios=${beneficiosPersonalizados.length} (R$${totalBeneficiosPersonalizados}), descontos=${descontosPersonalizados.length} (R$${totalDescontosPersonalizados})`)

        // Calcular salário proporcional aos dias trabalhados
        const salarioBase = Number(dadosAtualizados.salario_base || 0)
        const diasTrabalhados = Number(dadosAtualizados.dias_trabalhados || 30)
        const valorDia = salarioBase / 30
        const salarioProporcional = valorDia * diasTrabalhados

        // Calcular totais incluindo itens personalizados
        const totalProventos =
          salarioProporcional +
          Number(dadosAtualizados.bonus || 0) +
          Number(dadosAtualizados.horas_extras || 0) +
          Number(dadosAtualizados.adicional_noturno || 0) +
          Number(dadosAtualizados.adicional_periculosidade || 0) +
          Number(dadosAtualizados.adicional_insalubridade || 0) +
          Number(dadosAtualizados.comissoes || 0) +
          totalBeneficiosPersonalizados

        const totalDescontosRaw =
          Number(dadosAtualizados.inss || 0) +
          Number(dadosAtualizados.irrf || 0) +
          Number(dadosAtualizados.vale_transporte || 0) +
          Number(dadosAtualizados.cesta_basica_desconto || 0) +
          Number(dadosAtualizados.plano_saude || 0) +
          Number(dadosAtualizados.plano_odontologico || 0) +
          Number(dadosAtualizados.adiantamento || 0) +
          Number(dadosAtualizados.faltas || 0) +
          Number(dadosAtualizados.pensao_alimenticia || 0) +
          Number(dadosAtualizados.desconto_afastamento || 0) +
          totalDescontosPersonalizados

        // Total de descontos nunca pode exceder o total de proventos
        const totalDescontos = Math.min(totalDescontosRaw, totalProventos)

        const salarioLiquido = Math.max(0, totalProventos - totalDescontos)

        // Atualizar JSONB dos itens personalizados no holerite
        dadosParaAtualizar.beneficios = beneficiosPersonalizados.map((i: any) => ({
          descricao: i.descricao,
          valor: Number(i.valor)
        }))
        dadosParaAtualizar.descontos_personalizados = descontosPersonalizados.map((i: any) => ({
          descricao: i.descricao,
          valor: Number(i.valor)
        }))

        dadosParaAtualizar.total_proventos = totalProventos
        dadosParaAtualizar.total_descontos = totalDescontos
        dadosParaAtualizar.salario_liquido = salarioLiquido

        console.log('🧮 Recalculando totais do holerite:', {
          id,
          salarioBase,
          diasTrabalhados,
          salarioProporcional,
          totalBeneficiosPersonalizados,
          totalDescontosPersonalizados,
          totalProventos,
          totalDescontos,
          salarioLiquido
        })
      }
    }

    // @ts-ignore
    const { data, error } = await supabase
      .from('holerites')
      // @ts-ignore
      .update(dadosParaAtualizar)
      .eq('id', id)
      .select(`
        *,
        funcionario:funcionarios (
          nome_completo,
          cargo:cargos (nome),
          empresa:empresas (nome_fantasia)
        )
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar holerite:', error)
      throw error
    }

    return {
      success: true,
      data
    }

  } catch (error: any) {
    console.error('Erro ao atualizar holerite:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao atualizar holerite'
    })
  }
})
