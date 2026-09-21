import { createHash } from 'node:crypto'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'
import { avosDecimo, calcularDecimo, validarData } from '../../utils/decimoTerceiro'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const body = await readBody(event)
  const db = serverSupabaseServiceRole(event) as any
  try {
    const id = Number(body.funcionario_id)
    const ano = Number(body.ano)
    const parcela = Number(body.parcela) as 1 | 2
    if (!Number.isInteger(id) || id <= 0 || ano !== 2026 || ![1, 2].includes(parcela)) throw createError({ statusCode: 400, message: 'Funcionário, ano ou parcela inválidos. Tabelas disponíveis: 2026.' })
    const dataPagamento = validarData(String(body.data_pagamento || ''))
    if (Number(dataPagamento.slice(0, 4)) !== ano) throw new Error('Pagamento deve pertencer ao ano do 13º')
    const { data: f, error } = await db.from('funcionarios').select('id,nome_completo,salario_base,data_admissao,tipo_contrato,numero_dependentes,pensao_config_ativa,pensao_config_tipo,pensao_config_percentual,pensao_config_valor_fixo,pensao_config_regras').eq('id', id).single()
    if (error || !f) throw createError({ statusCode: 404, message: 'Funcionário não encontrado' })
    if (f.tipo_contrato !== 'CLT') throw new Error('Geração de 13º disponível para contratos CLT')
    const { data: existentes, error: erroExistentes } = await db.from('holerites').select('id,decimo_parcela,total_proventos,pensao_alimenticia,updated_at').eq('funcionario_id', id).eq('decimo_ano', ano)
    if (erroExistentes) throw erroExistentes
    if (existentes.some((h: any) => h.decimo_parcela === parcela)) throw createError({ statusCode: 409, message: 'Esta parcela já foi gerada. O holerite existente foi preservado.' })
    const primeira = existentes.find((h: any) => h.decimo_parcela === 1)
    if (parcela === 2 && !primeira) throw new Error('Gere ou registre a primeira parcela do 13º antes de gerar a segunda')
    const avosSugeridos = avosDecimo(f.data_admissao, ano)
    const avos = body.avos == null || body.avos === '' ? avosSugeridos : Number(body.avos)
    const remuneracao = body.remuneracao == null || body.remuneracao === '' ? Number(f.salario_base) : Number(body.remuneracao)
    const pensaoManual = body.pensao_manual == null || body.pensao_manual === '' ? undefined : Number(body.pensao_manual)
    const motivo = String(body.justificativa || '').trim()
    if ((pensaoManual !== undefined || avos !== avosSugeridos || remuneracao !== Number(f.salario_base)) && motivo.length < 5) throw new Error('Informe a justificativa dos ajustes manuais (avos, remuneração ou pensão)')
    const calc = calcularDecimo({ ano, parcela, remuneracao, avos, dependentes: Number(f.numero_dependentes || 0), primeiraBruta: Number(primeira?.total_proventos || 0), pensaoPrimeira: Number(primeira?.pensao_alimenticia || 0), pensaoManual,
      pensao: { ativa: !!f.pensao_config_ativa, incide: f.pensao_config_regras?.decimo ?? null, tipo: f.pensao_config_tipo, percentual: Number(f.pensao_config_percentual || 0), valorFixo: Number(f.pensao_config_valor_fixo || 0), base: f.pensao_config_regras?.base ?? null } })
    const avisos = ['Avos sugeridos pela admissão, projetados até dezembro. Confira afastamentos e faltas que afetem o direito.', 'A remuneração deve incluir as médias e adicionais devidos; ajuste quando necessário.']
    if (parcela === 1 && (dataPagamento < `${ano}-02-01` || dataPagamento > `${ano}-11-30`)) avisos.push('Confira a data: o prazo legal usual da primeira parcela vai de fevereiro a novembro.')
    if (parcela === 2 && (dataPagamento < `${ano}-12-01` || dataPagamento > `${ano}-12-20`)) avisos.push('Confira a data: o fechamento do 13º é em dezembro, com pagamento até dia 20.')
    const assinatura = createHash('sha256').update(JSON.stringify({ f, primeira, calc, dataPagamento, motivo })).digest('hex')
    if (body.confirmar !== true) return { success: true, calculo: calc, funcionario: f.nome_completo, avosSugeridos, avisos, assinatura }
    if (body.assinatura !== assinatura || body.conferencia !== true) throw createError({ statusCode: 409, message: 'Confira novamente a prévia: os dados mudaram ou não foram confirmados' })
    const { data: h, error: erroInsert } = await db.from('holerites').insert({
      funcionario_id: id, periodo_inicio: `${ano}-12-01`, periodo_fim: `${ano}-12-31`, data_pagamento: dataPagamento,
      decimo_ano: ano, decimo_parcela: parcela, decimo_primeira_id: primeira?.id || null,
      decimo_dados: { ...calc, justificativa: motivo, avosSugeridos, manualPensao: pensaoManual !== undefined, primeira_id: primeira?.id || null },
      salario_base: calc.proventos, dias_trabalhados: 30, inss: calc.inss, irrf: calc.irrf,
      base_inss: parcela === 2 ? calc.totalDireito : 0, base_irrf: calc.baseIRRF,
      adiantamento: calc.adiantamento, pensao_alimenticia: calc.pensao,
      pensao_tipo: pensaoManual !== undefined ? 'fixo' : f.pensao_config_tipo,
      pensao_percentual: Number(f.pensao_config_percentual || 0), pensao_regras: f.pensao_config_regras,
      total_proventos: calc.proventos, total_descontos: calc.descontos, salario_liquido: calc.liquido, fgts: calc.fgts,
      beneficios: [], descontos_personalizados: [], status: 'gerado',
      observacoes: `13º salário — ${parcela}ª parcela — ${ano} — ${avos}/12 avos`
    }).select('id').single()
    if (erroInsert) {
      if (erroInsert.code === '23505') throw createError({ statusCode: 409, message: 'Parcela já gerada por outra operação. Atualize a lista.' })
      throw erroInsert
    }
    return { success: true, id: h.id, calculo: calc }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: error.code ? 500 : 400, message: error.code ? 'Não foi possível gravar o 13º. Verifique a configuração do banco.' : error.message })
  }
})
