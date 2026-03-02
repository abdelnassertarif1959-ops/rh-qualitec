// Composable para consulta de CNPJ - Core
export interface DadosEmpresaCNPJ {
  // Dados principais
  nome: string
  nome_fantasia: string
  cnpj: string
  
  // Endereço detalhado
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  cep: string
  endereco_completo: string
  
  // Contatos
  telefone: string
  email: string
  
  // Informações cadastrais
  situacao_cadastral: string
  inscricao_estadual: string
  atividade_principal: string
  natureza_juridica: string
  porte: string
  capital_social: string
  data_abertura: string
  
  // Campos legados para compatibilidade
  razao_social: string
  endereco: string
}

export const useCNPJ = () => {
  const { validarFormatoBasico, limparCNPJ } = useCNPJValidation()
  const { handleCNPJError } = useCNPJErrors()

  const loading = ref(false)
  const error = ref('')

  const consultarCNPJ = async (cnpj: string): Promise<{ success: boolean; data?: DadosEmpresaCNPJ; message: string }> => {
    loading.value = true
    error.value = ''

    try {
      // Validação básica do CNPJ
      const validation = validarFormatoBasico(cnpj)
      if (!validation.valid) {
        throw new Error(validation.message)
      }

      const cnpjLimpo = limparCNPJ(cnpj)
      console.log('🔍 Consultando CNPJ:', cnpjLimpo)

      // Fazer a consulta na API com tratamento de erro mais robusto
      const response = await $fetch('/api/consulta-cnpj', {
        method: 'POST',
        body: { cnpj: cnpjLimpo },
        headers: {
          'Content-Type': 'application/json'
        },
        // Adicionar retry em caso de falha
        retry: 1,
        retryDelay: 1000
      })

      console.log('📦 Resposta recebida:', response)

      if (response.success) {
        console.log('🏢 Inscrição Estadual:', response.data?.inscricao_estadual || 'Não informada')
        
        return {
          success: true,
          data: response.data,
          message: 'Dados da empresa encontrados com sucesso!'
        }
      } else {
        throw new Error('Erro na consulta')
      }

    } catch (err: any) {
      const mensagem = handleCNPJError(err)
      error.value = mensagem
      
      return {
        success: false,
        message: mensagem
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    consultarCNPJ,
    validarCNPJ: validarFormatoBasico,
    formatarCNPJ: (cnpj: string) => {
      if (!cnpj) return ''
      const cnpjLimpo = limparCNPJ(cnpj)
      if (cnpjLimpo.length !== 14) return cnpj
      return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    },
    limparCNPJ
  }
}