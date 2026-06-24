import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'
import { notificarCriacaoFuncionario } from '../../utils/notifications'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem criar funcionários
  const requestingUser = await requireAdmin(event)
  console.log('👤 [CRIAR-FUNCIONARIO] Admin autenticado:', requestingUser.nome_completo)
  
  // Usar Service Role para bypass RLS
  const supabase = serverSupabaseServiceRole(event)
  
  // Obter usuário logado para registrar como responsável pelo cadastro
  const user = await serverSupabaseUser(event)
  
  const body = await readBody(event)

  try {
    console.log('📝 Criando funcionário:', body.nome_completo)
    console.log('📧 Email fornecido:', body.email_login)
    console.log('👤 Usuário logado:', user?.email)

    // Buscar ID do usuário logado
    let responsavelCadastroId = null
    if (user?.email) {
      const { data: usuarioLogado } = await supabase
        .from('funcionarios')
        .select('id, nome_completo')
        .eq('email_login', user.email)
        .single()
      
      if (usuarioLogado) {
        responsavelCadastroId = usuarioLogado.id
        console.log('✅ Responsável pelo cadastro:', usuarioLogado.nome_completo, '(ID:', usuarioLogado.id, ')')
      }
    }

    // Função para converter strings vazias em null
    const cleanValue = (value: any) => {
      if (value === '' || value === undefined) return null
      return value
    }

    // Função para converter responsável_id se for string
    const processResponsavelId = (value: any) => {
      if (!value || value === '' || value === undefined) return null
      
      // Se for string (nome), tentar buscar o ID
      if (typeof value === 'string' && isNaN(Number(value))) {
        console.log('⚠️ responsavel_id é string:', value, '- convertendo para null')
        return null // Por enquanto, vamos deixar null se for string
      }
      
      // Se for número ou string numérica, converter para número
      const numericValue = Number(value)
      if (!isNaN(numericValue)) {
        return numericValue
      }
      
      return null
    }

    // Gerar email temporário APENAS se não fornecido
    const emailLogin = cleanValue(body.email_login)
    
    // Se não tiver email, retornar erro
    if (!emailLogin) {
      throw new Error('Email de login é obrigatório')
    }
    
    // Se não tiver senha, retornar erro
    const senha = cleanValue(body.senha)
    if (!senha) {
      throw new Error('Senha é obrigatória')
    }
    
    console.log('📧 Email a ser usado:', emailLogin)

    const dadosParaInserir = {
      nome_completo: body.nome_completo,
      cpf: body.cpf,
      rg: cleanValue(body.rg),
      data_nascimento: cleanValue(body.data_nascimento),
      sexo: cleanValue(body.sexo),
      telefone: cleanValue(body.telefone),
      email_pessoal: cleanValue(body.email_pessoal),
      empresa_id: cleanValue(body.empresa_id),
      departamento_id: cleanValue(body.departamento_id),
      cargo_id: cleanValue(body.cargo_id),
      responsavel_id: processResponsavelId(body.responsavel_id),
      responsavel_cadastro_id: responsavelCadastroId, // NOVO CAMPO
      tipo_contrato: cleanValue(body.tipo_contrato),
      data_admissao: cleanValue(body.data_admissao),
      matricula: cleanValue(body.matricula),
      email_login: emailLogin,
      senha: senha,
      tipo_acesso: body.tipo_acesso || 'funcionario',
      status: body.status || 'ativo',
      salario_base: cleanValue(body.salario_base) || 0,
      numero_dependentes: cleanValue(body.numero_dependentes) || 0,
      tipo_salario: body.tipo_salario || 'mensal',
      banco: cleanValue(body.banco),
      agencia: cleanValue(body.agencia),
      conta: cleanValue(body.conta),
      tipo_conta: cleanValue(body.tipo_conta),
      forma_pagamento: cleanValue(body.forma_pagamento),
      beneficios: body.beneficios || {},
      descontos_personalizados: body.descontos_personalizados || [],
      
      // Configurações de Pensão Alimentícia
      pensao_config_ativa: body.pensao_config_ativa || false,
      pensao_config_tipo: body.pensao_config_tipo || 'percentual',
      pensao_config_percentual: cleanValue(body.pensao_config_percentual) || 0,
      pensao_config_valor_fixo: cleanValue(body.pensao_config_valor_fixo) || 0,
      pensao_config_recorrente: body.pensao_config_recorrente !== undefined ? body.pensao_config_recorrente : true
    }

    console.log('📦 Dados a inserir:', JSON.stringify(dadosParaInserir, null, 2))

    // Inserir funcionário
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .insert(dadosParaInserir as any)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar funcionário:', error)
      throw error
    }

    console.log('✅ Funcionário criado:', (funcionario as any).id)
    console.log('👤 Cadastrado por:', responsavelCadastroId ? `ID ${responsavelCadastroId}` : 'Sistema')

    // Criar notificação para o admin sobre novo funcionário
    if (user?.email && responsavelCadastroId) {
      const { data: responsavel } = await supabase
        .from('funcionarios')
        .select('id, nome_completo')
        .eq('id', responsavelCadastroId)
        .single()

      if (responsavel) {
        await notificarCriacaoFuncionario(event, funcionario, {
          id: responsavel.id,
          nome: responsavel.nome_completo
        })
      }
    }

    return {
      success: true,
      data: funcionario
    }
  } catch (error: any) {
    console.error('❌ Erro completo:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao criar funcionário'
    })
  }
})
