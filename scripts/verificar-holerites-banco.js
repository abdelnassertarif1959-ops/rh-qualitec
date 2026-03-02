/**
 * VERIFICAR HOLERITES NO BANCO DE DADOS
 * Este script testa diretamente no banco se há holerites para funcionários
 */

import { config } from 'dotenv'
config()

console.log('🔍 [VERIFICAR-HOLERITES] === VERIFICAÇÃO DIRETA NO BANCO ===')
console.log('🔍 [VERIFICAR-HOLERITES] Timestamp:', new Date().toISOString())

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 [CONFIG] Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')
console.log('🔧 [CONFIG] Service Role Key:', serviceRoleKey ? 'PRESENTE' : 'MISSING')

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ [CONFIG] Configurações do Supabase não encontradas!')
  process.exit(1)
}

async function verificarFuncionarios() {
  console.log('\n👥 [FUNCIONÁRIOS] === VERIFICANDO FUNCIONÁRIOS ===')
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/funcionarios?select=id,nome_completo,email_login,tipo_contrato&order=nome_completo.asc`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`)
    }
    
    const funcionarios = await response.json()
    console.log('✅ [FUNCIONÁRIOS] Total de funcionários:', funcionarios.length)
    
    if (funcionarios.length > 0) {
      console.log('📋 [FUNCIONÁRIOS] Lista de funcionários:')
      funcionarios.forEach((f, i) => {
        console.log(`   ${i+1}. ${f.nome_completo} (ID: ${f.id}) - ${f.tipo_contrato} - ${f.email_login}`)
      })
    }
    
    return funcionarios
    
  } catch (error) {
    console.error('❌ [FUNCIONÁRIOS] Erro ao buscar funcionários:', error.message)
    return []
  }
}

