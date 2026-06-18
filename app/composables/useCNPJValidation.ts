// Validação e formatação de CNPJ
export const useCNPJValidation = () => {
  // Formatar CNPJ para exibição
  const formatarCNPJ = (cnpj: string): string => {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
    if (cnpjLimpo.length === 14) {
      return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    }
    return cnpj
  }

  // Validar CNPJ (algoritmo completo)
  const validarCNPJ = (cnpj: string): boolean => {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
    
    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) return false
    
    // Validação dos dígitos verificadores
    let soma = 0
    let peso = 2
    
    // Primeiro dígito verificador
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso
      peso = peso === 9 ? 2 : peso + 1
    }
    
    let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    
    if (parseInt(cnpjLimpo.charAt(12)) !== digito1) return false
    
    // Segundo dígito verificador
    soma = 0
    peso = 2
    
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso
      peso = peso === 9 ? 2 : peso + 1
    }
    
    let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    
    return parseInt(cnpjLimpo.charAt(13)) === digito2
  }

  // Limpar CNPJ (remover formatação)
  const limparCNPJ = (cnpj: string): string => {
    return cnpj.replace(/[^\d]/g, '')
  }

  // Validar formato básico
  const validarFormatoBasico = (cnpj: string): { valid: boolean; message?: string } => {
    const cnpjLimpo = limparCNPJ(cnpj)
    
    if (!cnpjLimpo) {
      return { valid: false, message: 'CNPJ é obrigatório' }
    }

    if (cnpjLimpo.length !== 14) {
      return { valid: false, message: 'CNPJ deve ter 14 dígitos' }
    }

    if (!validarCNPJ(cnpjLimpo)) {
      return { valid: false, message: 'CNPJ inválido' }
    }

    return { valid: true }
  }

  return {
    formatarCNPJ,
    validarCNPJ,
    limparCNPJ,
    validarFormatoBasico
  }
}
