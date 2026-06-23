import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID do documento não fornecido' })
  }

  // Buscar documento apenas do funcionário logado
  const { data: doc, error } = await supabase
    .from('funcionario_documentos')
    .select('*')
    .eq('id', id)
    .eq('funcionario_id', user.id)
    .single()

  if (error || !doc) {
    throw createError({ statusCode: 404, message: 'Documento não encontrado' })
  }

  // Processar o conteúdo do documento (bytea do PostgreSQL)
  let buffer: Buffer
  
  if (typeof doc.conteudo === 'string') {
    const hexStr = doc.conteudo.replace(/^\\x/, '')
    buffer = Buffer.from(hexStr, 'hex')
  } else if (Buffer.isBuffer(doc.conteudo)) {
    buffer = doc.conteudo
  } else {
    buffer = Buffer.from(doc.conteudo)
  }

  // Configurar headers para visualização inline (abrir no navegador)
  setResponseHeaders(event, {
    'Content-Type': doc.tipo_arquivo || 'application/octet-stream',
    'Content-Disposition': `inline; filename="${encodeURIComponent(doc.nome_original)}"`,
    'Content-Length': String(buffer.length),
    'Cache-Control': 'private, max-age=300'
  })

  return buffer
})
