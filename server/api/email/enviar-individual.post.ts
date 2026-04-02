import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../utils/authMiddleware'
import { enviarEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  const { funcionario_id, assunto, mensagem } = body

  if (!funcionario_id || !assunto || !mensagem) {
    throw createError({ statusCode: 400, message: 'funcionario_id, assunto e mensagem são obrigatórios' })
  }

  const { data: funcionario, error } = await (supabase as any)
    .from('funcionarios')
    .select('id, nome_completo, email_login, email_pessoal, empresas:empresa_id(nome, nome_fantasia, cnpj)')
    .eq('id', funcionario_id)
    .single()

  if (error || !funcionario) {
    throw createError({ statusCode: 404, message: 'Funcionário não encontrado' })
  }

  const emailDestino = funcionario.email_login || funcionario.email_pessoal
  if (!emailDestino) {
    throw createError({ statusCode: 400, message: 'Funcionário não possui email cadastrado' })
  }

  const empresa = funcionario.empresas as any
  const empresaNome = empresa?.nome_fantasia || empresa?.nome || 'Qualitec Instrumentos de Medição'
  const empresaRazao = empresa?.nome || ''
  const empresaCnpj = empresa?.cnpj ? `CNPJ: ${empresa.cnpj}` : ''

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  const mensagemHtml = mensagem
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${assunto}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER: nome da empresa -->
          <tr>
            <td style="background:#ffffff;border-radius:12px 12px 0 0;padding:28px 40px;border-bottom:3px solid #e8f0fe;text-align:center;">
              <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#1e293b;letter-spacing:-0.5px;">
                ${empresaNome}
              </p>
              ${empresaRazao && empresaRazao !== empresaNome ? `<p style="margin:0 0 4px;font-size:12px;color:#64748b;">${empresaRazao}</p>` : ''}
              ${empresaCnpj ? `<p style="margin:0;font-size:12px;color:#94a3b8;">${empresaCnpj}</p>` : ''}
            </td>
          </tr>

          <!-- FAIXA AZUL com título -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:22px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#bfdbfe;">
                Departamento de Recursos Humanos
              </p>
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;">
                Comunicado Interno
              </h1>
            </td>
          </tr>

          <!-- CORPO -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">

              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                Para
              </p>
              <p style="margin:0 0 28px;font-size:18px;font-weight:700;color:#111827;">
                ${funcionario.nome_completo}
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 28px;">

              <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                Assunto
              </p>
              <p style="margin:0 0 28px;font-size:16px;font-weight:600;color:#1e40af;">
                ${assunto}
              </p>

              <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                Mensagem
              </p>
              <div style="background:#f8fafc;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:20px 24px;font-size:15px;line-height:1.8;color:#374151;">
                ${mensagemHtml}
              </div>

              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;text-align:right;">
                ${dataAtual}
              </p>
            </td>
          </tr>

          <!-- RODAPÉ -->
          <tr>
            <td style="background:#1e293b;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#e2e8f0;">
                ${empresaNome}
              </p>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">
                Departamento de Recursos Humanos
              </p>
              <hr style="border:none;border-top:1px solid #334155;margin:0 0 12px;">
              <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">
                Este é um email automático enviado pelo Sistema RH.<br>
                Por favor, não responda a esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`

  await enviarEmail({ to: emailDestino, subject: assunto, html })

  return { success: true, message: `Email enviado para ${emailDestino}` }
})
