/**
 * Script para diagnosticar inconsistência no contador de notificações
 * 
 * Problema: Badge mostra 40, mas painel mostra 2
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO DE INCONSISTÊNCIA DE NOTIFICAÇÕES\n')
  console.log('=' .repeat(60))

  try {
    // 1. Contar TODAS as notificações
    const { count: totalGeral, error: errorTotal } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })

    console.log('\n📊 TOTAL GERAL DE NOTIFICAÇÕES:', totalGeral)

    // 2. Contar notificações não lidas (sem filtro de expiração)
    const { count: naoLidasSemFiltro, error: errorNaoLidas } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false)

    console.log('📊 NÃO LIDAS (sem filtro de expiração):', naoLidasSemFiltro)

    // 3. Contar notificações não lidas E não expiradas (como na API)
    const { count: naoLidasComFiltro, error: errorFiltro } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false)
      .or('data_expiracao.is.null,data_expiracao.gt.' + new Date().toISOString())

    console.log('📊 NÃO LIDAS (com filtro de expiração):', naoLidasComFiltro)

    // 4. Buscar notificações não lidas para análise detalhada
    const { data: notificacoesNaoLidas, error: errorLista } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('lida', false)
      .order('created_at', { ascending: false })

    console.log('\n📋 ANÁLISE DETALHADA DAS NOTIFICAÇÕES NÃO LIDAS:\n')
    console.log('=' .repeat(60))

    if (notificacoesNaoLidas && notificacoesNaoLidas.length > 0) {
      let expiradas = 0
      let naoExpiradas = 0
      let semDataExpiracao = 0

      notificacoesNaoLidas.forEach((notif, index) => {
        const agora = new Date()
        const dataExpiracao = notif.data_expiracao ? new Date(notif.data_expiracao) : null
        const estaExpirada = dataExpiracao && dataExpiracao < agora

        if (estaExpirada) {
          expiradas++
        } else if (dataExpiracao) {
          naoExpiradas++
        } else {
          semDataExpiracao++
        }

        // Mostrar primeiras 5 e últimas 5
        if (index < 5 || index >= notificacoesNaoLidas.length - 5) {
          console.log(`\n${index + 1}. ID: ${notif.id}`)
          console.log(`   Título: ${notif.titulo}`)
          console.log(`   Tipo: ${notif.tipo}`)
          console.log(`   Origem: ${notif.origem}`)
          console.log(`   Criada em: ${new Date(notif.created_at).toLocaleString('pt-BR')}`)
          console.log(`   Data expiração: ${dataExpiracao ? dataExpiracao.toLocaleString('pt-BR') : 'Sem expiração'}`)
          console.log(`   Status: ${estaExpirada ? '❌ EXPIRADA' : '✅ VÁLIDA'}`)
        } else if (index === 5) {
          console.log('\n   ... (mostrando apenas primeiras 5 e últimas 5) ...')
        }
      })

      console.log('\n' + '=' .repeat(60))
      console.log('\n📊 RESUMO:')
      console.log(`   Total não lidas: ${notificacoesNaoLidas.length}`)
      console.log(`   ✅ Válidas (não expiradas): ${naoExpiradas}`)
      console.log(`   ⏰ Sem data de expiração: ${semDataExpiracao}`)
      console.log(`   ❌ Expiradas: ${expiradas}`)

      console.log('\n💡 DIAGNÓSTICO:')
      if (expiradas > 0) {
        console.log(`   ⚠️  Existem ${expiradas} notificações expiradas marcadas como não lidas`)
        console.log('   📝 Solução: Marcar notificações expiradas como lidas automaticamente')
      }

      if (naoLidasSemFiltro !== naoLidasComFiltro) {
        console.log(`   ⚠️  Diferença entre contadores: ${naoLidasSemFiltro - naoLidasComFiltro}`)
        console.log('   📝 Isso explica a inconsistência no badge')
      }

      // 5. Verificar últimos 30 dias (como no painel)
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - 30)

      const { data: notificacoesRecentes, error: errorRecentes } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('lida', false)
        .gte('created_at', dataLimite.toISOString())
        .or('data_expiracao.is.null,data_expiracao.gt.' + new Date().toISOString())

      console.log(`\n📅 NOTIFICAÇÕES DOS ÚLTIMOS 30 DIAS (não lidas e não expiradas): ${notificacoesRecentes?.length || 0}`)

    } else {
      console.log('   Nenhuma notificação não lida encontrada')
    }

    console.log('\n' + '=' .repeat(60))
    console.log('\n✅ Diagnóstico concluído!')

  } catch (error) {
    console.error('\n❌ Erro no diagnóstico:', error)
  }
}

diagnosticar()
