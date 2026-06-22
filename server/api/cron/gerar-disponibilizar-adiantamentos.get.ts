import { serverSupabaseClient } from '#supabase/server'
import { requireCronAuth } from '../../utils/cronMiddleware'

/**
 * API CRON para geração e disponibilização automática de adiantamentos
 * Executa todo dia 20 do mês (ou último dia útil anterior se cair em feriado/fim de semana)
 * 
 * NOVA LÓGICA:
 * - Gera os adiantamentos automaticamente
 * - Disponibiliza imediatamente no perfil dos funcionários
 * - Não envia email (funcionário acessa pelo sistema)
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação CRON
  await requireCronAuth(event)
  
  try {
    const supabase = await serverSupabaseClient(event)
    const hoje = new Date()
    const diaAtual = hoje.getDate()
    const mesAtual = hoje.getMonth() + 1
    const anoAtual = hoje.getFullYear()

    console.log(`🗓️ [GERAR-ADIANTAMENTOS] Executando em ${hoje.toISOString().split('T')[0]}`)
    console.log(`📅 Dia atual: ${diaAtual} | Mês: ${mesAtual} | Ano: ${anoAtual}`)

    // Verificar se é dia 20 ou último dia útil anterior
    const diaDisponibilizacao = calcularDiaDisponibilizacao(hoje)
    
    if (diaAtual !== diaDisponibilizacao) {
      console.log(`⏰ Não é dia de disponibilização (dia ${diaDisponibilizacao}). Hoje é dia ${diaAtual}.`)
      return {
        success: false,
        message: `Disponibilização automática executa no dia ${diaDisponibilizacao}. Hoje é dia ${diaAtual}.`,
        executado: false,
        dia_atual: diaAtual,
        dia_disponibilizacao: diaDisponibilizacao
      }
    }

    console.log(`✅ Dia correto para disponibilização: ${diaAtual}`)

    // Buscar funcionários ativos com salário quinzenal
    const { data: funcionarios, error: errorFuncionarios } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        email,
        email_login,
        salario_base,
        empresa_id,
        cargo,
        departamento,
        tipo_salario,
        vale_transporte,
        plano_saude,
        plano_odontologico,
        dependentes_irrf
      `)
      .eq('tipo_salario', 'quinzenal')
      .eq('ativo', true)

    if (errorFuncionarios) {
      console.error('❌ Erro ao buscar funcionários:', errorFuncionarios)
      throw errorFuncionarios
    }

    if (!funcionarios || funcionarios.length === 0) {
      console.log(`📭 Nenhum funcionário com salário quinzenal encontrado`)
      return {
        success: true,
        message: 'Nenhum funcionário com salário quinzenal encontrado',
        executado: true,
        funcionarios_encontrados: 0,
        adiantamentos_gerados: 0
      }
    }

    console.log(`👥 ${funcionarios.length} funcionário(s) com salário quinzenal encontrado(s)`)

    // Calcular período do adiantamento
    // Adiantamento: dia 1 até último dia do mês
    const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
    const periodoInicio = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-01`
    const periodoFim = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${ultimoDiaMes}`

    console.log(`📅 Período do adiantamento: ${periodoInicio} até ${periodoFim}`)

    let gerados = 0
    let erros = 0
    const resultados = []

    // Gerar adiantamento para cada funcionário
    for (const funcionario of funcionarios) {
      try {
        console.log(`🔄 Gerando adiantamento para: ${funcionario.nome_completo}`)

        // Pular Umberto (ID 169) para adiantamento
        if (funcionario.id === 169) {
          console.log(`ℹ️ Pula adiantamento para Umberto (ID 169)`)
          continue
        }

        // Verificar se já existe adiantamento para este período
        const { data: existente } = await supabase
          .from('holerites')
          .select('id')
          .eq('funcionario_id', funcionario.id)
          .eq('periodo_inicio', periodoInicio)
          .eq('periodo_fim', periodoFim)
          .single()

        if (existente) {
          console.log(`⚠️  Adiantamento já existe para ${funcionario.nome_completo}`)
          resultados.push({
            funcionario: funcionario.nome_completo,
            status: 'ja_existe',
            holerite_id: existente.id
          })
          continue
        }

        // Calcular valores do adiantamento (40% do salário base)
        const salarioBase = funcionario.salario_base || 0
        const valorAdiantamento = salarioBase * 0.4

        // Criar holerite de adiantamento
        const { data: novoHolerite, error: errorInsert } = await supabase
          .from('holerites')
          .insert({
            funcionario_id: funcionario.id,
            periodo_inicio: periodoInicio,
            periodo_fim: periodoFim,
            salario_base: valorAdiantamento,
            total_proventos: valorAdiantamento,
            total_descontos: 0,
            salario_liquido: valorAdiantamento,
            inss: 0,
            irrf: 0,
            vale_transporte: 0,
            status: 'enviado', // Já disponibilizado
            data_pagamento: hoje.toISOString().split('T')[0],
            dias_trabalhados: 30,
            observacoes: `Adiantamento salarial (40%) - Gerado e disponibilizado automaticamente em ${hoje.toISOString().split('T')[0]}`
          })
          .select()
          .single()

        if (errorInsert) {
          console.error(`❌ Erro ao gerar adiantamento para ${funcionario.nome_completo}:`, errorInsert)
          erros++
          resultados.push({
            funcionario: funcionario.nome_completo,
            status: 'erro',
            erro: errorInsert.message
          })
          continue
        }

        gerados++
        resultados.push({
          funcionario: funcionario.nome_completo,
          holerite_id: novoHolerite.id,
          status: 'gerado_e_disponibilizado',
          valor: valorAdiantamento
        })

        console.log(`✅ Adiantamento gerado e disponibilizado: ${funcionario.nome_completo} - R$ ${valorAdiantamento.toFixed(2)}`)

      } catch (error: any) {
        console.error(`💥 Erro inesperado ao processar ${funcionario.nome_completo}:`, error)
        erros++
        resultados.push({
          funcionario: funcionario.nome_completo,
          status: 'erro',
          erro: error.message
        })
      }
    }

    const mensagem = `Geração automática concluída: ${gerados} adiantamento(s) gerado(s) e disponibilizado(s)${erros > 0 ? ` (${erros} erro(s))` : ''}`

    console.log(`🎉 ${mensagem}`)
    console.log(`📊 Resumo:`)
    console.log(`   - Funcionários encontrados: ${funcionarios.length}`)
    console.log(`   - Adiantamentos gerados: ${gerados}`)
    console.log(`   - Erros: ${erros}`)

    return {
      success: true,
      message: mensagem,
      executado: true,
      data_execucao: hoje.toISOString(),
      dia_execucao: diaAtual,
      periodo_inicio: periodoInicio,
      periodo_fim: periodoFim,
      funcionarios_encontrados: funcionarios.length,
      adiantamentos_gerados: gerados,
      erros: erros,
      resultados: resultados
    }

  } catch (error: any) {
    console.error('💥 Erro na geração automática de adiantamentos:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro na geração automática de adiantamentos'
    })
  }
})

/**
 * Calcula o dia de disponibilização dos adiantamentos
 * Regra: Dia 20, ou último dia útil anterior se cair em feriado/fim de semana
 */
