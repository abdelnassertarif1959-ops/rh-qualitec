import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = serverSupabaseServiceRole(event)

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'Nenhum arquivo enviado' })
  }

  const arquivo = formData[0]
  if (!arquivo.filename || !arquivo.data) {
    throw createError({ statusCode: 400, message: 'Arquivo inválido' })
  }

  const tituloField = formData.find(f => f.name === 'titulo')
  const descricaoField = formData.find(f => f.name === 'descricao')
  const tipoIdField = formData.find(f => f.name === 'tipo_id')
  const dataReferenciaField = formData.find(f => f.name === 'data_referencia')

  const titulo = tituloField?.data?.toString()?.trim() || null
  const descricao = descricaoField?.data?.toString()?.trim() || null
  const tipoId = tipoIdField?.data ? Number(tipoIdField.data.toString()) : null
  const dataReferencia = dataReferenciaField?.data?.toString()?.trim() || null

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  if (arquivo.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, message: 'Arquivo muito grande. Máximo 10MB.' })
  }

  // Converter buffer para hex string para inserir como bytea no PostgreSQL
  const hexConteudo = '\\x' + arquivo.data.toString('hex')

  const { data, error } = await (supabase as any)
    .from('funcionario_documentos')
    .insert({
      funcionario_id: user.id,
      nome_original: arquivo.filename,
      tipo_arquivo: arquivo.type || 'application/octet-stream',
      tamanho_bytes: arquivo.data.length,
      conteudo: hexConteudo,
      titulo,
      descricao,
      tipo_id: tipoId && !isNaN(tipoId) ? tipoId : null,
      data_referencia: dataReferencia
    })
    .select('id, nome_original, tipo_arquivo, tamanho_bytes, criado_em, titulo, descricao, tipo_id, data_referencia')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
