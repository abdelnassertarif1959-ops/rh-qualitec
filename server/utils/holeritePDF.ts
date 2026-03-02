import PDFDocument from 'pdfkit'
import type { Readable } from 'stream'

interface Empresa {
  nome_fantasia: string
  razao_social: string
  cnpj: string
  endereco_completo?: string
  cidade?: string
  estado?: string
  cep?: string
  telefone?: string
  email?: string
}

interface Funcionario {
  nome_completo: string
  cpf: string
  pis_pasep?: string
  cargo: string
  departamento: string
}

interface Provento {
  descricao: string
  valor: number
}

interface Desconto {
  descricao: string
  valor: number
  base?: number
  aliquota?: number
}

interface DadosHolerite {
  empresa: Empresa
  funcionario: Funcionario
  periodo: {
    mes: number
    ano: number
    data_pagamento: string
  }
  proventos: Provento[]
  descontos: Desconto[]
  observacoes?: string
}

export function gerarHoleritePDF(dados: DadosHolerite): PDFDocument {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  })

  // Cores
  const corPrimaria = '#1e40af' // Azul
  const corSecundaria = '#64748b' // Cinza
  const corVerde = '#059669' // Verde para proventos
  const corVermelha = '#dc2626' // Vermelho para descontos

  let y = 50

  // ========== CABEÇALHO ==========
  doc.fontSize(20)
     .fillColor(corPrimaria)
     .font('Helvetica-Bold')
     .text('HOLERITE / CONTRACHEQUE', 50, y, { align: 'center' })
  
  y += 40

  // ========== DADOS DA EMPRESA ==========
  doc.fontSize(10)
     .fillColor(corSecundaria)
     .font('Helvetica')
     .text('DADOS DA EMPRESA', 50, y)
  
  y += 15
  
  // Box da empresa
  doc.rect(50, y, 495, 80)
     .stroke('#e5e7eb')
  
  y += 10
  
  doc.fontSize(12)
     .fillColor('#000')
     .font('Helvetica-Bold')
     .text(dados.empresa.nome_fantasia, 60, y)
  
  y += 15
  
  doc.fontSize(9)
     .font('Helvetica')
     .text(`Razão Social: ${dados.empresa.razao_social}`, 60, y)
  
  y += 12
  
  doc.text(`CNPJ: ${formatarCNPJ(dados.empresa.cnpj)}`, 60, y)
  
  y += 12
  
  if (dados.empresa.endereco_completo) {
    const endereco = `${dados.empresa.endereco_completo}${dados.empresa.cidade ? ', ' + dados.empresa.cidade : ''}${dados.empresa.estado ? ' - ' + dados.empresa.estado : ''}${dados.empresa.cep ? ' - CEP: ' + dados.empresa.cep : ''}`
    doc.text(endereco, 60, y, { width: 475 })
    y += 12
  }
  
  if (dados.empresa.telefone || dados.empresa.email) {
    const contato = `${dados.empresa.telefone ? 'Tel: ' + dados.empresa.telefone : ''}${dados.empresa.telefone && dados.empresa.email ? ' | ' : ''}${dados.empresa.email ? 'Email: ' + dados.empresa.email : ''}`
    doc.text(contato, 60, y)
  }
  
  y += 30

  // ========== DADOS DO FUNCIONÁRIO ==========
  doc.fontSize(10)
     .fillColor(corSecundaria)
     .font('Helvetica')
     .text('DADOS DO FUNCIONÁRIO', 50, y)
  
  y += 15
  
  // Box do funcionário
  doc.rect(50, y, 495, 65)
     .stroke('#e5e7eb')
  
  y += 10
  
  doc.fontSize(11)
     .fillColor('#000')
     .font('Helvetica-Bold')
     .text(dados.funcionario.nome_completo, 60, y)
  
  y += 15
  
  doc.fontSize(9)
     .font('Helvetica')
     .text(`CPF: ${formatarCPF(dados.funcionario.cpf)}`, 60, y)
  
  if (dados.funcionario.pis_pasep) {
    doc.text(`PIS/PASEP: ${formatarPIS(dados.funcionario.pis_pasep)}`, 250, y)
  }
  
  y += 12
  
  doc.text(`Cargo: ${dados.funcionario.cargo}`, 60, y)
  doc.text(`Departamento: ${dados.funcionario.departamento}`, 250, y)
  
  y += 30

  // ========== PERÍODO DE REFERÊNCIA ==========
  doc.fontSize(10)
     .fillColor(corSecundaria)
     .font('Helvetica')
     .text('PERÍODO DE REFERÊNCIA', 50, y)
  
  y += 15
  
  doc.rect(50, y, 495, 30)
     .stroke('#e5e7eb')
  
  y += 10
  
  const mesNome = obterNomeMes(dados.periodo.mes)
  doc.fontSize(10)
     .fillColor('#000')
     .font('Helvetica-Bold')
     .text(`Mês/Ano: ${mesNome}/${dados.periodo.ano}`, 60, y)
  
  doc.text(`Data de Pagamento: ${formatarData(dados.periodo.data_pagamento)}`, 350, y)
  
  y += 35

  // ========== PROVENTOS E DESCONTOS (LADO A LADO) ==========
  const larguraColuna = 240
  const xProventos = 50
  const xDescontos = 305

  // Cabeçalho Proventos
  doc.fontSize(10)
     .fillColor(corVerde)
     .font('Helvetica-Bold')
     .text('PROVENTOS (RECEBIMENTOS)', xProventos, y)
  
  // Cabeçalho Descontos
  doc.fillColor(corVermelha)
     .text('DESCONTOS', xDescontos, y)
  
  y += 15

  // Linhas de proventos e descontos
  const yInicio = y
  const maxLinhas = Math.max(dados.proventos.length, dados.descontos.length)
  
  // Desenhar proventos
  let yProventos = yInicio
  dados.proventos.forEach((provento, index) => {
    doc.fontSize(9)
       .fillColor('#000')
       .font('Helvetica')
       .text(provento.descricao, xProventos, yProventos, { width: 150 })
    
    doc.font('Helvetica-Bold')
       .text(formatarMoeda(provento.valor), xProventos + 160, yProventos, { width: 80, align: 'right' })
    
    yProventos += 15
  })
  
  // Desenhar descontos
  let yDescontos = yInicio
  dados.descontos.forEach((desconto, index) => {
    doc.fontSize(9)
       .fillColor('#000')
       .font('Helvetica')
       .text(desconto.descricao, xDescontos, yDescontos, { width: 150 })
    
    doc.font('Helvetica-Bold')
       .text(formatarMoeda(desconto.valor), xDescontos + 160, yDescontos, { width: 80, align: 'right' })
    
    yDescontos += 15
    
    // Mostrar base e alíquota se disponível
    if (desconto.base && desconto.aliquota) {
      doc.fontSize(7)
         .fillColor(corSecundaria)
         .font('Helvetica')
         .text(`Base: ${formatarMoeda(desconto.base)} | Alíquota: ${desconto.aliquota}%`, xDescontos, yDescontos - 3)
    }
  })
  
  y = Math.max(yProventos, yDescontos) + 10

  // Linhas separadoras
  doc.moveTo(xProventos, y)
     .lineTo(xProventos + larguraColuna, y)
     .stroke('#e5e7eb')
  
  doc.moveTo(xDescontos, y)
     .lineTo(xDescontos + larguraColuna, y)
     .stroke('#e5e7eb')
  
  y += 10

  // Totais
  const totalProventos = dados.proventos.reduce((sum, p) => sum + p.valor, 0)
  const totalDescontos = dados.descontos.reduce((sum, d) => sum + d.valor, 0)
  
  doc.fontSize(10)
     .fillColor(corVerde)
     .font('Helvetica-Bold')
     .text('TOTAL PROVENTOS:', xProventos, y)
  
  doc.text(formatarMoeda(totalProventos), xProventos + 160, y, { width: 80, align: 'right' })
  
  doc.fillColor(corVermelha)
     .text('TOTAL DESCONTOS:', xDescontos, y)
  
  doc.text(formatarMoeda(totalDescontos), xDescontos + 160, y, { width: 80, align: 'right' })
  
  y += 30

  // ========== SALÁRIO LÍQUIDO ==========
  const salarioLiquido = totalProventos - totalDescontos
  
  doc.rect(50, y, 495, 40)
     .fillAndStroke('#eff6ff', '#1e40af')
  
  y += 12
  
  doc.fontSize(14)
     .fillColor(corPrimaria)
     .font('Helvetica-Bold')
     .text('SALÁRIO LÍQUIDO:', 60, y)
  
  doc.fontSize(16)
     .text(formatarMoeda(salarioLiquido), 350, y, { width: 185, align: 'right' })
  
  y += 45

  // ========== INFORMAÇÕES ADICIONAIS ==========
  if (dados.observacoes) {
    doc.fontSize(10)
       .fillColor(corSecundaria)
       .font('Helvetica')
       .text('OBSERVAÇÕES', 50, y)
    
    y += 15
    
    doc.fontSize(8)
       .fillColor('#000')
       .font('Helvetica')
       .text(dados.observacoes, 50, y, { width: 495, align: 'justify' })
    
    y += 30
  }

  // ========== ASSINATURAS ==========
  y = doc.page.height - 120
  
  doc.fontSize(8)
     .fillColor(corSecundaria)
     .font('Helvetica')
     .text('_'.repeat(40), 60, y, { width: 200, align: 'center' })
  
  doc.text('_'.repeat(40), 345, y, { width: 200, align: 'center' })
  
  y += 15
  
  doc.text('Assinatura do Empregador/RH', 60, y, { width: 200, align: 'center' })
  doc.text('Assinatura do Funcionário', 345, y, { width: 200, align: 'center' })
  
  // Rodapé
  y += 25
  doc.fontSize(7)
     .fillColor('#9ca3af')
     .text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, 50, y, { width: 495, align: 'center' })

  return doc
}

// ========== FUNÇÕES AUXILIARES ==========

function formatarCNPJ(cnpj: string): string {
  const numeros = cnpj.replace(/\D/g, '')
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

function formatarCPF(cpf: string): string {
  const numeros = cpf.replace(/\D/g, '')
  return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

function formatarPIS(pis: string): string {
  const numeros = pis.replace(/\D/g, '')
  return numeros.replace(/^(\d{3})(\d{5})(\d{2})(\d{1})$/, '$1.$2.$3-$4')
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR')
}

function obterNomeMes(mes: number): string {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return meses[mes - 1]
}
