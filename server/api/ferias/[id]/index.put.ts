import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'
import { calcularRemuneracaoFerias, carregarTaxConfigDoBanco } from '../../../utils/calcularFerias'

// PUT /api/ferias/[id] — Editar período de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAdmin(event)
    const supabase = serverSupabaseServiceRole(event)
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' })

    // Verificar se existe
    const { data: existing, error: errGet } = await supabase
      .from('funcionario_ferias')
      .select('*, funcionarios(id, salario_base, numero_dependentes, pensao_config_ativa, pensao_config_tipo, pensao_config_percentual, pensao_config_valor_fixo)')
      .eq('id', id)
      .single()

    if (errGet || !existing) throw createError({ statusCode: 404, statusMessage: 'Período de férias não encontrado' })

    const {
      periodo_aquisitivo_inicio,
      periodo_aquisitivo_fim,
      data_inicio,
      data_fim,
      abono_pecuniario,
      dias_abono,
      status,
      observacoes,
      data_pagamento,
    } = body

    // REGRA: Data de pagamento obrigatória para status ativo (programado, em_gozo, concluido)
    const novoStatus = status !== undefined ? status : existing.status
    const novaDataPagamento = data_pagamento !== undefined ? data_pagamento : existing.data_pagamento

    if (novoStatus !== 'pendente' && novoStatus !== 'cancelado') {
      if (!novaDataPagamento) {
        throw createError({
          statusCode: 400,
          statusMessage: 'A data de pagamento é obrigatória para aprovar ou programar as férias.'
        })
      }
    }

    // Calcular valores se datas foram alteradas
    let updates: Record<string, any> = {}

    const dtInicio = new Date((data_inicio || existing.data_inicio) + 'T00:00:00')
    const dtFim = new Date((data_fim || existing.data_fim) + 'T00:00:00')
    const diasCorridos = Math.floor((dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    let diasUteis = 0
    const cursor = new Date(dtInicio)
    while (cursor <= dtFim) {
      const dow = cursor.getDay()
      if (dow !== 0 && dow !== 6) diasUteis++
      cursor.setDate(cursor.getDate() + 1)
    }

    const usarAbono = abono_pecuniario !== undefined ? abono_pecuniario : existing.abono_pecuniario
    const usarDiasAbono = dias_abono !== undefined ? dias_abono : existing.dias_abono
    // Dias efetivos de férias = corridos
    const diasFerias = diasCorridos

    const func = existing.funcionarios as any
    const salarioBase = Number(func?.salario_base) || 0
    const numeroDependentes = Number(func?.numero_dependentes) || 0

    // Carregar configurações de impostos do banco
    const taxConfig = await carregarTaxConfigDoBanco(supabase)

    const calc = calcularRemuneracaoFerias(
      salarioBase,
      diasFerias,
      usarAbono ? usarDiasAbono : 0,
      numeroDependentes,
      {
        ativa: func?.pensao_config_ativa || false,
        tipo: (func?.pensao_config_tipo as 'percentual' | 'fixo') || 'percentual',
        percentual: Number(func?.pensao_config_percentual) || 0,
        valorFixo: Number(func?.pensao_config_valor_fixo) || 0,
      },
      taxConfig
    )

    if (data_inicio !== undefined) updates.data_inicio = data_inicio
    if (data_fim !== undefined) updates.data_fim = data_fim
    if (periodo_aquisitivo_inicio !== undefined) updates.periodo_aquisitivo_inicio = periodo_aquisitivo_inicio
    if (periodo_aquisitivo_fim !== undefined) updates.periodo_aquisitivo_fim = periodo_aquisitivo_fim
    if (status !== undefined) updates.status = status
    if (observacoes !== undefined) updates.observacoes = observacoes
    if (data_pagamento !== undefined) updates.data_pagamento = data_pagamento
    if (abono_pecuniario !== undefined) updates.abono_pecuniario = abono_pecuniario
    if (dias_abono !== undefined) updates.dias_abono = dias_abono

    // Sempre recalcular valores
    updates = {
      ...updates,
      dias_corridos: diasCorridos,
      dias_uteis: diasUteis,
      valor_remuneracao: calc.valorRemuneracao,
      valor_um_terco: calc.valorUmTerco,
      valor_abono_pecuniario: calc.valorAbonoPecuniario,
      valor_bruto: calc.valorBruto,
      inss: calc.inss,
      irrf: calc.irrf,
      pensao_alimenticia: calc.pensaoAlimenticia,
      valor_liquido: calc.valorLiquido,
    }

    // Se o status foi alterado para 'cancelado' e existe um holerite associado, excluí-lo
    if (novoStatus === 'cancelado' && existing.holerite_id) {
      console.log(`🗑️ [PUT /api/ferias/[id]] Férias canceladas. Removendo holerite associado ID: ${existing.holerite_id}`)
      const { error: errHolerite } = await supabase
        .from('holerites')
        .delete()
        .eq('id', existing.holerite_id)
      
      if (errHolerite) {
        console.error(`❌ [PUT /api/ferias/[id]] Erro ao deletar holerite ${existing.holerite_id}:`, errHolerite)
      } else {
        console.log(`✅ [PUT /api/ferias/[id]] Holerite ${existing.holerite_id} removido devido ao cancelamento`)
        updates.holerite_id = null
      }
    }

    const { data: updated, error: errUpdate } = await supabase
      .from('funcionario_ferias')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (errUpdate) throw createError({ statusCode: 500, statusMessage: errUpdate.message })

    return { success: true, data: updated, calculo: calc }
  } catch (error: any) {
    console.error('[PUT /api/ferias/[id]] Erro:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erro ao atualizar férias' })
  }
})
