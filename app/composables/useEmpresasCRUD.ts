// Operações CRUD para empresas
import type { Empresa } from './useEmpresas'

export const useEmpresasCRUD = () => {
  const { empresas, carregarEmpresas } = useEmpresas()

  // Salvar empresa (criar ou atualizar)
  const salvarEmpresa = async (empresa: Partial<Empresa>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await $fetch('/api/empresas', {
        method: 'POST',
        body: empresa
      })

      if (response.success) {
        // Recarregar lista de empresas
        await carregarEmpresas()
        return { success: true, message: response.message || 'Empresa salva com sucesso!' }
      }

      return { success: false, message: 'Erro ao salvar empresa' }
    } catch (err: any) {
      console.error('❌ Erro ao salvar empresa:', err)
      return { success: false, message: err.data?.message || 'Erro ao salvar empresa' }
    }
  }

  // Atualizar empresa existente
  const atualizarEmpresa = async (id: string, dados: Partial<Empresa>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await $fetch(`/api/empresas/${id}`, {
        method: 'PATCH',
        body: dados
      })

      if (response.success) {
        // Atualizar na lista local
        const index = empresas.value.findIndex(e => e.id === id)
        if (index !== -1) {
          empresas.value[index] = { ...empresas.value[index], ...dados }
        }
        return { success: true, message: 'Empresa atualizada com sucesso!' }
      }

      return { success: false, message: 'Erro ao atualizar empresa' }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar empresa:', err)
      return { success: false, message: err.data?.message || 'Erro ao atualizar empresa' }
    }
  }

  // Deletar empresa
  const deletarEmpresa = async (empresaId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await $fetch(`/api/empresas/${empresaId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Remover da lista local
        const index = empresas.value.findIndex(e => e.id === empresaId)
        if (index !== -1) {
          empresas.value.splice(index, 1)
        }
        return { success: true, message: 'Empresa excluída com sucesso!' }
      }

      return { success: false, message: 'Erro ao excluir empresa' }
    } catch (err: any) {
      console.error('❌ Erro ao excluir empresa:', err)
      return { success: false, message: err.data?.message || 'Erro ao excluir empresa' }
    }
  }

  // Ativar/desativar empresa
  const toggleEmpresaAtiva = async (empresaId: string): Promise<{ success: boolean; message: string }> => {
    const empresa = empresas.value.find(e => e.id === empresaId)
    if (!empresa) {
      return { success: false, message: 'Empresa não encontrada' }
    }

    return await atualizarEmpresa(empresaId, { ativo: !empresa.ativo })
  }

  return {
    salvarEmpresa,
    atualizarEmpresa,
    deletarEmpresa,
    toggleEmpresaAtiva
  }
}
