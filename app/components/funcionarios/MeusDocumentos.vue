<template>
  <div id="meus-documentos-card" class="space-y-4">

    <!-- Header -->
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h2 class="text-xl font-bold text-gray-900 tracking-tight">Arquivos</h2>
        <p class="text-sm text-gray-500 mt-0.5">Seus documentos organizados por tipo e data</p>
      </div>
      <button v-if="isAdmin" type="button" class="inline-flex items-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm" @click="abrirModalUpload">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v12M8 11l4 4 4-4M4 20h16"/></svg>
        Enviar arquivo
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-wrap items-center gap-2">
      <select v-model.number="anoFiltro" class="h-9 px-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
      </select>
      <select v-model.number="mesFiltro" class="h-9 px-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        <option value="0">Todos os meses</option>
        <option v-for="(nome, idx) in meses" :key="idx" :value="idx + 1">{{ nome }}</option>
      </select>
      <select v-model="tipoFiltro" class="h-9 px-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        <option value="">Todos os tipos</option>
        <option v-for="t in tipos" :key="t.id" :value="String(t.id)">{{ t.nome }}</option>
      </select>
      <span class="ml-auto text-xs text-gray-400 font-medium">{{ documentosFiltrados.length }} arquivo(s)</span>
    </div>

    <!-- Drop zone -->
    <div
      class="border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer"
      :class="arrastando ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
      v-if="isAdmin" @dragover.prevent="arrastando = true"
      @dragleave="arrastando = false"
      @drop.prevent="onDrop"
      @click="abrirModalUpload"
    >
      <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
      <p class="text-sm text-gray-500">Clique ou arraste arquivos aqui</p>
      <p class="text-xs text-gray-400 mt-0.5">Todos os tipos &middot; Maximo 10MB</p>
    </div>

    <!-- Feedback -->
    <div v-if="enviando" class="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
      <svg class="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
      <span class="text-sm text-blue-700">Enviando...</span>
    </div>
    <div v-if="erro" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{{ erro }}</div>

    <!-- Loading -->
    <div v-if="carregando" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
    </div>

    <!-- Vazio -->
    <div v-else-if="!carregando && documentosFiltrados.length === 0" class="text-center py-12 bg-white rounded-2xl border border-gray-100">
      <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      <p class="text-sm text-gray-400 font-medium">Nenhum documento encontrado</p>
      <p class="text-xs text-gray-300 mt-1">Tente ajustar os filtros ou envie um novo arquivo</p>
    </div>

    <!-- Lista agrupada por tipo -->
    <div v-else-if="!carregando && documentosFiltrados.length > 0" class="space-y-3">
      <div v-for="grupo in gruposPorTipo" :key="grupo.tipo" class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <!-- Header grupo -->
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" :class="corPillTipo(grupo.tipo)">
            <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
            {{ grupo.tipo }}
          </span>
          <span class="text-xs text-gray-400 ml-auto">{{ grupo.docs.length }} arquivo(s)</span>
        </div>
        <!-- Cards inline -->
        <div class="p-2 space-y-1">
          <div
            v-for="doc in grupo.docs"
            :key="doc.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-150"
          >
            <!-- Icone -->
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ doc.nome_original }}</p>
              <p class="text-xs text-gray-400 mt-0.5 truncate">
                {{ formatarTamanho(doc.tamanho_bytes) }} &middot; <span v-if="doc.data_referencia">{{ formatarData(doc.data_referencia) }}</span><span v-else>{{ formatarData(doc.criado_em) }}</span><span v-if="doc.descricao"> &middot; {{ doc.descricao }}</span>
              </p>
            </div>
            <!-- Acoes -->
            <div class="flex items-center gap-0.5 flex-shrink-0">
              <button v-if="isAdmin" type="button" class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors" title="Editar" @click="abrirModalEdicao(doc)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button type="button" class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-white rounded-lg transition-colors" title="Baixar" @click="baixar(doc)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
              <button v-if="isAdmin" type="button" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors" title="Excluir" @click="confirmarExclusao(doc)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Upload -->
    <UiModal v-model="modalUpload" title="Enviar Documento" max-width="max-w-md">
      <div class="space-y-4">
        <div class="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors" :class="arquivoSelecionado ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'" @click="inputArquivo?.click()">
          <input ref="inputArquivo" type="file" class="hidden" @change="onFileSelect" />
          <svg v-if="!arquivoSelecionado" class="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          <svg v-else class="w-8 h-8 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm font-medium" :class="arquivoSelecionado ? 'text-green-700' : 'text-gray-600'">{{ arquivoSelecionado ? arquivoSelecionado.name : 'Clique para selecionar' }}</p>
          <p v-if="arquivoSelecionado" class="text-xs text-gray-400 mt-0.5">{{ formatarTamanho(arquivoSelecionado.size) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titulo <span class="text-gray-400 text-xs">(opcional)</span></label>
          <input v-model="novoTitulo" type="text" placeholder="Ex: Atestado medico..." class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descricao <span class="text-gray-400 text-xs">(opcional)</span></label>
          <textarea v-model="novaDescricao" rows="2" placeholder="Descreva o documento..." class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
        </div>
        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="fecharModalUpload">Cancelar</UiButton>
          <UiButton :disabled="!arquivoSelecionado || enviando" @click="confirmarUpload">{{ enviando ? 'Enviando...' : 'Enviar' }}</UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal Editar -->
    <UiModal v-model="modalEdicao" title="Editar Documento" max-width="max-w-md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
          <input v-model="edicaoTitulo" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
          <textarea v-model="edicaoDescricao" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
        </div>
        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="modalEdicao = false">Cancelar</UiButton>
          <UiButton :disabled="salvandoEdicao" @click="salvarEdicao">{{ salvandoEdicao ? 'Salvando...' : 'Salvar' }}</UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal Excluir -->
    <UiModal v-model="modalExclusao" title="Excluir Documento" max-width="max-w-sm">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">Tem certeza que deseja excluir <strong>{{ docParaExcluir?.titulo || docParaExcluir?.nome_original }}</strong>?</p>
        <div class="flex gap-3 justify-end">
          <UiButton variant="secondary" @click="modalExclusao = false">Cancelar</UiButton>
          <UiButton variant="danger" :disabled="excluindo" @click="excluir">{{ excluindo ? 'Excluindo...' : 'Excluir' }}</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
interface DocumentoTipo { nome: string }
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
interface Tipo { id: number; nome: string }

const { isAdmin } = useAuth()
const documentos = ref<Documento[]>([])
const tipos = ref<Tipo[]>([])
const carregando = ref(true)
const enviando = ref(false)
const erro = ref<string | null>(null)
const arrastando = ref(false)
const inputArquivo = ref<HTMLInputElement | null>(null)

const anoAtual = new Date().getFullYear()
const mesAtual = new Date().getMonth() + 1
const anoFiltro = ref(anoAtual)
const mesFiltro = ref(0)
const tipoFiltro = ref('')

const anos = Array.from({ length: 4 }, (_, i) => anoAtual - i)
const meses = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const documentosFiltrados = computed(() => {
  return documentos.value.filter(doc => {
    const dataBase = doc.data_referencia ? (doc.data_referencia + 'T00:00:00') : doc.criado_em
    const d = new Date(dataBase)
    const anoOk = d.getFullYear() === anoFiltro.value
    const mesOk = mesFiltro.value === 0 || (d.getMonth() + 1) === mesFiltro.value
    const tipoOk = !tipoFiltro.value || String(doc.tipo_id) === tipoFiltro.value
    return anoOk && mesOk && tipoOk
  })
})
const gruposPorTipo = computed(() => {
  const mapa = new Map<string, Documento[]>()
  for (const doc of documentosFiltrados.value) {
    const chave = doc.documento_tipos?.nome || doc.titulo || 'Sem tipo'
    if (!mapa.has(chave)) mapa.set(chave, [])
    mapa.get(chave)!.push(doc)
  }
  return Array.from(mapa.entries()).map(([tipo, docs]) => ({ tipo, docs }))
})

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

const carregarTipos = async () => {
  try {
    const res = await $fetch<{ data: Tipo[] }>('/api/admin/documento-tipos')
    tipos.value = res.data || []
  } catch {}
}

const modalUpload = ref(false)
const arquivoSelecionado = ref<File | null>(null)
const novoTitulo = ref('')
const novaDescricao = ref('')

const abrirModalUpload = () => {
  arquivoSelecionado.value = null
  novoTitulo.value = ''
  novaDescricao.value = ''
  modalUpload.value = true
}
const fecharModalUpload = () => {
  modalUpload.value = false
  arquivoSelecionado.value = null
  novoTitulo.value = ''
  novaDescricao.value = ''
}
const onFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) arquivoSelecionado.value = file
}
const onDrop = (e: DragEvent) => {
  arrastando.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) { arquivoSelecionado.value = file; modalUpload.value = true }
}
const confirmarUpload = async () => {
  if (!arquivoSelecionado.value) return
  if (arquivoSelecionado.value.size > 10 * 1024 * 1024) { erro.value = 'Arquivo muito grande (max 10MB)'; return }
  enviando.value = true; erro.value = null
  try {
    const form = new FormData()
    form.append('file', arquivoSelecionado.value)
    if (novoTitulo.value.trim()) form.append('titulo', novoTitulo.value.trim())
    if (novaDescricao.value.trim()) form.append('descricao', novaDescricao.value.trim())
    await $fetch('/api/funcionarios/documentos/upload', { method: 'POST', body: form })
    fecharModalUpload()
    await carregarDocumentos()
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao enviar arquivo'
  } finally { enviando.value = false }
}

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
  } catch { erro.value = 'Erro ao salvar' }
  finally { salvandoEdicao.value = false }
}

