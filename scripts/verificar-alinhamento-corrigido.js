import { readFileSync } from 'fs'

console.log('🧪 VERIFICAÇÃO: Alinhamento da Tabela do Holerite\n')

try {
  const conteudo = readFileSync('server/utils/holeriteHTML.ts', 'utf-8')
  
  console.log('📄 Verificando correções aplicadas...\n')
  
  const verificacoes = [
    {
      nome: 'CESTA BÁSICA (930)',
      regex: /if \(cestaBasica > 0\) \{[\s\S]*?<td>930<\/td>[\s\S]*?<td>CESTA BÁSICA<\/td>[\s\S]*?<td class="text-center"><\/td>[\s\S]*?<td class="text-right"><\/td>[\s\S]*?<td class="text-right">\$\{cestaBasica\.toLocaleString/,
      esperado: 'Linha com 5 colunas, células vazias com class="text-right", valor correto'
    },
    {
      nome: 'PLANO DE SAÚDE (940)',
      regex: /if \(planoSaude > 0\) \{[\s\S]*?<td>940<\/td>[\s\S]*?<td>PLANO DE SAÚDE<\/td>[\s\S]*?<td class="text-center"><\/td>[\s\S]*?<td class="text-right"><\/td>[\s\S]*?<td class="text-right">\$\{planoSaude\.toLocaleString/,
      esperado: 'Linha com 5 colunas, células vazias com class="text-right", valor correto (não $5)'
    },
    {
      nome: 'PLANO ODONTOLÓGICO (950)',
      regex: /if \(planoOdonto > 0\) \{[\s\S]*?<td>950<\/td>[\s\S]*?<td>PLANO ODONTOLÓGICO<\/td>[\s\S]*?<td class="text-center"><\/td>[\s\S]*?<td class="text-right"><\/td>[\s\S]*?<td class="text-right">\$\{planoOdonto\.toLocaleString/,
      esperado: 'Linha com 5 colunas, células vazias com class="text-right", valor correto (não $5)'
    },
    {
      nome: 'FALTAS (965)',
      regex: /if \(faltas > 0\) \{[\s\S]*?<td>965<\/td>[\s\S]*?<td>FALTAS<\/td>[\s\S]*?<td class="text-center"><\/td>[\s\S]*?<td class="text-right"><\/td>[\s\S]*?<td class="text-right">\$\{faltas\.toLocaleString/,
      esperado: 'Linha com 5 colunas, células vazias com class="text-right", valor correto (não $5)'
    },
    {
      nome: 'DESCONTOS PERSONALIZADOS',
      regex: /<td>\$\{codigo\}<\/td>[\s\S]*?<td>\$\{descricao\}<\/td>[\s\S]*?<td class="text-center"><\/td>[\s\S]*?<td class="text-right"><\/td>[\s\S]*?<td class="text-right">\$\{Number\(desconto\.valor\)\.toLocaleString/,
      esperado: 'Linha com 5 colunas, célula vazia com class="text-right"'
    }
  ]
  
  let sucessos = 0
  let falhas = 0
  
  verificacoes.forEach(({ nome, regex, esperado }) => {
    const passou = regex.test(conteudo)
    if (passou) {
      console.log(`✅ ${nome}`)
      console.log(`   ${esperado}`)
      sucessos++
    } else {
      console.log(`❌ ${nome}`)
      console.log(`   Esperado: ${esperado}`)
      falhas++
    }
    console.log()
  })
  
  // Verificar se não há código duplicado de CESTA BÁSICA
  const cestaBasicaMatches = conteudo.match(/if \(cestaBasica > 0\)/g) || []
  if (cestaBasicaMatches.length === 1) {
    console.log(`✅ CESTA BÁSICA sem duplicação`)
    console.log(`   Apenas 1 bloco if (cestaBasica > 0) encontrado\n`)
    sucessos++
  } else {
    console.log(`❌ CESTA BÁSICA com duplicação`)
    console.log(`   ${cestaBasicaMatches.length} blocos if (cestaBasica > 0) encontrados\n`)
    falhas++
  }
  
  // Verificar se não há mais $5 no código (exceto no CNPJ)
  const linhasComDollar5 = conteudo.split('\n').filter(linha => 
    linha.includes('$5') && !linha.includes('cnpj') && !linha.includes('CNPJ')
  )
  if (linhasComDollar5.length === 0) {
    console.log(`✅ Sem valores $5 hardcoded`)
    console.log(`   Todos os valores usam variáveis corretas\n`)
    sucessos++
  } else {
    console.log(`❌ Valores $5 hardcoded encontrados`)
    console.log(`   ${linhasComDollar5.length} ocorrências de $5 no código\n`)
    falhas++
  }
  
  // Verificar se não há style="width" nas linhas da tabela
  const styleWidthInRows = conteudo.match(/<td style="width:/g) || []
  if (styleWidthInRows.length === 0) {
    console.log(`✅ Sem estilos inline nas células da tabela`)
    console.log(`   Todas as células usam classes CSS\n`)
    sucessos++
  } else {
    console.log(`⚠️  Estilos inline encontrados nas células`)
    console.log(`   ${styleWidthInRows.length} ocorrências de style="width:" (pode ser no cabeçalho)\n`)
  }
  
  console.log(`\n📊 RESULTADO FINAL:`)
  console.log(`   ✅ Sucessos: ${sucessos}`)
  console.log(`   ❌ Falhas: ${falhas}`)
  console.log(`   📈 Taxa de sucesso: ${((sucessos / (sucessos + falhas)) * 100).toFixed(1)}%`)
  
  if (falhas === 0) {
    console.log(`\n✅ TODAS AS CORREÇÕES FORAM APLICADAS COM SUCESSO!`)
    console.log(`\n📝 Resumo das correções:`)
    console.log(`   • CESTA BÁSICA: Removida duplicação, alinhamento correto`)
    console.log(`   • PLANO DE SAÚDE: Valor correto (não $5), alinhamento correto`)
    console.log(`   • PLANO ODONTOLÓGICO: Valor correto (não $5), alinhamento correto`)
    console.log(`   • FALTAS: Valor correto (não $5), alinhamento correto`)
    console.log(`   • DESCONTOS PERSONALIZADOS: Alinhamento correto`)
    console.log(`\n🎯 Todas as linhas agora têm 5 colunas com alinhamento consistente!`)
  } else {
    console.log(`\n❌ AINDA EXISTEM PROBLEMAS A CORRIGIR`)
    process.exit(1)
  }
  
} catch (error) {
  console.error('❌ Erro ao ler arquivo:', error.message)
  process.exit(1)
}
