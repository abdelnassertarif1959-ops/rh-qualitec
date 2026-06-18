// Composable para gerenciar empresas - Core
export interface Empresa {
  id: string
  // Dados principais
  nome: string
  nome_fantasia?: string
  cnpj: string
  inscricao_estadual?: string
  
  // Endereço detalhado
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  endereco_completo?: string
  
  // Contatos
  telefone?: string
  email_holerites?: string
  
  // Informações cadastrais
  situacao_cadastral?: string
  atividade_principal?: string
  natureza_juridica?: string
  porte?: string
  capital_social?: string
  data_abertura?: string
  
  // Sistema
  logo_url?: string
  funcionarios_count?: number
  created_at?: string
  updated_at?: string
  
  // Campos legados para compatibilidade
  endereco?: string
}

// Dados de exemplo - em produção virão do Supabase
const empresasExemplo: Empresa[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Empresa Exemplo LTDA',
    nome_fantasia: 'Exemplo Corp',
    cnpj: '12.345.678/0001-90',
    inscricao_estadual: '123.456.789.012',
    logradouro: 'Rua Exemplo',
    numero: '123',
    bairro: 'Centro',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '01234-567',
    endereco_completo: 'Rua Exemplo, 123 - Centro - São Paulo/SP - CEP: 01234-567',
    telefone: '(11) 3333-4444',
    email_holerites: 'rh@empresa.com',
    situacao_cadastral: 'ATIVA',
    atividade_principal: 'Atividades de consultoria em gestão empresarial',
    porte: 'DEMAIS',
    logo_url: '',
    funcionarios_count: 12
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    nome: 'Tech Solutions S.A.',
    nome_fantasia: 'TechSol',
    cnpj: '98.765.432/0001-10',
    inscricao_estadual: '987.654.321.098',
    logradouro: 'Av. Tecnologia',
    numero: '456',
    bairro: 'Copacabana',
    municipio: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '22070-900',
    endereco_completo: 'Av. Tecnologia, 456 - Copacabana - Rio de Janeiro/RJ - CEP: 22070-900',
    telefone: '(21) 2222-3333',
    email_holerites: 'rh@techsolutions.com',
    situacao_cadastral: 'ATIVA',
    atividade_principal: 'Desenvolvimento de programas de computador sob encomenda',
    porte: 'DEMAIS',
    logo_url: '',
    funcionarios_count: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    nome: 'Consultoria ABC LTDA',
    nome_fantasia: 'ABC Consultoria',
    cnpj: '11.222.333/0001-44',
    inscricao_estadual: '111.222.333.444',
    logradouro: 'Rua Consultoria',
    numero: '789',
    bairro: 'Savassi',
    municipio: 'Belo Horizonte',
    uf: 'MG',
    cep: '30112-000',
    endereco_completo: 'Rua Consultoria, 789 - Savassi - Belo Horizonte/MG - CEP: 30112-000',
    telefone: '(31) 1111-2222',
    email_holerites: 'rh@consultoriaabc.com',
    situacao_cadastral: 'BAIXADA',
    atividade_principal: 'Atividades de consultoria em gestão empresarial',
    porte: 'ME',
    logo_url: '',
    funcionarios_count: 8
  }
]

export const useEmpresas = () => {
  const empresas = ref<Empresa[]>([])
  const loading = ref(false)
  const error = ref('')

  // Carregar empresas da API
  const carregarEmpresas = async () => {
    loading.value = true
    error.value = ''
    try {
      console.log('📡 [useEmpresas] Carregando empresas...')
      const response = await $fetch<any>('/api/empresas')
      
      console.log('📊 [useEmpresas] Resposta da API:', response)
      
      if (response.success && response.data) {
        empresas.value = response.data
        console.log(`✅ [useEmpresas] ${empresas.value.length} empresas carregadas:`, empresas.value)
      } else {
        console.warn('⚠️ [useEmpresas] Resposta sem dados:', response)
      }
    } catch (err: any) {
      error.value = 'Erro ao carregar empresas'
      console.error('❌ [useEmpresas] Erro ao carregar empresas:', err)
      // Fallback para dados de exemplo em caso de erro
      empresas.value = empresasExemplo
      console.log('⚠️ [useEmpresas] Usando dados de exemplo:', empresas.value.length, 'empresas')
    } finally {
      loading.value = false
    }
  }

  // Computed para opções de select
  const obterOpcoesEmpresas = computed(() => {
    console.log('🔍 [useEmpresas] Gerando opções de empresas:', {
      total: empresas.value.length,
      empresas: empresas.value.map(e => ({ id: e.id, nome: e.nome }))
    })
    
    // Não filtrar por 'ativo' pois a coluna não existe na tabela
    const opcoes = empresas.value.map(e => ({
      value: e.id,
      label: e.nome_fantasia || e.nome
    }))
    
    console.log('✅ [useEmpresas] Opções geradas:', opcoes)
    return opcoes
  })

  // Salvar empresa (criar ou atualizar)
  const salvarEmpresa = async (dadosEmpresa: Partial<Empresa>) => {
    loading.value = true
    error.value = ''
    try {
      console.log('💾 [useEmpresas] Salvando empresa:', dadosEmpresa)
      
      const response = await $fetch<any>('/api/empresas', {
        method: 'POST',
        body: dadosEmpresa
      })
      
      console.log('✅ [useEmpresas] Empresa salva:', response)
      
      // Recarregar lista de empresas
      await carregarEmpresas()
      
      return {
        success: true,
        message: response.message || 'Empresa salva com sucesso!'
      }
    } catch (err: any) {
      console.error('❌ [useEmpresas] Erro ao salvar empresa:', err)
      error.value = err.data?.message || 'Erro ao salvar empresa'
      return {
        success: false,
        message: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Deletar empresa
  const deletarEmpresa = async (empresaId: string) => {
    loading.value = true
    error.value = ''
    try {
      console.log('🗑️ [useEmpresas] Deletando empresa ID:', empresaId)
      
      const response = await $fetch<any>(`/api/empresas/${empresaId}`, {
        method: 'DELETE'
      })
      
      console.log('✅ [useEmpresas] Empresa deletada:', response)
      
      // Recarregar lista de empresas
      await carregarEmpresas()
      
      return {
        success: true,
        message: response.message || 'Empresa deletada com sucesso!'
      }
    } catch (err: any) {
      console.error('❌ [useEmpresas] Erro ao deletar empresa:', err)
      error.value = err.data?.message || 'Erro ao deletar empresa'
      return {
        success: false,
        message: error.value
      }
    } finally {
      loading.value = false
    }
  }

  return {
    empresas,
    loading: readonly(loading),
    error: readonly(error),
    carregarEmpresas,
    obterOpcoesEmpresas,
    salvarEmpresa,
    deletarEmpresa
  }
}