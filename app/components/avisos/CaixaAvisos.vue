<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
          <span class="font-semibold text-gray-900">Avisos e Comunicados</span>
        </div>
        <UiBadge v-if="avisos.length > 0" variant="info">
          {{ avisos.length }} {{ avisos.length === 1 ? 'aviso' : 'avisos' }}
        </UiBadge>
      </div>
    </template>

    <div v-if="carregando" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Carregando avisos...</p>
    </div>

    <div v-else-if="avisos.length === 0" class="text-center py-8 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <p class="font-medium">Nenhum aviso no momento</p>
      <p class="text-sm mt-1">Quando houver novos comunicados, eles aparecerão aqui</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="aviso in avisos.slice(0, 3)" 
        :key="aviso.id"
        class="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
        @click="abrirAviso(aviso)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">{{ aviso.titulo }}</h4>
            <p class="text-sm text-gray-600 line-clamp-2">{{ aviso.descricao }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{{ formatarData(aviso.created_at) }}</span>
              <span v-if="aviso.total_comentarios > 0" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                {{ aviso.total_comentarios }}
              </span>
            </div>
          </div>
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <UiButton 
        v-if="avisos.length > 3"
        variant="secondary" 
        class="w-full"
        @click="verTodos"
      >
        Ver todos os avisos ({{ avisos.length }})
      </UiButton>
    </div>

    <!-- Modal de Avisos -->
    <AvisosModalAvisos 
      v-if="modalAberto"
      :aviso-selecionado="avisoSelecionado"
      @fechar="fecharModal"
    />
  </UiCard>
</template>

<script setup lang="ts">
const { buscarAvisos } = useAvisos()
const { formatarDataRelativa } = useFormatarData()

const avisos = ref<any[]>([])
const carregando = ref(true)
const modalAberto = ref(false)
const avisoSelecionado = ref<any>(null)

const carregarAvisos = async () => {
  try {
    carregando.value = true
    avisos.value = await buscarAvisos()
  } catch (error) {
    console.error('Erro ao carregar avisos:', error)
  } finally {
    carregando.value = false
  }
}

const abrirAviso = (aviso: any) => {
  console.log('🔵 [CAIXA-AVISOS] Abrindo aviso:', aviso)
  console.log('🔵 [CAIXA-AVISOS] modalAberto ANTES:', modalAberto.value)
  avisoSelecionado.value = aviso
  modalAberto.value = true
  console.log('🔵 [CAIXA-AVISOS] modalAberto DEPOIS:', modalAberto.value)
  console.log('🔵 [CAIXA-AVISOS] Aviso selecionado:', avisoSelecionado.value)
  
  // Verificar se o modal vai ser renderizado
  nextTick(() => {
    console.log('🔵 [CAIXA-AVISOS] nextTick - Modal deve estar renderizado agora')
    console.log('🔵 [CAIXA-AVISOS] modalAberto no nextTick:', modalAberto.value)
  })
}

const fecharModal = () => {
  console.log('🔵 [CAIXA-AVISOS] Fechando modal')
  modalAberto.value = false
  avisoSelecionado.value = null
}

const verTodos = () => {
  avisoSelecionado.value = null
  modalAberto.value = true
}

const formatarData = formatarDataRelativa

onMounted(() => {
  carregarAvisos()
})
</script>
