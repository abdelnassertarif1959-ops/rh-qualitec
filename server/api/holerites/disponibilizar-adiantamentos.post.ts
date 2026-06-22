import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'

/**
 * API para disponibilização automática de adiantamentos
 * Executa todo dia 17 do mês para disponibilizar adiantamentos no perfil dos funcionários
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado disponibilizando adiantamentos:', requestingUser.nome_completo)
  
  try {
    const supabase = serverSupabaseServiceRole(event)
    const hoje = new Date()
    const diaAtual = hoje.getDate()
    const mesAtual = hoje.getMonth() + 1
    const anoAtual = hoje.getFullYear()

    console.log(`🗓️ [DISPONIBILIZAR-ADIANTAMENTOS] Executando em ${hoje.toISOString().split('T')[0]}`)
    console.log(`📅 Dia atual: ${diaAtual} | Mês: ${mesAtual} | Ano: ${anoAtual}`)

    // Verificar se é dia 17 (ou permitir execução manual)
    const body = await readBody(event).catch(() => ({}))
    const forcarExecucao = body?.forcar || false

    if (diaAtual !== 17 && !forcarExecucao) {
      console.log(`⏰ Não é dia 17 (hoje é dia ${diaAtual}). Disponibilização automática não executada.`)
      return {
        success: false,
        message: `Disponibilização automática só executa no dia 17. Hoje é dia ${diaAtual}.`,
        executado: false,
        dia_atual: diaAtual
      }
    }

    if (forcarExecucao) {
      console.log(`🔧 Execução forçada ativada - ignorando verificação de data`)
    }

    // Buscar adiantamentos do mês atual com status "gerado"
    // Adiantamentos agora têm periodo_inicio = dia 1 do mês
    const mesAnoAtual = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`
    
    console.log(`🔍 Buscando adiantamentos do mês ${mesAnoAtual} com status 'gerado'...`)

    const { data: adiantamentos, error: errorBusca } = await supabase
      .from('holerites')
      .select(`
        id,
        funcionario_id,
        periodo_inicio,
        periodo_fim,
        salario_base,
        status,
        observacoes,
        funcionarios!inner(nome_completo, email, email_login)
      `)
      .eq('status', 'gerado')
      .eq('periodo_inicio', `${mesAnoAtual}-01`) // Adiantamentos começam no dia 01
      .like('observacoes', 'Adiantamento%') // Garantir que é adiantamento

    if (errorBusca) {
      console.error('❌ Erro ao buscar adiantamentos:', errorBusca)
      throw errorBusca
    }

    if (!adiantamentos || adiantamentos.length === 0) {
      console.log(`📭 Nenhum adiantamento encontrado para disponibilizar no mês ${mesAnoAtual}`)
      return {
        success: true,
        message: `Nenhum adiantamento encontrado para disponibilizar no mês ${mesAnoAtual}`,
        executado: true,
        adiantamentos_encontrados: 0,
        adiantamentos_disponibilizados: 0
      }
    }

    console.log(`📦 ${adiantamentos.length} adiantamento(s) encontrado(s) para disponibilizar`)

    let disponibilizados = 0
    let erros = 0
    const resultados = []

    // Disponibilizar cada adiantamento
    for (const adiantamento of adiantamentos) {
      try {
        const funcionario = (adiantamento as any).funcionarios
        console.log(`🔄 Disponibilizando adiantamento para: ${funcionario.nome_completo}`)

        // Atualizar status para "enviado" (disponível no perfil)
        const { error: errorUpdate } = await supabase
          .from('holerites')
          .update({
            status: 'enviado',
            observacoes: `${adiantamento.observacoes} - Disponibilizado automaticamente em ${hoje.toISOString().split('T')[0]}`
          })
          .eq('id', adiantamento.id)

        if (errorUpdate) {
          console.error(`❌ Erro ao disponibilizar adiantamento ${adiantamento.id}:`, errorUpdate)
          erros++
          resultados.push({
            funcionario: funcionario.nome_completo,
            holerite_id: adiantamento.id,
            status: 'erro',
            erro: errorUpdate.message
          })
          continue
        }

        disponibilizados++
        resultados.push({
          funcionario: funcionario.nome_completo,
          holerite_id: adiantamento.id,
          status: 'disponibilizado',
          valor: adiantamento.salario_base
        })

        console.log(`✅ Adiantamento disponibilizado: ${funcionario.nome_completo} - R$ ${adiantamento.salario_base?.toFixed(2)}`)

      } catch (error: any) {
        console.error(`💥 Erro inesperado ao processar adiantamento ${adiantamento.id}:`, error)
        erros++
        resultados.push({
          funcionario: (adiantamento as any).funcionarios?.nome_completo || 'Desconhecido',
          holerite_id: adiantamento.id,
          status: 'erro',
          erro: error.message
        })
      }
    }

    const mensagem = `Disponibilização automática concluída: ${disponibilizados} adiantamento(s) disponibilizado(s)${erros > 0 ? ` (${erros} erro(s))` : ''}`

    console.log(`🎉 ${mensagem}`)
    console.log(`📊 Resumo:`)
    console.log(`   - Encontrados: ${adiantamentos.length}`)
    console.log(`   - Disponibilizados: ${disponibilizados}`)
    console.log(`   - Erros: ${erros}`)

    return {
      success: true,
      message: mensagem,
      executado: true,
      data_execucao: hoje.toISOString(),
      dia_execucao: diaAtual,
      mes_referencia: mesAnoAtual,
      adiantamentos_encontrados: adiantamentos.length,
      adiantamentos_disponibilizados: disponibilizados,
      erros: erros,
      resultados: resultados
    }

  } catch (error: any) {
    console.error('💥 Erro na disponibilização automática de adiantamentos:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro na disponibilização automática de adiantamentos'
    })
  }
})