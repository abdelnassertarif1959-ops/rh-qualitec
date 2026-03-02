/**
 * TESTAR API LOCAL - DESENVOLVIMENTO
 * Testa a API de holerites no ambiente local (localhost:3002)
 */

console.log('🧪 [TESTE-API-LOCAL] === TESTANDO API LOCAL ===')
console.log('🧪 [TESTE-API-LOCAL] Timestamp:', new Date().toISOString())

// Configuração
const BASE_URL = 'http://localhost:3002'

async function testarAPILocal() {
  console.log('\n🌐 [API-LOCAL] === TESTANDO ENDPOINTS LOCAIS ===')
  
  // 1. Testar health check
  console.log('\n❤️ [HEALTH] Testando health check...')
  try {
    const healthResponse = await fetch(`${BASE_URL}/api/health`)
    console.log('📊 [HEALTH] Status:', healthResponse.status)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text()
      console.log('✅ [HEALTH] Resposta:', healthData)
    } else {
      console.log('❌ [HEALTH] Erro:', healthResponse.statusText)
    }
  } catch (error) {
    console.log('💥 [HEALTH] Erro na requisição:', error.message)
  }
  
  // 2. Testar API de funcionários (para pegar um ID)
  console.log('\n👥 [FUNCIONÁRIOS] Buscando funcionários...')
  let funcionarioTeste = null
  
  try {
    const funcionariosResponse = await fetch(`${BASE_URL}/api/funcionarios`)
    console.log('📊 [FUNCIONÁRIOS] Status:', funcionariosResponse.status)
    
    if (funcionariosResponse.ok) {
      const funcionariosData = await funcionariosResponse.json()
      console.log('✅ [FUNCIONÁRIOS] Total encontrados:', funcionariosData?.data?.length || 0)
      
      if (funcionariosData?.data && funcionariosData.data.length > 0) {
        funcionarioTeste = funcionariosData.data[0]
        console.log('👤 [FUNCIONÁRIOS] Funcionário de teste:', funcionarioTeste.nome_completo, '(ID:', funcionarioTeste.id, ')')
      }
    } else {
      const errorText = await funcionariosResponse.text()
      console.log('❌ [FUNCIONÁRIOS] Erro:', errorText)
    }
  } catch (error) {
    console.log('💥 [FUNCIONÁRIOS] Erro na requisição:', error.message)
  }
  
  // 3. Testar API de holerites (principal)
  if (funcionarioTeste) {
    console.log('\n💰 [HOLERITES] Testando API de holerites...')
    console.log('👤 [HOLERITES] Funcionário:', funcionarioTeste.nome_completo, '(ID:', funcionarioTeste.id, ')')
    
    const apiUrl = `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=${funcionarioTeste.id}`
    console.log('🔗 [HOLERITES] URL:', apiUrl)
    
    try {
      const startTime = Date.now()
      const holeriteResponse = await fetch(apiUrl)
      const endTime = Date.now()
      
      console.log('⏱️ [HOLERITES] Tempo de resposta:', `${endTime - startTime}ms`)
      console.log('📊 [HOLERITES] Status:', holeriteResponse.status)
      console.log('📊 [HOLERITES] Status Text:', holeriteResponse.statusText)
      
      // Mostrar headers
      console.log('📋 [HOLERITES] Headers da resposta:')
      for (const [key, value] of holeriteResponse.headers.entries()) {
        console.log(`   ${key}: ${value}`)
      }
      
      if (holeriteResponse.ok) {
        const holeriteData = await holeriteResponse.json()
        console.log('✅ [HOLERITES] Resposta recebida!')
        console.log('📦 [HOLERITES] Tipo:', typeof holeriteData)
        console.log('📦 [HOLERITES] É array?', Array.isArray(holeriteData))
        console.log('📦 [HOLERITES] Quantidade:', holeriteData?.length || 0)
        
        if (holeriteData && Array.isArray(holeriteData) && holeriteData.length > 0) {
          console.log('📋 [HOLERITES] Primeiro holerite:')
          const primeiro = holeriteData[0]
          console.log('   ID:', primeiro.id)
          console.log('   Status:', primeiro.status)
          console.log('   Período:', primeiro.periodo_inicio, '-', primeiro.periodo_fim)
          console.log('   Salário Base:', primeiro.salario_base)
          console.log('   Funcionário ID:', primeiro.funcionario_id)
          
          console.log('📋 [HOLERITES] Todos os holerites:')
          holeriteData.forEach((h, i) => {
            console.log(`   ${i+1}. ID: ${h.id}, Status: ${h.status}, Período: ${h.periodo_inicio} - ${h.periodo_fim}`)
          })
          
          return { success: true, data: holeriteData, count: holeriteData.length }
        } else {
          console.log('⚠️ [HOLERITES] Array vazio ou dados inválidos')
          console.log('📦 [HOLERITES] Dados completos:', holeriteData)
          return { success: true, data: holeriteData, count: 0, empty: true }
        }
      } else {
        const errorText = await holeriteResponse.text()
        console.log('❌ [HOLERITES] Erro HTTP:', errorText)
        return { success: false, status: holeriteResponse.status, error: errorText }
      }
      
    } catch (error) {
      console.log('💥 [HOLERITES] Erro na requisição:', error.message)
      return { success: false, error: error.message }
    }
  } else {
    console.log('❌ [HOLERITES] Não foi possível testar - nenhum funcionário encontrado')
    return { success: false, error: 'Nenhum funcionário encontrado' }
  }
}

