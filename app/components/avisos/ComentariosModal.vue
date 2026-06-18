<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Comentários</h3>
        <button
          @click="$emit('fechar')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Lista de comentários -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-500 mt-2">Carregando comentários...</p>
        </div>

        <div v-else-if="comentarios.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-gray-500">Nenhum comentário ainda</p>
          <p class="text-sm text-gray-400 mt-1">Seja o primeiro a comentar!</p>
        </div>

        <div v-else>
          <div
            v-for="comentario in comentarios"
            :key="comentario.id"
            class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <img 
                  v-if="comentario.autor?.avatar" 
                  :src="comentario.autor.avatar" 
                  :alt="comentario.autor.nome_completo"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span v-else class="text-gray-600 font-semibold">
                  {{ comentario.autor?.nome_completo?.charAt(0) || 'U' }}
                </span>
              </div>
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-900 text-sm">
                    {{ comentario.autor?.nome_completo }}
                  </span>
                  <span
                    v-if="comentario.autor?.tipo_usuario === 'admin'"
                    class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    Admin
                  </span>
                </div>
                <button
                  v-if="podeExcluir(comentario)"
                  @click="excluirComentario(comentario.id)"
                  class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Excluir comentário"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-500 mb-1">
                {{ formatarData(comentario.criado_em) }}
              </p>
              <p class="text-gray-700 whitespace-pre-wrap break-words">
                {{ comentario.comentario }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form de novo comentário -->
      <div class="p-4 border-t border-gray-200">
        <form @submit.prevent="enviarComentario" class="flex gap-2">
          <textarea
            v-model="novoComentario"
            placeholder="Escreva um comentário... 💬"
            rows="2"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            :disabled="enviando"
          ></textarea>
          <button
            type="submit"
            :disabled="!novoComentario.trim() || enviando"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors self-end"
          >
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  avisoId: string | null
}>()

const emit = defineEmits(['fechar'])

const { user } = useAuth()
const { fetchComentarios, adicionarComentario, deletarComentario } = useAvisos()

const comentarios = ref<any[]>([])
const loading = ref(false)
const novoComentario = ref('')
const enviando = ref(false)

// Carregar comentários quando o modal abrir
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.avisoId) {
    await carregarComentarios()
  }
})

const carregarComentarios = async () => {
  if (!props.avisoId) return

  loading.value = true
  const result = await fetchComentarios(props.avisoId)
  if (result.success) {
    comentarios.value = result.comentarios
  }
  loading.value = false
}

const enviarComentario = async () => {
  if (!props.avisoId || !novoComentario.value.trim()) return

  enviando.value = true
  const result = await adicionarComentario(props.avisoId, novoComentario.value)
  
  if (result.success) {
    novoComentario.value = ''
    await carregarComentarios()
  }
  
  enviando.value = false
}

const excluirComentario = async (comentarioId: string) => {
  if (!confirm('Deseja realmente excluir este comentário?')) return

  const result = await deletarComentario(comentarioId)
  if (result.success) {
    await carregarComentarios()
  }
}

const podeExcluir = (comentario: any) => {
  if (!user.value) return false
  return user.value.tipo_usuario === 'admin' || comentario.usuario_id === user.value.id
}

const formatarData = (data: string) => {
  const date = new Date(data)
  const agora = new Date()
  const diff = agora.getTime() - date.getTime()
  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(diff / 3600000)
  const dias = Math.floor(diff / 86400000)

  if (minutos < 1) return 'Agora'
  if (minutos < 60) return `${minutos}min atrás`
  if (horas < 24) return `${horas}h atrás`
  if (dias < 7) return `${dias}d atrás`
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
