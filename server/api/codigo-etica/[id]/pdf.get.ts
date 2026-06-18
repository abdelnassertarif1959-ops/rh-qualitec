import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'
import PDFDocument from 'pdfkit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  const { data: codigo, error } = await (supabase as any)
    .from('codigo_etica')
    .select('*, empresa:empresa_id(id, nome, nome_fantasia, cnpj, endereco, telefone)')
    .eq('id', id)
    .single()

  if (error || !codigo) throw createError({ statusCode: 404, message: 'Código de ética não encontrado' })

  const nomeEmpresa = codigo.empresa?.nome_fantasia || codigo.empresa?.nome || 'Empresa'

  const doc = new PDFDocument({ margin: 50, size: 'A4' })

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="codigo-etica-${nomeEmpresa.replace(/\s+/g, '-')}.pdf"`)

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  const pageWidth = 595.28
  const margin = 50

  // ── CABEÇALHO ──────────────────────────────────────────────
  let logoWidth = 0

  // Logo em base64 (se existir)
  if (codigo.logo_base64) {
    try {
      const imgBuffer = Buffer.from(codigo.logo_base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      doc.image(imgBuffer, margin, 35, { fit: [130, 65], align: 'left', valign: 'center' })
      logoWidth = 145
    } catch {}
  }

  // Nome da empresa (lado direito do logo)
  const textX = margin + logoWidth
  doc.fontSize(9).font('Helvetica').fillColor('#666666')
    .text(nomeEmpresa, textX, 40, { width: pageWidth - margin - textX, align: logoWidth > 0 ? 'right' : 'left' })

  if (codigo.empresa?.cnpj) {
    doc.fontSize(8).fillColor('#999999')
      .text(`CNPJ: ${codigo.empresa.cnpj}`, textX, 52, { width: pageWidth - margin - textX, align: logoWidth > 0 ? 'right' : 'left' })
  }

  // Linha separadora
  const linhaY = 80
  doc.moveTo(margin, linhaY).lineTo(pageWidth - margin, linhaY).strokeColor('#1e3a5f').lineWidth(1.5).stroke()

  // Título principal
  doc.moveDown(0.5)
  doc.y = linhaY + 20
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#1e3a5f')
    .text(codigo.titulo || 'Codigo de Etica e Conduta', margin, doc.y, { align: 'center', width: pageWidth - margin * 2 })

  doc.moveDown(0.3)
  doc.moveTo(margin, doc.y).lineTo(pageWidth - margin, doc.y).strokeColor('#cccccc').lineWidth(0.5).stroke()
  doc.moveDown(1)

  // ── CONTEÚDO ───────────────────────────────────────────────
  const linhas = codigo.conteudo.split('\n')
  doc.fontSize(10).font('Helvetica').fillColor('#333333')

  for (const linha of linhas) {
    // Remover emojis e caracteres especiais não suportados pelo PDFKit
    const limpa = linha.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[^\x00-\xFF]/g, '').trim()

    if (!limpa) { doc.moveDown(0.4); continue }

    if (/^\d+\./.test(limpa)) {
      // Título de seção numerado
      doc.moveDown(0.6)
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e3a5f')
        .text(limpa, margin, doc.y, { width: pageWidth - margin * 2 })
      doc.fontSize(10).font('Helvetica').fillColor('#333333')
    } else if (limpa.startsWith('•') || limpa.startsWith('-')) {
      // Item de lista
      const texto = limpa.replace(/^[•\-]\s*/, '')
      doc.text(`• ${texto}`, margin + 12, doc.y, { width: pageWidth - margin * 2 - 12 })
    } else {
      doc.text(limpa, margin, doc.y, { width: pageWidth - margin * 2 })
    }
  }

  // ── RODAPÉ ─────────────────────────────────────────────────
  doc.moveDown(2)
  const rodapeY = doc.y
  doc.moveTo(margin, rodapeY).lineTo(pageWidth - margin, rodapeY).strokeColor('#cccccc').lineWidth(0.5).stroke()
  doc.moveDown(0.5)
  doc.fontSize(8).fillColor('#999999')
    .text(`Versao ${codigo.versao}  |  Gerado em ${new Date().toLocaleDateString('pt-BR')}  |  ${nomeEmpresa}`, margin, doc.y, { align: 'center', width: pageWidth - margin * 2 })

  doc.end()

  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })
})
