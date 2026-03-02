// Script para testar o contador diário localmente
import { createClient } from '@supabase/supabase-js'

async function testarContadorDiario() {
  try {
    console.log('🚀 Iniciando teste do contador diário...')

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Verificar se a tabela existe e tem dados
    console.log('📊 Verificando estado atual da tabela...')
    const { data: registros, error: errorConsulta } = await supabase
      .from('contador_diario')
      .select('*')
      .order('id', { ascending: false })
      .limit(5)

    if (errorConsulta) {
      console.error('❌ Erro ao consultar tabela:', errorConsulta)
      return
    }

    console.log('📈 Últimos 5 registros:')
    console.table(registros)

    // 2. Executar a função de incremento
    console.log('⚡ Executando incremento...')
    const { data, error } = await supabase.rpc('incrementar_contador_diario')

    if (error) {
      console.error('❌ Erro ao incrementar:', error)
      return
    }

    // 3. Verificar o resultado
    const { data: novoRegistro, error: errorNovo } = await supabase
      .from('contador_diario')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (errorNovo) {
      console.error('❌ Erro ao consultar novo registro:', errorNovo)
      return
    }

    console.log('✅ Novo registro criado:')
    console.table([novoRegistro])

    // 4. Estatísticas
    const { data: stats, error: errorStats } = await supabase
      .from('contador_diario')
      .select('numero')
      .order('numero', { ascending: false })
      .limit(1)
      .single()

    if (!errorStats && stats) {
      const diasRestantes = new Date('2078-12-31').getTime() - new Date().getTime()
      const diasRestantesCalculo = Math.ceil(diasRestantes / (1000 * 60 * 60 * 24))
      
      console.log('\n📊 Estatísticas:')
      console.log(`• Número atual: ${stats.numero}`)
      console.log(`• Dias até 2078: ${diasRestantesCalculo}`)
      console.log(`• Progresso: ${((stats.numero / diasRestantesCalculo) * 100).toFixed(2)}%`)
    }

    console.log('\n🎉 Teste concluído com sucesso!')

  } catch (error) {
    console.error('💥 Erro no teste:', error)
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testarContadorDiario()
}

export { testarContadorDiario }