// API para criar ou atualizar empresa
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem criar/atualizar empresas
  const requestingUser = await requireAdmin(event)
  console.log('🏢 [SALVAR-EMPRESA] Admin autenticado:', requestingUser.nome_completo)
  
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  console.log('🏢 Salvando empresa...')
  console.log('📝 Dados recebidos:', JSON.stringify(body, null, 2))

  // Campos válidos da tabela empresas no Supabase (schema real)
  const camposValidos = [
    'id',
    'nome',
    'nome_fantasia',
    'cnpj',
    'inscricao_estadual',
    'situacao_cadastral',
    'endereco',
    'telefone',
    'email',
    'created_at',
    'updated_at'
  ]

  // Mapear campos do frontend para o banco
  const dadosFiltrados: any = {}
  
  // Campos diretos
  if (body.id) dadosFiltrados.id = body.id
  if (body.nome) dadosFiltrados.nome = body.nome
  if (body.nome_fantasia) dadosFiltrados.nome_fantasia = body.nome_fantasia
  
  // CNPJ: limitar a 20 caracteres
  if (body.cnpj) {
    dadosFiltrados.cnpj = body.cnpj.substring(0, 20)
  }
  
  // Inscrição Estadual: limitar a 20 caracteres
  if (body.inscricao_estadual) {
    dadosFiltrados.inscricao_estadual = body.inscricao_estadual.substring(0, 20)
  }
  
  if (body.situacao_cadastral) dadosFiltrados.situacao_cadastral = body.situacao_cadastral
  
  // Telefone: limitar a 20 caracteres
  if (body.telefone) {
    dadosFiltrados.telefone = body.telefone.substring(0, 20)
  }
  
  // Email: frontend usa email_holerites, banco usa email
  if (body.email_holerites) dadosFiltrados.email = body.email_holerites
  else if (body.email) dadosFiltrados.email = body.email
  
  // Endereço: montar string completa a partir dos campos separados
  if (body.logradouro || body.numero || body.bairro || body.municipio || body.uf || body.cep) {
    const partes = []
    if (body.logradouro) partes.push(body.logradouro)
    if (body.numero) partes.push(body.numero)
    if (body.complemento) partes.push(body.complemento)
    if (body.bairro) partes.push(`- ${body.bairro}`)
    if (body.municipio && body.uf) partes.push(`- ${body.municipio}/${body.uf}`)
    if (body.cep) partes.push(`- CEP: ${body.cep}`)
    dadosFiltrados.endereco = partes.join(' ')
  } else if (body.endereco) {
    dadosFiltrados.endereco = body.endereco
  }

  console.log('✅ Dados filtrados (apenas campos válidos):', JSON.stringify(dadosFiltrados, null, 2))
  
  // Verificar tamanhos dos campos e limitar se necessário
  console.log('📏 Tamanhos dos campos:')
  Object.keys(dadosFiltrados).forEach(key => {
    const value = dadosFiltrados[key]
    if (typeof value === 'string') {
      console.log(`   - ${key}: ${value.length} caracteres - "${value}"`)
      
      // Limitar campos específicos que têm limite de 20 no banco
      if (['cnpj', 'inscricao_estadual', 'situacao_cadastral', 'telefone'].includes(key) && value.length > 20) {
        console.log(`   ⚠️ TRUNCANDO ${key} de ${value.length} para 20 caracteres`)
        dadosFiltrados[key] = value.substring(0, 20)
      }
    }
  })
  
  console.log('📦 Dados finais a serem enviados:', JSON.stringify(dadosFiltrados, null, 2))

  try {
    let response
    let url

    if (dadosFiltrados.id) {
      // Atualizar empresa existente
      url = `${supabaseUrl}/rest/v1/empresas?id=eq.${dadosFiltrados.id}`
      console.log('🔄 ATUALIZANDO empresa ID:', dadosFiltrados.id)
      
      // Remover ID do body para não tentar atualizar
      const { id, ...dadosSemId } = dadosFiltrados
      
      response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dadosSemId)
      })
    } else {
      // Criar nova empresa
      url = `${supabaseUrl}/rest/v1/empresas`
      console.log('➕ CRIANDO nova empresa')
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dadosFiltrados)
      })
    }

    console.log('📊 Status da resposta:', response.status)

    const responseText = await response.text()
    console.log('📦 Resposta do Supabase:', responseText)

    if (!response.ok) {
      console.error('❌ Erro HTTP:', response.status, responseText)
      throw new Error(`Erro ao salvar empresa: ${response.status} - ${responseText}`)
    }

    const empresa = responseText ? JSON.parse(responseText) : null
    console.log('✅ Empresa salva com sucesso!')
    
    return { 
      success: true, 
      message: dadosFiltrados.id ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!',
      data: Array.isArray(empresa) ? empresa[0] : empresa
    }
  } catch (error: any) {
    console.error('💥 Erro ao salvar empresa:', error.message)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao salvar empresa'
    })
  }
})
