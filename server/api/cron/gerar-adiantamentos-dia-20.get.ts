/**
 * API de cron para gerar e disponibilizar automaticamente adiantamentos no dia 20
 * Se o dia 20 cair em feriado ou fim de semana, executa no último dia útil anterior
 * 
 * Esta API deve ser configurada no Vercel Cron Jobs para executar diariamente
 */
import { requireCronAuth } from '../../utils/cronMiddleware'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação de cron job
  await requireCronAuth(event)
  console.log('[CRON] Geração de adiantamentos dia 20 autorizada')
  
  try {
    const hoje = new Date()
    const diaAtual = hoje.getDate()
    const diaSemana = hoje.getDay() // 0 = Domingo, 6 = Sábado
    
    console.log(`🕐 [CRON-ADIANTAMENTOS-DIA-20] Verificação executada em ${hoje.toISOString()}`)
    console.log(`📅 Dia atual: ${diaAtual}, Dia da semana: ${diaSemana}`)

    // Função para verificar se é dia útil
    const isDiaUtil = (dia: number, diaSemana: number) => {
      // Não é sábado (6) nem domingo (0)
      return diaSemana !== 0 && diaSemana !== 6
    }

    // Função para calcular o dia 20 ou último dia útil anterior
    const calcularDiaExecucao = () => {
      const dia20 = new Date(hoje.getFullYear(), hoje.getMonth(), 20)
      const diaSemana20 = dia20.getDay()
      
      // Se dia 20 é dia útil, executar no dia 20
      if (isDiaUtil(20, diaSemana20)) {
        return 20
      }
      
      // Se dia 20 é sábado, executar na sexta (dia 19)
      if (diaSemana20 === 6) {
        return 19
      }
      
      // Se dia 20 é domingo, executar na sexta (dia 18)
      if (diaSemana20 === 0) {
        return 18
      }
      
      return 20
    }

    const diaExecucao = calcularDiaExecucao()
    
    console.log(`🎯 Dia de execução calculado: ${diaExecucao}`)

    // Se não é o dia de execução, não faz nada
    if (diaAtual !== diaExecucao) {
      console.log(`⏰ Não é o dia de execução (hoje é dia ${diaAtual}, execução no dia ${diaExecucao}). Nenhuma ação necessária.`)
      return {
        success: true,
        message: `Verificação executada. Não é o dia de execução (hoje é dia ${diaAtual}, execução no dia ${diaExecucao}).`,
        dia_atual: diaAtual,
        dia_execucao: diaExecucao,
        acao_executada: false
      }
    }

    console.log(`🎯 É o dia de execução (${diaExecucao})! Gerando e disponibilizando adiantamentos...`)

    const supabase = await serverSupabaseServiceRole(event)
    
    // 1. Buscar todos os funcionários ativos com salário quinzenal
    const { data: funcionarios, error: errorFuncionarios } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('tipo_salario', 'quinzenal')
      .eq('ativo', true)
    
    if (errorFuncionarios) {
      throw new Error(`Erro ao buscar funcionários: ${errorFuncionarios.message}`)
    }

    if (!funcionarios || funcionarios.length === 0) {
      console.log('ℹ️ Nenhum funcionário com salário quinzenal encontrado')
      return {
        success: true,
        message: 'Nenhum funcionário com salário quinzenal encontrado',
        dia_atual: diaAtual,
        dia_execucao: diaExecucao,
        acao_executada: false,
        funcionarios_processados: 0
      }
    }

    console.log(`👥 ${funcionarios.length} funcionário(s) com salário quinzenal encontrado(s)`)

    // 2. Calcular período do adiantamento (dia 1 até último dia do mês)
    const mesAtual = hoje.getMonth()
    const anoAtual = hoje.getFullYear()
    const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0).getDate()
    
    const periodoInicio = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-01`
    const periodoFim = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${ultimoDiaMes}`
    const dataPagamento = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-20`

    console.log(`📅 Período: ${periodoInicio} até ${periodoFim}`)
    console.log(`💰 Data de pagamento: ${dataPagamento}`)

    let holeritesCriados = 0
    let erros = []

    // 3. Gerar adiantamento para cada funcionário
    for (const funcionario of funcionarios) {
      try {
        console.log(`\n👤 Processando funcionário: ${funcionario.nome_completo} (ID: ${funcionario.id})`)
        
        // Pular Umberto (ID 169) para adiantamento
        if (funcionario.id === 169) {
          console.log(`ℹ️ Pula adiantamento para Umberto (ID 169)`)
          continue
        }

        // Verificar se já existe adiantamento para este período
        const { data: holeriteExistente } = await supabase
          .from('holerites')
          .select('id')
          .eq('funcionario_id', funcionario.id)
          .eq('periodo_inicio', periodoInicio)
          .eq('periodo_fim', periodoFim)
          .single()
        
        if (holeriteExistente) {
          console.log(`⚠️ Adiantamento já existe para este funcionário neste período`)
          continue
        }

        // Calcular valor do adiantamento (40% do salário base)
        const salarioBase = funcionario.salario_base || 0
        const valorAdiantamento = salarioBase * 0.4
        
        // Criar holerite de adiantamento
        const { data: novoHolerite, error: errorHolerite } = await supabase
          .from('holerites')
          .insert({
            funcionario_id: funcionario.id,
            periodo_inicio: periodoInicio,
            periodo_fim: periodoFim,
            data_pagamento: dataPagamento,
            salario_base: valorAdiantamento,
            total_proventos: valorAdiantamento,
            total_descontos: 0,
            salario_liquido: valorAdiantamento,
            status: 'gerado',
            dias_trabalhados: 30,
            observacoes: 'Adiantamento salarial gerado automaticamente'
          })
          .select()
          .single()
        
        if (errorHolerite) {
          console.error(`❌ Erro ao criar holerite: ${errorHolerite.message}`)
          erros.push({
            funcionario_id: funcionario.id,
            funcionario_nome: funcionario.nome_completo,
            erro: errorHolerite.message
          })
          continue
        }

        console.log(`✅ Adiantamento criado com sucesso (ID: ${novoHolerite.id})`)
        holeritesCriados++

      } catch (error: any) {
        console.error(`💥 Erro ao processar funcionário ${funcionario.id}:`, error)
        erros.push({
          funcionario_id: funcionario.id,
          funcionario_nome: funcionario.nome_completo,
          erro: error.message
        })
      }
    }

    console.log(`\n📊 Resumo da execução:`)
    console.log(`   ✅ Adiantamentos criados: ${holeritesCriados}`)
    console.log(`   ❌ Erros: ${erros.length}`)

    return {
      success: true,
      message: `Adiantamentos gerados e disponibilizados automaticamente no dia ${diaExecucao}`,
      dia_atual: diaAtual,
      dia_execucao: diaExecucao,
      acao_executada: true,
      funcionarios_processados: funcionarios.length,
      holerites_criados: holeritesCriados,
      erros: erros.length > 0 ? erros : undefined,
      periodo: {
        inicio: periodoInicio,
        fim: periodoFim,
        data_pagamento: dataPagamento
      }
    }

  } catch (error: any) {
    console.error('💥 Erro na geração automática de adiantamentos:', error)
    
    return {
      success: false,
      message: error.message || 'Erro na geração automática de adiantamentos',
      dia_atual: new Date().getDate(),
      acao_executada: false,
      erro: error.message
    }
  }
})
