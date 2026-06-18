/**
 * Composable para busca e verificação de z-index
 * Encontra elementos com z-index alto e verifica conflitos
 */

export const useZIndexDebugSearch = () => {
  /**
   * Encontrar elementos com z-index alto
   */
  const findHighZIndex = (threshold = 1000) => {
    const elements = document.querySelectorAll('*')
    const highZElements: Array<{ element: HTMLElement, zIndex: number }> = []
    
    elements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el as HTMLElement)
      const zIndex = parseInt(computedStyle.zIndex)
      
      if (!isNaN(zIndex) && zIndex >= threshold) {
        highZElements.push({
          element: el as HTMLElement,
          zIndex
        })
      }
    })
    
    // Ordenar por z-index
    highZElements.sort((a, b) => b.zIndex - a.zIndex)
    
    console.group(`🔍 Elementos com Z-Index >= ${threshold}:`)
    highZElements.forEach(({ element, zIndex }, index) => {
      console.log(`${index + 1}. Z-Index: ${zIndex}`, {
        element,
        tagName: element.tagName,
        className: element.className,
        id: element.id
      })
    })
    console.groupEnd()
    
    return highZElements
  }
  
  /**
   * Verificar conflitos potenciais
   */
  const checkConflicts = () => {
    const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"]')
    const overlays = document.querySelectorAll('.overlay, [class*="overlay"], .backdrop, [class*="backdrop"]')
    const dropdowns = document.querySelectorAll('.dropdown, [class*="dropdown"], .popover, [class*="popover"]')
    
    console.group('🔍 Verificação de Conflitos:')
    
    console.log('Modais encontrados:', modals.length)
    modals.forEach((modal, index) => {
      const style = window.getComputedStyle(modal as HTMLElement)
      console.log(`  Modal ${index + 1}:`, {
        element: modal,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.log('Overlays encontrados:', overlays.length)
    overlays.forEach((overlay, index) => {
      const style = window.getComputedStyle(overlay as HTMLElement)
      console.log(`  Overlay ${index + 1}:`, {
        element: overlay,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.log('Dropdowns/Popovers encontrados:', dropdowns.length)
    dropdowns.forEach((dropdown, index) => {
      const style = window.getComputedStyle(dropdown as HTMLElement)
      console.log(`  Dropdown ${index + 1}:`, {
        element: dropdown,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.groupEnd()
  }
  
  return {
    findHighZIndex,
    checkConflicts
  }
}
