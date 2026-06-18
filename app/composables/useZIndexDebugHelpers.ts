/**
 * Helpers para debug de z-index
 * Funções auxiliares para verificação de stacking context
 */

export const useZIndexDebugHelpers = () => {
  /**
   * Verificar se elemento cria stacking context
   */
  const checkStackingContext = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element)
    
    // Condições que criam stacking context
    return (
      style.position === 'fixed' ||
      style.position === 'sticky' ||
      (style.position !== 'static' && style.zIndex !== 'auto') ||
      parseFloat(style.opacity) < 1 ||
      style.transform !== 'none' ||
      style.filter !== 'none' ||
      style.perspective !== 'none' ||
      style.clipPath !== 'none' ||
      style.mask !== 'none' ||
      style.mixBlendMode !== 'normal' ||
      style.isolation === 'isolate' ||
      style.willChange === 'transform' ||
      style.willChange === 'opacity'
    )
  }
  
  /**
   * Debug de stacking contexts no documento
   */
  const debugStackingContexts = () => {
    const elements = document.querySelectorAll('*')
    const stackingElements: HTMLElement[] = []
    
    elements.forEach((el) => {
      if (checkStackingContext(el as HTMLElement)) {
        stackingElements.push(el as HTMLElement)
      }
    })
    
    console.log(`📊 Total de elementos com stacking context: ${stackingElements.length}`)
    
    // Agrupar por z-index
    const byZIndex: Record<string, HTMLElement[]> = {}
    
    stackingElements.forEach((el) => {
      const style = window.getComputedStyle(el)
      const zIndex = style.zIndex
      
      if (!byZIndex[zIndex]) {
        byZIndex[zIndex] = []
      }
      byZIndex[zIndex].push(el)
    })
    
    console.log('📊 Elementos agrupados por z-index:', byZIndex)
  }
  
  return {
    checkStackingContext,
    debugStackingContexts
  }
}
