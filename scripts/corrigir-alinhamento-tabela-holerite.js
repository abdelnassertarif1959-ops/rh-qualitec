/**
 * Script para corrigir o alinhamento da tabela do holerite
 * 
 * Adiciona larguras fixas nas células <td> para garantir alinhamento correto
 */

import { readFileSync, writeFileSync } from 'fs'

const filePath = 'server/utils/holeriteHTML.ts'

console.log('🔧 Corrigindo alinhamento da tabela do holerite...\n')

// Ler o arquivo
let content = readFileSync(filePath, 'utf-8')

// Padrões a serem substituídos
const replacements = [
  // Padrão 1: <td>CÓDIGO</td><td>DESCRIÇÃO</td><td class="text-center">REF</td><td class="text-right">VALOR</td><td></td>
  {
    from: /<td>(\d+)<\/td>\s*<td>([^<]+)<\/td>\s*<td class="text-center">([^<]*)<\/td>\s*<td class="text-right">([^<]+)<\/td>\s*<td><\/td>/g,
    to: '<td style="width: 12%;">$1</td>\n          <td style="width: 38%;">$2</td>\n          <td style="width: 15%;" class="text-center">$3</td>\n          <td style="width: 17.5%;" class="text-right">$4</td>\n          <td style="width: 17.5%;"></td>'
  },
  // Padrão 2: <td>CÓDIGO</td><td>DESCRIÇÃO</td><td class="text-center"></td><td class="text-right">VALOR</td><td></td>
  {
    from: /<td>(\d+)<\/td>\s*<td>([^<]+)<\/td>\s*<td class="text-center"><\/td>\s*<td class="text-right">([^<]+)<\/td>\s*<td><\/td>/g,
    to: '<td style="width: 12%;">$1</td>\n          <td style="width: 38%;">$2</td>\n          <td style="width: 15%;" class="text-center"></td>\n          <td style="width: 17.5%;" class="text-right">$3</td>\n          <td style="width: 17.5%;"></td>'
  },
  // Padrão 3: <td>CÓDIGO</td><td>DESCRIÇÃO</td><td class="text-center">REF</td><td></td><td class="text-right">VALOR</td>
  {
    from: /<td>(\d+)<\/td>\s*<td>([^<]+)<\/td>\s*<td class="text-center">([^<]*)<\/td>\s*<td><\/td>\s*<td class="text-right">([^<]+)<\/td>/g,
    to: '<td style="width: 12%;">$1</td>\n          <td style="width: 38%;">$2</td>\n          <td style="width: 15%;" class="text-center">$3</td>\n          <td style="width: 17.5%;"></td>\n          <td style="width: 17.5%;" class="text-right">$5</td>'
  },
  // Padrão 4: <td>CÓDIGO</td><td>DESCRIÇÃO</td><td class="text-center"></td><td></td><td class="text-right">VALOR</td>
  {
    from: /<td>(\d+)<\/td>\s*<td>([^<]+)<\/td>\s*<td class="text-center"><\/td>\s*<td><\/td>\s*<td class="text-right">([^<]+)<\/td>/g,
    to: '<td style="width: 12%;">$1</td>\n          <td style="width: 38%;">$2</td>\n          <td style="width: 15%;" class="text-center"></td>\n          <td style="width: 17.5%;"></td>\n          <td style="width: 17.5%;" class="text-right">$5</td>'
  }
]

let modificacoes = 0

// Aplicar todas as substituições
replacements.forEach((replacement, index) => {
  const matches = content.match(replacement.from)
  if (matches) {
    console.log(`✅ Padrão ${index + 1}: ${matches.length} ocorrências encontradas`)
    content = content.replace(replacement.from, replacement.to)
    modificacoes += matches.length
  } else {
    console.log(`⏭️  Padrão ${index + 1}: Nenhuma ocorrência encontrada`)
  }
})

// Salvar o arquivo
if (modificacoes > 0) {
  writeFileSync(filePath, content, 'utf-8')
  console.log(`\n✅ Arquivo corrigido com sucesso!`)
  console.log(`📊 Total de modificações: ${modificacoes}`)
} else {
  console.log(`\n⚠️  Nenhuma modificação necessária`)
}
