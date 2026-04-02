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
      conteudo: hexConteudo
    })
    .select('id, nome_original, tipo_arquivo, tamanho_bytes, criado_em')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true, data }
})
