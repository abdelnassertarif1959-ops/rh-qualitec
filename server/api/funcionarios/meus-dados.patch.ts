// API para atualizar dados do funcionário logado
import { requireOwnershipOrAdmin } from '../../utils/authMiddleware'
import { notificarAlteracaoDados } from '../../utils/notifications'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Pegar ID do usuário do body (enviado pelo frontend)
  const userId = body.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Usuário não autenticado'
    })
  }
  
  // SEGURANÇA: Verificar se é o próprio usuário ou admin
  const requestingUser = await requireOwnershipOrAdmin(event, userId)
  console.log('👤 [MEUS-DADOS] Usuário autenticado:', requestingUser.nome_completo)
  console.log('👤 [MEUS-DADOS] É admin:', requestingUser.tipo_acesso === 'admin')
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  console.log('📝 Atualizando dados do funcionário:', userId)
  console.log('📦 Dados recebidos:', JSON.stringify(body, null, 2))

  try {
    // Usar o tipo de acesso já verificado pelo middleware
    const isAdmin = requestingUser.tipo_acesso === 'admin'

    console.log('👤 Tipo de usuário:', isAdmin ? 'Admin' : 'Funcionário')

    // Campos que o funcionário pode atualizar
    const camposPermitidos: any = {
      telefone: body.telefone,
      email_pessoal: body.email_pessoal,
      pis_pasep: body.pis_pasep,
      banco: body.banco,
      agencia: body.agencia,
      conta: body.conta,
      tipo_conta: body.tipo_conta,
      forma_pagamento: body.forma_pagamento,
      chave_pix: body.chave_pix,
      avatar: body.avatar, // Todos podem alterar avatar
      
      // Campos que podem ser editados apenas uma vez (verificação no frontend)
      data_nascimento: body.data_nascimento,
      sexo: body.sexo,
      rg: body.rg
    }

    // Se for admin, pode atualizar dados profissionais e pensão alimentícia também
    if (isAdmin) {
      if (body.nome_completo !== undefined) camposPermitidos.nome_completo = body.nome_completo
      if (body.cpf !== undefined) camposPermitidos.cpf = body.cpf
      if (body.cargo_id !== undefined) camposPermitidos.cargo_id = body.cargo_id
      if (body.departamento_id !== undefined) camposPermitidos.departamento_id = body.departamento_id
      if (body.data_admissao !== undefined) camposPermitidos.data_admissao = body.data_admissao
      if (body.tipo_contrato !== undefined) camposPermitidos.tipo_contrato = body.tipo_contrato
      if (body.empresa_id !== undefined) camposPermitidos.empresa_id = body.empresa_id
      if (body.pensao_alimenticia !== undefined) camposPermitidos.pensao_alimenticia = body.pensao_alimenticia
    } else {
      // Se não for admin e tentar atualizar pensão alimentícia, ignorar silenciosamente
      if (body.pensao_alimenticia !== undefined) {
        console.log('⚠️ Funcionário tentou atualizar pensão alimentícia - IGNORADO')
      }
    }

    // Remover campos undefined
    const chavesPermitidas = Object.keys(camposPermitidos)
    chavesPermitidas.forEach(key => {
      if (camposPermitidos[key] === undefined) {
        delete camposPermitidos[key]
      }
    })

    console.log('✅ Campos a atualizar:', JSON.stringify(camposPermitidos, null, 2))

    // Buscar dados atuais antes da alteração para comparação
    const dadosAtuaisResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    let valoresAnteriores = {}
    if (dadosAtuaisResponse.ok) {
      const dadosAtuais = await dadosAtuaisResponse.json()
      if (dadosAtuais && dadosAtuais.length > 0) {
        valoresAnteriores = dadosAtuais[0]
      }
    }

    // Atualizar no banco
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(camposPermitidos)
      }
    )

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao atualizar:', errorText)
      throw new Error(`Erro ao atualizar dados: ${errorText}`)
    }

    const funcionarioAtualizado = await response.json()
    console.log('✅ Dados atualizados com sucesso!')

    // Identificar apenas os campos que realmente mudaram
    const camposRealmenteAlterados: string[] = []
    const valoresAnterioresReais: any = {}
    const valoresNovosReais: any = {}

    if (valoresAnteriores && funcionarioAtualizado[0]) {
      Object.keys(camposPermitidos).forEach(campo => {
        const valorAntigo = valoresAnteriores[campo]
        const valorNovo = funcionarioAtualizado[0][campo]
        
        // Função para normalizar valores para comparação
        const normalizeValue = (value: any) => {
          if (value === null || value === undefined || value === '') return null
          if (typeof value === 'string') return value.trim()
          if (typeof value === 'object') return JSON.stringify(value)
          return String(value)
        }
        
        const valorAntigoNormalizado = normalizeValue(valorAntigo)
        const valorNovoNormalizado = normalizeValue(valorNovo)
        
        // Só considera alterado se os valores normalizados são diferentes
        if (valorAntigoNormalizado !== valorNovoNormalizado) {
          camposRealmenteAlterados.push(campo)
          valoresAnterioresReais[campo] = valorAntigo
          valoresNovosReais[campo] = valorNovo
        }
      })
    }

    console.log('📝 Campos realmente alterados:', camposRealmenteAlterados)

    // Criar notificação apenas se houve alterações reais
    if (camposRealmenteAlterados.length > 0) {
      console.log('📬 [FUNCIONARIOS-API] Criando notificação para alterações:', camposRealmenteAlterados)
      
      try {
        await notificarAlteracaoDados(event, {
          id: userId,
          nome: funcionarioAtualizado[0]?.nome_completo || 'Funcionário'
        }, camposRealmenteAlterados, 'proprio', valoresAnterioresReais, valoresNovosReais)
        
        console.log('✅ [FUNCIONARIOS-API] Notificação criada com sucesso!')
      } catch (notifError) {
        console.error('❌ [FUNCIONARIOS-API] Erro ao criar notificação:', notifError)
      }
    } else {
      console.log('ℹ️ [FUNCIONARIOS-API] Nenhuma alteração real detectada, não criando notificação')
    }

    return {
      success: true,
      message: 'Dados atualizados com sucesso!',
      data: funcionarioAtualizado[0]
    }
  } catch (error: any) {
    console.error('💥 Erro ao atualizar dados:', error.message)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao atualizar dados'
    })
  }
})
