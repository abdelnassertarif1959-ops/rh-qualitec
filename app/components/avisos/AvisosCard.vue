<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        📢 Avisos e Comunicados
        <span v-if="avisos.length > 0" class="text-sm font-normal text-gray-500">
          ({{ avisos.length }})
        </span>
      </h2>
      <button
        @click="abrirModal"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Ver todos
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Sem avisos -->
    <div v-else-if="avisos.length === 0" class="text-center py-8 text-gray-500">
      <p>Nenhum aviso no momento</p>
    </div>

    <!-- Lista de avisos (últimos 3) -->
    <div v-else class="space-y-3">
      <div
        v-for="aviso in avisosRecentes"
        :key="aviso.id"
        @click="abrirAviso(aviso)"
        class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 truncate">{{ aviso.titulo }}</h3>
            <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ aviso.descricao }}</p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{{ formatarData(aviso.criado_em) }}</span>
              <span v-if="aviso.total_comentarios > 0" class="flex items-center gap-1">
                💬 {{ aviso.total_comentarios }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de avisos -->
    <AvisosModal
      v-if="modalAberto"
      :aviso-selecionado="avisoSelecionado"
      @fechar="fecharModal"
      @atualizar="carregarAvisos"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAvisos } from '~/composables/useAvisos'
import type { Aviso } from '~/composables/useAvisos'

const { avisos, loading, buscarAvisos } = useAvisos()

const modalAberto = ref(false)
const avisoSelecionado = ref<Aviso | null>(null)

const avisosRecentes = computed(() => avisos.value.slice(0, 3))

const formatarData = (data: string) => {
  const date = new Date(data)
  const agora = new Date()
  const diff = agora.getTime() - date.getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  if (dias < 7) return `${dias} dias atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const abrirModal = () => {
  avisoSelecionado.value = null
  modalAberto.value = true
}

const abrirAviso = (aviso: Aviso) => {
  avisoSelecionado.value = aviso
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  avisoSelecionado.value = null
}

const carregarAvisos = async () => {
  try {
    await buscarAvisos()
  } catch (error) {
    console.error('Erro ao carregar avisos:', error)
  }
}

onMounted(() => {
  carregarAvisos()
})
</script>
