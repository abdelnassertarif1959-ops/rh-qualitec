/**
 * API para excluir todas as notificações (ou filtradas)
 */
import { requireAuth } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação
  const requestingUser = await requireAuth(event)
  console.log('[API] Usuário autenticado excluindo todas as notificações:', requestingUser.nome_completo)
  
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey
    
    const query = getQuery(event)
    const tipo = query.tipo as string | undefined
    const lidas = query.lidas as string | undefined

    console.log('🗑️ [NOTIFICACAO-DELETE-ALL] Excluindo notificações...')
    console.log('   Filtros:', { tipo, lidas })

    // Construir query
    let url = `${supabaseUrl}/rest/v1/notificacoes?`
    
    if (tipo) {
      url += `tipo=eq.${tipo}&`
    }
    
    if (lidas === 'true') {
      url += `lida=eq.true&`
    } else if (lidas === 'false') {
      url += `lida=eq.false&`
    }

    // Remover último & se houver
    url = url.replace(/&$/, '')

    // Excluir notificações
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [NOTIFICACAO-DELETE-ALL] Erro ao excluir:', errorText)
      throw new Error('Erro ao excluir notificações')
    }

    console.log('✅ [NOTIFICACAO-DELETE-ALL] Notificações excluídas com sucesso')

    return {
      success: true,
      message: 'Notificações excluídas com sucesso'
    }

  } catch (error: any) {
    console.error('💥 [NOTIFICACAO-DELETE-ALL] Erro:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao excluir notificações'
    })
  }
})
