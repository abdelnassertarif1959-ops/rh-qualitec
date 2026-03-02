/**
 * Composable completo para debug de z-index
 * Agrega todas as funcionalidades de debug
 */

export const useZIndexDebugComplete = () => {
  const { isDebugging, toggleDebug } = useZIndexDebug()
  const { analyzeElement } = useZIndexDebugAnalyze()
  const { findHighZIndex, checkConflicts } = useZIndexDebugSearch()
  
  return {
    // Estado
    isDebugging,
    
    // Controle
    toggleDebug,
    
    // Análise
    analyzeElement,
    
    // Busca
    findHighZIndex,
    checkConflicts
  }
}
