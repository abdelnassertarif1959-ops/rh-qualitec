import { enviarEmail } from '../../utils/email'
import { criarNotificacaoAdmin } from '../../utils/notifications'
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado enviando email:', requestingUser.nome_completo)
  
  console.log('📧 [ENVIAR-EMAIL] === INÍCIO DA REQUISIÇÃO ===')
  console.log('📧 [ENVIAR-EMAIL] Timestamp:', new Date().toISOString())
  console.log('📧 [ENVIAR-EMAIL] Method:', event.node.req.method)
  console.log('📧 [ENVIAR-EMAIL] URL:', event.node.req.url)
  console.log('📧 [ENVIAR-EMAIL] Environment:', process.env.NODE_ENV)
  console.log('📧 [ENVIAR-EMAIL] Vercel URL:', process.env.VERCEL_URL)

  // Headers CORS para Vercel
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (event.node.req.method === 'OPTIONS') {
    return 'OK'
  }

  try {
    const body = await readBody(event)
    console.log('📧 [ENVIAR-EMAIL] Body recebido:', body)

    // Validar dados obrigatórios
    if (!body.email || !body.assunto || !body.conteudo) {
      throw createError({
        statusCode: 400,
        message: 'Email, assunto e conteúdo são obrigatórios'
      })
    }

    // Enviar email
    const resultado = await enviarEmail({
      to: body.email,
      subject: body.assunto,
      html: body.conteudo
    })

    if (resultado.success) {
      // Criar notificação de sucesso
      await criarNotificacaoAdmin(event, {
        tipo: 'success',
        titulo: 'Email enviado com sucesso',
        mensagem: `Email enviado para ${body.email}`,
        origem: 'envio_email',
        dados: {
          email: body.email,
          assunto: body.assunto
        }
      })

      console.log('✅ [ENVIAR-EMAIL] Email enviado com sucesso')
      return { success: true, message: 'Email enviado com sucesso' }
    } else {
      throw new Error(resultado.error || 'Erro ao enviar email')
    }

  } catch (error: any) {
    console.error('❌ [ENVIAR-EMAIL] Erro:', error)

    // Criar notificação de erro
    await criarNotificacaoAdmin(event, {
      tipo: 'error',
      titulo: 'Erro ao enviar email',
      mensagem: `Falha no envio: ${error.message}`,
      origem: 'erro_sistema',
      dados: {
        erro: error.message,
        stack: error.stack
      }
    })

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno do servidor'
    })
  }
})