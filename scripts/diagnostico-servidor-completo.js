/**
 * DIAGNÓSTICO COMPLETO DO SERVIDOR - PRODUÇÃO VERCEL
 * Execute: node scripts/diagnostico-servidor-completo.js
 */

console.log('🔍 [DIAGNÓSTICO-SERVIDOR] === INICIANDO DIAGNÓSTICO COMPLETO ===')
console.log('🔍 [DIAGNÓSTICO-SERVIDOR] Timestamp:', new Date().toISOString())

// 1. VERIFICAR AMBIENTE
console.log('\n🌍 [AMBIENTE] === VERIFICAÇÃO DO AMBIENTE ===')
console.log('🌍 [AMBIENTE] NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('🌍 [AMBIENTE] VERCEL_URL:', process.env.VERCEL_URL || 'undefined')
console.log('🌍 [AMBIENTE] VERCEL_ENV:', process.env.VERCEL_ENV || 'undefined')
console.log('🌍 [AMBIENTE] Platform:', process.platform)
console.log('🌍 [AMBIENTE] Node Version:', process.version)

// 2. VERIFICAR VARIÁVEIS SUPABASE
console.log('\n🔧 [SUPABASE] === VERIFICAÇÃO DAS VARIÁVEIS SUPABASE ===')
const supabaseVars = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'NUXT_PUBLIC_SUPABASE_URL': process.env.NUXT_PUBLIC_SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
  'NUXT_PUBLIC_SUPABASE_KEY': process.env.NUXT_PUBLIC_SUPABASE_KEY
}

for (const [key, value] of Object.entries(supabaseVars)) {
  if (value) {
    console.log(`✅ [SUPABASE] ${key}: PRESENTE (${value.substring(0, 30)}...)`)
  } else {
    console.log(`❌ [SUPABASE] ${key}: AUSENTE`)
  }
}

// 3. VERIFICAR OUTRAS VARIÁVEIS IMPORTANTES
console.log('\n📧 [EMAIL] === VERIFICAÇÃO DAS VARIÁVEIS DE EMAIL ===')
const emailVars = {
  'GMAIL_EMAIL': process.env.GMAIL_EMAIL,
  'GMAIL_APP_PASSWORD': process.env.GMAIL_APP_PASSWORD
}

for (const [key, value] of Object.entries(emailVars)) {
  if (value) {
    console.log(`✅ [EMAIL] ${key}: PRESENTE`)
  } else {
    console.log(`❌ [EMAIL] ${key}: AUSENTE`)
  }
}

console.log('\n🔐 [SEGURANÇA] === VERIFICAÇÃO DAS VARIÁVEIS DE SEGURANÇA ===')
const securityVars = {
  'NUXT_SECRET_KEY': process.env.NUXT_SECRET_KEY,
  'CRON_SECRET': process.env.CRON_SECRET
}

for (const [key, value] of Object.entries(securityVars)) {
  if (value) {
    console.log(`✅ [SEGURANÇA] ${key}: PRESENTE`)
  } else {
    console.log(`❌ [SEGURANÇA] ${key}: AUSENTE`)
  }
}

// 4. TESTAR CONEXÃO COM SUPABASE
console.log('\n🧪 [TESTE-SUPABASE] === TESTANDO CONEXÃO COM SUPABASE ===')

async function testarSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ [TESTE-SUPABASE] Variáveis necessárias não encontradas')
    return
  }
  
  try {
    console.log('🧪 [TESTE-SUPABASE] Testando conexão básica...')
    
    const response = await fetch(`${supabaseUrl}/rest/v1/funcionarios?select=count`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 [TESTE-SUPABASE] Status da resposta:', response.status)
    console.log('📊 [TESTE-SUPABASE] Status text:', response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ [TESTE-SUPABASE] Conexão bem-sucedida!')
      console.log('✅ [TESTE-SUPABASE] Dados recebidos:', data)
    } else {
      const errorText = await response.text()
      console.log('❌ [TESTE-SUPABASE] Erro na conexão:', errorText)
    }
    
  } catch (error) {
    console.log('💥 [TESTE-SUPABASE] Erro na requisição:', error.message)
  }
}

