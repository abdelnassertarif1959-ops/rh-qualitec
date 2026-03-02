/**
 * Script para testar o drawer de notificações
 */

console.log('🧪 [TESTE-DRAWER] Testando drawer de notificações...')

// Verificar se o container de teleports existe
const teleportContainer = document.getElementById('teleports')
console.log('📋 [TESTE-DRAWER] Container teleports:', teleportContainer ? 'ENCONTRADO' : 'NÃO ENCONTRADO')

if (teleportContainer) {
  console.log('📋 [TESTE-DRAWER] Container teleports HTML:', teleportContainer.outerHTML)
  console.log('📋 [TESTE-DRAWER] Filhos do container:', teleportContainer.children.length)
}

// Verificar se o botão de notificações existe
const notificationButton = document.querySelector('[aria-label*="Notificações"]') || 
                           document.querySelector('button[aria-expanded]') ||
                           document.querySelector('button:has(svg path[d*="M15 17h5l-5 5v-5"])')

console.log('📋 [TESTE-DRAWER] Botão de notificações:', notificationButton ? 'ENCONTRADO' : 'NÃO ENCONTRADO')

if (notificationButton) {
  console.log('📋 [TESTE-DRAWER] Botão HTML:', notificationButton.outerHTML)
  
  // Simular clique
  console.log('🖱️ [TESTE-DRAWER] Simulando clique no botão...')
  notificationButton.click()
  
  // Verificar se o drawer apareceu
  setTimeout(() => {
    const drawer = document.querySelector('.notifications-drawer-container') ||
                   document.querySelector('[role="dialog"]') ||
                   teleportContainer?.querySelector('div')
    
    console.log('📋 [TESTE-DRAWER] Drawer após clique:', drawer ? 'ENCONTRADO' : 'NÃO ENCONTRADO')
    
    if (drawer) {
      console.log('📋 [TESTE-DRAWER] Drawer HTML:', drawer.outerHTML.substring(0, 200) + '...')
    }
  }, 1000)
}

// Verificar estado global
if (typeof window !== 'undefined' && window.$nuxt) {
  console.log('📋 [TESTE-DRAWER] Estado Nuxt disponível')
  
  // Tentar acessar o estado global
  setTimeout(() => {
    try {
      const nuxtApp = window.$nuxt
      console.log('📋 [TESTE-DRAWER] Nuxt app:', nuxtApp)
    } catch (error) {
      console.log('📋 [TESTE-DRAWER] Erro ao acessar Nuxt app:', error)
    }
  }, 500)
}