<template>
  <AnimatedModal v-model:open="mostrarInterno">
    <AnimatedModalBody
      class="max-w-2xl"
      :show-close="true"
      :close-on-outside="false"
    >
      <form @submit.prevent="criarAviso" class="flex flex-col h-full">
        <AnimatedModalContent class="flex-1 overflow-y-auto space-y-4">
          <!-- Header -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              📢 Criar Aviso Rápido
            </h2>
            <p class="text-sm text-gray-600 mt-2">Envie um comunicado para todos os funcionários</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Título <span class="text-red-500">*</span>
            </label>
            <input
              v-model="novoAviso.titulo"
              type="text"
              maxlength="200"
              placeholder="Ex: 📢 Reunião importante na sexta-feira"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              {{ novoAviso.titulo.length }}/200 caracteres
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="novoAviso.descricao"
              rows="6"
              placeholder="Escreva a mensagem completa... Você pode usar emojis! 😊"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            ></textarea>
          </div>

          <div class="text-center pt-2">
            <label class="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                v-model="naoMostrarNovamente"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Não mostrar novamente
            </label>
          </div>
        </AnimatedModalContent>

        <AnimatedModalFooter class="flex gap-3">
          <button
            type="button"
            @click="pularAgora"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Pular por Agora
          </button>
          <button
            type="submit"
            :disabled="criando"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ criando ? 'Criando...' : 'Criar Aviso' }}
          </button>
        </AnimatedModalFooter>
      </form>
    </AnimatedModalBody>
  </AnimatedModal>
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
}>()

const emit = defineEmits<{
  fechar: []
}>()

const { criarAviso: criarAvisoAPI } = useAvisos()

const novoAviso = ref({
  titulo: '',
  descricao: ''
})

const criando = ref(false)
const naoMostrarNovamente = ref(false)

// Computed para sincronizar com a prop
const mostrarInterno = computed({
  get() {
    return props.mostrar
  },
  set(value) {
    if (!value) {
      emit('fechar')
    }
  }
})

const criarAviso = async () => {
  if (!novoAviso.value.titulo.trim() || !novoAviso.value.descricao.trim()) {
    return
  }

  criando.value = true
  const result = await criarAvisoAPI(novoAviso.value.titulo, novoAviso.value.descricao)
  
  if (result.success) {
    // Salvar preferência se marcado
    if (naoMostrarNovamente.value) {
      localStorage.setItem('nao_mostrar_popup_aviso_admin', 'true')
    }
    
    // Limpar formulário
    novoAviso.value = { titulo: '', descricao: '' }
    
    // Fechar modal
    emit('fechar')
  }
  
  criando.value = false
}

const pularAgora = () => {
  // Salvar preferência se marcado
  if (naoMostrarNovamente.value) {
    localStorage.setItem('nao_mostrar_popup_aviso_admin', 'true')
  }
  
  emit('fechar')
}
</script>