function calcularDiaDisponibilizacao(data: Date): number {
  const ano = data.getFullYear()
  const mes = data.getMonth()
  
  // Começar pelo dia 20
  let diaDisponibilizacao = new Date(ano, mes, 20)
  
  // Verificar se é fim de semana ou feriado
  while (isFimDeSemanaOuFeriado(diaDisponibilizacao)) {
    // Voltar um dia
    diaDisponibilizacao.setDate(diaDisponibilizacao.getDate() - 1)
  }
  
  return diaDisponibilizacao.getDate()
}

/**
 * Verifica se a data é fim de semana ou feriado
 */
function isFimDeSemanaOuFeriado(data: Date): boolean {
  const diaSemana = data.getDay()
  
  // Fim de semana (0 = domingo, 6 = sábado)
  if (diaSemana === 0 || diaSemana === 6) {
    return true
  }
  
  // Verificar feriados nacionais fixos
  const dia = data.getDate()
  const mes = data.getMonth() + 1
  
  const feriadosFixos = [
    { dia: 1, mes: 1 },   // Ano Novo
    { dia: 21, mes: 4 },  // Tiradentes
    { dia: 1, mes: 5 },   // Dia do Trabalho
    { dia: 7, mes: 9 },   // Independência
    { dia: 12, mes: 10 }, // Nossa Senhora Aparecida
    { dia: 2, mes: 11 },  // Finados
    { dia: 15, mes: 11 }, // Proclamação da República
    { dia: 25, mes: 12 }  // Natal
  ]
  
  return feriadosFixos.some(f => f.dia === dia && f.mes === mes)
}
