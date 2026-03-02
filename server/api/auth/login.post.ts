import { verifyPassword } from '../../utils/auth'
import { notificarLogin, criarNotificacaoAdmin } from '../../utils/notifications'
import { generateTokenPair, setTokenCookies } from '../../utils/jwt'
import { requireCsrfProtection } from '../../utils/csrfMiddleware'

// Rate limiting simples (em produção, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar proteção CSRF
  await requireCsrfProtection(event)
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substr(2, 9)
  
  console.log(`🔐 [${requestId}] INÍCIO - Nova tentativa de login`)
  console.log(`🔐 [${requestId}] Timestamp: ${new Date().toISOString()}`)

  const { email, senha } = await readBody(event)

  if (!email || !senha) {
    console.log(`🔐 [${requestId}] ERRO - Email ou senha não fornecidos`)
    throw createError({
      statusCode: 400,
      statusMessage: 'Email e senha são obrigatórios'
    })
  }

  // Rate limiting básico
  const clientIP = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
  const now = Date.now()
  const attempts = loginAttempts.get(clientIP)
  
  if (attempts && attempts.count >= 5 && now - attempts.lastAttempt < 15 * 60 * 1000) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    console.log(`🔐 [${requestId}] Tentativa de login:`, { email, clientIP })
    
    // Buscar funcionário apenas pelo email (SEM incluir senhas na resposta)
    const url = `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.${encodeURIComponent(email)}&status=eq.ativo&select=id,nome_completo,email_login,tipo_acesso,status,cargo_id,departamento_id,empresa_id,senha_hash`
    
    console.log(`🔐 [${requestId}] 📡 Consultando usuário...`)

    const response = await fetch(url, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    })

    console.log(`🔐 [${requestId}] 📊 Status da resposta:`, response.status)
    
    const funcionarios = await response.json()
    console.log(`🔐 [${requestId}] 👥 Funcionários encontrados:`, funcionarios.length)

    if (!response.ok || !funcionarios || funcionarios.length === 0) {
      console.log(`🔐 [${requestId}] ⚠️ Usuário não encontrado`)
      // Incrementar tentativas falhadas
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, { count: currentAttempts.count + 1, lastAttempt: now })
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou senha incorretos'
      })
    }

    const funcionario = funcionarios[0]
    console.log(`🔐 [${requestId}] 👤 Funcionário encontrado:`, { id: funcionario.id, nome: funcionario.nome_completo })
    
    // Verificar senha com hash
    const isValidPassword = await verifyPassword(senha, funcionario.senha_hash)
    console.log(`🔐 [${requestId}] ✅ Senha válida:`, isValidPassword)
    
    if (!isValidPassword) {
      // Incrementar tentativas falhadas
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, { count: currentAttempts.count + 1, lastAttempt: now })
      
      // Notificar admin sobre tentativa de login falhada (após 3 tentativas)
      if (currentAttempts.count >= 2) {
        const agora = new Date().toLocaleString('pt-BR', { 
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })

        await criarNotificacaoAdmin(event, {
          titulo: '🚨 Tentativas de Login Suspeitas',
          mensagem: `Múltiplas tentativas de login falhadas para ${email} em ${agora} (IP: ${clientIP})`,
          tipo: 'warning',
          origem: 'login_falhado',
          importante: true,
          dados: {
            email_tentativa: email,
            ip: clientIP,
            tentativas: currentAttempts.count + 1,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou senha incorretos'
      })
    }

    // Reset tentativas em caso de sucesso
    loginAttempts.delete(clientIP)

    console.log(`🔐 [${requestId}] 🎉 LOGIN SUCESSO - Gerando tokens JWT...`)

    // Gerar par de tokens JWT
    const tokens = generateTokenPair({
      userId: funcionario.id,
      email: funcionario.email_login,
      tipo: funcionario.tipo_acesso,
      empresa_id: funcionario.empresa_id
    })
    
    // Definir tokens em cookies seguros
    setTokenCookies(event, tokens)

    // Criar notificação de login para o admin
    await notificarLogin(event, {
      id: funcionario.id,
      nome: funcionario.nome_completo,
      email: funcionario.email_login,
      tipo: funcionario.tipo_acesso
    }, clientIP)

    console.log(`🔐 [${requestId}] ✅ CONCLUÍDO - Tempo total: ${Date.now() - startTime}ms`)

    // Retornar dados do usuário e tokens
    return {
      success: true,
      user: {
        id: funcionario.id,
        nome: funcionario.nome_completo,
        email: funcionario.email_login,
        tipo: funcionario.tipo_acesso,
        cargo: funcionario.cargo_id,
        departamento: funcionario.departamento_id
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    }
  } catch (error: any) {
    console.error(`🔐 [${requestId}] 💥 Erro no login:`, error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
