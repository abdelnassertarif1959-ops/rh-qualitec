import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'
import { enviarEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é admin
    const user = await requireAdmin(event)
    
    console.log('🟢 [API-AVISOS] === INÍCIO POST AVISO ===')
    
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    const { titulo, descricao, criado_por } = body

    console.log('🟢 [API-AVISOS] Body recebido:', {
      titulo,
      descricao: descricao?.substring(0, 50) + '...',
      criado_por
    })

    // Validações
    if (!titulo || titulo.trim().length === 0) {
      console.error('❌ [API-AVISOS] Título vazio')
      throw createError({
        statusCode: 400,
        message: 'Título é obrigatório'
      })
    }

    if (titulo.length > 200) {
      console.error('❌ [API-AVISOS] Título muito longo')
      throw createError({
        statusCode: 400,
        message: 'Título deve ter no máximo 200 caracteres'
      })
    }

    if (!descricao || descricao.trim().length === 0) {
      console.error('❌ [API-AVISOS] Descrição vazia')
      throw createError({
        statusCode: 400,
        message: 'Descrição é obrigatória'
      })
    }

    if (!criado_por) {
      console.error('❌ [API-AVISOS] ID do criador não fornecido')
      throw createError({
        statusCode: 400,
        message: 'ID do criador é obrigatório'
      })
    }

    console.log('🟢 [API-AVISOS] Verificando se usuário é admin...')
    console.log('🟢 [API-AVISOS] criado_por:', criado_por)

    // Verificar se o usuário é admin
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select('tipo_acesso')
      .eq('id', criado_por)
      .single()

    console.log('🟢 [API-AVISOS] Resultado da busca do funcionário:', {
      funcionario,
      funcError,
      tipo_acesso: funcionario?.tipo_acesso
    })

    if (funcError) {
      console.error('❌ [API-AVISOS] Erro ao buscar funcionário:', funcError)
      throw createError({
        statusCode: 500,
        message: 'Erro ao verificar permissões do usuário'
      })
    }

    if (!funcionario) {
      console.error('❌ [API-AVISOS] Funcionário não encontrado')
      throw createError({
        statusCode: 404,
        message: 'Usuário não encontrado'
      })
    }

    if (funcionario.tipo_acesso !== 'admin') {
      console.error('❌ [API-AVISOS] Usuário não é admin:', funcionario.tipo_acesso)
      throw createError({
        statusCode: 403,
        message: 'Apenas administradores podem criar avisos'
      })
    }

    console.log('✅ [API-AVISOS] Usuário é admin, criando aviso...')

    // Criar aviso
    const { data: aviso, error } = await supabase
      .from('avisos')
      .insert({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        criado_por
      })
      .select(`
        *,
        criador:funcionarios!avisos_criado_por_fkey(
          id,
          nome_completo,
          avatar
        )
      `)
      .single()

    if (error) {
      console.error('❌ [API-AVISOS] Erro ao criar aviso no banco:', error)
      throw createError({
        statusCode: 500,
        message: 'Erro ao criar aviso'
      })
    }

    console.log('✅ [API-AVISOS] Aviso criado com sucesso:', aviso)

    // Enviar email para todos os funcionários ativos com email cadastrado
    try {
      const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id, nome_completo, email_login, email_pessoal, empresas:empresa_id(nome, nome_fantasia)')
        .eq('status', 'ativo')
        .neq('tipo_acesso', 'admin')
        .eq('receber_avisos_email', true)

      if (funcionarios && funcionarios.length > 0) {
        const dataAviso = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        const descricaoHtml = descricao.trim().replace(/\n/g, '<br>')

        let enviados = 0
        for (const func of funcionarios as any[]) {
          const emailDestino = func.email_login || func.email_pessoal
          if (!emailDestino) continue

          const empresaNome = func.empresas?.nome_fantasia || func.empresas?.nome || 'Qualitec Instrumentos de Medição'

          const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#ffffff;border-radius:12px 12px 0 0;padding:24px 40px;border-bottom:3px solid #e8f0fe;text-align:center;">
            <p style="margin:0;font-size:20px;font-weight:800;color:#1e293b;">${empresaNome}</p>
          </td>
        </tr>
        <tr>
          <td style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#bfdbfe;">Comunicado Interno</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">📢 Novo Aviso</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px 40px 28px;">
            <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Para</p>
            <p style="margin:0 0 24px;font-size:17px;font-weight:700;color:#111827;">${func.nome_completo}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;">
            <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Assunto</p>
            <p style="margin:0 0 24px;font-size:16px;font-weight:600;color:#1e40af;">${titulo.trim()}</p>
            <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Mensagem</p>
            <div style="background:#f8fafc;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:18px 22px;font-size:15px;line-height:1.8;color:#374151;">${descricaoHtml}</div>
            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:right;">${dataAviso}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#1e293b;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#e2e8f0;">${empresaNome}</p>
            <p style="margin:0 0 10px;font-size:12px;color:#94a3b8;">Departamento de Recursos Humanos</p>
            <hr style="border:none;border-top:1px solid #334155;margin:0 0 10px;">
            <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">Email automático do Sistema RH. Por favor, não responda.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

          try {
            await enviarEmail({ to: emailDestino, subject: `📢 ${titulo.trim()}`, html })
            enviados++
          } catch (emailErr) {
            console.warn(`⚠️ [API-AVISOS] Falha ao enviar email para ${emailDestino}:`, emailErr)
          }
        }
        console.log(`✅ [API-AVISOS] Emails enviados: ${enviados}/${funcionarios.length}`)
      }
    } catch (emailError) {
      // Não falhar a criação do aviso por causa do email
      console.error('⚠️ [API-AVISOS] Erro ao enviar emails do aviso:', emailError)
    }

    console.log('🟢 [API-AVISOS] === FIM POST AVISO ===')

    return {
      ...aviso,
      total_comentarios: 0
    }
  } catch (error: any) {
    console.error('❌ [API-AVISOS] Erro geral:', error)
    console.error('❌ [API-AVISOS] Stack:', error.stack)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar aviso'
    })
  }
})
