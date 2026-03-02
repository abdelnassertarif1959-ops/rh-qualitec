// Composable para gerenciar dados da admin
export const useAdmin = () => {
  const adminInfo = ref<any>(null)
  const loading = ref(false)

  // Buscar informações da admin (Silvana)
  const buscarAdmin = async () => {
    console.log('📡 [useAdmin] Buscando informações da admin...')
    loading.value = true
    try {
      const { data } = await useFetch('/api/admin/info')
      console.log('✅ [useAdmin] Resposta recebida:', data.value)
      
      if (data.value?.success) {
        adminInfo.value = data.value.data
        console.log('✅ [useAdmin] Admin carregada:', adminInfo.value)
      } else {
        console.log('⚠️ [useAdmin] Resposta sem sucesso')
      }
    } catch (error) {
      console.error('❌ [useAdmin] Erro ao buscar admin:', error)
    } finally {
      loading.value = false
    }
  }

  // Computed para nome da admin
  const nomeAdmin = computed(() => {
    return adminInfo.value?.nome_completo || 'Admin'
  })

  // Computed para email da admin
  const emailAdmin = computed(() => {
    return adminInfo.value?.email_login || ''
  })

  return {
    adminInfo: readonly(adminInfo),
    nomeAdmin,
    emailAdmin,
    loading: readonly(loading),
    buscarAdmin
  }
}
