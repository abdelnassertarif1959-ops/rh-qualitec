/**
 * Script para gerar HTML de exemplo do holerite responsivo
 * Usa dados mockados para demonstração
 */

import fs from 'fs'

// Dados mockados
const holerite = {
  id: 1,
  funcionario_id: 93,
  periodo_inicio: '2026-02-01',
  periodo_fim: '2026-02-28',
  salario_base: 3650.00,
  dias_trabalhados: 30,
  bonus: 0,
  horas_extras: 0,
  adicional_noturno: 0,
  adicional_periculosidade: 0,
  adicional_insalubridade: 0,
  comissoes: 0,
  inss: 326.58,
  aliquota_inss: 8.9,
  inss_referencia: '8,9',
  irrf: 0,
  vale_transporte: 0,
  cesta_basica_desconto: 0,
  plano_saude: 0,
  plano_odontologico: 0,
  adiantamento: 1460.00,
  faltas: 0,
  pensao_alimenticia: 0,
  fgts: 292.00,
  base_inss: 3650.00,
  faixa_irrf: '0,00',
  beneficios: [],
  descontos_personalizados: []
}

const funcionario = {
  id: 93,
  nome_completo: 'SAMUEL TARIF',
  cargo_nome: 'ASSISTENTE COMERCIAL',
  departamento_nome: 'ADMINISTRATIVO',
  data_admissao: '2025-08-01',
  numero_dependentes: 0,
  tipo_contrato: 'CLT'
}

const empresa = {
  nome: 'SPEED GESTAO E SERVICOS ADMINISTRATIVOS LTDA',
  nome_fantasia: 'SPEED GESTAO E SERVICOS ADMINISTRATIVOS LTDA',
  cnpj: '46732564000110',
  responsavel_nome: 'SILVANA APARECIDA BARDUCHI',
  responsavel_cpf: '04487488869'
}

