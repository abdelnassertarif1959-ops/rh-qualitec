/**
 * Composable para debug visual de z-index
 * Gerencia estilos de debug e visualização
 */

export const useZIndexDebugVisual = () => {
  const { debugStackingContexts } = useZIndexDebugHelpers()
  
  /**
   * Iniciar debug visual
   */
  const startDebug = () => {
    // Adicionar estilos de debug
    const style = document.createElement('style')
    style.id = 'z-index-debug'
    style.textContent = `
      /* Debug de Z-Index */
      [style*="z-index"], .z-\\[, [class*="z-"] {
        position: relative !important;
      }
      
      [style*="z-index"]:before, 
      .z-\\[:before,
      [class*="z-"]:before {
        content: attr(class) " | z:" attr(style);
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 2px;
        z-index: 99999;
        pointer-events: none;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* Destacar elementos com stacking context */
      [style*="transform"], 
      [style*="opacity"], 
      [style*="filter"],
      [style*="position: fixed"],
      [style*="position: absolute"],
      [style*="position: relative"][style*="z-index"] {
        outline: 2px dashed orange !important;
        outline-offset: -2px;
      }
    `
    document.head.appendChild(style)
    
    // Log elementos problemáticos
    debugStackingContexts()
    
    console.log('🐛 Z-Index Debug Mode ATIVADO')
    console.log('💡 Elementos com outline laranja podem criar stacking context')
    console.log('💡 Labels vermelhos mostram z-index atual')
  }
  
  /**
   * Parar debug visual
   */
  const stopDebug = () => {
    const style = document.getElementById('z-index-debug')
    if (style) {
      style.remove()
    }
    
    console.log('🐛 Z-Index Debug Mode DESATIVADO')
  }
  
  return {
    startDebug,
    stopDebug
  }
}
