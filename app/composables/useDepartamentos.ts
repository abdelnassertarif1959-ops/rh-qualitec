export const useDepartamentos = () => {
  const departamentos = ref([])
  const loading = ref(false)

  const carregarDepartamentos = async () => {
    loading.value = true
    try {
      const resultado: any = await $fetch('/api/departamentos')
      
      if (resultado.success && resultado.data) {
        departamentos.value = Array.isArray(resultado.data) ? resultado.data : []
        console.log('✅ Departamentos carregados:', departamentos.value.length)
      } else {
        departamentos.value = []
      }
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error)
      departamentos.value = []
    } finally {
      loading.value = false
    }
  }

  const opcoesDepartamentos = computed(() => {
    if (!Array.isArray(departamentos.value)) {
      return []
    }
    return departamentos.value.map((dep: any) => ({
      value: dep.id.toString(),
      label: dep.nome
    }))
  })

  return {
    departamentos,
    loading,
    carregarDepartamentos,
    opcoesDepartamentos
  }
}
