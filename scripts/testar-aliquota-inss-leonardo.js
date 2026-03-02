// Script para testar a alíquota do INSS do Leonardo no HTML

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarAliquotaINSS() {
  console.log('🧪 Testando alíquota do INSS do Leonardo...\n')
  
  try {
    // 1. Buscar Leonardo
    const { data: leonardo } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .ilike('nome_completo', '%leonardo%')
      .single()
    
    console.log(`✅ Leonardo: ${leonardo.nome_completo} (ID: ${leonardo.id})\n`)
    
    // 2. Buscar holerite mais recente
    const { data: holerite } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', leonardo.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    console.log(`📄 Holerite ID: ${holerite.id}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)
    console.log(`   INSS: R$ ${holerite.inss}`)
    console.log(`   Alíquota INSS (banco): ${holerite.aliquota_inss}%`)
    
    // 3. Simular formatação do HTML
    const aliquotaFormatada = holerite.aliquota_inss 
      ? holerite.aliquota_inss.toFixed(2).replace('.', ',')
      : 'não definida'
    
    console.log(`   Alíquota INSS (HTML): ${aliquotaFormatada}%\n`)
    
    // 4. Verificar se está correto
    if (holerite.aliquota_inss === 8.79) {
      console.log('✅ CORRETO! A alíquota está 8,79% no banco')
      console.log('✅ No HTML/PDF será exibido: 8,79%\n')
    } else {
      console.log(`⚠️  ATENÇÃO! Alíquota no banco: ${holerite.aliquota_inss}%`)
      console.log('   Esperado: 8.79%\n')
    }
    
    console.log('📝 Para ver a mudança:')
    console.log('   1. Acesse o holerite do Leonardo')
    console.log('   2. Clique em "Baixar HTML" ou "Baixar PDF"')
    console.log('   3. Verifique a linha "I.N.S.S." - coluna "Referência"')
    console.log('   4. Deve mostrar: 8,79')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarAliquotaINSS()