// 4. Testar API de debug
async function testarAPIDebugLocal() {
  console.log('\n🔍 [DEBUG-LOCAL] === TESTANDO API DE DEBUG LOCAL ===')
  
  // Usar um ID conhecido do resultado anterior
  const funcionarioId = 129 // MACIEL CARVALHO
  const debugUrl = `${BASE_URL}/api/debug/holerites-funcionario?funcionarioId=${funcionarioId}&token=qualitec-debug-2026-secure`
  
  console.log('🔍 [DEBUG-LOCAL] URL:', debugUrl)
  
  try {
    const response = await fetch(debugUrl)
    console.log('📊 [DEBUG-LOCAL] Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ [DEBUG-LOCAL] Dados de debug recebidos:')
      console.log('📦 [DEBUG-LOCAL] Success:', data.success)
      console.log('📦 [DEBUG-LOCAL] Ambiente:', data.ambiente)
      console.log('📦 [DEBUG-LOCAL] Funcionário ID:', data.funcionarioId)
      
      if (data.resultados) {
        console.log('📋 [DEBUG-LOCAL] Resultados dos testes:')
        data.resultados.forEach((resultado, i) => {
          console.log(`   ${i+1}. ${resultado.nome}: ${resultado.sucesso ? '✅' : '❌'} (${resultado.quantidade || 0} holerites)`)
        })
      }
      
      return data
    } else {
      const error = await response.text()
      console.log('❌ [DEBUG-LOCAL] Erro:', error)
      return null
    }
  } catch (error) {
    console.log('💥 [DEBUG-LOCAL] Erro na requisição:', error.message)
    return null
  }
}

// 5. Comparar com resultado do banco direto
async function compararResultados() {
  console.log('\n📊 [COMPARAÇÃO] === COMPARANDO RESULTADOS ===')
  
  console.log('📋 [COMPARAÇÃO] Resultados do banco direto (anterior):')
  console.log('   ✅ 11 funcionários encontrados')
  console.log('   ✅ 20 holerites encontrados')
  console.log('   ✅ 19 holerites com status "visualizado"')
  console.log('   ✅ 1 holerite com status "enviado"')
  console.log('   ✅ Todos os funcionários DEVERIAM ver holerites')
  
  const resultadoAPI = await testarAPILocal()
  
  console.log('\n📋 [COMPARAÇÃO] Resultados da API local:')
  if (resultadoAPI.success) {
    if (resultadoAPI.empty) {
      console.log('   ⚠️ API retorna array vazio (problema na API)')
    } else {
      console.log(`   ✅ API retorna ${resultadoAPI.count} holerites (funcionando!)`)
    }
  } else {
    console.log('   ❌ API falhou:', resultadoAPI.error)
  }
  
  const resultadoDebug = await testarAPIDebugLocal()
  
  console.log('\n📋 [COMPARAÇÃO] Resultados da API de debug:')
  if (resultadoDebug) {
    console.log('   ✅ API de debug funcionando')
    console.log('   📦 Ambiente:', resultadoDebug.ambiente)
  } else {
    console.log('   ❌ API de debug falhou')
  }
}

// EXECUTAR TODOS OS TESTES
async function executarTestesCompletos() {
  console.log('\n🚀 [TESTE-COMPLETO] === EXECUTANDO TESTES COMPLETOS ===')
  
  await compararResultados()
  
  console.log('\n🏁 [TESTE-COMPLETO] === TESTES FINALIZADOS ===')
  console.log('🏁 [TESTE-COMPLETO] Timestamp:', new Date().toISOString())
  
  console.log('\n📊 [CONCLUSÃO] === CONCLUSÕES ===')
  console.log('1. Se a API local funciona mas a produção não:')
  console.log('   → Problema específico do ambiente de produção')
  console.log('2. Se a API local também falha:')
  console.log('   → Problema na implementação da API')
  console.log('3. Se o banco tem dados mas a API não retorna:')
  console.log('   → Problema na query ou filtros da API')
  
  console.log('\n💡 [PRÓXIMOS-PASSOS] === PRÓXIMOS PASSOS ===')
  console.log('1. Verificar se o servidor local está rodando (localhost:3002)')
  console.log('2. Se a API local funciona, focar no problema de produção')
  console.log('3. Se a API local falha, debugar a implementação')
  console.log('4. Comparar logs entre desenvolvimento e produção')
}

// Executar automaticamente
executarTestesCompletos().catch(error => {
  console.error('💥 [ERRO-GERAL] Erro nos testes:', error)
})