/**
 * Script simples para testar o drawer
 * Execute no console do navegador na página /test-drawer
 */

console.log('🧪 [TESTE-SIMPLES] Iniciando teste...')

// Verificar se estamos na página de teste
if (!window.location.pathname.includes('test-drawer')) {
  console.log('❌ [TESTE-SIMPLES] Navegue para /test-drawer primeiro')
} else {
  console.log('✅ [TESTE-SIMPLES] Na página de teste')
  
  // Procurar o botão de teste
  const testButton = document.querySelector('button')
  if (testButton) {
    console.log('✅ [TESTE-SIMPLES] Botão encontrado:', testButton.textContent)
    
    // Clicar no botão
    console.log('👆 [TESTE-SIMPLES] Clicando no botão...')
    testButton.click()
    
    // Verificar se o modal apareceu
    setTimeout(() => {
      const modal = document.querySelector('.fixed.inset-0.z-\\[9999\\]')
      if (modal) {
        console.log('✅ [TESTE-SIMPLES] Modal encontrado! Drawer está funcionando!')
      } else {
        console.log('❌ [TESTE-SIMPLES] Modal não encontrado')
      }
    }, 100)
  } else {
    console.log('❌ [TESTE-SIMPLES] Botão não encontrado')
  }
}