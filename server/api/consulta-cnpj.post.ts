import { requireAuth } from '../utils/authMiddleware'

// Interface para a resposta da ReceitaWS
interface ReceitaWSResponse {
  status?: string
  message?: string
  nome?: string
  fantasia?: string
  situacao?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  telefone?: string
  email?: string
  atividade_principal?: Array<{ text: string }>
  natureza_juridica?: string
  porte?: string
  capital_social?: string
  abertura?: string
  extra?: {
    inscricao_estadual?: string
  }
  // Campos adicionais onde pode estar a inscrição estadual
  inscricao_estadual?: string
  ie?: string
  inscricao?: string
}

export default defineEventHandler(async (event) => {
  console.log('🚀 API consulta-cnpj INICIADA')
  console.log('📍 URL:', getRequestURL(event).pathname)
  console.log('🔧 Método:', event.method)
  
  try {
    // SEGURANÇA: Verificar autenticação
    const requestingUser = await requireAuth(event)
    console.log('👤 Usuário autenticado:', requestingUser.nome_completo)
    
    console.log('📥 Lendo body da requisição...')
    const body = await readBody(event)
    console.log('📦 Body recebido:', body)
    
    const { cnpj } = body

    console.log('📋 CNPJ extraído:', cnpj)

    if (!cnpj) {
      console.log('❌ CNPJ não fornecido')
      throw createError({
        statusCode: 400,
        statusMessage: 'CNPJ é obrigatório'
      })
    }

    // Limpar CNPJ (remover pontos, barras e hífens)
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
    console.log('🧹 CNPJ limpo:', cnpjLimpo)

    // Validar se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      console.log('❌ CNPJ com tamanho inválido:', cnpjLimpo.length)
      throw createError({
        statusCode: 400,
        statusMessage: 'CNPJ deve ter 14 dígitos'
      })
    }

    console.log('🌐 Consultando ReceitaWS para CNPJ:', cnpjLimpo)

    // Consultar API da ReceitaWS
    const response = await $fetch<ReceitaWSResponse>(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
      headers: {
        'User-Agent': 'Sistema-RH/1.0',
        'Accept': 'application/json'
      },
      timeout: 15000 // 15 segundos de timeout
    })

    console.log('📦 Resposta da ReceitaWS recebida')
    console.log('📊 Status da resposta:', response.status)
    console.log('🏢 Nome da empresa:', response.nome)

    // Verificar se a consulta foi bem-sucedida
    if (response.status === 'ERROR') {
      console.log('❌ ReceitaWS retornou erro:', response.message)
      throw createError({
        statusCode: 404,
        statusMessage: response.message || 'CNPJ não encontrado'
      })
    }

    // Mapear dados da API para o formato do sistema
    const dadosEmpresa = {
      // Dados principais
      nome: response.nome || '',
      nome_fantasia: response.fantasia || '',
      cnpj: formatarCNPJ(cnpjLimpo),
      
      // Endereço detalhado
      logradouro: response.logradouro || '',
      numero: response.numero || '',
      complemento: response.complemento || '',
      bairro: response.bairro || '',
      municipio: response.municipio || '',
      uf: response.uf || '',
      cep: response.cep || '',
      endereco_completo: formatarEndereco(response),
      
      // Contatos
      telefone: response.telefone || '',
      email: response.email || '',
      
      // Informações cadastrais
      situacao_cadastral: response.situacao || '',
      inscricao_estadual: obterInscricaoEstadual(response),
      atividade_principal: response.atividade_principal?.[0]?.text || '',
      natureza_juridica: response.natureza_juridica || '',
      porte: response.porte || '',
      capital_social: response.capital_social || '',
      data_abertura: response.abertura || '',
      
      // Dados legados para compatibilidade
      razao_social: response.nome || '',
      endereco: formatarEndereco(response)
    }

    console.log('✅ Dados processados com sucesso')
    console.log('🏢 Inscrição Estadual encontrada:', dadosEmpresa.inscricao_estadual)
    console.log('📤 Retornando dados para o frontend')

    return {
      success: true,
      data: dadosEmpresa
    }

  } catch (error: any) {
    console.error('❌ ERRO na API consulta-cnpj:', error)
    console.error('❌ Tipo do erro:', typeof error)
    console.error('❌ Nome do erro:', error.name)
    console.error('❌ Mensagem:', error.message)
    console.error('❌ Stack:', error.stack)
    
    // Se for erro da API externa
    if (error.statusCode) {
      console.log('🔄 Repassando erro da API externa')
      throw error
    }

    // Se for erro de rede/timeout
    if (error.name === 'FetchError' || error.code === 'NETWORK_ERROR') {
      console.log('🌐 Erro de rede detectado')
      throw createError({
        statusCode: 503,
        statusMessage: 'Serviço de consulta CNPJ temporariamente indisponível. Tente novamente em alguns minutos.'
      })
    }

    // Erro genérico
    console.log('🔧 Erro genérico, retornando 500')
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao consultar CNPJ'
    })
  }
})

// Função para obter inscrição estadual de diferentes campos possíveis
function obterInscricaoEstadual(dados: ReceitaWSResponse): string {
  // Tentar diferentes campos onde a inscrição estadual pode estar
  const possiveisIE = [
    dados.extra?.inscricao_estadual,
    dados.inscricao_estadual,
    dados.ie,
    dados.inscricao
  ]
  
  // Retornar o primeiro valor válido encontrado
  for (const ie of possiveisIE) {
    if (ie && ie.trim() && ie.trim() !== 'ISENTO' && ie.trim() !== 'NÃO INFORMADO') {
      console.log('🔍 Inscrição Estadual encontrada:', ie)
      return ie.trim()
    }
  }
  
  console.log('⚠️ Inscrição Estadual não encontrada ou isenta')
  return ''
}

// Função para formatar CNPJ
function formatarCNPJ(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

// Função para formatar endereço completo
function formatarEndereco(dados: ReceitaWSResponse): string {
  const partes = []
  
  if (dados.logradouro) partes.push(dados.logradouro)
  if (dados.numero) partes.push(dados.numero)
  if (dados.complemento) partes.push(dados.complemento)
  if (dados.bairro) partes.push(dados.bairro)
  if (dados.municipio) partes.push(dados.municipio)
  if (dados.uf) partes.push(dados.uf)
  if (dados.cep) partes.push(`CEP: ${dados.cep}`)
  
  return partes.join(', ')
}