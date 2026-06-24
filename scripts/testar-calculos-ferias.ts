import { calcularRemuneracaoFerias } from '../server/utils/calcularFerias'

console.log('🧪 INICIANDO SUÍTE DE TESTES AUTOMATIZADOS - CÁLCULO DE FÉRIAS CLT 2026\n')

let testesPassados = 0
let testesFalhados = 0

function assertEqual(val1: any, val2: any, message: string) {
  if (val1 === val2) {
    console.log(`  ✅ PASSOU: ${message} (valor: ${val1})`)
    testesPassados++
  } else {
    console.error(`  ❌ FALHOU: ${message} (esperava: ${val2}, obtido: ${val1})`)
    testesFalhados++
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 1: Caso de Referência (Sem dependentes, 20 dias gozo, 10 dias abono)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 1: Empregado sem dependentes (R$ 3.650,00, 20 dias gozo + 10 abono)')
const res1 = calcularRemuneracaoFerias(3650.00, 20, 10, 0)
assertEqual(res1.valorRemuneracao, 2433.33, 'Remuneração das férias (20 dias)')
assertEqual(res1.valorUmTerco, 811.11, '1/3 Constitucional')
assertEqual(res1.valorAbonoPecuniario, 1216.67, 'Abono Pecuniário (10 dias vendidos)')
assertEqual(res1.valorBruto, 4461.11, 'Total Bruto')
assertEqual(res1.inss, 277.93, 'INSS Progressivo 2026')
assertEqual(res1.irrf, 0.00, 'IRRF (Isento devido à Lei 15.270/2025)')
assertEqual(res1.valorLiquido, 4183.18, 'Líquido a receber')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 2: Empregado com 1, 2 e 3 dependentes (R$ 5.000,00, 30 dias gozo)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 2: Comparação de Dependentes IRRF (R$ 5.000,00, 30 dias)')
const res2_0 = calcularRemuneracaoFerias(5000.00, 30, 0, 0)
const res2_1 = calcularRemuneracaoFerias(5000.00, 30, 0, 1)
const res2_2 = calcularRemuneracaoFerias(5000.00, 30, 0, 2)
const res2_3 = calcularRemuneracaoFerias(5000.00, 30, 0, 3)

// IRRF deve reduzir conforme o número de dependentes aumenta
console.log(`  Base INSS: R$ ${res2_0.valorBruto} (Remuneração: R$ 5000.00 + 1/3: R$ 1666.67) = R$ 6666.67`)
console.log(`  INSS pago: R$ ${res2_0.inss}`)
console.log(`  IRRF com 0 dependentes: R$ ${res2_0.irrf} (faixa: ${res2_0.faixaIRRF})`)
console.log(`  IRRF com 1 dependente: R$ ${res2_1.irrf} (faixa: ${res2_1.faixaIRRF})`)
console.log(`  IRRF com 2 dependentes: R$ ${res2_2.irrf} (faixa: ${res2_2.faixaIRRF})`)
console.log(`  IRRF com 3 dependentes: R$ ${res2_3.irrf} (faixa: ${res2_3.faixaIRRF})`)

assertEqual(res2_1.irrf < res2_0.irrf, true, 'IRRF de 1 dependente deve ser menor que 0')
assertEqual(res2_2.irrf < res2_1.irrf, true, 'IRRF de 2 dependentes deve ser menor que 1')
assertEqual(res2_3.irrf < res2_2.irrf, true, 'IRRF de 3 dependentes deve ser menor que 2')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 3: Empregado pagando Pensão Alimentícia (R$ 4.000,00, 30 dias gozo)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 3: Empregado com desconto de Pensão Alimentícia')
// Teste Pensão Alimentícia Fixo (R$ 500,00)
const res3_fixo = calcularRemuneracaoFerias(4000.00, 30, 0, 0, {
  ativa: true,
  tipo: 'fixo',
  percentual: 0,
  valorFixo: 500.00
})
assertEqual(res3_fixo.pensaoAlimenticia, 500.00, 'Pensão alimentícia fixa de R$ 500,00')
// Teste Pensão Alimentícia Percentual (20% do líquido base: baseInss - inss)
// baseInss = 4000 + 1333.33 = 5333.33. INSS = 548.18.
// Líquido base = 5333.33 - 548.18 = 4785.15
// 20% = 957.03
const res3_pct = calcularRemuneracaoFerias(4000.00, 30, 0, 0, {
  ativa: true,
  tipo: 'percentual',
  percentual: 20,
  valorFixo: 0
})
assertEqual(res3_pct.pensaoAlimenticia, 957.03, 'Pensão alimentícia percentual de 20% (R$ 957,03)')

// Teste Pensão Alimentícia Percentual com Abono Pecuniário (30% do líquido base incluindo abono)
// Salário base = 4000.00, 20 dias gozo, 10 dias abono.
// baseInss = 2666.67 + 888.89 = 3555.56
// valorAbonoPecuniario = 1333.33
// INSS = 315.27
// Líquido base = 3555.56 + 1333.33 - 315.27 = 4573.62
// 30% = 1372.09
const res3_abono_pct = calcularRemuneracaoFerias(4000.00, 20, 10, 0, {
  ativa: true,
  tipo: 'percentual',
  percentual: 30,
  valorFixo: 0
})
assertEqual(res3_abono_pct.pensaoAlimenticia, 1372.09, 'Pensão alimentícia percentual de 30% com abono pecuniário (R$ 1.372,09)')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 4: Empregado com Salário Mínimo (R$ 1.621,00, 30 dias gozo)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 4: Salário Mínimo 2026 (R$ 1.621,00)')
const res4 = calcularRemuneracaoFerias(1621.00, 30, 0, 0)
assertEqual(res4.valorRemuneracao, 1621.00, 'Remuneração é igual ao salário mínimo')
assertEqual(res4.valorUmTerco, 540.33, '1/3 constitucional')
// Base INSS = 1621.00 + 540.33 = 2161.33
// INSS faixa 1: 1621 * 0.075 = 121.575
// INSS faixa 2: (2161.33 - 1621) * 0.09 = 540.33 * 0.09 = 48.6297
// Total INSS = 170.2047
assertEqual(res4.inss, 170.20, 'INSS progressivo correto')
assertEqual(res4.irrf, 0.00, 'IRRF Isento para salário mínimo')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 5: Empregado acima do teto de contribuição INSS (R$ 10.000,00, 30 dias)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 5: Salário acima do teto INSS 2026 (R$ 10.000,00)')
const res5 = calcularRemuneracaoFerias(10000.00, 30, 0, 0)
// Teto INSS 2026 = 8475.55
// INSS progressivo sobre 8475.55:
// - 1621.00 * 0.075 = 121.575
// - (2902.84 - 1621) * 0.09 = 115.3656
// - (4354.27 - 2902.84) * 0.12 = 174.1716
// - (8475.55 - 4354.27) * 0.14 = 576.9792
// Total = 988.09
assertEqual(res5.inss, 988.09, 'INSS limitado ao teto máximo (R$ 988,09)')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 6: Férias Proporcionais (15 dias gozo, R$ 3.000,00)
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 6: Férias Proporcionais (15 dias, R$ 3.000,00)')
const res6 = calcularRemuneracaoFerias(3000.00, 15, 0, 0)
assertEqual(res6.valorRemuneracao, 1500.00, 'Remuneração proporcional de 15 dias')
assertEqual(res6.valorUmTerco, 500.00, '1/3 constitucional')
assertEqual(res6.valorBruto, 2000.00, 'Bruto total')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO 7: Lei 15.270/2025 - Redutor de IRRF progressivo
// ─────────────────────────────────────────────────────────────────────────────
console.log('Scenario 7: Lei 15.270/2025 Redução de IRRF')
// Base IRRF <= 5000 deve ser zerada
const res7_baixo = calcularRemuneracaoFerias(4000.00, 30, 0, 0)
assertEqual(res7_baixo.irrf, 0.00, 'IRRF zerado para bases inferiores a R$ 5.000,00')

// Base IRRF > 7350 deve ter imposto sem redução
// Salário base = 12000, 1/3 = 4000. Bruto = 16000.
// Base Inss limitada = 8475.55. INSS = 988.09.
// Base IRRF = 12000 + 4000 - 988.09 = 15011.91.
// Imposto normal = (15011.91 * 0.275) - 896.00 = 4128.275 - 896 = 3232.28
// Sem redutor pois base > 7350
const res7_alto = calcularRemuneracaoFerias(12000.00, 30, 0, 0)
assertEqual(res7_alto.irrf, 3232.28, 'IRRF normal de R$ 3.232,28 para bases superiores a R$ 7.350,00')
console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// RESUMO DE EXECUÇÃO
// ─────────────────────────────────────────────────────────────────────────────
console.log('─────────────────────────────────────────────────────────────────────────────')
console.log(`📊 RESUMO: ${testesPassados} testes passados, ${testesFalhados} testes falhados.`)
console.log('─────────────────────────────────────────────────────────────────────────────')

if (testesFalhados > 0) {
  console.error('\n❌ HÁ FALHAS NOS TESTES DE CÁLCULO DE FÉRIAS!')
  process.exit(1)
} else {
  console.log('\n✅ TODOS OS TESTES PASSARAM COM SUCESSO!')
  process.exit(0)
}
