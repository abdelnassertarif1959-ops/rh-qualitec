import { gerarHoleriteHTML } from '../server/utils/holeriteHTML'

console.log('🧪 TESTE: Alinhamento da Tabela do Holerite\n')

// Mock de dados para teste
const holerite = {
  id: 1,
  periodo_inicio: '2026-01-01',
  periodo_fim: '2026-01-31',
  salario_base: 3650.00,
  dias_trabalhados: 30,
  bonus: 0,
  horas_extras: 0,
  adicional_noturno: 0,
  adicional_periculosidade: 0,
  adicional_insalubridade: 0,
  comissoes: 0,
  inss: 326.58,
  inss_referencia: '8.93',
  aliquota_inss: 8.93,
  irrf: 0,
  vale_transporte: 0,
  cesta_basica_desconto: 150.00,
  plano_saude: 200.00,
  plano_odontologico: 50.00,
  faltas: 100.00,
  adiantamento: 1460.00,
  pensao_alimenticia: 0,
  fgts: 292.00,
  beneficios: [],
  descontos_personalizados: [
    { descricao: 'Desconto Teste', valor: 75.50, referencia: '971' }
  ]
}

const funcionario = {
  id: 1,
  nome_completo: 'TESTE ALINHAMENTO',
  cargo_nome: 'Desenvolvedor',
  departamento_nome: 'TI',
  data_admissao: '2025-01-01',
  numero_dependentes: 0,
  tipo_contrato: 'CLT'
}

const empresa = {
  nome: 'QUALITEC LTDA',
  nome_fantasia: 'QUALITEC',
  cnpj: '12345678000190',
  responsavel_nome: 'SILVANA APARECIDA BARDUCHI',
  responsavel_cpf: '04487488869'
}

console.log('📄 Gerando HTML do holerite...\n')

try {
  const html = gerarHoleriteHTML(holerite, funcionario, empresa)
  
  // Verificar se todas as linhas têm 5 colunas <td>
  const linhas = html.match(/<tr>[\s\S]*?<\/tr>/g) || []
  const linhasTabela = linhas.filter(l => l.includes('<td'))
  
  console.log(`✅ Total de linhas na tabela: ${linhasTabela.length}\n`)
  
  // Verificar cada linha
  let erros = 0
  let sucessos = 0
  
  linhasTabela.forEach((linha, index) => {
    const colunas = (linha.match(/<td/g) || []).length
    const temTextRight = linha.includes('class="text-right"')
    
    // Extrair código e descrição
    const codigoMatch = linha.match(/<td[^>]*>(\d+)<\/td>/)
    const descricaoMatch = linha.match(/<td[^>]*>([A-Z\s]+)<\/td>/)
    
    const codigo = codigoMatch ? codigoMatch[1] : '???'
    const descricao = descricaoMatch ? descricaoMatch[1].trim() : '???'
    
    if (colunas !== 5) {
      console.log(`❌ Linha ${index + 1} (${codigo} - ${descricao}): ${colunas} colunas (esperado: 5)`)
      erros++
    } else if (!temTextRight) {
      console.log(`⚠️  Linha ${index + 1} (${codigo} - ${descricao}): 5 colunas mas sem class="text-right"`)
      erros++
    } else {
      console.log(`✅ Linha ${index + 1} (${codigo} - ${descricao}): OK`)
      sucessos++
    }
  })
  
  console.log(`\n📊 RESULTADO:`)
  console.log(`   ✅ Sucessos: ${sucessos}`)
  console.log(`   ❌ Erros: ${erros}`)
  console.log(`   📈 Taxa de sucesso: ${((sucessos / linhasTabela.length) * 100).toFixed(1)}%`)
  
  // Verificar itens específicos mencionados pelo usuário
  console.log(`\n🔍 VERIFICAÇÃO ESPECÍFICA:`)
  
  const verificarItem = (codigo, nome) => {
    const regex = new RegExp(`<td[^>]*>${codigo}</td>[\\s\\S]*?<td[^>]*>${nome}[\\s\\S]*?</td>[\\s\\S]*?<td[^>]*class="text-center"[^>]*>[\\s\\S]*?</td>[\\s\\S]*?<td[^>]*class="text-right"[^>]*>[\\s\\S]*?</td>[\\s\\S]*?<td[^>]*class="text-right"[^>]*>[\\s\\S]*?</td>`)
    const encontrado = regex.test(html)
    console.log(`   ${encontrado ? '✅' : '❌'} ${codigo} - ${nome}`)
    return encontrado
  }
  
  const item1 = verificarItem('8781', 'DIAS NORMAIS')
  const item2 = verificarItem('998', 'I\\.N\\.S\\.S\\.')
  const item3 = verificarItem('910', 'ADIANTAMENTO SALARIAL')
  const item4 = verificarItem('930', 'CESTA BÁSICA')
  const item5 = verificarItem('940', 'PLANO DE SAÚDE')
  const item6 = verificarItem('950', 'PLANO ODONTOLÓGICO')
  const item7 = verificarItem('965', 'FALTAS')
  const item8 = verificarItem('971', 'DESCONTO TESTE')
  
  const todosOk = item1 && item2 && item3 && item4 && item5 && item6 && item7 && item8
  
  if (todosOk && erros === 0) {
    console.log(`\n✅ TESTE PASSOU! Todas as linhas estão alinhadas corretamente.`)
  } else {
    console.log(`\n❌ TESTE FALHOU! Ainda existem problemas de alinhamento.`)
  }
  
} catch (error) {
  console.error('❌ Erro ao gerar HTML:', error.message)
  process.exit(1)
}
