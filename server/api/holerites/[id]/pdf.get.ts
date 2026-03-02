import { gerarHoleriteHTML } from '../../../utils/holeriteHTML'
import { notificarDownloadHolerite } from '../../../utils/notifications'
import { requireOwnershipOrAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite não fornecido'
      })
    }

    console.log('📄 Gerando holerite HTML para ID:', id)

    // Buscar holerite para verificar ownership
    const holeriteResponse = await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!holeriteResponse.ok) {
      throw new Error('Erro ao buscar holerite')
    }

    const holerites = await holeriteResponse.json()
    
    if (!holerites || holerites.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Holerite não encontrado'
      })
    }

    const holerite = holerites[0]
    
    // SEGURANÇA: Verificar ownership ou admin
    const requestingUser = await requireOwnershipOrAdmin(event, holerite.funcionario_id)
    console.log('[API] Acesso autorizado para gerar PDF do holerite:', requestingUser.nome_completo)
    
    // Log para debug da referência INSS
    console.log('📄 Dados do Holerite para HTML:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   INSS: R$ ${holerite.inss}`)
    console.log(`   INSS Percentual: ${holerite.inss_percentual}%`)
    console.log(`   INSS Referência: "${holerite.inss_referencia || 'null'}"`)
    console.log(`   Alíquota INSS: ${holerite.aliquota_inss || 'null'}`)

    // Buscar funcionário
    const funcionarioResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!funcionarioResponse.ok) {
      throw new Error('Erro ao buscar funcionário')
    }

    const funcionarios = await funcionarioResponse.json()
    
    if (!funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    const funcionario = funcionarios[0]
    
    // Buscar cargo (se existir)
    let cargoNome = 'Não informado' // CORRIGIDO: mensagem mais amigável
    if (funcionario.cargo_id) {
      const cargoResponse = await fetch(
        `${supabaseUrl}/rest/v1/cargos?id=eq.${funcionario.cargo_id}&select=nome`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (cargoResponse.ok) {
        const cargos = await cargoResponse.json()
        if (cargos && cargos.length > 0) {
          cargoNome = cargos[0].nome
        }
      }
    }
    
    // Buscar departamento (se existir)
    let departamentoNome = 'Não informado' // CORRIGIDO: mensagem mais amigável
    if (funcionario.departamento_id) {
      const deptResponse = await fetch(
        `${supabaseUrl}/rest/v1/departamentos?id=eq.${funcionario.departamento_id}&select=nome`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (deptResponse.ok) {
        const departamentos = await deptResponse.json()
        if (departamentos && departamentos.length > 0) {
          departamentoNome = departamentos[0].nome
        }
      }
    }
    
    // Adicionar nome do cargo e departamento ao objeto funcionario
    funcionario.cargo_nome = cargoNome
    funcionario.departamento_nome = departamentoNome
    funcionario.numero_dependentes = funcionario.numero_dependentes || 0

    // Buscar empresa
    const empresaResponse = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${funcionario.empresa_id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!empresaResponse.ok) {
      throw new Error('Erro ao buscar empresa')
    }

    const empresas = await empresaResponse.json()
    
    if (!empresas || empresas.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Empresa não encontrada'
      })
    }

    const empresa = empresas[0]

    // Gerar HTML
    const html = gerarHoleriteHTML(holerite, funcionario, empresa)

    // Criar notificação de download
    await notificarDownloadHolerite(event, {
      id: funcionario.id,
      nome: funcionario.nome_completo,
      email: funcionario.email_login || funcionario.email_pessoal
    }, holerite, 'pdf')

    // Retornar HTML para visualização no navegador (sem forçar download)
    setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html

  } catch (error: any) {
    console.error('Erro ao gerar holerite:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao gerar holerite'
    })
  }
})
