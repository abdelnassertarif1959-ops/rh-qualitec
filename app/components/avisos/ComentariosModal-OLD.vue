<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[9999] overflow-y-auto" style="background: rgba(0,0,0,0.5);">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              📢 {{ avisoDetalhes ? avisoDetalhes.titulo : 'Avisos e Comunicados' }}
            </h2>
            <button
              @click="fechar"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            <!-- Detalhes do Aviso -->
            <div v-if="avisoDetalhes">
              <div class="bg-gray-50 p-5 rounded-lg mb-6">
                <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>👤 {{ avisoDetalhes.criador?.nome_completo || 'Admin' }}</span>
                  <span>{{ formatarData(avisoDetalhes.created_at) }}</span>
                </div>
                <div class="text-gray-700 whitespace-pre-wrap">{{ avisoDetalhes.descricao }}</div>
              </div>

              <!-- Comentários -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  💬 Comentários
                  <span v-if="comentarios.length > 0" class="text-sm font-normal text-gray-500">
                    ({{ comentarios.length }})
                  </span>
                </h3>

                <!-- Formulário -->
                <div class="mb-6">
                  <textarea
                    v-model="novoComentario"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Escreva seu comentário... 😊"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                      @click="enviarComentario"
                      :disabled="!novoComentario.trim() || loadingComentario"
                      class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      {{ loadingComentario ? 'Enviando...' : 'Comentar' }}
                    </button>
                  </div>
                </div>

                <!-- Loading -->
                <div v-if="loadingComentarios" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>

                <!-- Sem comentários -->
                <div v-else-if="comentarios.length === 0" class="text-center py-8 text-gray-500">
                  <p>Nenhum comentário ainda. Seja o primeiro!</p>
                </div>

                <!-- Lista -->
                <div v-else class="space-y-4">
                  <div
                    v-for="comentario in comentarios"
                    :key="comentario.id"
                    class="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-medium text-gray-900">
                        {{ comentario.funcionario?.nome_completo || 'Usuário' }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatarDataComentario(comentario.created_at) }}
                      </span>
                    </div>
                    <p class="text-gray-700 whitespace-pre-wrap">{{ comentario.comentario }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lista de Avisos -->
            <div v-else>
              <div v-if="carregando" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Carregando...</p>
              </div>

              <div v-else-if="avisos.length === 0" class="text-center py-12 text-gray-500">
                <p>Nenhum aviso no momento</p>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="aviso in avisos" 
                  :key="aviso.id"
                  class="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  @click="abrirDetalhes(aviso)"
                >
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ aviso.titulo }}</h3>
                  <p class="text-gray-600 mb-4">{{ aviso.descricao }}</p>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span>{{ formatarData(aviso.created_at) }}</span>
                    <span v-if="aviso.total_comentarios > 0">
                      💬 {{ aviso.total_comentarios }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
console.log('🟢 [AVISOS-MODAL] === COMPONENTE CRIADO ===')

const props = defineProps<{
  avisoSelecionado?: any | null
}>()

console.log('🟢 [AVISOS-MODAL] Props:', props)

const emit = defineEmits<{
  fechar: []
}>()

const { buscarAvisos, fetchComentarios, adicionarComentario } = useAvisos()

const avisos = ref<any[]>([])
const carregando = ref(true)
const avisoDetalhes = ref<any>(null)
const comentarios = ref<any[]>([])
const novoComentario = ref('')
const loadingComentarios = ref(false)
const loadingComentario = ref(false)

const fechar = () => {
  console.log('🟢 [AVISOS-MODAL] Fechando modal')
  emit('fechar')
}

const formatarData = (data: string) => {
  const date = new Date(data)
  const agora = new Date()
  const diff = agora.getTime() - date.getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  if (dias < 7) return `${dias} dias atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatarDataComentario = (data: string) => {
  const date = new Date(data)
  const agora = new Date()
  const diff = agora.getTime() - date.getTime()
  const minutos = Math.floor(diff / (1000 * 60))
  const horas = Math.floor(diff / (1000 * 60 * 60))
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutos < 1) return 'Agora'
  if (minutos < 60) return `${minutos}min atrás`
  if (horas < 24) return `${horas}h atrás`
  if (dias < 7) return `${dias}d atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const carregarAvisos = async () => {
  try {
    carregando.value = true
    avisos.value = await buscarAvisos()
    console.log('🟢 [AVISOS-MODAL] Avisos carregados:', avisos.value.length)
  } catch (error) {
    console.error('❌ [AVISOS-MODAL] Erro ao carregar avisos:', error)
  } finally {
    carregando.value = false
  }
}

const carregarComentarios = async () => {
  if (!avisoDetalhes.value) return
  
  loadingComentarios.value = true
  try {
    console.log('🟢 [AVISOS-MODAL] Carregando comentários...')
    const result = await fetchComentarios(avisoDetalhes.value.id.toString())
    if (result.success) {
      comentarios.value = result.comentarios
      console.log('🟢 [AVISOS-MODAL] Comentários carregados:', comentarios.value.length)
    }
  } catch (error) {
    console.error('❌ [AVISOS-MODAL] Erro ao carregar comentários:', error)
  } finally {
    loadingComentarios.value = false
  }
}

const enviarComentario = async () => {
  console.log('🟢 [AVISOS-MODAL] Enviando comentário...')
  
  if (!novoComentario.value.trim()) {
    console.log('🟢 [AVISOS-MODAL] Comentário vazio')
    return
  }

  if (!avisoDetalhes.value) {
    console.error('❌ [AVISOS-MODAL] Nenhum aviso selecionado')
    return
  }

  loadingComentario.value = true
  try {
    const result = await adicionarComentario(avisoDetalhes.value.id.toString(), novoComentario.value)
    console.log('🟢 [AVISOS-MODAL] Resultado:', result)
    
    if (result.success) {
      console.log('✅ [AVISOS-MODAL] Comentário enviado!')
      novoComentario.value = ''
      await carregarComentarios()
    } else {
      console.error('❌ [AVISOS-MODAL] Erro:', result.message)
      alert(result.message || 'Erro ao enviar comentário')
    }
  } catch (error) {
    console.error('❌ [AVISOS-MODAL] Erro:', error)
    alert('Erro ao enviar comentário')
  } finally {
    loadingComentario.value = false
  }
}

const abrirDetalhes = (aviso: any) => {
  console.log('🟢 [AVISOS-MODAL] Abrindo detalhes:', aviso.titulo)
  avisoDetalhes.value = aviso
}

// Watch para avisoSelecionado
watch(() => props.avisoSelecionado, (novoAviso) => {
  console.log('🟢 [AVISOS-MODAL] avisoSelecionado mudou:', novoAviso)
  if (novoAviso) {
    avisoDetalhes.value = novoAviso
  }
}, { immediate: true })

// Watch para avisoDetalhes
watch(avisoDetalhes, (novoAviso) => {
  console.log('🟢 [AVISOS-MODAL] avisoDetalhes mudou:', novoAviso)
  if (novoAviso) {
    carregarComentarios()
  }
})

onMounted(() => {
  console.log('🟢 [AVISOS-MODAL] === COMPONENTE MONTADO ===')
  console.log('🟢 [AVISOS-MODAL] avisoSelecionado:', props.avisoSelecionado)
  
  if (props.avisoSelecionado) {
    avisoDetalhes.value = props.avisoSelecionado
  } else {
    carregarAvisos()
  }
})
</script>
