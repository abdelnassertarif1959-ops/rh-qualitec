<template>
  <UiCard id="meus-documentos-card" class="mb-6">
    <template #header>
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="font-semibold text-gray-900">Meus Documentos</span>
        <span v-if="documentos.length > 0" class="ml-auto text-xs text-gray-500">{{ documentos.length }} arquivo(s)</span>
      </div>
    </template>

    <!-- Área de upload (clica para abrir modal) — apenas admin -->
    <div
      v-if="isAdmin"
      class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer mb-4"
      :class="arrastando ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
      @dragover.prevent="arrastando = true"
      @dragleave="arrastando = false"
      @drop.prevent="onDrop"
      @click="abrirModalUpload"
    >
      <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p class="text-sm font-medium text-gray-700">Clique ou arraste arquivos aqui</p>
      <p class="text-xs text-gray-500 mt-1">Todos os tipos · Máximo 10MB por arquivo</p>
    </div>

    <!-- Progresso -->
    <div v-if="enviando" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
      <svg class="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      <span class="text-sm text-blue-700">Enviando...</span>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ erro }}</div>

    <!-- Lista -->
    <div v-if="carregando" class="text-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="documentos.length === 0" class="text-center py-6 text-gray-500 text-sm">
      Nenhum documento enviado ainda
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="doc in documentos"
        :key="doc.id"
        class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" :class="corIcone(doc.tipo_arquivo)">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <!-- Info do documento -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ doc.nome_original }}</p>
          <p class="text-xs text-gray-400">
            {{ formatarTamanho(doc.tamanho_bytes) }} · 
            <span v-if="doc.data_referencia" class="font-medium text-gray-600">Ref: {{ formatarData(doc.data_referencia) }}</span>
            <span v-else>{{ formatarData(doc.criado_em) }}</span>
          </p>
          <div v-if="doc.documento_tipos?.nome || doc.titulo || doc.descricao" class="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span v-if="doc.documento_tipos?.nome" class="text-xs font-semibold text-gray-700">{{ doc.documento_tipos.nome }}</span>
            <span v-else-if="doc.titulo" class="text-xs font-semibold text-gray-700">{{ doc.titulo }}</span>
            <span v-if="doc.descricao" class="text-xs text-gray-500 truncate">{{ doc.descricao }}</span>
          </div>
        </div>

        <div class="flex items-center gap-1 flex-shrink-0">
          <button v-if="isAdmin" type="button" class="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors" title="Editar título/descrição" @click="abrirModalEdicao(doc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button type="button" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Baixar" @click="baixar(doc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button v-if="isAdmin" type="button" class="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Excluir" @click="confirmarExclusao(doc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Upload com título e descrição -->
    <UiModal v-model="modalUpload" title="Anexar Documento" max-width="max-w-md">
      <div class="space-y-4">
        <!-- Seletor de arquivo -->
        <div
          class="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
          :class="arquivoSelecionado ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
          @click="inputArquivo?.click()"
        >
          <input ref="inputArquivo" type="file" class="hidden" @change="onFileSelect" />
          <svg v-if="!arquivoSelecionado" class="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <svg v-else class="w-8 h-8 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm font-medium" :class="arquivoSelecionado ? 'text-green-700' : 'text-gray-700'">
            {{ arquivoSelecionado ? arquivoSelecionado.name : 'Clique para selecionar arquivo' }}
          </p>
          <p v-if="arquivoSelecionado" class="text-xs text-gray-500 mt-0.5">{{ formatarTamanho(arquivoSelecionado.size) }}</p>
        </div>

        <!-- Data de Referência -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data de referência 
            <span class="text-xs text-gray-500">(mês/ano do documento)</span>
          </label>
          <input
            v-model="novaDataReferencia"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">Ex: para docs de Jan/2024, use 01/01/2024</p>
        </div>

        <!-- Título -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título <span class="text-gray-400 text-xs">(opcional)</span></label>
          <input
            v-model="novoTitulo"
            type="text"
            placeholder="Ex: Atestado médico, Declaração..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição <span class="text-gray-400 text-xs">(opcional)</span></label>
          <textarea
            v-model="novaDescricao"
            rows="3"
            placeholder="Descreva o documento..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="fecharModalUpload">Cancelar</UiButton>
          <UiButton :disabled="!arquivoSelecionado || enviando" @click="confirmarUpload">
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal Editar título/descrição -->
    <UiModal v-model="modalEdicao" title="Editar Documento" max-width="max-w-md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input v-model="edicaoTitulo" type="text" placeholder="Ex: Atestado médico..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea v-model="edicaoDescricao" rows="3" placeholder="Descreva o documento..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>
        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="modalEdicao = false">Cancelar</UiButton>
          <UiButton :disabled="salvandoEdicao" @click="salvarEdicao">
            {{ salvandoEdicao ? 'Salvando...' : 'Salvar' }}
          </UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal confirmação exclusão -->
    <UiModal v-model="modalExclusao" title="Excluir Documento" max-width="max-w-sm">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">Tem certeza que deseja excluir <strong>{{ docParaExcluir?.titulo || docParaExcluir?.nome_original }}</strong>?</p>
        <div class="flex gap-3 justify-end">
          <UiButton variant="secondary" @click="modalExclusao = false">Cancelar</UiButton>
          <UiButton variant="danger" :disabled="excluindo" @click="excluir">
            {{ excluindo ? 'Excluindo...' : 'Excluir' }}
          </UiButton>
        </div>
      </div>
    </UiModal>
  </UiCard>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

interface DocumentoTipo {
  nome: string
}

interface Documento {
  id: string
  nome_original: string
  tipo_arquivo: string
  tamanho_bytes: number
  criado_em: string
  titulo: string | null
  descricao: string | null
  tipo_id: number | null
  documento_tipos: DocumentoTipo | null
  data_referencia: string | null
}

const documentos = ref<Documento[]>([])
const carregando = ref(true)
const enviando = ref(false)
const erro = ref<string | null>(null)
const arrastando = ref(false)
const modalExclusao = ref(false)
const docParaExcluir = ref<Documento | null>(null)
const excluindo = ref(false)
const inputArquivo = ref<HTMLInputElement | null>(null)

const { isAdmin } = useAuth()

// Modal upload
const modalUpload = ref(false)
const arquivoSelecionado = ref<File | null>(null)
const novoTitulo = ref('')
const novaDescricao = ref('')
const novaDataReferencia = ref(new Date().toISOString().split('T')[0])

const carregarDocumentos = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ success: boolean; data: Documento[] }>('/api/funcionarios/documentos')
    documentos.value = res.data || []
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao carregar documentos'
  } finally {
    carregando.value = false
  }
}

