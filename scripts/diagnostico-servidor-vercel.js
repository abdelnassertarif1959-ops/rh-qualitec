/**
 * DIAGNÓSTICO DO SERVIDOR PARA PRODUÇÃO VERCEL
 * Execute este script no servidor para verificar configurações
 */

console.log('🔍 [DIAGNÓSTICO-SERVIDOR] === INICIANDO DIAGNÓSTICO ===')
console.log('🔍 [DIAGNÓSTICO-SERVIDOR] Timestamp:', new Date().toISOString())

// 1. VERIFICAR AMBIENTE
console.log('🌍 [AMBIENTE] Node.js version:', process.version)
console.log('🌍 [AMBIENTE] Platform:', process.platform)
console.log('🌍 [AMBIENTE] NODE_ENV:', process.env.NODE_ENV)
console.log('🌍 [AMBIENTE] VERCEL_URL:', process.env.VERCEL_URL || 'N/A')
console.log('🌍 [AMBIENTE] VERCEL_ENV:', process.env.VERCEL_ENV || 'N/A')

// 2. VERIFICAR VARIÁVEIS DE AMBIENTE SUPABASE
console.log('🔧 [CONFIG] === VERIFICANDO CONFIGURAÇÕES SUPABASE ===')

const supabaseVars = [
  'SUPABASE_URL',
  'NUXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'NUXT_PUBLIC_SUPABASE_KEY'
]

supabaseVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ [CONFIG] ${varName}: ${value.substring(0, 30)}...`)
  } else {
    console.log(`❌ [CONFIG] ${varName}: MISSING`)
  }
})

// 3. VERIFICAR OUTRAS VARIÁVEIS IMPORTANTES
console.log('📧 [EMAIL] === VERIFICANDO CONFIGURAÇÕES DE EMAIL ===')
console.log('📧 [EMAIL] GMAIL_EMAIL:', process.env.GMAIL_EMAIL ? 'PRESENTE' : 'MISSING')
console.log('📧 [EMAIL] GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'PRESENTE' : 'MISSING')

console.log('🔐 [SECURITY] === VERIFICANDO CONFIGURAÇÕES DE SEGURANÇA ===')
console.log('🔐 [SECURITY] NUXT_SECRET_KEY:', process.env.NUXT_SECRET_KEY ? 'PRESENTE' : 'MISSING')
console.log('🔐 [SECURITY] CRON_SECRET:', process.env.CRON_SECRET ? 'PRESENTE' : 'MISSING')

// 4. TESTAR CONEXÃO COM SUPABASE
async function testarConexaoSupabase() {
  console.log('🧪 [SUPABASE-TEST] === TESTANDO CONEXÃO COM SUPABASE ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ [SUPABASE-TEST] Configurações faltando!')
    console.error('   URL:', supabaseUrl ? 'OK' : 'MISSING')
    console.error('   Service Role Key:', serviceRoleKey ? 'OK' : 'MISSING')
    return
  }
  
  try {
    // Testar conexão básica
    const testUrl = `${supabaseUrl}/rest/v1/funcionarios?select=count&limit=1`
    console.log('🧪 [SUPABASE-TEST] URL de teste:', testUrl)
    
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
      const data = await response.json()
      console.log('✅ [SUPABASE-TEST] Conexão OK! Dados:', data)
    } else {
      const errorText = await response.text()
      console.error('❌ [SUPABASE-TEST] Erro na conexão:', errorText)
    }
    
  } catch (error) {
    console.error('💥 [SUPABASE-TEST] Erro na requisição:', error.message)
  }
}

// 5. TESTAR API DE HOLERITES ESPECÍFICA
async function testarAPIHolerites() {
  console.log('📋 [HOLERITES-TEST] === TESTANDO API DE HOLERITES ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ [HOLERITES-TEST] Configurações faltando!')
    return
  }
  
  try {
    // Buscar um funcionário para teste
    const funcionariosUrl = `${supabaseUrl}/rest/v1/funcionarios?select=id,nome_completo&limit=1`
    console.log('📋 [HOLERITES-TEST] Buscando funcionário de teste...')
    
    const funcionariosResponse = await fetch(funcionariosUrl, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!funcionariosResponse.ok) {
      console.error('❌ [HOLERITES-TEST] Erro ao buscar funcionários:', funcionariosResponse.status)
      return
    }
    
    const funcionarios = await funcionariosResponse.json()
    if (!funcionarios || funcionarios.length === 0) {
      console.log('⚠️ [HOLERITES-TEST] Nenhum funcionário encontrado')
      return
    }
    
    const funcionario = funcionarios[0]
    console.log('👤 [HOLERITES-TEST] Funcionário de teste:', funcionario.nome_completo, '(ID:', funcionario.id, ')')
    
    // Testar busca de holerites
    const holeritesUrl = `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&select=*&order=periodo_inicio.desc`
    console.log('📋 [HOLERITES-TEST] Buscando holerites...')
    
    const holeritesResponse = await fetch(holeritesUrl, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 [HOLERITES-TEST] Status:', holeritesResponse.status)
    
    if (holeritesResponse.ok) {
      const holerites = await holeritesResponse.json()
      console.log('✅ [HOLERITES-TEST] Holerites encontrados:', holerites.length)
      
      if (holerites.length > 0) {
        console.log('📋 [HOLERITES-TEST] Primeiro holerite:')
        const primeiro = holerites[0]
        console.log('   ID:', primeiro.id)
        console.log('   Status:', primeiro.status)
        console.log('   Período:', primeiro.periodo_inicio, 'a', primeiro.periodo_fim)
        console.log('   Salário:', primeiro.salario_bruto)
      }
    } else {
      const errorText = await holeritesResponse.text()
      console.error('❌ [HOLERITES-TEST] Erro ao buscar holerites:', errorText)
    }
    
  } catch (error) {
    console.error('💥 [HOLERITES-TEST] Erro na requisição:', error.message)
  }
}

// 6. VERIFICAR TODAS AS VARIÁVEIS DE AMBIENTE
function listarTodasVariaveis() {
  console.log('📝 [ENV-VARS] === TODAS AS VARIÁVEIS DE AMBIENTE ===')
  
  const relevantVars = Object.keys(process.env).filter(key => 
    key.includes('SUPABASE') || 
    key.includes('GMAIL') || 
    key.includes('NUXT') ||
    key.includes('VERCEL') ||
    key.includes('SECRET') ||
    key.includes('CRON')
  )
  
  console.log('📝 [ENV-VARS] Variáveis relevantes encontradas:', relevantVars.length)
  
  relevantVars.forEach(key => {
    const value = process.env[key]
    if (value && (key.includes('KEY') || key.includes('PASSWORD') || key.includes('SECRET'))) {
      console.log(`📝 [ENV-VARS] ${key}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`📝 [ENV-VARS] ${key}: ${value}`)
    }
  })
}

// EXECUTAR TODOS OS TESTES
async function executarDiagnosticoCompleto() {
  console.log('🚀 [DIAGNÓSTICO-SERVIDOR] === EXECUTANDO TODOS OS TESTES ===')
  
  // Listar variáveis
  listarTodasVariaveis()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Testar conexão
  await testarConexaoSupabase()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Testar API específica
  await testarAPIHolerites()
  
  console.log('🏁 [DIAGNÓSTICO-SERVIDOR] === DIAGNÓSTICO COMPLETO FINALIZADO ===')
}

// EXECUTAR
executarDiagnosticoCompleto().catch(error => {
  console.error('💥 [DIAGNÓSTICO-SERVIDOR] Erro geral:', error)
})