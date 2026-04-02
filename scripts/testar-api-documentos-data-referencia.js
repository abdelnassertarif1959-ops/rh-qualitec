// Script para testar se a API está retornando data_referencia
import dotenv from 'dotenv'

dotenv.config()

const BASE_URL = process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testar() {
  console.log('🔍 Testando API de documentos...\n')
  console.log(`Base URL: ${BASE_URL}\n`)

  // Simular login para obter token
  console.log('1️⃣ Fazendo login...')
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cpf: '12345678900', // CPF de teste - ajuste conforme necessário
      senha: 'senha123'
    })
  })

  if (!loginRes.ok) {
    console.log('❌ Erro no login. Use um CPF/senha válido.')
    console.log('   Status:', loginRes.status)
    return
  }

  const cookies = loginRes.headers.get('set-cookie')
  console.log('✅ Login realizado\n')

  // Buscar documentos
  console.log('2️⃣ Buscando documentos...')
  const docsRes = await fetch(`${BASE_URL}/api/funcionarios/documentos`, {
    headers: { 'Cookie': cookies || '' }
  })

  if (!docsRes.ok) {
    console.log('❌ Erro ao buscar documentos')
    console.log('   Status:', docsRes.status)
    return
  }

  const { data: docs } = await docsRes.json()
  console.log(`✅ ${docs.length} documento(s) encontrado(s)\n`)

  // Exibir primeiros 3 documentos
  docs.slice(0, 3).forEach((doc, i) => {
    console.log(`📄 Documento ${i + 1}:`)
    console.log(`   Nome: ${doc.nome_original}`)
    console.log(`   Criado em: ${doc.criado_em}`)
    console.log(`   Data referência: ${doc.data_referencia || '(não retornado pela API)'}`)
    console.log(`   ${doc.data_referencia ? '✅ API retorna data_referencia' : '❌ API NÃO retorna data_referencia'}`)
    console.log('')
  })

  // Verificar estrutura do primeiro documento
  if (docs.length > 0) {
    console.log('🔍 Estrutura completa do primeiro documento:')
    console.log(JSON.stringify(docs[0], null, 2))
  }
}

testar().catch(console.error)
