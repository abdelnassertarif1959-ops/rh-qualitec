/**
 * Script para diagnosticar inconsistência no contador de notificações
 * 
 * Verifica:
 * 1. Total de notificações no banco
 * 2. Total de notificações não lidas
 * 3. Notificações expiradas
 * 4. Notificações por tipo e origem
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO DO CONTADOR DE NOTIFICAÇÕES\n')
  console.log('=' .repeat(60))
  
  try {
    // 1. Total de notificações
    const { count: totalNotificacoes, error: errorTotal } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
    
    if (errorTotal) throw errorTotal
    
    console.log(`\n📊 TOTAL DE NOTIFICAÇÕES: ${totalNotificacoes}`)
    
    // 2. Notificações não lidas
    const { count: totalNaoLidas, error: errorNaoLidas } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false)
    
    if (errorNaoLidas) throw errorNaoLidas
    
    console.log(`📬 NOTIFICAÇÕES NÃO LIDAS: ${totalNaoLidas}`)
    
    // 3. Notificações lidas
    const { count: totalLidas, error: errorLidas } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', true)
    
    if (errorLidas) throw errorLidas
    
    console.log(`✅ NOTIFICAÇÕES LIDAS: ${totalLidas}`)
    
    // 4. Notificações expiradas
    const agora = new Date().toISOString()
    const { count: totalExpiradas, error: errorExpiradas } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .not('data_expiracao', 'is', null)
      .lt('data_expiracao', agora)
    
    if (errorExpiradas) throw errorExpiradas
    
    console.log(`⏰ NOTIFICAÇÕES EXPIRADAS: ${totalExpiradas}`)
    
    // 5. Notificações não lidas E não expiradas (o que o sistema deveria mostrar)
    const { count: totalNaoLidasAtivas, error: errorAtivas } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false)
      .or(`data_expiracao.is.null,data_expiracao.gt.${agora}`)
    
    if (errorAtivas) throw errorAtivas
    
    console.log(`🔔 NOTIFICAÇÕES NÃO LIDAS ATIVAS: ${totalNaoLidasAtivas}`)
    
    console.log('\n' + '='.repeat(60))
    console.log('\n📋 DETALHAMENTO POR TIPO:\n')
    
    // 6. Contagem por tipo
    const { data: porTipo, error: errorTipo } = await supabase
      .from('notificacoes')
      .select('tipo, lida')
    
    if (errorTipo) throw errorTipo
    
    const contagemTipo = {}
    porTipo.forEach(n => {
      if (!contagemTipo[n.tipo]) {
        contagemTipo[n.tipo] = { total: 0, lidas: 0, naoLidas: 0 }
      }
      contagemTipo[n.tipo].total++
      if (n.lida) {
        contagemTipo[n.tipo].lidas++
      } else {
        contagemTipo[n.tipo].naoLidas++
      }
    })
    
    Object.entries(contagemTipo).forEach(([tipo, dados]) => {
      console.log(`  ${tipo}:`)
      console.log(`    Total: ${dados.total}`)
      console.log(`    Lidas: ${dados.lidas}`)
      console.log(`    Não lidas: ${dados.naoLidas}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('\n📋 DETALHAMENTO POR ORIGEM:\n')
    
    // 7. Contagem por origem
    const { data: porOrigem, error: errorOrigem } = await supabase
      .from('notificacoes')
      .select('origem, lida')
    
    if (errorOrigem) throw errorOrigem
    
    const contagemOrigem = {}
    porOrigem.forEach(n => {
      const origem = n.origem || 'sem_origem'
      if (!contagemOrigem[origem]) {
        contagemOrigem[origem] = { total: 0, lidas: 0, naoLidas: 0 }
      }
      contagemOrigem[origem].total++
      if (n.lida) {
        contagemOrigem[origem].lidas++
      } else {
        contagemOrigem[origem].naoLidas++
      }
    })
    
    Object.entries(contagemOrigem).forEach(([origem, dados]) => {
      console.log(`  ${origem}:`)
      console.log(`    Total: ${dados.total}`)
      console.log(`    Lidas: ${dados.lidas}`)
      console.log(`    Não lidas: ${dados.naoLidas}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('\n🔍 ANÁLISE:\n')
    
    // Análise
    if (totalNaoLidas !== totalNaoLidasAtivas) {
      console.log(`⚠️  INCONSISTÊNCIA DETECTADA!`)
      console.log(`   Total não lidas: ${totalNaoLidas}`)
      console.log(`   Total não lidas ativas: ${totalNaoLidasAtivas}`)
      console.log(`   Diferença: ${totalNaoLidas - totalNaoLidasAtivas} (provavelmente expiradas)`)
    } else {
      console.log(`✅ Contadores consistentes!`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('\n💡 RECOMENDAÇÕES:\n')
    
    if (totalExpiradas > 0) {
      console.log(`  • Existem ${totalExpiradas} notificações expiradas que podem ser limpas`)
    }
    
    if (totalNaoLidas > 50) {
      console.log(`  • Existem ${totalNaoLidas} notificações não lidas. Considere marcar antigas como lidas.`)
    }
    
    console.log('\n✅ Diagnóstico concluído!\n')
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error)
    process.exit(1)
  }
}

diagnosticar()
