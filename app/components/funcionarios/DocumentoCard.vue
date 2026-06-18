<template>
  <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-150 group">
    <!-- Icone -->
    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-800 truncate leading-tight">{{ doc.nome_original }}</p>
      <p class="text-xs text-gray-400 mt-0.5 truncate">
        {{ formatarTamanho(doc.tamanho_bytes) }} &middot; {{ formatarData(doc.criado_em) }}<span v-if="doc.descricao"> &middot; {{ doc.descricao }}</span>
      </p>
    </div>

    <!-- Acoes - sempre visiveis em mobile, hover em desktop -->
    <div class="flex items-center gap-0.5 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
      <button type="button" class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors" title="Editar" @click="$emit('editar', doc)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
      </button>
      <button type="button" class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-white rounded-lg transition-colors" title="Baixar" @click="$emit('baixar', doc)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      </button>
      <button type="button" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors" title="Excluir" @click="$emit('excluir', doc)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
interface DocumentoTipo { nome: string }
interface Documento {
  id: string; nome_original: string; tipo_arquivo: string; tamanho_bytes: number
  criado_em: string; titulo: string | null; descricao: string | null
  tipo_id: number | null; documento_tipos: DocumentoTipo | null
}
defineProps<{ doc: Documento }>()
defineEmits<{ editar: [doc: Documento]; baixar: [doc: Documento]; excluir: [doc: Documento] }>()

const corIcone = (tipo: string) => {
  if (tipo.includes('pdf')) return 'bg-red-500'
  if (tipo.includes('image')) return 'bg-green-500'
  if (tipo.includes('word') || tipo.includes('document')) return 'bg-blue-500'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'bg-emerald-600'
  return 'bg-gray-400'
}
const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
const formatarData = (data: string) =>
  new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
</script>
