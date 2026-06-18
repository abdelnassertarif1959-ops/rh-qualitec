/**
 * Composable para análise de elementos z-index
 * Analisa elementos específicos e sua hierarquia
 */

export const useZIndexDebugAnalyze = () => {
  const { checkStackingContext } = useZIndexDebugHelpers()
  
  /**
   * Analisar elemento específico
   */
  const analyzeElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (!element) {
      console.warn(`Elemento não encontrado: ${selector}`)
      return
    }
    
    const computedStyle = window.getComputedStyle(element)
    const stackingContext = checkStackingContext(element)
    
    console.group(`🔍 Análise: ${selector}`)
    console.log('Elemento:', element)
    console.log('Cria Stacking Context:', stackingContext)
    console.log('Z-Index:', computedStyle.zIndex)
    console.log('Position:', computedStyle.position)
    console.log('Transform:', computedStyle.transform)
    console.log('Opacity:', computedStyle.opacity)
    console.log('Filter:', computedStyle.filter)
    console.log('Isolation:', computedStyle.isolation)
    
    // Analisar pais
    let parent = element.parentElement
    let level = 1
    console.log('📊 Hierarquia de Stacking Context:')
    
    while (parent && level <= 10) {
      const parentStyle = window.getComputedStyle(parent)
      const parentStacking = checkStackingContext(parent)
      
      if (parentStacking) {
        console.log(`  ${level}. ${parent.tagName}.${parent.className}`, {
          zIndex: parentStyle.zIndex,
          position: parentStyle.position,
          transform: parentStyle.transform !== 'none' ? parentStyle.transform : undefined,
          opacity: parentStyle.opacity !== '1' ? parentStyle.opacity : undefined
        })
      }
      
      parent = parent.parentElement
      level++
    }
    
    console.groupEnd()
  }
  
  return {
    analyzeElement
  }
}
