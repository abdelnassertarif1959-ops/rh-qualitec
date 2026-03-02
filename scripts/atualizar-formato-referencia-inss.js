import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function atualizarFormatoReferencia() {
  try {
    console.log('🔄 Atualizando formato da referência do INSS...\n')
    
    // Buscar holerites com referência no formato antigo (contém "s/")
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('id, inss_referencia, inss_percentual')
      .not('inss_referencia', 'is', null)
      .like('inss_referencia', '%s/%')
    
    if (error) {
      console.error('❌ Erro ao buscar holerites:', error)
      return
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('✅ Nenhum holerite com formato antigo encontrado')
      return
    }
    
    console.log(`📊 Encontrados ${holerites.length} holerites para atualizar:\n`)
    
    let atualizados = 0
    let erros = 0
    
    for (const holerite of holerites) {
      try {
        // Extrair apenas o percentual da referência antiga
        // Formato antigo: "8.9% s/ R$ 3.650,00" ou "12.00 s/ R$ 4.100,00"
        const referenciaAntiga = holerite.inss_referencia
        
        // Tentar extrair o número antes de "s/"
        const match = referenciaAntiga.match(/^([\d.,]+)/)
        
        let novaReferencia = ''
        if (match) {
          // Pegar o número e remover % se existir
          novaReferencia = match[1].replace('%', '').trim()
        } else if (holerite.inss_percentual) {
          // Se não conseguir extrair, usar o percentual do banco
          novaReferencia = holerite.inss_percentual.toFixed(2)
        }
        
        if (novaReferencia) {
          // Atualizar no banco
          const { error: updateError } = await supabase
            .from('holerites')
            .update({ inss_referencia: novaReferencia })
            .eq('id', holerite.id)
          
          if (updateError) {
            console.error(`❌ Erro ao atualizar holerite ${holerite.id}:`, updateError)
            erros++
          } else {
            console.log(`✅ Holerite ${holerite.id}:`)
            console.log(`   Antes: "${referenciaAntiga}"`)
            console.log(`   Depois: "${novaReferencia}"`)
            atualizados++
          }
        }
      } catch (err) {
        console.error(`❌ Erro ao processar holerite ${holerite.id}:`, err)
        erros++
      }
    }
    
    console.log(`\n📊 Resumo:`)
    console.log(`   ✅ Atualizados: ${atualizados}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log(`   📋 Total: ${holerites.length}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

atualizarFormatoReferencia()
