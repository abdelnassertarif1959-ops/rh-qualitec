import { ref } from 'vue'

export function useEmailIndividual() {
  const loading = ref(false)
  const erro = ref<string | null>(null)
  const sucesso = ref<string | null>(null)

  const enviarEmailIndividual = async (payload: {
    funcionario_id: number
    assunto: string
    mensagem: string
  }) => {
    loading.value = true
    erro.value = null
    sucesso.value = null

    try {
      const res = await $fetch<{ success: boolean; message: string }>('/api/email/enviar-individual', {
        method: 'POST',
        body: payload
      })
      sucesso.value = res.message
      return true
    } catch (e: any) {
      erro.value = e?.data?.message || 'Erro ao enviar email'
      return false
    } finally {
      loading.value = false
    }
  }

  const resetar = () => {
    erro.value = null
    sucesso.value = null
  }

  return { loading, erro, sucesso, enviarEmailIndividual, resetar }
}
