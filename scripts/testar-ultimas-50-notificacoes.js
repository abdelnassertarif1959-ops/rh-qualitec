/**
 * Script para testar se a API está retornando as últimas 50 notificações
 * Execute no console do navegador na página de admin
 */

console.log('🧪 [TESTE-50] Testando carregamento das últimas 50 notificações...')

async function testarUltimas50Notificacoes() {
  try {
    console.log('📡 [TESTE-50] Fazendo requisição para /api/notificacoes...')
    
    const response = await fetch('/api/notificacoes?limite=50')
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ [TESTE-50] Resposta da API:', {
        total: data.total,
        total_nao_lidas: data.total_nao_lidas,
        filtros: data.filtros,
        notificacoes_recebidas: data.notificacoes.length
      })
      
      if (data.notificacoes.length > 0) {
        console.log('🔝 [TESTE-50] Primeira notificação (mais recente):')
        console.log('   Título:', data.notificacoes[0].titulo)
        console.log('   Data:', data.notificacoes[0].created_at)
        console.log('   Importante:', data.notificacoes[0].importante)
        
        console.log('🔚 [TESTE-50] Última notificação (mais antiga):')
        const ultima = data.notificacoes[data.notificacoes.length - 1]
        console.log('   Título:', ultima.titulo)
        console.log('   Data:', ultima.created_at)
        console.log('   Importante:', ultima.importante)
        
        // Verificar ordenação
        console.log('📊 [TESTE-50] Verificando ordenação...')
        let ordenacaoCorreta = true
        
        for (let i = 0; i < data.notificacoes.length - 1; i++) {
          const atual = data.notificacoes[i]
          const proxima = data.notificacoes[i + 1]
          
          // Verificar se importantes vêm primeiro
          if (!atual.importante && proxima.importante) {
            console.warn('⚠️ [TESTE-50] Ordenação incorreta: notificação não importante antes de importante')
            ordenacaoCorreta = false
          }
          
          // Se ambas têm a mesma importância, verificar data
          if (atual.importante === proxima.importante) {
            const dataAtual = new Date(atual.created_at)
            const dataProxima = new Date(proxima.created_at)
            
            if (dataAtual < dataProxima) {
              console.warn('⚠️ [TESTE-50] Ordenação de data incorreta:', atual.created_at, 'antes de', proxima.created_at)
              ordenacaoCorreta = false
            }
          }
        }
        
        if (ordenacaoCorreta) {
          console.log('✅ [TESTE-50] Ordenação está correta!')
        } else {
          console.log('❌ [TESTE-50] Problemas na ordenação encontrados')
        }
        
        // Contar não lidas
        const naoLidas = data.notificacoes.filter(n => !n.lida)
        console.log('📈 [TESTE-50] Estatísticas:')
        console.log('   Total carregadas:', data.notificacoes.length)
        console.log('   Não lidas:', naoLidas.length)
        console.log('   Lidas:', data.notificacoes.length - naoLidas.length)
        
      } else {
        console.log('📭 [TESTE-50] Nenhuma notificação encontrada')
      }
      
    } else {
      console.error('❌ [TESTE-50] Erro na resposta da API:', data)
    }
    
  } catch (error) {
    console.error('💥 [TESTE-50] Erro ao testar API:', error)
  }
}

// Executar teste
testarUltimas50Notificacoes()

console.log('🔍 [TESTE-50] Para testar novamente, execute: testarUltimas50Notificacoes()')