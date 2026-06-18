/**
 * Plugin de desenvolvimento para debug de z-index
 * Adiciona comandos globais para debug no console
 */

export default defineNuxtPlugin(() => {
  // Só executar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') return

  // Adicionar comandos globais ao window para debug
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.debugZIndex = {
      /**
       * Ativar debug visual
       */
      start: () => {
        const { toggleDebug } = useZIndexDebug()
        toggleDebug()
      },
      
      /**
       * Analisar elemento
       */
      analyze: (selector: string) => {
        const { analyzeElement } = useZIndexDebug()
        analyzeElement(selector)
      },
      
      /**
       * Encontrar z-index altos
       */
      findHigh: (threshold = 1000) => {
        const { findHighZIndex } = useZIndexDebug()
        return findHighZIndex(threshold)
      },
      
      /**
       * Verificar conflitos
       */
      checkConflicts: () => {
        const { checkConflicts } = useZIndexDebug()
        checkConflicts()
      },
      
      /**
       * Mostrar ajuda
       */
      help: () => {
        console.log(`
🔧 Comandos de Debug Z-Index:

debugZIndex.start()           - Ativar debug visual
debugZIndex.analyze(selector) - Analisar elemento específico
debugZIndex.findHigh(1000)    - Encontrar z-index >= 1000
debugZIndex.checkConflicts()  - Verificar conflitos potenciais
debugZIndex.help()            - Mostrar esta ajuda

Exemplos:
debugZIndex.analyze('.notifications-drawer-container')
debugZIndex.findHigh(500)
        `)
      }
    }

    console.log('🔧 Debug Z-Index carregado! Digite debugZIndex.help() para ver comandos.')
  }
})