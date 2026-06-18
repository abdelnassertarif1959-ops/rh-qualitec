// API para verificar o schema da tabela empresas
import { requireAdmin } from '../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  // SEGURANÇA: Apenas admins podem ver o schema
  const requestingUser = await requireAdmin(event)
  console.log('📋 [SCHEMA-EMPRESAS] Admin autenticado:', requestingUser.nome_completo)
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    // Buscar uma empresa qualquer para ver as colunas
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?select=*&limit=1`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const empresas = await response.json()
    
    if (Array.isArray(empresas) && empresas.length > 0) {
      const colunas = Object.keys(empresas[0])
      return {
        success: true,
        message: 'Colunas da tabela empresas',
        colunas: colunas.sort(),
        exemplo: empresas[0]
      }
    }

    // Se não houver empresas, tentar criar uma vazia para ver o erro
    const testResponse = await fetch(
      `${supabaseUrl}/rest/v1/empresas`,
      {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          nome: 'TESTE',
          cnpj: '00.000.000/0000-00'
        })
      }
    )

    const testResult = await testResponse.json()
    
    return {
      success: false,
      message: 'Nenhuma empresa encontrada. Tentativa de criar teste:',
      status: testResponse.status,
      resultado: testResult
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})
