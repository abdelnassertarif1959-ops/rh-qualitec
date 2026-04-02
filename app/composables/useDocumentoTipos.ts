export const useDocumentoTipos = () => {
  const tipos = useState<Array<{ id: number; nome: string; descricao_padrao: string | null; ativo: boolean }>>('documento-tipos', () => [])
  const carregado = useState('documento-tipos-carregado', () => false)

  const carregar = async () => {
    if (carregado.value) return
    try {
      const res = await $fetch<{ data: any[] }>('/api/admin/documento-tipos')
      tipos.value = (res.data || []).filter(t => t.ativo)
      carregado.value = true
    } catch (e) {
      console.error('Erro ao carregar tipos de documentos:', e)
    }
  }

  // Auto-carregar na primeira vez
  if (process.client && !carregado.value) {
    carregar()
  }

  return { tipos, carregar }
}