const modalExclusao = ref(false)
const docParaExcluir = ref<Documento | null>(null)
const excluindo = ref(false)

const confirmarExclusao = (doc: Documento) => { docParaExcluir.value = doc; modalExclusao.value = true }
const excluir = async () => {
  if (!docParaExcluir.value) return
  excluindo.value = true
  try {
    await $fetch(`/api/funcionarios/documentos/${docParaExcluir.value.id}`, { method: 'DELETE' })
    modalExclusao.value = false; docParaExcluir.value = null
    await carregarDocumentos()
  } catch { erro.value = 'Erro ao excluir' }
  finally { excluindo.value = false }
}

const baixar = async (doc: Documento) => {
  try {
    const response = await fetch(`/api/funcionarios/documentos/${doc.id}/download`)
    if (!response.ok) throw new Error()
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = doc.nome_original; a.click()
    URL.revokeObjectURL(url)
  } catch { erro.value = 'Erro ao baixar documento' }
}

const corIcone = (tipo: string) => {
  if (tipo.includes('pdf')) return 'bg-red-500'
  if (tipo.includes('image')) return 'bg-green-500'
  if (tipo.includes('word') || tipo.includes('document')) return 'bg-blue-500'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'bg-emerald-600'
  return 'bg-gray-400'
}

const corPillTipo = (nome: string) => {
  const n = nome.toLowerCase()
  if (n.includes('das') || n.includes('simples')) return 'bg-blue-100 text-blue-700'
  if (n.includes('holerite')) return 'bg-green-100 text-green-700'
  if (n.includes('atestado')) return 'bg-amber-100 text-amber-700'
  if (n.includes('contrato')) return 'bg-purple-100 text-purple-700'
  if (n.includes('recibo')) return 'bg-red-100 text-red-700'
  if (n.includes('cpf')) return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
const formatarData = (data: string) =>
  new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

onMounted(() => { carregarDocumentos(); carregarTipos() })
</script>





