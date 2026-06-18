import { serverSupabaseServiceRole } from '#supabase/server'
import { gerarHoleriteHTML } from '../../../utils/holeriteHTML'
import { notificarDownloadHolerite } from '../../../utils/notifications'
import { requireOwnershipOrAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole(event)

  try {
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite é obrigatório'
      })
    }

    // Buscar holerite para verificar ownership
    const { data: holerite, error: holeriteError }: any = await supabase
      .from('holerites')
      .select('*')
      .eq('id', id)
      .single()

    if (holeriteError || !holerite) {
      throw createError({
        statusCode: 404,
        message: 'Holerite não encontrado'
      })
    }

    // SEGURANÇA: Verificar ownership ou admin
    const requestingUser = await requireOwnershipOrAdmin(event, holerite.funcionario_id)
    console.log('[API] Acesso autorizado para visualizar HTML do holerite:', requestingUser.nome_completo)

    // Buscar funcionário
    const { data: funcionario, error: funcError }: any = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', holerite.funcionario_id)
      .single()

    if (funcError || !funcionario) {
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    // Buscar cargo (se existir)
    let cargo = null
    if (funcionario.cargo_id) {
      const { data: cargoData } = await supabase
        .from('cargos')
        .select('nome')
        .eq('id', funcionario.cargo_id)
        .single()
      cargo = cargoData
    }

    // Buscar departamento (se existir)
    let departamento = null
    if (funcionario.departamento_id) {
      const { data: deptData } = await supabase
        .from('departamentos')
        .select('nome')
        .eq('id', funcionario.departamento_id)
        .single()
      departamento = deptData
    }

    // Buscar empresa
    const { data: empresa, error: empresaError }: any = await supabase
      .from('empresas')
      .select('*')
      .eq('id', funcionario.empresa_id)
      .single()

    if (empresaError || !empresa) {
      throw createError({
        statusCode: 404,
        message: 'Empresa não encontrada'
      })
    }

    // Buscar itens personalizados do holerite (da tabela holerite_itens_personalizados)
    const { data: itensPersonalizados } = await supabase
      .from('holerite_itens_personalizados')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .gte('data_inicio', holerite.periodo_inicio)
      .or(`data_fim.is.null,data_fim.gte.${holerite.periodo_inicio}`)
    
    // Separar benefícios e descontos
    const beneficiosPersonalizados = (itensPersonalizados || []).filter((item: any) => item.tipo === 'beneficio')
    const descontosPersonalizados = (itensPersonalizados || []).filter((item: any) => item.tipo === 'desconto')
    
    console.log(`📋 Itens personalizados encontrados:`)
    console.log(`   Benefícios: ${beneficiosPersonalizados.length}`)
    console.log(`   Descontos: ${descontosPersonalizados.length}`)

    // Gerar HTML
    const funcionarioData = {
      id: funcionario.id,
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      cargo_nome: (cargo as any)?.nome || 'Não informado', // CORRIGIDO: usar cargo_nome
      departamento_nome: (departamento as any)?.nome || 'Não informado', // CORRIGIDO: usar departamento_nome
      data_admissao: funcionario.data_admissao,
      numero_dependentes: funcionario.numero_dependentes || 0,
      pensao_alimenticia: funcionario.pensao_alimenticia || 0,
      tipo_contrato: funcionario.tipo_contrato || 'CLT' // IMPORTANTE: Incluir tipo de contrato
    }

    const empresaData = {
      nome: (empresa as any).nome || (empresa as any).nome_fantasia || 'Empresa',
      nome_fantasia: (empresa as any).nome_fantasia || (empresa as any).nome || 'Empresa',
      cnpj: (empresa as any).cnpj || '',
      logradouro: (empresa as any).logradouro || '',
      numero: (empresa as any).numero || '',
      complemento: (empresa as any).complemento || '',
      bairro: (empresa as any).bairro || '',
      cidade: (empresa as any).cidade || '',
      estado: (empresa as any).estado || '',
      cep: (empresa as any).cep || '',
      responsavel_nome: (empresa as any).responsavel_nome || 'SILVANA APARECIDA BARDUCHI',
      responsavel_cpf: (empresa as any).responsavel_cpf || '04487488869'
    }

    // Adicionar itens personalizados ao holerite
    const holeriteComItens = {
      ...holerite,
      beneficios: beneficiosPersonalizados.map((item: any) => ({
        tipo: item.descricao,
        descricao: item.observacoes || item.descricao,
        valor: item.valor
      })),
      descontos_personalizados: descontosPersonalizados.map((item: any) => ({
        descricao: item.descricao,
        referencia: item.id.toString(), // Usar ID como referência
        valor: item.valor
      }))
    }

    const html = gerarHoleriteHTML(holeriteComItens, funcionarioData, empresaData)

    // Criar notificação de download
    await notificarDownloadHolerite(event, {
      id: funcionario.id,
      nome: funcionario.nome_completo,
      email: funcionario.email_login || funcionario.email_pessoal
    }, holerite, 'html')

    // Retornar HTML como arquivo para download
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="holerite-${funcionario.nome_completo.replace(/\s+/g, '-')}.html"`)
    
    return html
  } catch (error: any) {
    console.error('Erro ao gerar HTML:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao gerar HTML do holerite'
    })
  }
})
