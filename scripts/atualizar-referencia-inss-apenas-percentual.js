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

async function atualizarReferenciasINSS() {
  try {
    console.log('🔄 Atualizando referências do INSS para mostrar apenas percentual...\n')
    
    // Buscar todos os holerites que têm referência com formato antigo
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('id, funcionario_id, inss, inss_percentual, inss_referencia')
      .not('inss_referencia', 'is', null)
      .gt('inss', 0)
    
    if (error) {
      console.error('❌ Erro ao buscar holerites:', error)
      return
    }
    
    if (!holerites || holerites.length === 0) {
      console.log('⚠️  Nenhum holerite encontrado com referência INSS')
      return
    }
    
    console.log(`📊 Encontrados ${holerites.length} holerites com referência INSS\n`)
    
    let atualizados = 0
    let erros = 0
    let jaCorretos = 0
    
    for (const h of holerites) {
      // Verificar se a referência tem o formato antigo (contém "s/" ou "R$")
      if (h.inss_referencia && (h.inss_referencia.includes('s/') || h.inss_referencia.includes('R$'))) {
        console.log(`📝 Holerite ID ${h.id}:`)
        console.log(`   Referência antiga: "${h.inss_referencia}"`)
        
        // Extrair apenas o percentual (primeira parte antes de "s/")
        let novaReferencia = h.inss_referencia.split('s/')[0].trim()
        
        // Remover o símbolo % se existir
        novaReferencia = novaReferencia.replace('%', '').trim()
        
        // Se não conseguiu extrair, usar o percentual do banco
        if (!novaReferencia || isNaN(parseFloat(novaReferencia))) {
          novaReferencia = h.inss_percentual ? h.inss_percentual.toFixed(2) : '0.00'
        }
        
        console.log(`   Referência nova: "${novaReferencia}"`)
        
        // Atualizar no banco
        const { error: updateError } = await supabase
          .from('holerites')
          .update({ inss_referencia: novaReferencia })
          .eq('id', h.id)
        
        if (updateError) {
          console.log(`   ❌ Erro ao atualizar`)
          erros++
        } else {
          console.log(`   ✅ Atualizado com sucesso`)
          atualizados++
        }
        console.log('')
      } else {
        // Já está no formato correto
        jaCorretos++
      }
    }
    
    console.log('\n📊 Resumo:')
    console.log(`   ✅ Atualizados: ${atualizados}`)
    console.log(`   ✓  Já corretos: ${jaCorretos}`)
    console.log(`   ❌ Erros: ${erros}`)
    console.log(`   📋 Total: ${holerites.length}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

atualizarReferenciasINSS()
