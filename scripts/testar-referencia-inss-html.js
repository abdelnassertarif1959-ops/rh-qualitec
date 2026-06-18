/**
 * Script para testar se a referência do INSS está aparecendo corretamente no HTML
 * 
 * Uso: node scripts/testar-referencia-inss-html.js
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarReferenciaINSS() {
  console.log('🔍 Testando referência do INSS no HTML...\n')
  
  try {
    // Buscar um holerite que tenha INSS
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('id, funcionario_id, inss, inss_percentual, inss_referencia, inss_config_tipo')
      .gt('inss', 0)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('❌ Erro ao buscar holerites:', error)
      return
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('⚠️  Nenhum holerite com INSS encontrado')
      return
    }
    
    console.log(`📋 Encontrados ${holerites.length} holerites com INSS:\n`)
    
    for (const holerite of holerites) {
      console.log(`\n📄 Holerite ID: ${holerite.id}`)
      console.log(`   Funcionário ID: ${holerite.funcionario_id}`)
      console.log(`   INSS Valor: R$ ${holerite.inss.toFixed(2)}`)
      console.log(`   INSS Percentual: ${holerite.inss_percentual || 'não definido'}%`)
      console.log(`   INSS Config Tipo: ${holerite.inss_config_tipo || 'não definido'}`)
      console.log(`   INSS Referência: ${holerite.inss_referencia || 'não definida'}`)
      
      // Testar chamada à API de HTML
      console.log(`\n   🌐 Testando API de HTML...`)
      const response = await fetch(`http://localhost:3000/api/holerites/${holerite.id}/html`)
      
      if (!response.ok) {
        console.log(`   ❌ Erro na API: ${response.status} ${response.statusText}`)
        continue
      }
      
      const html = await response.text()
      
      // Procurar pela linha do INSS no HTML
      const inssMatch = html.match(/<td>998<\/td>\s*<td>I\.N\.S\.S\.<\/td>\s*<td class="text-center">([^<]+)<\/td>/)
      
      if (inssMatch) {
        const referenciaNoHTML = inssMatch[1]
        console.log(`   ✅ Referência no HTML: "${referenciaNoHTML}"`)
        
        // Verificar se está correto
        if (holerite.inss_referencia) {
          if (referenciaNoHTML === holerite.inss_referencia) {
            console.log(`   ✅ CORRETO: Referência do banco está sendo usada`)
          } else {
            console.log(`   ❌ ERRO: Esperado "${holerite.inss_referencia}", mas aparece "${referenciaNoHTML}"`)
          }
        } else {
          console.log(`   ℹ️  Usando referência calculada (não há referência personalizada no banco)`)
        }
      } else {
        console.log(`   ❌ Linha do INSS não encontrada no HTML`)
      }
    }
    
    console.log('\n\n📊 Resumo:')
    console.log('   - Se a referência personalizada existe no banco, ela deve aparecer no HTML')
    console.log('   - Se não existe, o sistema usa o percentual ou calcula automaticamente')
    console.log('   - Formato esperado: "12.00 s/ R$ 3.650,00" ou apenas "12,00"')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarReferenciaINSS()
