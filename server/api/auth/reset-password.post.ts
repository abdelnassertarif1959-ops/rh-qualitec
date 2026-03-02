import { serverSupabaseServiceRole } from '#supabase/server'
import bcrypt from 'bcryptjs'
import { requireCsrfProtection } from '../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar proteção CSRF
  await requireCsrfProtection(event)
  try {
    const body = await readBody(event)
    const { token, newPassword } = body

    if (!token || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token e nova senha são obrigatórios'
      })
    }

    // Validar senha
    if (newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A senha deve ter pelo menos 6 caracteres'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Verificar se o token existe e não expirou
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (tokenError || !resetToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token inválido ou expirado'
      })
    }

    // Verificar se o token não expirou
    const now = new Date()
    const expiresAt = new Date(resetToken.expires_at)
    
    if (expiresAt < now) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token expirado'
      })
    }

    // Verificar se o funcionário existe (CORRIGIDO: usar apenas email_login)
    const { data: funcionario, error: funcionarioError } = await supabase
      .from('funcionarios')
      .select('id, email_login, nome_completo')
      .eq('email_login', resetToken.email)
      .single()

    if (funcionarioError || !funcionario) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Usuário não encontrado'
      })
    }

    // Hash da nova senha
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Atualizar senha do funcionário
    const { error: updateError } = await supabase
      .from('funcionarios')
      .update({ senha_hash: hashedPassword })
      .eq('id', funcionario.id)

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao atualizar senha'
      })
    }

    // Marcar token como usado
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('token', token)

    // Limpar tentativas de recuperação para este email
    await supabase
      .from('password_reset_attempts')
      .delete()
      .eq('email', resetToken.email)

    console.log(`✅ Senha redefinida para usuário: ${funcionario.nome_completo}`)

    return {
      success: true,
      message: 'Senha redefinida com sucesso'
    }

  } catch (error: any) {
    console.error('Erro na redefinição de senha:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})