import { enviarEmail } from '../../../utils/email'
import { criarNotificacaoAdmin } from '../../../utils/notifications'
import { requireAdmin } from '../../../utils/authMiddleware'

/**
 * Parse seguro de string DATE do Postgres (YYYY-MM-DD) para Date local
 * Evita problemas de timezone usando construtor direto
 */
function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Função pura que calcula referência do holerite baseado no periodo_inicio
 * Para FOLHA MENSAL: mostra o mês trabalhado (mês ANTERIOR ao periodo_inicio)
 * Para ADIANTAMENTO: mostra o período completo (mesmo mês)
 * @param periodo_inicio - String DATE do Postgres (YYYY-MM-DD)
 * @param isAdiantamento - Se true, é adiantamento
 * @returns Objeto com mesAno, inicio e fim formatados
 */
function buildReferencia(periodo_inicio: string, isAdiantamento: boolean = false): { mesAno: string; inicio: string; fim: string } {
  const periodoInicio = parseDateOnly(periodo_inicio)
  const ano = periodoInicio.getFullYear()
  const mes = periodoInicio.getMonth() // 0-11
  
  // O mês de referência é SEMPRE o mês do periodo_inicio (mês trabalhado)
  // Exemplo: periodo_inicio = 01/04/2026 → "abril de 2026"
  const mesReferencia = mes
  
  // Calcular primeiro e último dia do mês de referência
  const refInicio = new Date(ano, mesReferencia, 1)
  const refFim = new Date(ano, mesReferencia + 1, 0)
  
  const mesAno = refInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const inicio = refInicio.toLocaleDateString('pt-BR')
  const fim = refFim.toLocaleDateString('pt-BR')
  
  return { mesAno, inicio, fim }
}

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[API] Admin autenticado enviando email de holerite:', requestingUser.nome_completo)
  
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite não fornecido'
      })
    }

    console.log('📧 Buscando holerite ID:', id)

    // Buscar holerite
    const holeriteResponse = await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!holeriteResponse.ok) {
      const errorText = await holeriteResponse.text()
      console.error('❌ Erro ao buscar holerite:', errorText)
      throw new Error('Erro ao buscar holerite')
    }

    const holerites = await holeriteResponse.json()
    
    if (!holerites || holerites.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Holerite não encontrado'
      })
    }

    const holerite = holerites[0]
    console.log('✅ Holerite encontrado:', holerite.id)

    // Buscar funcionário
    const funcionarioResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!funcionarioResponse.ok) {
      throw new Error('Erro ao buscar funcionário')
    }

    const funcionarios = await funcionarioResponse.json()
    
    if (!funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    const funcionario = funcionarios[0]
    console.log('✅ Funcionário encontrado:', funcionario.nome_completo)
    
    // Usar email_login se email não estiver disponível
    const emailDestino = funcionario.email || funcionario.email_login
    
    if (!emailDestino) {
      throw createError({
        statusCode: 400,
        message: 'Funcionário não possui email cadastrado'
      })
    }

    // Calcular referência usando função pura (sem lógica de mês anterior)
    const isDev = process.env.NODE_ENV === 'development'
    
    // Determinar se é adiantamento pela observação (mais confiável)
    const periodoInicioDate = parseDateOnly(holerite.periodo_inicio)
    const isAdiantamento = holerite.observacoes?.startsWith('Adiantamento') || false
    
    // Calcular referência (subtrai 1 mês se for folha mensal)
    const referencia = buildReferencia(holerite.periodo_inicio, isAdiantamento)
    
    // Logs de debug (apenas em dev)
    if (isDev) {
      console.log('🔍 [DEBUG] Cálculo de Referência:')
      console.log('  periodo_inicio raw:', holerite.periodo_inicio)
      console.log('  isAdiantamento:', isAdiantamento)
      console.log('  periodoInicio local:', parseDateOnly(holerite.periodo_inicio).toISOString())
      console.log('  refInicio:', referencia.inicio)
      console.log('  refFim:', referencia.fim)
      console.log('  mesAno final:', referencia.mesAno)
    }
    
    // Determinar tipo de holerite pela observação
    let tipoHolerite = 'mensal'
    if (isAdiantamento) {
      tipoHolerite = 'adiantamento'
    }
    
    const mesAno = referencia.mesAno

    console.log('📨 Enviando email para:', emailDestino)
    console.log('📅 Mês de referência:', mesAno)
    console.log('🗓️ Período exibido no email:', referencia.inicio, 'a', referencia.fim)

    // Enviar email
    const emailEnviado = await enviarEmail({
      to: emailDestino,
      subject: `Holerite disponível - ${mesAno}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">📄 Holerite Disponível</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Olá, <strong>${funcionario.nome_completo}</strong>!</p>
            
            <p>Seu holerite referente a <strong>${mesAno} (${tipoHolerite})</strong> está disponível para visualização no Sistema RH.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #1f2937;">📊 Resumo do Holerite</h3>
              <p><strong>Período:</strong> ${referencia.inicio} a ${referencia.fim}</p>
              <p><strong>Salário Base:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holerite.salario_base || 0)}</p>
              <p><strong>Salário Líquido:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holerite.salario_liquido || 0)}</p>
            </div>
            
            <p>Acesse o sistema para visualizar os detalhes completos e fazer o download do PDF:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://rhqualitec.vercel.app/login" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🔐 Acessar Sistema RH
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>💡 Dica:</strong> Você pode visualizar e baixar todos os seus holerites na seção "Meus Holerites" do sistema.
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
              <p><strong>Qualitec Instrumentos de Medição</strong></p>
              <p>Este é um email automático. Por favor, não responda.</p>
            </div>
          </div>
        </div>
      `
    })

    if (!emailEnviado || !emailEnviado.success) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao enviar email'
      })
    }

    console.log('✅ Email enviado com sucesso!')

    // Criar notificação para o admin sobre envio de email
    const agora = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    await criarNotificacaoAdmin(event, {
      titulo: '📧 Holerite Enviado',
      mensagem: `Holerite de ${funcionario.nome_completo} (${mesAno}) enviado por email em ${agora}`,
      tipo: 'success',
      origem: 'envio_email',
      dados: {
        funcionario_id: funcionario.id,
        funcionario_nome: funcionario.nome_completo,
        funcionario_email: emailDestino,
        holerite_id: holerite.id,
        periodo: mesAno,
        tipo_holerite: tipoHolerite,
        timestamp: new Date().toISOString()
      },
      acao_url: `/admin/holerites`
    })

    // Atualizar status do holerite para "enviado"
    await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ status: 'enviado' })
      }
    )

    return {
      success: true,
      message: 'Email enviado com sucesso',
      email: emailDestino
    }

  } catch (error: any) {
    console.error('💥 Erro ao enviar email do holerite:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao enviar email'
    })
  }
})
