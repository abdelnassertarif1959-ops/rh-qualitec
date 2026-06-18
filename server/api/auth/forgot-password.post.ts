import { serverSupabaseServiceRole } from '#supabase/server'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email é obrigatório'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Primeiro, verificar se o email existe exatamente como digitado
    let { data: funcionario, error: funcionarioError } = await supabase
      .from('funcionarios')
      .select('email_login, nome_completo')
      .eq('email_login', email)
      .single()

    // Se não encontrou, verificar se existe em minúsculo
    if (funcionarioError || !funcionario) {
      const emailLowerCase = email.toLowerCase()
      
      const { data: funcionarioLower, error: funcionarioLowerError } = await supabase
        .from('funcionarios')
        .select('email_login, nome_completo')
        .eq('email_login', emailLowerCase)
        .single()

      if (!funcionarioLowerError && funcionarioLower) {
        throw createError({
          statusCode: 400,
          statusMessage: `Email encontrado, mas digite em minúsculo: ${emailLowerCase}`
        })
      }

      // Se não encontrou nem em minúsculo, verificar se existe similar
      const { data: funcionariosSimilares } = await supabase
        .from('funcionarios')
        .select('email_login, nome_completo')
        .ilike('email_login', `%${email.split('@')[0]}%`)
        .limit(3)

      if (funcionariosSimilares && funcionariosSimilares.length > 0) {
        const emailsSugeridos = funcionariosSimilares.map(f => f.email_login).join(', ')
        throw createError({
          statusCode: 404,
          statusMessage: `Email não encontrado. Emails similares cadastrados: ${emailsSugeridos}`
        })
      }

      throw createError({
        statusCode: 404,
        statusMessage: 'Email não cadastrado no sistema. Verifique se o email está correto ou entre em contato com o RH.'
      })
    }

    // Verificar rate limiting
    const { data: attempts } = await supabase
      .from('password_reset_attempts')
      .select('*')
      .eq('email', email)
      .single()

    const now = new Date()
    
    if (attempts) {
      // Verificar se está bloqueado
      if (attempts.blocked_until && new Date(attempts.blocked_until) > now) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Muitas tentativas. Tente novamente mais tarde.'
        })
      }

      // Verificar se excedeu 5 tentativas no mês
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      
      if (attempts.created_at && attempts.created_at > monthAgo.toISOString() && (attempts.attempt_count || 0) >= 5) {
        // Bloquear por 1 hora
        const blockedUntil = new Date()
        blockedUntil.setHours(blockedUntil.getHours() + 1)
        
        await supabase
          .from('password_reset_attempts')
          .update({ 
            blocked_until: blockedUntil.toISOString(),
            attempt_count: (attempts.attempt_count || 0) + 1
          })
          .eq('email', email)

        throw createError({
          statusCode: 429,
          statusMessage: 'Limite de tentativas excedido. Bloqueado por 1 hora.'
        })
      }

      // Incrementar tentativas
      await supabase
        .from('password_reset_attempts')
        .update({ attempt_count: (attempts.attempt_count || 0) + 1 })
        .eq('email', email)
    } else {
      // Criar novo registro de tentativas
      await supabase
        .from('password_reset_attempts')
        .insert({ email, attempt_count: 1 })
    }

    // Gerar token seguro
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30) // 30 minutos

    // Salvar token no banco
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      console.error('Erro ao salvar token:', tokenError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor'
      })
    }

    // Enviar email
    await enviarEmailRecuperacaoSenha(email, token)

    return {
      success: true,
      message: `Email de recuperação enviado para ${funcionario.nome_completo}. Verifique sua caixa de entrada.`
    }

  } catch (error: any) {
    console.error('Erro na recuperação de senha:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})

// Função para enviar email de recuperação de senha
async function enviarEmailRecuperacaoSenha(email: string, token: string) {
  // Importar utilitário de configuração
  const { getBaseUrl, logEnvironmentInfo } = await import('../../utils/config')
  
  // Log para debug
  logEnvironmentInfo()
  
  const baseUrl = getBaseUrl()
  const resetUrl = `${baseUrl}/reset-password?token=${token}`
  
  console.log('🔗 [RESET-PASSWORD] URL final gerada:', resetUrl)
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">🔐 Recuperação de Senha</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Olá!</p>
        
        <p>Você solicitou a recuperação de senha para sua conta no Sistema RH Qualitec.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #1f2937;">🔑 Redefinir Senha</h3>
          <p>Clique no botão abaixo para redefinir sua senha:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Redefinir Senha
            </a>
          </div>
          
          <p style="font-size: 12px; color: #6b7280;">
            Se o botão não funcionar, copie e cole este link no seu navegador:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <strong>⚠️ Importante:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Este link expira em 30 minutos</li>
            <li>Se você não solicitou esta recuperação, ignore este email</li>
            <li>Por segurança, não compartilhe este link com ninguém</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
          <p><strong>Qualitec Instrumentos de Medição</strong></p>
          <p>Este é um email automático. Por favor, não responda.</p>
        </div>
      </div>
    </div>
  `

  // Importar função de email
  const { enviarEmail } = await import('../../utils/email')
  
  return await enviarEmail({
    to: email,
    subject: 'Recuperação de Senha - Sistema RH Qualitec',
    html
  })
}