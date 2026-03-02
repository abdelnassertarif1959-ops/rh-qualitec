/**
 * Configuração padronizada de Z-Index para evitar conflitos
 * 
 * HIERARQUIA DE Z-INDEX:
 * - Base: 0-99 (elementos normais)
 * - Elevated: 100-199 (dropdowns, tooltips)
 * - Overlay: 200-299 (modals pequenos, popovers)
 * - Modal: 1000-1099 (modals principais)
 * - Notification: 1100-1199 (toasts, notificações)
 * - Critical: 9000-9999 (elementos críticos do sistema)
 */

export const Z_INDEX = {
  // Base - Elementos normais
  BASE: 0,
  SIDEBAR: 10,
  HEADER: 20,
  CONTENT: 30,
  
  // Elevated - Elementos flutuantes
  DROPDOWN: 100,
  TOOLTIP: 110,
  POPOVER: 120,
  
  // Overlay - Modais pequenos
  OVERLAY_SMALL: 200,
  MODAL_SMALL: 210,
  
  // Modal - Modais principais
  MODAL_OVERLAY: 1000,
  MODAL_CONTENT: 1010,
  
  // Notification - Sistema de notificações
  NOTIFICATION_OVERLAY: 1000,
  NOTIFICATION_DRAWER: 1010,
  TOAST: 1100,
  
  // Critical - Elementos críticos
  LOADING_OVERLAY: 9000,
  ERROR_BOUNDARY: 9100,
  DEBUG_PANEL: 9200,
  
  // Maximum - Último recurso
  MAX: 9999
} as const

/**
 * Classes Tailwind correspondentes aos z-index
 */
export const Z_INDEX_CLASSES = {
  BASE: 'z-0',
  SIDEBAR: 'z-10',
  HEADER: 'z-20',
  CONTENT: 'z-30',
  
  DROPDOWN: 'z-[100]',
  TOOLTIP: 'z-[110]',
  POPOVER: 'z-[120]',
  
  OVERLAY_SMALL: 'z-[200]',
  MODAL_SMALL: 'z-[210]',
  
  MODAL_OVERLAY: 'z-[1000]',
  MODAL_CONTENT: 'z-[1010]',
  
  NOTIFICATION_OVERLAY: 'z-[1000]',
  NOTIFICATION_DRAWER: 'z-[1010]',
  TOAST: 'z-[1100]',
  
  LOADING_OVERLAY: 'z-[9000]',
  ERROR_BOUNDARY: 'z-[9100]',
  DEBUG_PANEL: 'z-[9200]',
  
  MAX: 'z-[9999]'
} as const

/**
 * Função para obter z-index seguro
 */
export function getZIndex(level: keyof typeof Z_INDEX): number {
  return Z_INDEX[level]
}

/**
 * Função para obter classe Tailwind de z-index
 */
export function getZIndexClass(level: keyof typeof Z_INDEX_CLASSES): string {
  return Z_INDEX_CLASSES[level]
}

/**
 * Verificar se um elemento pode criar stacking context
 */
export function checkStackingContext(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element)
  
  // Propriedades que criam stacking context
  const stackingProperties = [
    computedStyle.position !== 'static' && computedStyle.zIndex !== 'auto',
    computedStyle.opacity !== '1',
    computedStyle.transform !== 'none',
    computedStyle.filter !== 'none',
    computedStyle.perspective !== 'none',
    computedStyle.clipPath !== 'none',
    computedStyle.mask !== 'none',
    computedStyle.isolation === 'isolate',
    computedStyle.mixBlendMode !== 'normal',
    computedStyle.contain === 'layout' || computedStyle.contain === 'paint' || computedStyle.contain === 'strict'
  ]
  
  return stackingProperties.some(Boolean)
}

/**
 * Debug: Listar elementos com stacking context
 */
export function debugStackingContexts(): void {
  if (process.env.NODE_ENV !== 'development') return
  
  const elements = document.querySelectorAll('*')
  const stackingElements: HTMLElement[] = []
  
  elements.forEach((el) => {
    if (checkStackingContext(el as HTMLElement)) {
      stackingElements.push(el as HTMLElement)
    }
  })
  
  console.group('🔍 Elementos com Stacking Context:')
  stackingElements.forEach((el, index) => {
    const computedStyle = window.getComputedStyle(el)
    console.log(`${index + 1}.`, {
      element: el,
      tagName: el.tagName,
      className: el.className,
      zIndex: computedStyle.zIndex,
      position: computedStyle.position,
      transform: computedStyle.transform,
      opacity: computedStyle.opacity,
      filter: computedStyle.filter
    })
  })
  console.groupEnd()
}