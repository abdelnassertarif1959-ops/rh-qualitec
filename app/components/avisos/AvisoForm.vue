<template>
  <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ aviso ? 'Editar Aviso' : 'Novo Aviso' }}
    </h3>

    <form @submit.prevent="salvar" class="space-y-4">
      <!-- Título -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          v-model="form.titulo"
          type="text"
          maxlength="200"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o título do aviso"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ form.titulo.length }}/200 caracteres
        </p>
      </div>

      <!-- Descrição -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Descrição * (você pode usar emojis 😊)
        </label>
        <textarea
          v-model="form.descricao"
          rows="6"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Digite a descrição do aviso..."
        ></textarea>
      </div>

      <!-- Botões -->
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {{ loading ? 'Salvando...' : 'Salvar Aviso' }}
        </button>
        <button
          type="button"
          @click="$emit('cancelar')"
          :disabled="loading"
          class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAvisos } from '~/composables/useAvisos'
import type { Aviso } from '~/composables/useAvisos'

const props = defineProps<{
  aviso?: Aviso
}>()

const emit = defineEmits<{
  cancelar: []
  salvar: []
}>()

const { criarAviso, atualizarAviso, loading } = useAvisos()

const form = reactive({
  titulo: props.aviso?.titulo || '',
  descricao: props.aviso?.descricao || ''
})

const salvar = async () => {
  try {
    if (props.aviso) {
      await atualizarAviso(props.aviso.id, form)
    } else {
      await criarAviso(form)
    }
    emit('salvar')
  } catch (error) {
    console.error('Erro ao salvar aviso:', error)
    alert('Erro ao salvar aviso')
  }
}
</script>
