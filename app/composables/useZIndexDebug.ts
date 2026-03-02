/**
 * Composable para debug de z-index e stacking context - Core
 * Gerencia estado e controle do modo debug
 */

export const useZIndexDebug = () => {
  const { startDebug, stopDebug } = useZIndexDebugVisual()
  
  const isDebugging = ref(false)
  
  /**
   * Ativar/desativar modo debug
   */
  const toggleDebug = () => {
    isDebugging.value = !isDebugging.value
    
    if (isDebugging.value) {
      startDebug()
    } else {
      stopDebug()
    }
  }
  
  // Cleanup automático
  onUnmounted(() => {
    if (isDebugging.value) {
      stopDebug()
    }
  })
  
  return {
    isDebugging: readonly(isDebugging),
    toggleDebug
  }
}