const abrirModalUpload = () => {
  arquivoSelecionado.value = null
  novoTitulo.value = ''
  novaDescricao.value = ''
  novaDataReferencia.value = new Date().toISOString().split('T')[0]
  modalUpload.value = true
}

const fecharModalUpload = () => {
  modalUpload.value = false
  arquivoSelecionado.value = null
  novoTitulo.value = ''
  novaDescricao.value = ''
  novaDataReferencia.value = new Date().toISOString().split('T')[0]
}

const onFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) arquivoSelecionado.value = file
}

const onDrop = (e: DragEvent) => {
  arrastando.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    arquivoSelecionado.value = file
    novoTitulo.value = ''
    novaDescricao.value = ''
    novaDataReferencia.value = new Date().toISOString().split('T')[0]
    modalUpload.value = true
  }
}

const confirmarUpload = async () => {
  if (!arquivoSelecionado.value) return
  const file = arquivoSelecionado.value

  enviando.value = true
  erro.value = null
  try {
    // Comprimir imagem se necessário para respeitar o limite de payload de 4.5MB da Vercel
    const fileToUpload = await compressImageIfNeeded(file)
    
    // Limite de payload da Vercel é 4.5MB
    const MAX_SIZE_VERCEL = 4.5 * 1024 * 1024
    if (fileToUpload.size > MAX_SIZE_VERCEL) {
      erro.value = `Arquivo muito grande (${(fileToUpload.size / 1024 / 1024).toFixed(1)}MB). Limite de upload em produção é de 4.5MB.`
      enviando.value = false
      return
    }

    const form = new FormData()
    form.append('file', fileToUpload)
    if (novoTitulo.value.trim()) form.append('titulo', novoTitulo.value.trim())
    if (novaDescricao.value.trim()) form.append('descricao', novaDescricao.value.trim())
    if (novaDataReferencia.value) form.append('data_referencia', novaDataReferencia.value)

    await $fetch('/api/funcionarios/documentos/upload', { method: 'POST', body: form })
    fecharModalUpload()
    await carregarDocumentos()
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao enviar arquivo'
  } finally {
    enviando.value = false
  }
}

// Modal edição
const modalEdicao = ref(false)
const docParaEditar = ref<Documento | null>(null)
const edicaoTitulo = ref('')
const edicaoDescricao = ref('')
const salvandoEdicao = ref(false)

const abrirModalEdicao = (doc: Documento) => {
  docParaEditar.value = doc
  edicaoTitulo.value = doc.titulo || ''
  edicaoDescricao.value = doc.descricao || ''
  modalEdicao.value = true
}

const salvarEdicao = async () => {
  if (!docParaEditar.value) return
  salvandoEdicao.value = true
  try {
    await $fetch(`/api/funcionarios/documentos/${docParaEditar.value.id}`, {
      method: 'PATCH',
      body: { titulo: edicaoTitulo.value.trim() || null, descricao: edicaoDescricao.value.trim() || null }
    })
    modalEdicao.value = false
    await carregarDocumentos()
  } catch {
    erro.value = 'Erro ao salvar alterações'
  } finally {
    salvandoEdicao.value = false
  }
}

const baixar = async (doc: Documento) => {
  try {
    const response = await fetch(`/api/funcionarios/documentos/${doc.id}/download`)
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
    await $fetch(`/api/funcionarios/documentos/${docParaExcluir.value.id}`, { method: 'DELETE' })
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
  new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const corIcone = (tipo: string) => {
  if (tipo.includes('pdf')) return 'bg-red-500'
  if (tipo.includes('image')) return 'bg-green-500'
  if (tipo.includes('word') || tipo.includes('document')) return 'bg-blue-500'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'bg-emerald-600'
  return 'bg-gray-500'
}

onMounted(() => carregarDocumentos())
</script>
