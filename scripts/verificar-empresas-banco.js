// Script para verificar empresas no banco de dados
import 'dotenv/config'

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NUXT_PUBLIC_SUPABASE_KEY

async function verificarEmpresas() {
  console.log('🔍 Verificando empresas no banco de dados...\n')
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/empresas?select=*&order=nome.asc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const empresas = await response.json()
    
    console.log(`📊 Total de empresas: ${empresas.length}\n`)
    
    if (empresas.length === 0) {
      console.log('⚠️ NENHUMA EMPRESA ENCONTRADA NO BANCO!')
      console.log('\n💡 Você precisa cadastrar empresas primeiro.')
      console.log('   Acesse: Admin > Empresas > Adicionar Empresa\n')
      return
    }
    
    console.log('📋 Empresas cadastradas:\n')
    empresas.forEach((empresa, index) => {
      console.log(`${index + 1}. ${empresa.nome}`)
      console.log(`   ID: ${empresa.id}`)
      console.log(`   CNPJ: ${empresa.cnpj || 'Não informado'}`)
      console.log(`   Ativa: ${empresa.ativo ? '✅ Sim' : '❌ Não'}`)
      console.log(`   Funcionários: ${empresa.funcionarios_count || 0}`)
      console.log('')
    })
    
    const ativas = empresas.filter(e => e.ativo)
    const inativas = empresas.filter(e => !e.ativo)
    
    console.log('📊 Resumo:')
    console.log(`   ✅ Ativas: ${ativas.length}`)
    console.log(`   ❌ Inativas: ${inativas.length}`)
    console.log(`   📦 Total: ${empresas.length}`)
    
    if (ativas.length === 0) {
      console.log('\n⚠️ ATENÇÃO: Nenhuma empresa ativa!')
      console.log('   As empresas precisam estar ativas para aparecer no select.')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar empresas:', error.message)
  }
}

verificarEmpresas()