async function verificarHolerites() {
  console.log('\n💰 [HOLERITES] === VERIFICANDO HOLERITES ===')
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/holerites?select=id,funcionario_id,status,periodo_inicio,periodo_fim,salario_base&order=periodo_inicio.desc&limit=20`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`)
    }
    
    const holerites = await response.json()
    console.log('✅ [HOLERITES] Total de holerites:', holerites.length)
    
    if (holerites.length > 0) {
      console.log('📋 [HOLERITES] Últimos 20 holerites:')
      holerites.forEach((h, i) => {
        console.log(`   ${i+1}. ID: ${h.id}, Funcionário: ${h.funcionario_id}, Status: ${h.status}, Período: ${h.periodo_inicio} - ${h.periodo_fim}`)
      })
      
      // Agrupar por status
      const porStatus = {}
      holerites.forEach(h => {
        porStatus[h.status] = (porStatus[h.status] || 0) + 1
      })
      
      console.log('📊 [HOLERITES] Holerites por status:')
      Object.entries(porStatus).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`)
      })
    }
    
    return holerites
    
  } catch (error) {
    console.error('❌ [HOLERITES] Erro ao buscar holerites:', error.message)
    return []
  }
}

async function verificarHoleritesPorFuncionario(funcionarios) {
  console.log('\n🔍 [HOLERITES-POR-FUNCIONÁRIO] === VERIFICANDO HOLERITES POR FUNCIONÁRIO ===')
  
  for (const funcionario of funcionarios.slice(0, 5)) { // Verificar apenas os primeiros 5
    console.log(`\n👤 [FUNCIONÁRIO] ${funcionario.nome_completo} (ID: ${funcionario.id})`)
    
    try {
      // Buscar todos os holerites do funcionário
      const response = await fetch(`${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&select=*&order=periodo_inicio.desc`, {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error(`❌ [FUNCIONÁRIO] Erro HTTP: ${response.status}`)
        continue
      }
      
      const holerites = await response.json()
      console.log(`📊 [FUNCIONÁRIO] Total de holerites: ${holerites.length}`)
      
      if (holerites.length > 0) {
        // Mostrar por status
        const porStatus = {}
        holerites.forEach(h => {
          porStatus[h.status] = (porStatus[h.status] || 0) + 1
        })
        
        console.log('📋 [FUNCIONÁRIO] Por status:')
        Object.entries(porStatus).forEach(([status, count]) => {
          console.log(`   ${status}: ${count}`)
        })
        
        // Mostrar os 3 mais recentes
        console.log('📋 [FUNCIONÁRIO] 3 mais recentes:')
        holerites.slice(0, 3).forEach((h, i) => {
          console.log(`   ${i+1}. Status: ${h.status}, Período: ${h.periodo_inicio} - ${h.periodo_fim}, Salário: R$ ${h.salario_base}`)
        })
        
        // Verificar quais são visíveis para o funcionário
        const visiveis = holerites.filter(h => h.status === 'enviado' || h.status === 'visualizado')
        console.log(`👁️ [FUNCIONÁRIO] Holerites visíveis (enviado/visualizado): ${visiveis.length}`)
        
        if (visiveis.length > 0) {
          console.log('✅ [FUNCIONÁRIO] Este funcionário DEVERIA ver holerites na tela!')
        } else {
          console.log('⚠️ [FUNCIONÁRIO] Este funcionário NÃO tem holerites visíveis (todos são "gerado")')
        }
      } else {
        console.log('❌ [FUNCIONÁRIO] Nenhum holerite encontrado')
      }
      
    } catch (error) {
      console.error(`❌ [FUNCIONÁRIO] Erro:`, error.message)
    }
  }
}

async function testarAPIEspecifica() {
  console.log('\n🧪 [API-TESTE] === TESTANDO API ESPECÍFICA ===')
  
  // Buscar um funcionário que tenha holerites
  try {
    const funcionariosResponse = await fetch(`${supabaseUrl}/rest/v1/funcionarios?select=id,nome_completo&limit=1`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!funcionariosResponse.ok) {
      throw new Error('Erro ao buscar funcionário')
    }
    
    const funcionarios = await funcionariosResponse.json()
    if (funcionarios.length === 0) {
      console.log('❌ [API-TESTE] Nenhum funcionário encontrado')
      return
    }
    
    const funcionario = funcionarios[0]
    console.log(`👤 [API-TESTE] Testando com funcionário: ${funcionario.nome_completo} (ID: ${funcionario.id})`)
    
    // Simular a mesma query que a API faz
    const queries = [
      {
        nome: 'Query 1: enviado e visualizado',
        url: `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&status=in.(enviado,visualizado)&select=*&order=periodo_inicio.desc`
      },
      {
        nome: 'Query 2: não gerado',
        url: `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&status=neq.gerado&select=*&order=periodo_inicio.desc`
      },
      {
        nome: 'Query 3: todos',
        url: `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&select=*&order=periodo_inicio.desc`
      }
    ]
    
    for (const query of queries) {
      console.log(`\n🔍 [API-TESTE] ${query.nome}`)
      console.log(`🔗 [API-TESTE] URL: ${query.url}`)
      
      try {
        const response = await fetch(query.url, {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Diagnostico-Holerites-Script'
          }
        })
        
        console.log(`📊 [API-TESTE] Status: ${response.status}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ [API-TESTE] Sucesso! Encontrados: ${data.length}`)
          
          if (data.length > 0) {
            console.log(`📋 [API-TESTE] Primeiro resultado:`)
            console.log(`   ID: ${data[0].id}`)
            console.log(`   Status: ${data[0].status}`)
            console.log(`   Período: ${data[0].periodo_inicio} - ${data[0].periodo_fim}`)
          }
        } else {
          const errorText = await response.text()
          console.log(`❌ [API-TESTE] Erro: ${errorText}`)
        }
        
      } catch (error) {
        console.log(`💥 [API-TESTE] Erro na requisição: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ [API-TESTE] Erro geral:', error.message)
  }
}

// EXECUTAR VERIFICAÇÃO COMPLETA
async function executarVerificacaoCompleta() {
  console.log('\n🚀 [VERIFICAÇÃO] === EXECUTANDO VERIFICAÇÃO COMPLETA ===')
  
  const funcionarios = await verificarFuncionarios()
  await verificarHolerites()
  
  if (funcionarios.length > 0) {
    await verificarHoleritesPorFuncionario(funcionarios)
  }
  
  await testarAPIEspecifica()
  
  console.log('\n🏁 [VERIFICAÇÃO] === VERIFICAÇÃO FINALIZADA ===')
  console.log('🏁 [VERIFICAÇÃO] Timestamp:', new Date().toISOString())
  
  console.log('\n📊 [CONCLUSÃO] === CONCLUSÕES ===')
  console.log('1. Se há funcionários e holerites no banco, mas a API retorna vazio:')
  console.log('   → Problema na query ou filtros da API')
  console.log('2. Se não há holerites com status "enviado" ou "visualizado":')
  console.log('   → Funcionários não verão holerites (todos são "gerado")')
  console.log('3. Se a API funciona no teste direto mas não no frontend:')
  console.log('   → Problema na integração frontend/backend')
}

// Executar
executarVerificacaoCompleta().catch(error => {
  console.error('💥 [ERRO-GERAL] Erro na verificação:', error)
  process.exit(1)
})