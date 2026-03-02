/**
 * Script para testar se o FGTS editado aparece no HTML do holerite
 */

import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('\n🧪 TESTE: FGTS no HTML do Holerite\n')

async function testarFGTSnoHTML() {
  try {
    // 1. Buscar um holerite
    console.log('1️⃣ Buscando holerite...')
    const responseGet = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?select=*&order=id.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const holerites = await responseGet.json()
    
    if (!holerites || holerites.length === 0) {
      console.log('❌ Nenhum holerite encontrado')
      return
    }

    const holerite = holerites[0]
    console.log('✅ Holerite encontrado:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)
    console.log(`   FGTS Atual no Banco: R$ ${holerite.fgts || 0}`)

    // 2. Atualizar FGTS para um valor de teste
    console.log('\n2️⃣ Atualizando FGTS para R$ 100.00...')
    const novoFGTS = 100.00
    
    const responsePatch = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?id=eq.${holerite.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          fgts: novoFGTS
        })
      }
    )

    if (!responsePatch.ok) {
      console.log('❌ Erro ao atualizar FGTS')
      return
    }

    console.log('✅ FGTS atualizado para R$ 100.00')

    // 3. Buscar o HTML do holerite
    console.log('\n3️⃣ Buscando HTML do holerite...')
    const responseHTML = await fetch(
      `http://localhost:3001/api/holerites/${holerite.id}/html`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!responseHTML.ok) {
      console.log('❌ Erro ao buscar HTML:', responseHTML.status, responseHTML.statusText)
      return
    }

    const html = await responseHTML.text()
    
    // 4. Verificar se o FGTS aparece no HTML
    console.log('\n4️⃣ Verificando FGTS no HTML...')
    
    // Procurar por "F.G.T.S do Mês" no HTML
    const regexFGTS = /F\.G\.T\.S do Mês.*?(\d+[.,]\d+)/s
    const matchFGTS = html.match(regexFGTS)
    
    if (matchFGTS) {
      const valorNoHTML = matchFGTS[1].replace(',', '.')
      console.log('✅ FGTS encontrado no HTML:', valorNoHTML)
      
      if (parseFloat(valorNoHTML) === novoFGTS) {
        console.log('✅ VALOR CORRETO! O FGTS editado está aparecendo no HTML!')
      } else {
        console.log('❌ VALOR INCORRETO!')
        console.log(`   Esperado: R$ ${novoFGTS.toFixed(2)}`)
        console.log(`   Encontrado: R$ ${valorNoHTML}`)
        console.log('\n⚠️  O HTML está calculando o FGTS ao invés de usar o valor do banco!')
      }
    } else {
      console.log('❌ FGTS não encontrado no HTML')
      console.log('   Procurando por "F.G.T.S" no HTML...')
      
      if (html.includes('F.G.T.S')) {
        console.log('   ✓ Texto "F.G.T.S" encontrado')
        // Mostrar trecho do HTML onde aparece
        const index = html.indexOf('F.G.T.S')
        console.log('   Trecho:', html.substring(index, index + 200))
      } else {
        console.log('   ✗ Texto "F.G.T.S" NÃO encontrado no HTML')
      }
    }

    // 5. Restaurar valor original
    console.log('\n5️⃣ Restaurando valor original...')
    const fgtsOriginal = holerite.salario_base * 0.08
    
    await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?id=eq.${holerite.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fgts: fgtsOriginal
        })
      }
    )

    console.log(`✅ FGTS restaurado para R$ ${fgtsOriginal.toFixed(2)}`)

    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMO')
    console.log('='.repeat(60))
    console.log('Se o valor estava incorreto, o problema é que o servidor')
    console.log('não está usando o valor do banco, está recalculando.')
    console.log('\n💡 SOLUÇÃO: Reinicie o servidor para aplicar as mudanças!')

  } catch (error) {
    console.error('\n❌ ERRO:', error.message)
  }
}

testarFGTSnoHTML()
