<template>
  <Teleport to="body">
    <div 
      v-if="avisoSelecionado"
      class="fixed inset-0 z-[9999] overflow-y-auto" 
      style="background: rgba(0,0,0,0.5);"
      @click="fechar"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Modal -->
        <div 
          class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" 
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              📢 {{ avisoSelecionado.titulo }}
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
            <div class="bg-gray-50 p-5 rounded-lg mb-6">
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>👤 {{ avisoSelecionado.criador?.nome_completo || 'Admin' }}</span>
                <span>{{ formatarData(avisoSelecionado.criado_em) }}</span>
              </div>
              <div class="text-gray-700 whitespace-pre-wrap">{{ avisoSelecionado.descricao }}</div>
            </div>

            <!-- Comentários -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                💬 Comentários
                <span v-if="comentarios.length > 0" class="text-sm font-normal text-gray-500">
                  ({{ comentarios.length }})
                </span>
              </h3>

              <!-- Loading -->
              <div v-if="loadingComentarios" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              <!-- Sem comentários -->
              <div v-else-if="comentarios.length === 0" class="text-center py-8 text-gray-500">
                <p>Nenhum comentário ainda. Seja o primeiro!</p>
              </div>

              <!-- Lista de Comentários -->
              <div v-else class="space-y-4 mb-6">
                <div
                  v-for="comentario in comentarios"
                  :key="comentario.id"
                  class="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium text-gray-900">
                      {{ comentario.autor?.nome_completo || 'Usuário' }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ formatarDataComentario(comentario.criado_em) }}
                    </span>
                  </div>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ comentario.comentario }}</p>
                </div>
              </div>

              <!-- Formulário de Novo Comentário -->
              <div class="mt-6 pt-4 border-t border-gray-200">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
console.log('🟢 [MODAL-AVISOS] === COMPONENTE CRIADO ===')

const props = defineProps<{
  avisoSelecionado?: any | null
}>()

const emit = defineEmits<{
  fechar: []
}>()

const { fetchComentarios, adicionarComentario } = useAvisos()

const comentarios = ref<any[]>([])
const novoComentario = ref('')
const loadingComentarios = ref(false)
const loadingComentario = ref(false)

// Usar composable de formatação de datas
const { formatarDataRelativa, formatarDataComentario } = useFormatarData()

const fechar = () => {
  console.log('🟢 [MODAL-AVISOS] Fechando modal')
  emit('fechar')
}

const formatarData = formatarDataRelativa

const carregarComentarios = async () => {
  if (!props.avisoSelecionado) return
  
  loadingComentarios.value = true
  try {
    console.log('🟢 [MODAL-AVISOS] Carregando comentários...')
    const result = await fetchComentarios(props.avisoSelecionado.id.toString())
    if (result.success) {
      comentarios.value = result.comentarios
      console.log('🟢 [MODAL-AVISOS] Comentários carregados:', comentarios.value.length)
    }
  } catch (error) {
    console.error('❌ [MODAL-AVISOS] Erro ao carregar comentários:', error)
  } finally {
    loadingComentarios.value = false
  }
}

const enviarComentario = async () => {
  console.log('🟢 [MODAL-AVISOS] Enviando comentário...')
  
  if (!novoComentario.value.trim()) {
    console.log('🟢 [MODAL-AVISOS] Comentário vazio')
    return
  }

  if (!props.avisoSelecionado) {
    console.error('❌ [MODAL-AVISOS] Nenhum aviso selecionado')
    return
  }

  loadingComentario.value = true
  try {
    const result = await adicionarComentario(props.avisoSelecionado.id.toString(), novoComentario.value)
    console.log('🟢 [MODAL-AVISOS] Resultado:', result)
    
    if (result.success) {
      console.log('✅ [MODAL-AVISOS] Comentário enviado!')
      novoComentario.value = ''
      await carregarComentarios()
    } else {
      console.error('❌ [MODAL-AVISOS] Erro:', result.message)
      alert(result.message || 'Erro ao enviar comentário')
    }
  } catch (error) {
    console.error('❌ [MODAL-AVISOS] Erro:', error)
    alert('Erro ao enviar comentário')
  } finally {
    loadingComentario.value = false
  }
}

// Watch para avisoSelecionado
watch(() => props.avisoSelecionado, (novoAviso) => {
  console.log('🟢 [MODAL-AVISOS] avisoSelecionado mudou:', novoAviso)
  if (novoAviso) {
    carregarComentarios()
  }
}, { immediate: true })

onMounted(() => {
  console.log('🟢 [MODAL-AVISOS] === COMPONENTE MONTADO ===')
  console.log('🟢 [MODAL-AVISOS] avisoSelecionado:', props.avisoSelecionado)
})
</script>