// 5. SIMULAR REQUISIÇÃO DE HOLERITES
async function testarHolerites() {
  console.log('\n💰 [TESTE-HOLERITES] === SIMULANDO REQUISIÇÃO DE HOLERITES ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ [TESTE-HOLERITES] Variáveis necessárias não encontradas')
    return
  }
  
  try {
    // Primeiro, buscar um funcionário para teste
    console.log('👤 [TESTE-HOLERITES] Buscando funcionários...')
    const funcionariosResponse = await fetch(`${supabaseUrl}/rest/v1/funcionarios?select=id,nome_completo&limit=1`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!funcionariosResponse.ok) {
      console.log('❌ [TESTE-HOLERITES] Erro ao buscar funcionários:', funcionariosResponse.status)
      return
    }
    
    const funcionarios = await funcionariosResponse.json()
    if (!funcionarios || funcionarios.length === 0) {
      console.log('❌ [TESTE-HOLERITES] Nenhum funcionário encontrado')
      return
    }
    
    const funcionario = funcionarios[0]
    console.log('👤 [TESTE-HOLERITES] Funcionário encontrado:', funcionario.nome_completo, '(ID:', funcionario.id, ')')
    
    // Agora testar busca de holerites
    console.log('💰 [TESTE-HOLERITES] Buscando holerites do funcionário...')
    const holeritesResponse = await fetch(`${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&select=*&order=periodo_inicio.desc`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 [TESTE-HOLERITES] Status da resposta:', holeritesResponse.status)
    
    if (holeritesResponse.ok) {
      const holerites = await holeritesResponse.json()
      console.log('✅ [TESTE-HOLERITES] Holerites encontrados:', holerites.length)
      
      if (holerites.length > 0) {
        console.log('📋 [TESTE-HOLERITES] Primeiro holerite:')
        console.log('   ID:', holerites[0].id)
        console.log('   Status:', holerites[0].status)
        console.log('   Período:', holerites[0].periodo_inicio, 'a', holerites[0].periodo_fim)
        console.log('   Salário Base:', holerites[0].salario_base)
      }
    } else {
      const errorText = await holeritesResponse.text()
      console.log('❌ [TESTE-HOLERITES] Erro ao buscar holerites:', errorText)
    }
    
  } catch (error) {
    console.log('💥 [TESTE-HOLERITES] Erro na requisição:', error.message)
  }
}

// 6. VERIFICAR TODAS AS VARIÁVEIS DE AMBIENTE
console.log('\n📋 [TODAS-VARS] === TODAS AS VARIÁVEIS DE AMBIENTE ===')
const allEnvVars = Object.keys(process.env).sort()
console.log('📋 [TODAS-VARS] Total de variáveis:', allEnvVars.length)

// Mostrar apenas as relevantes para o projeto
const relevantVars = allEnvVars.filter(key => 
  key.includes('SUPABASE') || 
  key.includes('GMAIL') || 
  key.includes('NUXT') || 
  key.includes('VERCEL') ||
  key.includes('CRON') ||
  key.includes('SECRET')
)

console.log('📋 [TODAS-VARS] Variáveis relevantes:')
relevantVars.forEach(key => {
  const value = process.env[key]
  if (value) {
    // Mascarar valores sensíveis
    if (key.includes('KEY') || key.includes('PASSWORD') || key.includes('SECRET')) {
      console.log(`   ${key}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`   ${key}: ${value}`)
    }
  } else {
    console.log(`   ${key}: undefined`)
  }
})

// EXECUTAR TODOS OS TESTES
async function executarDiagnosticoCompleto() {
  await testarSupabase()
  await testarHolerites()
  
  console.log('\n🏁 [DIAGNÓSTICO-SERVIDOR] === DIAGNÓSTICO COMPLETO FINALIZADO ===')
  console.log('🏁 [DIAGNÓSTICO-SERVIDOR] Timestamp:', new Date().toISOString())
  
  // Resumo final
  console.log('\n📊 [RESUMO] === RESUMO DO DIAGNÓSTICO ===')
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (supabaseUrl && serviceRoleKey) {
    console.log('✅ [RESUMO] Configuração básica do Supabase: OK')
  } else {
    console.log('❌ [RESUMO] Configuração básica do Supabase: FALTANDO')
    console.log('   - Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no Vercel')
  }
  
  const gmailEmail = process.env.GMAIL_EMAIL
  const gmailPassword = process.env.GMAIL_APP_PASSWORD
  
  if (gmailEmail && gmailPassword) {
    console.log('✅ [RESUMO] Configuração de email: OK')
  } else {
    console.log('⚠️ [RESUMO] Configuração de email: FALTANDO (não crítico)')
  }
  
  console.log('\n💡 [PRÓXIMOS-PASSOS] === PRÓXIMOS PASSOS ===')
  console.log('1. Configure as variáveis faltantes no painel do Vercel')
  console.log('2. Faça um redeploy após configurar as variáveis')
  console.log('3. Execute o script de diagnóstico no navegador (produção)')
  console.log('4. Teste o sistema com um usuário real')
}

// Executar automaticamente
executarDiagnosticoCompleto().catch(error => {
  console.error('💥 [DIAGNÓSTICO-SERVIDOR] Erro geral:', error)
})