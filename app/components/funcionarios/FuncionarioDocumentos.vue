<template>
  <div class="space-y-4">
    <!-- Upload -->
    <div
      class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
      :class="arrastando ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
      @dragover.prevent="arrastando = true"
      @dragleave="arrastando = false"
      @drop.prevent="onDrop"
      @click="inputArquivo?.click()"
    >
      <input ref="inputArquivo" type="file" class="hidden" multiple @change="onFileChange" />
      <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p class="text-sm font-medium text-gray-700">Clique ou arraste arquivos aqui</p>
      <p class="text-xs text-gray-500 mt-1">Todos os tipos · Máximo 10MB por arquivo</p>
    </div>

    <!-- Progresso -->
    <div v-if="enviando" class="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
      <svg class="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      <span class="text-sm text-blue-700">Enviando {{ nomeEnviando }}...</span>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ erro }}
    </div>

    <!-- Lista -->
    <div v-if="carregando" class="text-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="documentos.length === 0" class="text-center py-8 text-gray-500 text-sm">
      Nenhum documento enviado ainda
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="doc in documentos"
        :key="doc.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ doc.nome_original }}</p>
          <p class="text-xs text-gray-500">{{ formatarTamanho(doc.tamanho_bytes) }} · {{ formatarData(doc.criado_em) }}</p>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button type="button" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Baixar" @click="baixar(doc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button type="button" class="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Excluir" @click="confirmarExclusao(doc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal confirmação exclusão -->
    <UiModal v-model="modalExclusao" title="Excluir Documento" max-width="max-w-sm">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">Tem certeza que deseja excluir <strong>{{ docParaExcluir?.nome_original }}</strong>?</p>
        <div class="flex gap-3 justify-end">
          <UiButton variant="secondary" @click="modalExclusao = false">Cancelar</UiButton>
          <UiButton variant="danger" :disabled="excluindo" @click="excluir">
            {{ excluindo ? 'Excluindo...' : 'Excluir' }}
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
interface Documento {
  id: string
  nome_original: string
  tipo_arquivo: string
  tamanho_bytes: number
  criado_em: string
}

const props = defineProps<{ funcionarioId: number | string }>()

const documentos = ref<Documento[]>([])
const carregando = ref(true)
const enviando = ref(false)
const nomeEnviando = ref('')
const erro = ref<string | null>(null)
const arrastando = ref(false)
const modalExclusao = ref(false)
const docParaExcluir = ref<Documento | null>(null)
const excluindo = ref(false)
const inputArquivo = ref<HTMLInputElement | null>(null)

const carregarDocumentos = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ success: boolean; data: Documento[] }>(`/api/admin/documentos/${props.funcionarioId}`)
    documentos.value = res.data || []
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao carregar documentos'
  } finally {
    carregando.value = false
  }
}

const uploadArquivo = async (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    erro.value = `${file.name}: arquivo muito grande (máx 10MB)`
    return
  }
  enviando.value = true
  nomeEnviando.value = file.name
  erro.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('funcionario_id', String(props.funcionarioId))
    await $fetch('/api/admin/documentos/upload', { method: 'POST', body: form })
    await carregarDocumentos()
  } catch (e: any) {
    erro.value = e?.data?.message || `Erro ao enviar ${file.name}`
  } finally {
    enviando.value = false
    nomeEnviando.value = ''
  }
}

const onFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) await uploadArquivo(file)
  if (inputArquivo.value) inputArquivo.value.value = ''
}

const onDrop = async (e: DragEvent) => {
  arrastando.value = false
  const files = e.dataTransfer?.files
  if (!files) return
  for (const file of Array.from(files)) await uploadArquivo(file)
}

const baixar = async (doc: Documento) => {
  try {
    const response = await fetch(`/api/admin/documentos/${doc.id}/download`)
    if (!response.ok) throw new Error('Erro ao baixar')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.nome_original
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    erro.value = 'Erro ao baixar documento'
  }
}

const confirmarExclusao = (doc: Documento) => {
  docParaExcluir.value = doc
  modalExclusao.value = true
}

const excluir = async () => {
  if (!docParaExcluir.value) return
  excluindo.value = true
  try {
    await $fetch(`/api/admin/documentos/${docParaExcluir.value.id}`, { method: 'DELETE' })
    modalExclusao.value = false
    docParaExcluir.value = null
    await carregarDocumentos()
  } catch {
    erro.value = 'Erro ao excluir documento'
  } finally {
    excluindo.value = false
  }
}

const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const corIcone = (tipo: string) => {
  if (tipo.includes('pdf')) return 'bg-red-500'
  if (tipo.includes('image')) return 'bg-green-500'
  if (tipo.includes('word') || tipo.includes('document')) return 'bg-blue-500'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'bg-emerald-600'
  return 'bg-gray-500'
}

onMounted(() => carregarDocumentos())
</script>
