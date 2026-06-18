/**
 * TESTE COM VARIÁVEIS LOCAIS
 * Simula o ambiente de produção usando as variáveis do .env local
 */

// Carregar variáveis do .env
import { config } from 'dotenv'
config()

console.log('🔍 [TESTE-LOCAL] === INICIANDO TESTE COM VARIÁVEIS LOCAIS ===')
console.log('🔍 [TESTE-LOCAL] Timestamp:', new Date().toISOString())

// Verificar se as variáveis foram carregadas
console.log('🔧 [CONFIG] === VERIFICANDO CONFIGURAÇÕES ===')
console.log('✅ [CONFIG] SUPABASE_URL:', process.env.SUPABASE_URL ? 'OK' : 'MISSING')
console.log('✅ [CONFIG] SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING')
console.log('✅ [CONFIG] NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING')

// Testar conexão com Supabase
async function testarConexaoSupabase() {
  console.log('🧪 [SUPABASE-TEST] === TESTANDO CONEXÃO ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log('🧪 [SUPABASE-TEST] URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')
  console.log('🧪 [SUPABASE-TEST] Key:', serviceRoleKey ? 'PRESENTE' : 'MISSING')
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ [SUPABASE-TEST] Configurações faltando!')
    return
  }
  
  try {
    // Testar conexão básica
    const testUrl = `${supabaseUrl}/rest/v1/funcionarios?select=id,nome_completo,email_login&limit=3`
    console.log('🧪 [SUPABASE-TEST] Testando URL:', testUrl)
    
    const response = await fetch(testUrl, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 [SUPABASE-TEST] Status:', response.status)
    console.log('📊 [SUPABASE-TEST] Status Text:', response.statusText)
    
    if (response.ok) {
      const funcionarios = await response.json()
      console.log('✅ [SUPABASE-TEST] Funcionários encontrados:', funcionarios.length)
      
      if (funcionarios.length > 0) {
        console.log('👤 [SUPABASE-TEST] Primeiro funcionário:', funcionarios[0].nome_completo, '(ID:', funcionarios[0].id, ')')
        
        // Testar holerites para este funcionário
        await testarHolerites(funcionarios[0].id, supabaseUrl, serviceRoleKey)
      }
    } else {
      const errorText = await response.text()
      console.error('❌ [SUPABASE-TEST] Erro:', errorText)
    }
    
  } catch (error) {
    console.error('💥 [SUPABASE-TEST] Erro na requisição:', error.message)
  }
}

// Testar API de holerites específica
async function testarHolerites(funcionarioId, supabaseUrl, serviceRoleKey) {
  console.log('📋 [HOLERITES-TEST] === TESTANDO HOLERITES ===')
  console.log('📋 [HOLERITES-TEST] Funcionário ID:', funcionarioId)
  
  try {
    // Testar diferentes filtros como na API real
    const urls = [
      `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&status=in.(enviado,visualizado)&select=*&order=periodo_inicio.desc`,
      `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&status=neq.gerado&select=*&order=periodo_inicio.desc`,
      `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&select=*&order=periodo_inicio.desc`
    ]
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      console.log(`📋 [HOLERITES-TEST] Tentativa ${i + 1}/3`)
      console.log(`📋 [HOLERITES-TEST] URL: ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log(`📊 [HOLERITES-TEST] Tentativa ${i + 1} - Status:`, response.status)
      
      if (response.ok) {
        const holerites = await response.json()
        console.log(`✅ [HOLERITES-TEST] Tentativa ${i + 1} - Holerites:`, holerites.length)
        
        if (holerites.length > 0) {
          console.log('📋 [HOLERITES-TEST] Primeiro holerite:')
          const primeiro = holerites[0]
          console.log('   ID:', primeiro.id)
          console.log('   Status:', primeiro.status)
          console.log('   Período:', primeiro.periodo_inicio, 'a', primeiro.periodo_fim)
          console.log('   Salário Bruto:', primeiro.salario_bruto)
          console.log('   Salário Líquido:', primeiro.salario_liquido)
        }
        
        return holerites // Sucesso, parar aqui
      } else {
        const errorText = await response.text()
        console.error(`❌ [HOLERITES-TEST] Tentativa ${i + 1} - Erro:`, errorText)
      }
    }
    
  } catch (error) {
    console.error('💥 [HOLERITES-TEST] Erro na requisição:', error.message)
  }
}

// Simular a API completa
async function simularAPICompleta() {
  console.log('🎭 [API-SIMULATION] === SIMULANDO API COMPLETA ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // Simular um funcionário específico (você pode alterar este ID)
  const funcionarioIdTeste = '123e4567-e89b-12d3-a456-426614174000' // ID de exemplo
  
  console.log('🎭 [API-SIMULATION] Simulando para funcionário ID:', funcionarioIdTeste)
  console.log('🎭 [API-SIMULATION] URL:', supabaseUrl)
  console.log('🎭 [API-SIMULATION] Key:', serviceRoleKey ? 'PRESENTE' : 'MISSING')
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ [API-SIMULATION] Configurações faltando!')
    return
  }
  
  // Simular exatamente o que a API faz
  const urls = [
    `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioIdTeste}&status=in.(enviado,visualizado)&select=*&order=periodo_inicio.desc`,
    `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioIdTeste}&status=neq.gerado&select=*&order=periodo_inicio.desc`,
    `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioIdTeste}&select=*&order=periodo_inicio.desc`
  ]
  
  let holerites = null
  let lastError = null
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`🎭 [API-SIMULATION] Tentativa ${i + 1}/3 - URL:`, url)
    
    const headers = {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Nuxt-Server-Production-V2',
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    }
    
    try {
      const startTime = Date.now()
      const response = await fetch(url, { headers, method: 'GET' })
      const endTime = Date.now()
      
      console.log(`⏱️ [API-SIMULATION] Tentativa ${i + 1} - Tempo:`, `${endTime - startTime}ms`)
      console.log(`📊 [API-SIMULATION] Tentativa ${i + 1} - Status:`, response.status)
      
      if (response.ok) {
        holerites = await response.json()
        console.log(`✅ [API-SIMULATION] Tentativa ${i + 1} - SUCESSO!`)
        console.log(`📦 [API-SIMULATION] Tentativa ${i + 1} - Holerites:`, holerites?.length || 0)
        break
      } else {
        const errorText = await response.text()
        lastError = `Status ${response.status}: ${errorText}`
        console.error(`❌ [API-SIMULATION] Tentativa ${i + 1} - Erro:`, lastError)
        
        if (response.status === 401 || response.status === 403) {
          console.log(`🔄 [API-SIMULATION] Tentativa ${i + 1} - Erro de auth, tentando próxima...`)
          continue
        } else {
          throw new Error(lastError)
        }
      }
    } catch (fetchError) {
      lastError = fetchError.message
      console.error(`💥 [API-SIMULATION] Tentativa ${i + 1} - Erro de fetch:`, fetchError)
      
      if (i === urls.length - 1) {
        throw fetchError
      }
    }
  }
  
  if (holerites === null) {
    console.error('❌ [API-SIMULATION] Todas as tentativas falharam. Último erro:', lastError)
  } else {
    console.log('✅ [API-SIMULATION] Simulação concluída com sucesso!')
    console.log('📦 [API-SIMULATION] Resultado final:', holerites?.length || 0, 'holerites')
  }
}

// EXECUTAR TODOS OS TESTES
async function executarTodosOsTestes() {
  console.log('🚀 [TESTE-LOCAL] === EXECUTANDO TODOS OS TESTES ===')
  
  await testarConexaoSupabase()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  await simularAPICompleta()
  
  console.log('🏁 [TESTE-LOCAL] === TESTES FINALIZADOS ===')
}

// EXECUTAR
executarTodosOsTestes().catch(error => {
  console.error('💥 [TESTE-LOCAL] Erro geral:', error)
})