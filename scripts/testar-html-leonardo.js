import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarHTMLLeonardo() {
  try {
    console.log('🔍 Testando HTML do holerite do Leonardo...\n')
    
    // Buscar funcionário Leonardo
    const { data: funcionarios } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .ilike('nome_completo', '%leonardo%')
    
    if (!funcionarios || funcionarios.length === 0) {
      console.error('❌ Leonardo não encontrado')
      return
    }
    
    const leonardo = funcionarios[0]
    console.log(`👤 Funcionário: ${leonardo.nome_completo} (ID: ${leonardo.id})\n`)
    
    // Buscar holerite mais recente
    const { data: holerites } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', leonardo.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (!holerites || holerites.length === 0) {
      console.error('❌ Nenhum holerite encontrado')
      return
    }
    
    const holerite = holerites[0]
    console.log(`📄 Holerite ID: ${holerite.id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Pensão Alimentícia: R$ ${holerite.pensao_alimenticia?.toFixed(2) || '0.00'}\n`)
    
    // Fazer requisição para a API de PDF
    const apiUrl = `http://localhost:3000/api/holerites/${holerite.id}/pdf`
    console.log(`🌐 Fazendo requisição para: ${apiUrl}\n`)
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error(`❌ Erro na API: ${response.status} ${response.statusText}`)
      const text = await response.text()
      console.error(text)
      return
    }
    
    const html = await response.text()
    
    // Contar quantas vezes "PENSÃO ALIMENTÍCIA" aparece no HTML
    const regex = /PENSÃO ALIMENTÍCIA/gi
    const matches = html.match(regex)
    const count = matches ? matches.length : 0
    
    console.log(`📊 Análise do HTML:`)
    console.log(`   Total de ocorrências de "PENSÃO ALIMENTÍCIA": ${count}`)
    
    if (count === 0) {
      console.log(`\n⚠️  Pensão alimentícia NÃO aparece no HTML!`)
    } else if (count === 1) {
      console.log(`\n✅ Pensão alimentícia aparece APENAS UMA VEZ (correto!)`)
    } else {
      console.log(`\n❌ DUPLICAÇÃO DETECTADA! Pensão aparece ${count} vezes`)
      
      // Extrair as linhas que contêm "PENSÃO ALIMENTÍCIA"
      const lines = html.split('\n')
      const pensaoLines = lines.filter(line => line.includes('PENSÃO ALIMENTÍCIA'))
      
      console.log(`\n📝 Linhas encontradas:`)
      pensaoLines.forEach((line, index) => {
        console.log(`\n   ${index + 1}. ${line.trim()}`)
      })
    }
    
    // Verificar códigos 915 e 960
    const codigo915 = html.includes('<td>915</td>')
    const codigo960 = html.includes('<td>960</td>')
    
    console.log(`\n🔢 Códigos encontrados:`)
    console.log(`   Código 915: ${codigo915 ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Código 960: ${codigo960 ? '⚠️  SIM (DUPLICADO!)' : '✅ NÃO (correto)'}`)
    
    if (codigo960) {
      console.log(`\n❌ PROBLEMA: Código 960 ainda existe no HTML!`)
      console.log(`   O código duplicado precisa ser removido do holeriteHTML.ts`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    
    if (error.message.includes('fetch failed')) {
      console.log('\n💡 Dica: Certifique-se de que o servidor está rodando:')
      console.log('   npm run dev')
    }
  }
}

testarHTMLLeonardo()
