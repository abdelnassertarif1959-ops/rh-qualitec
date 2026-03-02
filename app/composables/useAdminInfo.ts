// Composable para acessar informações computadas da admin
export const useAdminInfo = () => {
  const { adminInfo } = useAdmin()

  // Obter nome da admin para sugestão
  const nomeAdmin = computed(() => {
    return adminInfo.value?.nome || 'Silvana Qualitec'
  })

  // Obter ID da admin
  const idAdmin = computed(() => {
    return adminInfo.value?.id || null
  })

  // Obter email da admin
  const emailAdmin = computed(() => {
    return adminInfo.value?.email || 'silvana@qualitec.com.br'
  })

  return {
    nomeAdmin,
    idAdmin,
    emailAdmin
  }
}
