import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'
import { enviarEmail } from '../../../utils/email'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // funcionario_ids: string[] | null — se null, envia para todos
  const { funcionario_ids } = body as { funcionario_ids: string[] | null }

  // Buscar o aviso
  const { data: aviso, error: avisoError } = await supabase
    .from('avisos')
    .select('id, titulo, descricao')
    .eq('id', id)
    .single()

  if (avisoError || !aviso) {
    throw createError({ statusCode: 404, message: 'Aviso não encontrado' })
  }

  // Buscar funcionários
  let query = supabase
    .from('funcionarios')
    .select('id, nome_completo, email_login, email_pessoal, empresas:empresa_id(nome, nome_fantasia)')
    .eq('status', 'ativo')
    .neq('tipo_acesso', 'admin')

  if (funcionario_ids && funcionario_ids.length > 0) {
    query = query.in('id', funcionario_ids)
  }

  const { data: funcionarios } = await query

  if (!funcionarios || funcionarios.length === 0) {
    throw createError({ statusCode: 400, message: 'Nenhum funcionário encontrado para envio' })
  }

  const dataAviso = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const descricaoHtml = aviso.descricao.replace(/\n/g, '<br>')

  let enviados = 0
  const erros: string[] = []

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
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">📢 Aviso</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px 40px 28px;">
            <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Para</p>
            <p style="margin:0 0 24px;font-size:17px;font-weight:700;color:#111827;">${func.nome_completo}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;">
            <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Assunto</p>
            <p style="margin:0 0 24px;font-size:16px;font-weight:600;color:#1e40af;">${aviso.titulo}</p>
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
            <p style="margin:0;font-size:11px;color:#64748b;">Email automático do Sistema RH. Por favor, não responda.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    try {
      await enviarEmail({ to: emailDestino, subject: `📢 ${aviso.titulo}`, html })
      enviados++
    } catch (e) {
      erros.push(func.nome_completo)
    }
  }

  return {
    success: true,
    enviados,
    total: funcionarios.length,
    erros
  }
})
