import { useRuntimeConfig } from "#imports"
import { defineEventHandler } from "#imports"
import { requireAdmin } from '../utils/authMiddleware'

// API de teste para verificar conexão com Supabase
// PROTEGIDA: Apenas admins podem acessar
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar se o usuário é admin
  const requestingUser = await requireAdmin(event)
  console.log('[TEST-SUPABASE] Admin autenticado:', requestingUser.nome_completo)
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey
  const serviceRoleKey = config.supabaseServiceRoleKey

  const results: any = {
    config: {
      supabaseUrl: supabaseUrl ? '✅ Configurado' : '❌ Não configurado',
      supabaseUrlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined',
      supabaseKey: supabaseKey ? '✅ Configurado' : '❌ Não configurado',
      supabaseKeyValue: supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'undefined',
      serviceRoleKey: serviceRoleKey ? '✅ Configurado' : '❌ Não configurado',
      serviceRoleKeyValue: serviceRoleKey ? serviceRoleKey.substring(0, 30) + '...' : 'undefined',
      // Mostrar variáveis de ambiente diretas
      envCheck: {
        NUXT_PUBLIC_SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL ? 'Existe' : 'Não existe',
        NUXT_PUBLIC_SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY ? 'Existe' : 'Não existe',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Existe' : 'Não existe'
      }
    },
    tests: []
  }

  // Teste 1: Listar tabelas
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/`,
      {
        headers: {
          'apikey': serviceRoleKey || supabaseKey,
          'Authorization': `Bearer ${serviceRoleKey || supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    results.tests.push({
      test: 'Conexão com Supabase',
      status: response.ok ? '✅ OK' : '❌ Falhou',
      statusCode: response.status
    })
  } catch (error: any) {
    results.tests.push({
      test: 'Conexão com Supabase',
      status: '❌ Erro',
      error: error.message
    })
  }

  // Teste 2: Verificar tabela funcionarios
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?select=count`,
      {
        headers: {
          'apikey': serviceRoleKey || supabaseKey,
          'Authorization': `Bearer ${serviceRoleKey || supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    )

    const data = await response.json()

    results.tests.push({
      test: 'Tabela funcionarios',
      status: response.ok ? '✅ Existe' : '❌ Não existe',
      statusCode: response.status,
      data: data
    })
  } catch (error: any) {
    results.tests.push({
      test: 'Tabela funcionarios',
      status: '❌ Erro',
      error: error.message
    })
  }

  // Teste 3: Buscar funcionário Silvana
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.silvana@qualitec.ind.br&select=id,nome_completo,email_login,tipo_acesso,status`,
      {
        headers: {
          'apikey': serviceRoleKey || supabaseKey,
          'Authorization': `Bearer ${serviceRoleKey || supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const funcionarios = await response.json()

    results.tests.push({
      test: 'Buscar Silvana',
      status: funcionarios.length > 0 ? '✅ Encontrada' : '⚠️ Não encontrada',
      statusCode: response.status,
      count: funcionarios.length,
      data: funcionarios
    })
  } catch (error: any) {
    results.tests.push({
      test: 'Buscar Silvana',
      status: '❌ Erro',
      error: error.message
    })
  }

  // Teste 4: Buscar com senha
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.silvana@qualitec.ind.br&senha=eq.Qualitec2025Silvana&select=id,nome_completo,email_login,tipo_acesso,status`,
      {
        headers: {
          'apikey': serviceRoleKey || supabaseKey,
          'Authorization': `Bearer ${serviceRoleKey || supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const funcionarios = await response.json()

    results.tests.push({
      test: 'Buscar Silvana com senha',
      status: funcionarios.length > 0 ? '✅ Credenciais corretas' : '⚠️ Senha incorreta',
      statusCode: response.status,
      count: funcionarios.length,
      data: funcionarios
    })
  } catch (error: any) {
    results.tests.push({
      test: 'Buscar Silvana com senha',
      status: '❌ Erro',
      error: error.message
    })
  }

  // Teste 5: Listar todas tabelas principais
  const tabelas = [
    'empresas',
    'departamentos',
    'cargos',
    'funcionarios',
    'holerites',
    'funcionario_beneficios',
    'feriados'
  ]

  for (const tabela of tabelas) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/${tabela}?select=count&limit=1`,
        {
          headers: {
            'apikey': serviceRoleKey || supabaseKey,
            'Authorization': `Bearer ${serviceRoleKey || supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      )

      results.tests.push({
        test: `Tabela ${tabela}`,
        status: response.ok ? '✅ Existe' : '❌ Não existe',
        statusCode: response.status
      })
    } catch (error: any) {
      results.tests.push({
        test: `Tabela ${tabela}`,
        status: '❌ Erro',
        error: error.message
      })
    }
  }

  return results
})
