<template>
  <AnimatedModal v-model:open="mostrarInterno">
    <AnimatedModalBody
      class="max-w-3xl"
      :show-close="true"
    >
      <AnimatedModalContent class="flex-1 overflow-y-auto">
        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            📢 Novos Avisos
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ avisosRecentes.length }} {{ avisosRecentes.length === 1 ? 'novo aviso' : 'novos avisos' }} para você
          </p>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <div
            v-for="aviso in avisosRecentes"
            :key="aviso.id"
            class="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ aviso.titulo }}</h3>
            <p class="text-gray-700 mb-3 whitespace-pre-wrap">{{ aviso.descricao }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>{{ formatarData(aviso.created_at) }}</span>
              <button
                @click="abrirComentarios(aviso)"
                class="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Ver comentários
              </button>
            </div>
          </div>
        </div>

        <!-- Info -->
        <p class="text-xs text-gray-500 text-center mt-6">
          Este popup aparece apenas uma vez por sessão
        </p>
      </AnimatedModalContent>

      <AnimatedModalFooter>
        <button
          @click="fechar"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Entendi
        </button>
      </AnimatedModalFooter>
    </AnimatedModalBody>
  </AnimatedModal>

  <!-- Modal de Comentários -->
  <AvisosModalAvisos 
    :aberto="modalComentariosAberto"
    :aviso-selecionado="avisoSelecionado"
    @fechar="fecharComentarios"
  />
</template>

<script setup lang="ts">
import {
  AnimatedModal,
  AnimatedModalBody,
  AnimatedModalContent,
  AnimatedModalFooter,
} from '~/components/ui/animated-modal'

const props = defineProps<{
  mostrar: boolean
  avisosRecentes: any[]
}>()

const emit = defineEmits<{
  fechar: []
}>()

const { formatarDataRelativa } = useFormatarData()

const modalComentariosAberto = ref(false)
const avisoSelecionado = ref<any>(null)

const formatarData = formatarDataRelativa

// Sincronizar prop com estado interno e só mostrar se houver avisos
const mostrarInterno = computed({
  get: () => props.mostrar && props.avisosRecentes.length > 0,
  set: (value) => {
    if (!value) {
      fechar()
    }
  }
})

const abrirComentarios = (aviso: any) => {
  avisoSelecionado.value = aviso
  modalComentariosAberto.value = true
}

const fecharComentarios = () => {
  modalComentariosAberto.value = false
  avisoSelecionado.value = null
}

const fechar = () => {
  // Marcar como visualizado nesta sessão
  sessionStorage.setItem('avisos_visualizados', 'true')
  emit('fechar')
}
</script>
