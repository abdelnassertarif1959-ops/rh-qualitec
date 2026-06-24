import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../utils/authMiddleware'
import { calcularRemuneracaoFerias, carregarTaxConfigDoBanco } from '../../utils/calcularFerias'

// POST /api/ferias — Criar novo período de férias
export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await requireAuth(event)
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)

    // Se não for admin, força o funcionario_id a ser o do próprio usuário e o status a ser 'pendente'
    if (requestingUser.tipo_acesso !== 'admin') {
      body.funcionario_id = requestingUser.id
      body.status = 'pendente'
    }

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
      .select('id, nome_completo, salario_base, numero_dependentes, pensao_config_ativa, pensao_config_tipo, pensao_config_percentual, pensao_config_valor_fixo')
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

    // Dias efetivos de férias = corridos (o abono é pago como indenização sobre dias adicionais)
    const diasFerias = diasCorridos

    // Carregar configurações de impostos do banco
    const taxConfig = await carregarTaxConfigDoBanco(supabase)

    // Calcular remuneração CLT 2026
    const salarioBase = Number(funcionario.salario_base) || 0
    const numeroDependentes = Number(funcionario.numero_dependentes) || 0
    const calc = calcularRemuneracaoFerias(
      salarioBase,
      diasFerias,
      abono_pecuniario ? dias_abono : 0,
      numeroDependentes,
      {
        ativa: funcionario.pensao_config_ativa || false,
        tipo: (funcionario.pensao_config_tipo as 'percentual' | 'fixo') || 'percentual',
        percentual: Number(funcionario.pensao_config_percentual) || 0,
        valorFixo: Number(funcionario.pensao_config_valor_fixo) || 0,
      },
      taxConfig
    )

    // Determinar status automático ou usar o fornecido (ex: 'pendente' pelo funcionário)
    const hoje = new Date()
    let status = body.status || 'programado'
    if (status !== 'pendente') {
      if (dtInicio <= hoje && dtFim >= hoje) status = 'em_gozo'
      else if (dtFim < hoje) status = 'concluido'
    }

    // REGRA: Data de pagamento obrigatória para status ativo (programado, em_gozo, concluido)
    if (status !== 'pendente' && status !== 'cancelado') {
      if (!data_pagamento) {
        throw createError({
          statusCode: 400,
          statusMessage: 'A data de pagamento é obrigatória para aprovar ou programar as férias.'
        })
      }
    }

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
        pensao_alimenticia: calc.pensaoAlimenticia,
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
