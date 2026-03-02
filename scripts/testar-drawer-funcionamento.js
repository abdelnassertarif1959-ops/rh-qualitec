/**
 * Script para testar se o drawer de notificações está funcionando
 * Execute no console do navegador na página de admin
 */

console.log('🧪 [TESTE-DRAWER] Iniciando teste do drawer de notificações...')

// 1. Verificar se o container teleports existe
const teleportContainer = document.getElementById('teleports')
console.log('📍 [TESTE-DRAWER] Container teleports encontrado:', !!teleportContainer)
if (teleportContainer) {
  console.log('📍 [TESTE-DRAWER] Container teleports:', teleportContainer)
}

// 2. Verificar se o botão de notificações existe
const notificationButton = document.querySelector('button[aria-label*="Notificações"]')
console.log('🔘 [TESTE-DRAWER] Botão de notificações encontrado:', !!notificationButton)
if (notificationButton) {
  console.log('🔘 [TESTE-DRAWER] Botão:', notificationButton)
}

// 3. Simular clique no botão
if (notificationButton) {
  console.log('👆 [TESTE-DRAWER] Simulando clique no botão...')
  notificationButton.click()
  
  // Aguardar um pouco e verificar se o drawer apareceu
  setTimeout(() => {
    const drawer = document.querySelector('.notifications-drawer-container')
    console.log('📱 [TESTE-DRAWER] Drawer encontrado após clique:', !!drawer)
    
    if (drawer) {
      console.log('✅ [TESTE-DRAWER] Drawer funcionando!')
      console.log('📱 [TESTE-DRAWER] Drawer element:', drawer)
    } else {
      console.log('❌ [TESTE-DRAWER] Drawer não apareceu após clique')
      
      // Verificar estado no Vue
      console.log('🔍 [TESTE-DRAWER] Verificando estado Vue...')
      
      // Tentar encontrar elementos Vue
      const vueApp = document.querySelector('#__nuxt')
      if (vueApp && vueApp.__vue__) {
        console.log('🔍 [TESTE-DRAWER] Vue app encontrado')
      }
    }
  }, 500)
} else {
  console.log('❌ [TESTE-DRAWER] Botão de notificações não encontrado')
}

// 4. Verificar se há erros no console
console.log('🔍 [TESTE-DRAWER] Verifique se há erros no console acima')
console.log('🔍 [TESTE-DRAWER] Teste concluído')