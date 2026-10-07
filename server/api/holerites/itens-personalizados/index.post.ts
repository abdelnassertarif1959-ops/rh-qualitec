import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado criando item personalizado:', requestingUser.nome_completo)
  
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  try {
    const funcionarioId = Number(body.funcionario_id)
    const valor = Number(body.valor)
    const dataInicio = String(body.data_inicio || '')
    const dataFim = body.data_fim ? String(body.data_fim) : null

    if (!Number.isInteger(funcionarioId) || funcionarioId <= 0) {
      throw createError({ statusCode: 400, message: 'Funcionário inválido.' })
    }
    if (!['beneficio', 'desconto'].includes(body.tipo)) {
      throw createError({ statusCode: 400, message: 'Tipo do item inválido.' })
    }
    if (!['unico', 'recorrente'].includes(body.vigencia_tipo)) {
      throw createError({ statusCode: 400, message: 'Tipo de vigência inválido.' })
    }
    if (!String(body.descricao || '').trim()) {
      throw createError({ statusCode: 400, message: 'Informe a descrição do item.' })
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      throw createError({ statusCode: 400, message: 'Informe um valor maior que zero.' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataInicio) || (dataFim && !/^\d{4}-\d{2}-\d{2}$/.test(dataFim))) {
      throw createError({ statusCode: 400, message: 'Informe uma vigência com datas válidas.' })
    }
    const dataEhValida = (data: string) => {
      const parsed = new Date(data + 'T00:00:00Z')
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === data
    }
    const dataInicioValida = dataEhValida(dataInicio)
    const dataFimValida = !dataFim || dataEhValida(dataFim)
    if (!dataInicioValida || !dataFimValida) {
      throw createError({ statusCode: 400, message: 'Informe uma vigência com datas existentes no calendário.' })
    }
    if (dataFim && dataFim < dataInicio) {
      throw createError({ statusCode: 400, message: 'A data final não pode ser anterior à data inicial.' })
    }

    const { data, error } = await supabase
      .from('holerite_itens_personalizados')
      .insert([{
        funcionario_id: funcionarioId,
        tipo: body.tipo,
        descricao: String(body.descricao).trim(),
        valor,
        vigencia_tipo: body.vigencia_tipo,
        data_inicio: dataInicio,
        data_fim: dataFim,
        observacoes: body.observacoes || null,
        ativo: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar item personalizado:', error)
      
      // Se a tabela não existe, retornar mensagem clara
      if (error.code === 'PGRST205' || error.code === '42P01') {
        throw createError({
          statusCode: 500,
          message: 'Tabela holerite_itens_personalizados não existe. Execute o SQL: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor.'
        })
      }
      
      throw error
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao criar item personalizado:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar item personalizado'
    })
  }
})
