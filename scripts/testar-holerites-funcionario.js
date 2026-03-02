/**
 * Script para testar se os holerites estão aparecendo para funcionários
 * Execute no console do navegador quando logado como funcionário
 */

console.log('🧪 [TESTE-HOLERITES] Iniciando teste de holerites para funcionário...')

// Verificar se estamos logados
const currentUser = JSON.parse(localStorage.getItem('auth-user') || '{}')
console.log('👤 [TESTE-HOLERITES] Usuário atual:', currentUser?.nome || 'Não logado')
console.log('👤 [TESTE-HOLERITES] ID do usuário:', currentUser?.id)
console.log('👤 [TESTE-HOLERITES] É admin?', currentUser?.is_admin)

if (!currentUser?.id) {
  console.error('❌ [TESTE-HOLERITES] Usuário não está logado!')
} else {
  // Testar a API de holerites
  console.log('🌐 [TESTE-HOLERITES] Testando API de holerites...')
  
  const apiUrl = `/api/holerites/meus-holerites?funcionarioId=${currentUser.id}`
  console.log('🌐 [TESTE-HOLERITES] URL da API:', apiUrl)
  
  fetch(apiUrl)
    .then(response => {
      console.log('📊 [TESTE-HOLERITES] Status da resposta:', response.status)
      console.log('📊 [TESTE-HOLERITES] Headers da resposta:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return response.json()
    })
    .then(holerites => {
      console.log('✅ [TESTE-HOLERITES] Holerites recebidos:', holerites)
      console.log('📦 [TESTE-HOLERITES] Quantidade:', holerites?.length || 0)
      
      if (holerites && holerites.length > 0) {
        console.log('📋 [TESTE-HOLERITES] Detalhes dos holerites:')
        holerites.forEach((h, i) => {
          console.log(`   ${i+1}. ID: ${h.id}`)
          console.log(`      Status: ${h.status}`)
          console.log(`      Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
          console.log(`      Valor: R$ ${h.salario_liquido || 'N/A'}`)
          console.log(`      Disponível em: ${h.data_disponibilizacao || 'N/A'}`)
          console.log('      ---')
        })
      } else {
        console.log('⚠️ [TESTE-HOLERITES] Nenhum holerite encontrado')
        console.log('💡 [TESTE-HOLERITES] Possíveis motivos:')
        console.log('   - Holerites estão com status "gerado" (não aparecem)')
        console.log('   - Funcionário não tem holerites cadastrados')
        console.log('   - Problema de configuração em produção')
      }
    })
    .catch(error => {
      console.error('❌ [TESTE-HOLERITES] Erro ao buscar holerites:', error)
      console.error('❌ [TESTE-HOLERITES] Detalhes do erro:', error.message)
      
      // Verificar se é erro de rede ou servidor
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 [TESTE-HOLERITES] Erro de rede - verifique a conexão')
      } else if (error.message.includes('500')) {
        console.error('🔧 [TESTE-HOLERITES] Erro interno do servidor - verifique logs')
      } else if (error.message.includes('401')) {
        console.error('🔐 [TESTE-HOLERITES] Erro de autenticação - usuário não autorizado')
      }
    })
}

// Verificar também o ambiente
console.log('🌍 [TESTE-HOLERITES] Ambiente atual:', window.location.hostname)
console.log('🌍 [TESTE-HOLERITES] URL completa:', window.location.href)

// Verificar se há dados no localStorage
const authData = localStorage.getItem('auth-user')
console.log('💾 [TESTE-HOLERITES] Dados de auth no localStorage:', authData ? 'Presentes' : 'Ausentes')

// Verificar cookies
console.log('🍪 [TESTE-HOLERITES] Cookies:', document.cookie || 'Nenhum cookie')

console.log('🧪 [TESTE-HOLERITES] Teste concluído. Verifique os logs acima.')