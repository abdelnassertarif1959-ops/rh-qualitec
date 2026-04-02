import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = serverSupabaseServiceRole(event)

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'Nenhum arquivo enviado' })
  }

  // Extrair funcionario_id e arquivo
  const funcionarioIdField = formData.find(f => f.name === 'funcionario_id')
  const arquivo = formData.find(f => f.name === 'file')

  if (!funcionarioIdField?.data) {
    throw createError({ statusCode: 400, message: 'funcionario_id é obrigatório' })
  }
  if (!arquivo?.filename || !arquivo?.data) {
    throw createError({ statusCode: 400, message: 'Arquivo inválido' })
  }

  const funcionarioId = Number(funcionarioIdField.data.toString())
  if (isNaN(funcionarioId)) {
    throw createError({ statusCode: 400, message: 'funcionario_id inválido' })
  }

  const MAX_SIZE = 10 * 1024 * 1024
  if (arquivo.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, message: 'Arquivo muito grande. Máximo 10MB.' })
  }

  const hexConteudo = '\\x' + arquivo.data.toString('hex')

  const { data, error } = await supabase
    .from('funcionario_documentos')
    .insert({
      funcionario_id: funcionarioId,
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
