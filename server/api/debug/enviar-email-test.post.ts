import { requireAdmin } from '../../utils/authMiddleware'
import { enviarEmail } from '../../utils/email'

/**
 * API de Debug - Enviar Email de Teste
 * PROTEGIDA: Apenas admins podem acessar
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem acessar esta API de debug
  const requestingUser = await requireAdmin(event)
  console.log('📧 [DEBUG-EMAIL] Admin autenticado:', requestingUser.nome_completo)
  
  try {
    const body = await readBody(event)
    const { destinatario, assunto, mensagem } = body
    
    if (!destinatario || !assunto || !mensagem) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destinatário, assunto e mensagem são obrigatórios'
      })
    }
    
    console.log('📧 [DEBUG-EMAIL] Enviando email de teste...')
    console.log('📧 [DEBUG-EMAIL] Para:', destinatario)
    console.log('📧 [DEBUG-EMAIL] Assunto:', assunto)
    
    // Enviar email de teste
    await enviarEmail({
      to: destinatario,
      subject: `[TESTE] ${assunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email de Teste - Sistema RH Qualitec</h2>
          <p><strong>Enviado por:</strong> ${requestingUser.nome_completo} (${requestingUser.email_login})</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <hr>
          <div style="margin-top: 20px;">
            ${mensagem}
          </div>
          <hr>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este é um email de teste enviado através da API de debug.
          </p>
        </div>
      `
    })
    
    console.log('✅ [DEBUG-EMAIL] Email enviado com sucesso')
    
    return {
      success: true,
      message: 'Email de teste enviado com sucesso',
      destinatario,
      assunto,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('❌ [DEBUG-EMAIL] Erro ao enviar email:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao enviar email de teste: ${error.message}`
    })
  }
})
