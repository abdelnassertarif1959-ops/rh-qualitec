import { serverSupabaseClient } from '#supabase/server'
import { calcularRemuneracaoFerias } from '../../utils/calcularFerias'

// POST /api/ferias — Criar novo período de férias
export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)
    const body = await readBody(event)

    const {
      funcionario_id,
      periodo_aquisitivo_inicio,
      periodo_aquisitivo_fim,
      data_inicio,
      data_fim,
      abono_pecuniario = false,
      dias_abono = 0,
      observacoes = '',
      data_pagamento = null,
    } = body

    // Validações básicas
    if (!funcionario_id) throw createError({ statusCode: 400, statusMessage: 'funcionario_id é obrigatório' })
    if (!data_inicio || !data_fim) throw createError({ statusCode: 400, statusMessage: 'data_inicio e data_fim são obrigatórios' })
    if (!periodo_aquisitivo_inicio || !periodo_aquisitivo_fim) throw createError({ statusCode: 400, statusMessage: 'Período aquisitivo é obrigatório' })

    // Buscar dados do funcionário
    const { data: funcionario, error: errFunc } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base, numero_dependentes')
      .eq('id', funcionario_id)
      .single()

    if (errFunc || !funcionario) throw createError({ statusCode: 404, statusMessage: 'Funcionário não encontrado' })

    // Calcular dias corridos e úteis
    const dtInicio = new Date(data_inicio + 'T00:00:00')
    const dtFim = new Date(data_fim + 'T00:00:00')
    const diasCorridos = Math.floor((dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    // Calcular dias úteis (excluindo domingos e sábados para fins de registro)
    let diasUteis = 0
    const cursor = new Date(dtInicio)
    while (cursor <= dtFim) {
      const dow = cursor.getDay()
      if (dow !== 0 && dow !== 6) diasUteis++
      cursor.setDate(cursor.getDate() + 1)
    }

    // Dias efetivos de férias = corridos − abono
    const diasFerias = diasCorridos - (abono_pecuniario ? dias_abono : 0)

    // Calcular remuneração CLT 2026
    const salarioBase = Number(funcionario.salario_base) || 0
    const numeroDependentes = Number(funcionario.numero_dependentes) || 0
    const calc = calcularRemuneracaoFerias(
      salarioBase,
      diasFerias,
      abono_pecuniario ? dias_abono : 0,
      numeroDependentes
    )

    // Determinar status automático baseado nas datas
    const hoje = new Date()
    let status = 'programado'
    if (dtInicio <= hoje && dtFim >= hoje) status = 'em_gozo'
    else if (dtFim < hoje) status = 'concluido'

    // Inserir no banco
    const { data: novaFerias, error: errInsert } = await supabase
      .from('funcionario_ferias')
      .insert({
        funcionario_id,
        periodo_aquisitivo_inicio,
        periodo_aquisitivo_fim,
        data_inicio,
        data_fim,
        dias_corridos: diasCorridos,
        dias_uteis: diasUteis,
        abono_pecuniario: abono_pecuniario || false,
        dias_abono: abono_pecuniario ? dias_abono : 0,
        status,
        valor_remuneracao: calc.valorRemuneracao,
        valor_um_terco: calc.valorUmTerco,
        valor_abono_pecuniario: calc.valorAbonoPecuniario,
        valor_bruto: calc.valorBruto,
        inss: calc.inss,
        irrf: calc.irrf,
        valor_liquido: calc.valorLiquido,
        observacoes: observacoes || null,
        data_pagamento: data_pagamento || null,
      })
      .select()
      .single()

    if (errInsert) {
      console.error('[POST /api/ferias] Erro insert:', errInsert)
      throw createError({ statusCode: 500, statusMessage: errInsert.message })
    }

    return {
      success: true,
      data: novaFerias,
      calculo: calc,
      message: 'Férias registradas com sucesso',
    }
  } catch (error: any) {
    console.error('[POST /api/ferias] Erro:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro ao criar férias',
    })
  }
})
