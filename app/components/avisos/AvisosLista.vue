<template>
  <div class="p-6">
    <!-- Botão criar aviso (apenas admin) -->
    <div v-if="user?.tipo_usuario === 'admin'" class="mb-6">
      <button
        @click="abrirFormulario"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Criar Novo Aviso
      </button>
    </div>

    <!-- Formulário de criação -->
    <AvisoForm
      v-if="mostrarFormulario"
      @cancelar="fecharFormulario"
      @salvar="handleSalvar"
    />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Sem avisos -->
    <div v-else-if="avisos.length === 0" class="text-center py-12 text-gray-500">
      <p class="text-lg">Nenhum aviso no momento</p>
    </div>

    <!-- Lista de avisos -->
    <div v-else class="space-y-4">
      <div
        v-for="aviso in avisos"
        :key="aviso.id"
        @click="$emit('selecionar', aviso)"
        class="p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ aviso.titulo }}</h3>
            <p class="text-gray-600 line-clamp-3 mb-3">{{ aviso.descricao }}</p>
            
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                👤 {{ aviso.autor?.nome_completo || 'Admin' }}
              </span>
              <span>{{ formatarData(aviso.criado_em) }}</span>
              <span v-if="aviso.total_comentarios > 0" class="flex items-center gap-1 text-blue-600">
                💬 {{ aviso.total_comentarios }} {{ aviso.total_comentarios === 1 ? 'comentário' : 'comentários' }}
              </span>
            </div>
          </div>

          <!-- Botão deletar (apenas admin) -->
          <button
            v-if="user?.tipo_usuario === 'admin'"
            @click.stop="confirmarDeletar(aviso)"
            class="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
            title="Deletar aviso"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAvisos } from '~/composables/useAvisos'
import { useAuth } from '~/composables/useAuth'
import type { Aviso } from '~/composables/useAvisos'

const emit = defineEmits<{
  selecionar: [aviso: Aviso]
  atualizar: []
}>()

const { avisos, loading, buscarAvisos, deletarAviso } = useAvisos()
const { user } = useAuth()

const mostrarFormulario = ref(false)

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

const abrirFormulario = () => {
  mostrarFormulario.value = true
}

const fecharFormulario = () => {
  mostrarFormulario.value = false
}

const handleSalvar = async () => {
  fecharFormulario()
  await buscarAvisos()
  emit('atualizar')
}

const confirmarDeletar = async (aviso: Aviso) => {
  if (!confirm(`Tem certeza que deseja deletar o aviso "${aviso.titulo}"?\n\nTodos os comentários também serão deletados.`)) {
    return
  }

  try {
    await deletarAviso(aviso.id)
    emit('atualizar')
  } catch (error) {
    console.error('Erro ao deletar aviso:', error)
    alert('Erro ao deletar aviso')
  }
}

onMounted(() => {
  buscarAvisos()
})
</script>