// Função simplificada de geração de HTML
function gerarHTML() {
  const corTema = '#2563eb'
  const corFundo = '#eff6ff'
  const isAdiantamento = false
  const tipoFolha = 'Folha Mensal'
  const mesAno = 'janeiro de 2026'
  const dataPagamento = '06/02/2026'
  const dataAdmissao = '01/08/2025'
  const cnpjFormatado = '46.732.564/0001-10'
  
  const salarioProporcional = 3650.00
  const totalVencimentos = 3650.00
  const totalDescontos = 1786.58
  const valorLiquido = 1863.42
  const fgts = 292.00
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Holerite - ${funcionario.nome_completo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
      padding: 5px;
      background: ${corFundo};
    }
    
    .container {
      max-width: 100%;
      width: 100%;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }
    
    @media (min-width: 600px) {
      body {
        padding: 15px;
        font-size: 12px;
      }
    }
    
    @media (min-width: 768px) {
      body {
        padding: 20px;
      }
      
      .container {
        max-width: 800px;
      }
    }
    
    .header {
      margin-bottom: 15px;
      padding: 15px 10px 10px 10px;
      border-bottom: 3px solid ${corTema};
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border-radius: 8px 8px 0 0;
    }
    
    @media (min-width: 600px) {
      .header {
        padding: 20px 20px 15px 20px;
        margin-bottom: 20px;
      }
    }
    
    .header-top {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 10px;
    }
    
    @media (min-width: 600px) {
      .header-top {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }
    }
    
    .company-name {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: ${corTema};
    }
    
    @media (min-width: 600px) {
      .company-name {
        font-size: 16px;
      }
    }
    
    .company-cnpj {
      font-size: 10px;
      margin-top: 3px;
      color: #666;
    }
    
    @media (min-width: 600px) {
      .company-cnpj {
        font-size: 11px;
      }
    }
    
    .header-right {
      text-align: left;
    }
    
    @media (min-width: 600px) {
      .header-right {
        text-align: right;
      }
    }
    
    .folha-tipo {
      font-size: 12px;
      font-weight: bold;
      color: ${corTema};
      background: white;
      padding: 6px 12px;
      border-radius: 20px;
      border: 2px solid ${corTema};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: inline-block;
    }
    
    @media (min-width: 600px) {
      .folha-tipo {
        font-size: 14px;
        padding: 8px 16px;
      }
    }
    
    .folha-tipo::before {
      content: "📊";
      margin-right: 8px;
    }
    
    .competencia {
      font-size: 10px;
      text-transform: capitalize;
      margin-top: 5px;
      color: #666;
    }
    
    @media (min-width: 600px) {
      .competencia {
        font-size: 11px;
      }
    }
    
    .employee-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 0 10px 15px 10px;
      padding: 12px;
      background: ${corFundo};
      border: 2px solid ${corTema};
      border-radius: 8px;
    }
    
    @media (min-width: 480px) {
      .employee-info {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .employee-info {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin: 0 20px 20px 20px;
        padding: 15px;
      }
    }
    
    .info-item {
      font-size: 9px;
    }
    
    @media (min-width: 600px) {
      .info-item {
        font-size: 10px;
      }
    }
    
    .info-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }
    
    .info-value {
      display: block;
      word-break: break-word;
    }
    
    @media (min-width: 768px) {
      .employee-info .info-item:nth-child(2) {
        grid-column: span 2;
      }
    }
    
    table {
      width: calc(100% - 20px);
      margin: 0 10px 15px 10px;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 9px;
    }
    
    @media (min-width: 600px) {
      table {
        width: calc(100% - 40px);
        margin: 0 20px 15px 20px;
        font-size: 10px;
      }
    }
    
    th {
      background: ${corTema};
      color: white;
      padding: 8px 4px;
      text-align: left;
      font-size: 9px;
      font-weight: bold;
      border: none;
    }
    
    @media (min-width: 600px) {
      th {
        padding: 12px 8px;
        font-size: 11px;
      }
    }
    
    td {
      padding: 6px 4px;
      border: 1px solid #e5e7eb;
      font-size: 9px;
      background: white;
      word-break: break-word;
    }
    
    @media (min-width: 600px) {
      td {
        padding: 8px;
        font-size: 10px;
      }
    }
    
    tr:nth-child(even) td {
      background: #f9fafb;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals {
      margin: 10px 10px 15px 10px;
      padding: 15px;
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border: 3px solid ${corTema};
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    @media (min-width: 600px) {
      .totals {
        margin: 10px 20px 20px 20px;
        padding: 20px;
      }
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 11px;
      border-bottom: 1px solid #e5e7eb;
      gap: 10px;
    }
    
    @media (min-width: 600px) {
      .total-row {
        padding: 8px 0;
        font-size: 12px;
      }
    }
    
    .total-row:last-child {
      border-bottom: none;
    }
    
    .total-row.liquido {
      font-size: 14px;
      font-weight: bold;
      padding: 12px 0 8px 0;
      border-top: 3px solid ${corTema};
      margin-top: 8px;
      color: ${corTema};
    }
    
    @media (min-width: 600px) {
      .total-row.liquido {
        font-size: 16px;
        padding: 15px 0 10px 0;
        margin-top: 10px;
      }
    }
    
    .signature {
      margin: 15px 10px;
      padding: 12px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 9px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    
    @media (min-width: 600px) {
      .signature {
        flex-direction: row;
        align-items: center;
        gap: 15px;
        margin: 20px;
        padding: 15px;
        font-size: 10px;
      }
    }
    
    .signature-image {
      max-width: 150px;
      height: auto;
    }
    
    @media (min-width: 600px) {
      .signature-image {
        max-width: 200px;
      }
    }
    
    .signature-text {
      flex: 1;
      text-align: center;
    }
    
    @media (min-width: 600px) {
      .signature-text {
        text-align: left;
      }
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .bases-calculo {
      margin: 15px 10px;
    }
    
    @media (min-width: 600px) {
      .bases-calculo {
        margin-top: 20px;
      }
    }
    
    .bases-title {
      font-size: 10px;
      font-weight: bold;
      margin-bottom: 8px;
      padding: 5px;
      background: #f0f0f0;
      border: 1px solid #ccc;
    }
    
    @media (min-width: 600px) {
      .bases-title {
        font-size: 11px;
        margin-bottom: 10px;
      }
    }
    
    .bases-table {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: #ccc;
      border: 1px solid #ccc;
    }
    
    @media (min-width: 480px) {
      .bases-table {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .bases-table {
        grid-template-columns: repeat(6, 1fr);
      }
    }
    
    .base-item {
      background: white;
      padding: 6px 3px;
      font-size: 8px;
      text-align: center;
    }
    
    @media (min-width: 600px) {
      .base-item {
        padding: 8px 5px;
        font-size: 9px;
      }
    }
    
    .base-label {
      font-weight: bold;
      display: block;
      margin-bottom: 3px;
      word-break: break-word;
    }
    
    .base-value {
      display: block;
    }
    
    @media print {
      body {
        padding: 0;
        font-size: 11px;
      }
      
      .container {
        max-width: 100%;
        box-shadow: none;
      }
      
      .header {
        padding: 15px;
      }
      
      .employee-info {
        grid-template-columns: repeat(4, 1fr);
        margin: 0 15px 15px 15px;
      }
      
      table {
        width: calc(100% - 30px);
        margin: 0 15px 15px 15px;
        font-size: 10px;
      }
      
      .totals {
        margin: 10px 15px;
      }
      
      .signature {
        margin: 15px;
        flex-direction: row;
      }
      
      .bases-table {
        grid-template-columns: repeat(6, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="company-name">${empresa.nome_fantasia}</div>
          <div class="company-cnpj">CNPJ: ${cnpjFormatado}</div>
          <div class="company-cnpj">CC: GERAL</div>
          <div class="company-cnpj">Mensalista</div>
        </div>
        <div class="header-right">
          <div class="folha-tipo">${tipoFolha}</div>
          <div class="competencia">${mesAno}</div>
          <div class="competencia" style="margin-top: 2px; font-size: 10px;">Pagamento: ${dataPagamento}</div>
        </div>
      </div>
    </div>
    
    <div class="employee-info">
      <div class="info-item">
        <span class="info-label">Código</span>
        <span class="info-value">${funcionario.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Nome do Funcionário</span>
        <span class="info-value">${funcionario.nome_completo}</span>
        <span class="info-value">${funcionario.cargo_nome}</span>
      </div>
      <div class="info-item">
        <span class="info-label">CBO</span>
        <span class="info-value">354125</span>
      </div>
      <div class="info-item">
        <span class="info-label">Departamento</span>
        <span class="info-value">${funcionario.departamento_nome}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Mat</span>
        <span class="info-value">${funcionario.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Admissão:</span>
        <span class="info-value">${dataAdmissao}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Pagamento:</span>
        <span class="info-value">${dataPagamento}</span>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">Código</th>
          <th style="width: 40%;">Descrição</th>
          <th style="width: 15%;" class="text-center">Referência</th>
          <th style="width: 17.5%;" class="text-right">Vencimentos</th>
          <th style="width: 17.5%;" class="text-right">Descontos</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>8781</td>
          <td>DIAS NORMAIS</td>
          <td class="text-center">30.00</td>
          <td class="text-right">3.650,00</td>
          <td></td>
        </tr>
        <tr>
          <td>998</td>
          <td>I.N.S.S.</td>
          <td class="text-center">8,9</td>
          <td></td>
          <td class="text-right">326,58</td>
        </tr>
        <tr>
          <td>910</td>
          <td>ADIANTAMENTO SALARIAL</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">1.460,00</td>
        </tr>
      </tbody>
    </table>
    
    <div class="totals">
      <div class="total-row">
        <span>Total de Vencimentos</span>
        <span>3.650,00</span>
      </div>
      <div class="total-row">
        <span>Total de Descontos</span>
        <span>1.786,58</span>
      </div>
      <div class="total-row liquido">
        <span>Valor Líquido</span>
        <span>1.863,42</span>
      </div>
    </div>
    
    <div class="signature">
      <img src="/ass.png" alt="Assinatura Digital" class="signature-image" />
      <div class="signature-text">
        <div class="signature-title">Assinado de forma digital por ${empresa.responsavel_nome}</div>
        <div>CPF: ${empresa.responsavel_cpf}</div>
        <div>Dados: 11/02/2026, 09:05:43 -03'00'</div>
      </div>
    </div>
    
    <div class="bases-calculo">
      <div class="bases-title">Bases de Cálculo</div>
      <div class="bases-table">
        <div class="base-item">
          <span class="base-label">Salário Base</span>
          <span class="base-value">3.650,00</span>
        </div>
        <div class="base-item">
          <span class="base-label">Sal. Contr. INSS</span>
          <span class="base-value">3.650,00</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base Cálc. FGTS</span>
          <span class="base-value">3.650,00</span>
        </div>
        <div class="base-item">
          <span class="base-label">F.G.T.S do Mês</span>
          <span class="base-value">292,00</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base Cálc. IRRF</span>
          <span class="base-value">3.323,42</span>
        </div>
        <div class="base-item">
          <span class="base-label">Faixa IRRF</span>
          <span class="base-value">0,00</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

// Gerar e salvar HTML
const html = gerarHTML()
const filename = 'test-holerite-responsivo.html'
fs.writeFileSync(filename, html)

console.log('✅ HTML responsivo gerado com sucesso!')
console.log(`📁 Arquivo: ${filename}`)
console.log('\n📱 Para testar a responsividade:')
console.log('   1. Abra o arquivo no navegador')
console.log('   2. Pressione F12 para abrir DevTools')
console.log('   3. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)')
console.log('   4. Teste diferentes tamanhos de tela:')
console.log('      - Mobile: 375px (iPhone)')
console.log('      - Tablet: 768px (iPad)')
console.log('      - Desktop: 1024px+')
console.log('\n💡 Dica: Use Ctrl+P para testar a impressão')
