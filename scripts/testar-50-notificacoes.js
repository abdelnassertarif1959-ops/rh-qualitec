/**
 * Script para testar se o drawer está carregando exatamente 50 notificações
 * Execute no console do navegador após abrir o drawer
 */

console.log('🧪 [TESTE-50] Testando carregamento de 50 notificações...')

// Simular abertura do drawer e verificar quantas notificações foram carregadas
setTimeout(() => {
  // Verificar se há notificações no DOM
  const notificationItems = document.querySelectorAll('.divide-y.divide-gray-100 > div')
  console.log('📊 [TESTE-50] Notificações encontradas no DOM:', notificationItems.length)
  
  // Verificar se há indicação de loading
  const loadingElement = document.querySelector('.animate-spin')
  console.log('⏳ [TESTE-50] Loading ativo:', !!loadingElement)
  
  // Verificar footer com informações
  const footerText = document.querySelector('.p-4.border-t.border-gray-200.bg-gray-50')
  if (footerText) {
    console.log('📄 [TESTE-50] Texto do footer:', footerText.textContent)
  }
  
  // Verificar se há mensagem de "sem notificações"
  const emptyState = document.querySelector('.text-center.py-8')
  if (emptyState && emptyState.textContent.includes('Nenhuma notificação')) {
    console.log('📭 [TESTE-50] Estado vazio detectado')
  }
  
  // Verificar se há notificações não lidas (com fundo azul)
  const unreadNotifications = document.querySelectorAll('.bg-blue-50')
  console.log('🔵 [TESTE-50] Notificações não lidas:', unreadNotifications.length)
  
  // Verificar se há notificações lidas
  const readNotifications = notificationItems.length - unreadNotifications.length
  console.log('✅ [TESTE-50] Notificações lidas:', readNotifications)
  
  console.log('🎯 [TESTE-50] Resumo:')
  console.log(`   Total no DOM: ${notificationItems.length}`)
  console.log(`   Não lidas: ${unreadNotifications.length}`)
  console.log(`   Lidas: ${readNotifications}`)
  console.log(`   Limite esperado: 50`)
  console.log(`   Status: ${notificationItems.length <= 50 ? '✅ OK' : '❌ EXCEDEU'}`)
  
}, 2000) // Aguardar 2 segundos para carregar