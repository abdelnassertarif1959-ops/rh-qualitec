<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="$emit('fechar')"
        ></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden z-10">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ aviso.titulo }}
            </h2>
            <button
              @click="$emit('fechar')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            <!-- Conteúdo do aviso -->
            <div class="bg-gray-50 p-5 rounded-lg mb-6">
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span class="flex items-center gap-1">
                  👤 {{ aviso.criador?.nome_completo || 'Admin' }}
                </span>
                <span>{{ formatarData(aviso.created_at) }}</span>
              </div>

              <div class="text-gray-700 whitespace-pre-wrap">{{ aviso.descricao }}</div>
            </div>

            <!-- Seção de comentários -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                💬 Comentários
                <span v-if="comentarios.length > 0" class="text-sm font-normal text-gray-500">
                  ({{ comentarios.length }})
                </span>
              </h3>

              <!-- Formulário de novo comentário -->
              <div class="mb-6">
                <textarea
                  v-model="novoComentario"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Escreva seu comentário... (você pode usar emojis 😊)"
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

              <!-- Loading comentários -->
              <div v-if="loadingComentarios" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              <!-- Sem comentários -->
              <div v-else-if="comentarios.length === 0" class="text-center py-8 text-gray-500">
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>

              <!-- Lista de comentários -->
              <div v-else class="space-y-4">
                <div
                  v-for="comentario in comentarios"
                  :key="comentario.id"
                  class="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  aviso: any
}>()

const emit = defineEmits<{
  fechar: []
}>()

const { fetchComentarios, adicionarComentario } = useAvisos()

const comentarios = ref<any[]>([])
const novoComentario = ref('')
const loadingComentarios = ref(false)
const loadingComentario = ref(false)

const formatarData = (data: string) => {
  const date = new Date(data)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const carregarComentarios = async () => {
  loadingComentarios.value = true
  try {
    const result = await fetchComentarios(props.aviso.id.toString())
    if (result.success) {
      comentarios.value = result.comentarios
    }
  } catch (error) {
    console.error('Erro ao carregar comentários:', error)
  } finally {
    loadingComentarios.value = false
  }
}

const enviarComentario = async () => {
  console.log('🟣 [AVISO-DETALHES] Enviando comentário...')
  console.log('🟣 [AVISO-DETALHES] Comentário:', novoComentario.value)
  
  if (!novoComentario.value.trim()) {
    console.log('🟣 [AVISO-DETALHES] Comentário vazio, abortando')
    return
  }

  loadingComentario.value = true
  try {
    console.log('🟣 [AVISO-DETALHES] Chamando adicionarComentario...')
    const result = await adicionarComentario(props.aviso.id.toString(), novoComentario.value)
    console.log('🟣 [AVISO-DETALHES] Resultado:', result)
    
    if (result.success) {
      console.log('✅ [AVISO-DETALHES] Comentário enviado com sucesso')
      novoComentario.value = ''
      await carregarComentarios()
    } else {
      console.error('❌ [AVISO-DETALHES] Erro ao enviar:', result.message)
      alert(result.message || 'Erro ao enviar comentário')
    }
  } catch (error) {
    console.error('❌ [AVISO-DETALHES] Erro ao enviar comentário:', error)
    alert('Erro ao enviar comentário')
  } finally {
    loadingComentario.value = false
  }
}

onMounted(() => {
  console.log('🟣 [AVISO-DETALHES] Componente montado')
  console.log('🟣 [AVISO-DETALHES] Aviso:', props.aviso)
  carregarComentarios()
})
</script>
