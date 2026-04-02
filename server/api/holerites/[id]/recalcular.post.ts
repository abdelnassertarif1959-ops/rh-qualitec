import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

/**
 * Recalcula os totais de um holerite incluindo itens personalizados ativos.
 * Deve ser chamado após adicionar/remover itens personalizados.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID do holerite obrigatório' })

  // Buscar holerite atual
  const { data: holerite, error: erroHolerite } = await (supabase as any)
    .from('holerites')
    .select('*')
    .eq('id', id)
    .single()

  if (erroHolerite || !holerite) {
    throw createError({ statusCode: 404, message: 'Holerite não encontrado' })
  }

  // Buscar itens personalizados ativos para a DATA DE GERAÇÃO do holerite
  // Usa created_at do holerite (quando foi gerado/pago), não o período de competência
  const dataGeracao = holerite.created_at ? holerite.created_at.split('T')[0] : new Date().toISOString().split('T')[0]

  const { data: itens } = await (supabase as any)
    .from('holerite_itens_personalizados')
    .select('*')
    .eq('funcionario_id', holerite.funcionario_id)
    .eq('ativo', true)
    .lte('data_inicio', dataGeracao)
    .or(`data_fim.is.null,data_fim.gte.${dataGeracao}`)

  const beneficios = (itens || []).filter((i: any) => i.tipo === 'beneficio')
  const descontos = (itens || []).filter((i: any) => i.tipo === 'desconto')

  const totalBeneficios = beneficios.reduce((acc: number, i: any) => acc + Number(i.valor || 0), 0)
  const totalDescontosPersonalizados = descontos.reduce((acc: number, i: any) => acc + Number(i.valor || 0), 0)

  // Calcular salário proporcional
  const salarioBase = Number(holerite.salario_base || 0)
  const diasTrabalhados = Number(holerite.dias_trabalhados || 30)
  const salarioProporcional = (salarioBase / 30) * diasTrabalhados

  const totalProventos =
    salarioProporcional +
    Number(holerite.bonus || 0) +
    Number(holerite.horas_extras || 0) +
    Number(holerite.adicional_noturno || 0) +
    Number(holerite.adicional_periculosidade || 0) +
    Number(holerite.adicional_insalubridade || 0) +
    Number(holerite.comissoes || 0) +
    totalBeneficios

  const totalDescontos =
    Number(holerite.inss || 0) +
    Number(holerite.irrf || 0) +
    Number(holerite.vale_transporte || 0) +
    Number(holerite.cesta_basica_desconto || 0) +
    Number(holerite.plano_saude || 0) +
    Number(holerite.plano_odontologico || 0) +
    Number(holerite.adiantamento || 0) +
    Number(holerite.faltas || 0) +
    Number(holerite.pensao_alimenticia || 0) +
    totalDescontosPersonalizados

  const salarioLiquido = totalProventos - totalDescontos

  console.log(`🧮 [RECALCULAR] Holerite ${id}:`, {
    beneficios: beneficios.length,
    descontos: descontos.length,
    totalBeneficios,
    totalDescontosPersonalizados,
    totalProventos,
    totalDescontos,
    salarioLiquido
  })

  // Atualizar holerite com novos totais e JSONB dos itens
  const { data: atualizado, error: erroUpdate } = await (supabase as any)
    .from('holerites')
    .update({
      total_proventos: totalProventos,
      total_descontos: totalDescontos,
      salario_liquido: salarioLiquido,
      beneficios: beneficios.map((i: any) => ({ descricao: i.descricao, valor: Number(i.valor) })),
      descontos_personalizados: descontos.map((i: any) => ({ descricao: i.descricao, valor: Number(i.valor) }))
    })
    .eq('id', id)
    .select('id, total_proventos, total_descontos, salario_liquido')
    .single()

  if (erroUpdate) throw createError({ statusCode: 500, message: erroUpdate.message })

  return { success: true, data: atualizado }
})
