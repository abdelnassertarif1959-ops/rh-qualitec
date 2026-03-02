import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function corrigirAliquotaINSSLeonardo() {
  console.log('🔧 Corrigindo alíquota do INSS do Leonardo...\n')

  try {
    // 1. Buscar Leonardo
    const { data: funcionarios, error: errorFunc } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .ilike('nome_completo', '%leonardo%')
      .single()

    if (errorFunc) throw errorFunc
    if (!funcionarios) {
      console.log('❌ Leonardo não encontrado')
      return
    }

    console.log(`✅ Leonardo encontrado: ${funcionarios.nome_completo} (ID: ${funcionarios.id})`)

    // 2. Buscar holerites do Leonardo
    const { data: holerites, error: errorHol } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionarios.id)
      .order('created_at', { ascending: false })

    if (errorHol) throw errorHol

    console.log(`\n📋 Holerites encontrados: ${holerites.length}`)

    // 3. Atualizar alíquota para 8,79%
    for (const holerite of holerites) {
      const aliquotaAtual = holerite.aliquota_inss || 'não definida'
      
      console.log(`\n📄 Holerite ID ${holerite.id}:`)
      console.log(`   Alíquota atual: ${aliquotaAtual}`)
      console.log(`   INSS: R$ ${holerite.inss}`)

      // Atualizar para 8,79%
      const { error: updateError } = await supabase
        .from('holerites')
        .update({ 
          aliquota_inss: 8.79
        })
        .eq('id', holerite.id)

      if (updateError) {
        console.log(`   ❌ Erro ao atualizar: ${updateError.message}`)
      } else {
        console.log(`   ✅ Alíquota atualizada para: 8,79%`)
      }
    }

    // 4. Verificar atualização
    console.log('\n\n🔍 Verificando atualização...')
    const { data: verificacao } = await supabase
      .from('holerites')
      .select('id, aliquota_inss, inss')
      .eq('funcionario_id', funcionarios.id)
      .order('created_at', { ascending: false })

    console.log('\n📊 Holerites após atualização:')
    verificacao.forEach(h => {
      console.log(`   ID ${h.id}: Alíquota ${h.aliquota_inss}% | INSS R$ ${h.inss}`)
    })

    console.log('\n✅ Correção concluída!')
    console.log('\n💡 Agora gere novamente o HTML/PDF do holerite para ver a alíquota correta.')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

corrigirAliquotaINSSLeonardo()
