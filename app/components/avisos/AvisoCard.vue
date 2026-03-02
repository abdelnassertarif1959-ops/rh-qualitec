<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3 flex-1">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <img 
            v-if="aviso.criador?.avatar" 
            :src="aviso.criador.avatar" 
            :alt="aviso.criador.nome_completo"
            class="w-10 h-10 rounded-full object-cover"
          />
          <span v-else class="text-blue-600 font-semibold text-lg">
            {{ aviso.criador?.nome_completo?.charAt(0) || 'A' }}
          </span>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900">{{ aviso.titulo }}</h3>
          <p class="text-sm text-gray-500">
            {{ aviso.criador?.nome_completo }} • {{ formatarData(aviso.criado_em) }}
          </p>
        </div>
      </div>
      
      <!-- Botão deletar (apenas admin) -->
      <button
        v-if="isAdmin"
        @click="$emit('deletar', aviso.id)"
        class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
        title="Deletar aviso"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Descrição -->
    <div class="mb-4">
      <p class="text-gray-700 whitespace-pre-wrap">{{ aviso.descricao }}</p>
    </div>

    <!-- Footer com botão de comentários -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <button
        @click="$emit('ver-comentarios', aviso.id)"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{{ totalComentarios }} {{ totalComentarios === 1 ? 'comentário' : 'comentários' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  aviso: any
  isAdmin: boolean
  totalComentarios?: number
}>()

defineEmits(['deletar', 'ver-comentarios'])

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
    year: date.getFullYear() !== agora.getFullYear() ? 'numeric' : undefined
  })
}
</script>
