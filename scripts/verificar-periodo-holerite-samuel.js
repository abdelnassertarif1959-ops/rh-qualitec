// Script para verificar o período do holerite do Samuel Tarif
import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

async function verificarPeriodoHolerite() {
  try {
    console.log('🔍 Buscando holerite do Samuel Tarif...\n')
    console.log('URL:', SUPABASE_URL)
    console.log('Key:', SUPABASE_SERVICE_ROLE_KEY ? 'Definida' : 'Não definida')
    console.log('')
    
    // Buscar funcionário Samuel
    const funcResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?nome_completo=ilike.%samuel%tarif%&select=id,nome_completo`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )
    
    if (!funcResponse.ok) {
      const errorText = await funcResponse.text()
      console.log('❌ Erro na resposta:', funcResponse.status, funcResponse.statusText)
      console.log('Resposta:', errorText.substring(0, 200))
      return
    }
    
    const funcionarios = await funcResponse.json()
    
    if (!funcionarios || funcionarios.length === 0) {
      console.log('❌ Funcionário Samuel Tarif não encontrado')
      return
    }
    
    const samuel = funcionarios[0]
    console.log(`✅ Funcionário encontrado: ${samuel.nome_completo} (ID: ${samuel.id})\n`)
    
    // Buscar holerites do Samuel (últimos 3)
    const holeriteResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.${samuel.id}&select=*&order=created_at.desc&limit=3`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )
    
    const holerites = await holeriteResponse.json()
    
    if (!holerites || holerites.length === 0) {
      console.log('❌ Nenhum holerite encontrado para Samuel')
      return
    }
    
    console.log(`📄 Últimos ${holerites.length} holerite(s) do Samuel:\n`)
    
    holerites.forEach((h, index) => {
      const periodoInicio = new Date(h.periodo_inicio)
      const periodoFim = new Date(h.periodo_fim)
      const isAdiantamento = periodoInicio.getDate() === 15
      
      console.log(`${index + 1}. Holerite ID: ${h.id}`)
      console.log(`   Tipo: ${isAdiantamento ? '💰 Adiantamento' : '📄 Folha Mensal'}`)
      console.log(`   Período no banco: ${h.periodo_inicio} a ${h.periodo_fim}`)
      console.log(`   Período formatado: ${periodoInicio.toLocaleDateString('pt-BR')} a ${periodoFim.toLocaleDateString('pt-BR')}`)
      console.log(`   Status: ${h.status}`)
      console.log(`   Criado em: ${new Date(h.created_at).toLocaleString('pt-BR')}`)
      
      // Simular cálculo do email
      if (!isAdiantamento) {
        const mesAnterior = new Date(periodoInicio)
        mesAnterior.setMonth(mesAnterior.getMonth() - 1)
        
        const primeiroDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1)
        const ultimoDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0)
        
        const mesReferencia = mesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        
        console.log(`   📧 Email mostraria:`)
        console.log(`      Mês: ${mesReferencia}`)
        console.log(`      Período: ${primeiroDia.toLocaleDateString('pt-BR')} a ${ultimoDia.toLocaleDateString('pt-BR')}`)
      } else {
        const mesReferencia = periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        console.log(`   📧 Email mostraria:`)
        console.log(`      Mês: ${mesReferencia}`)
        console.log(`      Período: ${periodoInicio.toLocaleDateString('pt-BR')} a ${periodoFim.toLocaleDateString('pt-BR')}`)
      }
      
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarPeriodoHolerite()
