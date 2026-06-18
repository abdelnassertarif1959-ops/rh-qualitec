<template>
  <div>
    <UiPageHeader title="Arquivos" description="Seus documentos organizados por tipo e data" />

    <!-- Filtros + botão anexar -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <!-- Ano -->
      <select v-model="filtroAno" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">{{ ano }}</option>
      </select>

      <!-- Mês -->
      <select v-model="filtroMes" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="">Todos os meses</option>
        <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>

      <!-- Tipo -->
      <select v-model="filtroTipo" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="">Todos os tipos</option>
        <option v-for="tipo in tiposDisponiveis" :key="tipo" :value="tipo">{{ tipo }}</option>
      </select>

      <span class="ml-auto text-xs text-gray-500">{{ documentosFiltrados.length }} arquivo(s)</span>

      <!-- Botão anexar (funcionário) -->
      <button
        @click="abrirModalUpload"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Anexar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Vazio -->
    <div v-else-if="documentosFiltrados.length === 0" class="text-center py-12 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="font-medium">Nenhum documento encontrado</p>
    </div>

    <!-- Agrupado por título/tipo -->
    <div v-else class="space-y-4">
      <div v-for="(grupo, tituloGrupo) in documentosAgrupados" :key="tituloGrupo" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <!-- Header do grupo -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span class="text-sm font-semibold text-gray-800">{{ tituloGrupo }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ grupo.length }} arquivo(s)</span>
        </div>

        <!-- Documentos do grupo -->
        <div class="divide-y divide-gray-50">
          <div
            v-for="doc in grupo"
            :key="doc.id"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ doc.nome_original }}</p>
              <p class="text-xs text-gray-400">
                {{ formatarTamanho(doc.tamanho_bytes) }} ·
                <span v-if="doc.data_referencia">{{ formatarDataRef(doc.data_referencia) }}</span>
                <span v-else>{{ formatarData(doc.criado_em) }}</span>
                <span v-if="doc.descricao"> · {{ doc.descricao }}</span>
              </p>
            </div>

            <div class="flex items-center gap-1 flex-shrink-0">
              <button type="button" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Baixar" @click="baixar(doc)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão upload flutuante -->
    <button
      @click="abrirModalUpload"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
      title="Anexar documento"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
    </button>

    <!-- Modal Upload -->
    <UiModal v-model="modalUpload" title="Anexar Documento" max-width="max-w-md">
      <div class="space-y-4">
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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de referência <span class="text-xs text-gray-400">(mês/ano do documento)</span></label>
          <input v-model="novaDataReferencia" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título <span class="text-gray-400 text-xs">(opcional)</span></label>
          <input v-model="novoTitulo" type="text" placeholder="Ex: DAS, Atestado médico..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição <span class="text-gray-400 text-xs">(opcional)</span></label>
          <textarea v-model="novaDescricao" rows="2" placeholder="Descreva o documento..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        <div v-if="erroUpload" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ erroUpload }}</div>

        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="modalUpload = false">Cancelar</UiButton>
          <UiButton :disabled="!arquivoSelecionado || enviando" @click="confirmarUpload">
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { isAdmin } = useAuth()

interface Documento {
  id: string
  nome_original: string
  tipo_arquivo: string
  tamanho_bytes: number
  criado_em: string
  titulo: string | null
  descricao: string | null
  data_referencia: string | null
  documento_tipos: { nome: string } | null
}

const documentos = ref<Documento[]>([])
const carregando = ref(true)
const enviando = ref(false)
const erroUpload = ref<string | null>(null)
const inputArquivo = ref<HTMLInputElement | null>(null)
const modalUpload = ref(false)
const arquivoSelecionado = ref<File | null>(null)
const novoTitulo = ref('')
const novaDescricao = ref('')
const novaDataReferencia = ref(new Date().toISOString().split('T')[0])

// Filtros
const filtroAno = ref(new Date().getFullYear().toString())
const filtroMes = ref('')
const filtroTipo = ref('')

const meses = [
  { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
]

const carregarDocumentos = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ success: boolean; data: Documento[] }>('/api/funcionarios/documentos')
    documentos.value = res.data || []
  } finally {
    carregando.value = false
  }
}

// Anos disponíveis baseados nos documentos
const anosDisponiveis = computed(() => {
  const anos = new Set<string>()
  anos.add(new Date().getFullYear().toString())
  documentos.value.forEach(d => {
    const dataStr = d.data_referencia || d.criado_em
    if (dataStr) {
      const dataObj = new Date(dataStr.length === 10 ? dataStr + 'T00:00:00' : dataStr)
      anos.add(dataObj.getFullYear().toString())
    }
  })
  return Array.from(anos).sort((a, b) => Number(b) - Number(a))
})

// Tipos disponíveis
const tiposDisponiveis = computed(() => {
  const tipos = new Set<string>()
  documentos.value.forEach(d => {
    const t = d.documento_tipos?.nome || d.titulo
    if (t) tipos.add(t)
  })
  return Array.from(tipos).sort()
})

// Documentos filtrados
const documentosFiltrados = computed(() => {
  return documentos.value.filter(d => {
    const dataStr = d.data_referencia || d.criado_em
    // Forçar parse local adicionando T00:00:00 para evitar UTC offset
    const dataObj = new Date(dataStr.length === 10 ? dataStr + 'T00:00:00' : dataStr)
    const ano = dataObj.getFullYear().toString()
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0')
    const tipo = d.documento_tipos?.nome || d.titulo || ''

    if (filtroAno.value && ano !== filtroAno.value) return false
    if (filtroMes.value && mes !== filtroMes.value) return false
    if (filtroTipo.value && tipo !== filtroTipo.value) return false
    return true
  })
})

// Agrupado por título/tipo
const documentosAgrupados = computed(() => {
  const grupos: Record<string, Documento[]> = {}
  for (const doc of documentosFiltrados.value) {
    const chave = doc.documento_tipos?.nome || doc.titulo || 'Sem título'
    if (!grupos[chave]) grupos[chave] = []
    grupos[chave].push(doc)
  }
  return grupos
})

const abrirModalUpload = () => {
  arquivoSelecionado.value = null
  novoTitulo.value = ''
  novaDescricao.value = ''
  novaDataReferencia.value = new Date().toISOString().split('T')[0]
  erroUpload.value = null
  modalUpload.value = true
}

const onFileSelect = (e: Event) => {
  arquivoSelecionado.value = (e.target as HTMLInputElement).files?.[0] || null
}

const confirmarUpload = async () => {
  if (!arquivoSelecionado.value) return
  if (arquivoSelecionado.value.size > 10 * 1024 * 1024) {
    erroUpload.value = 'Arquivo muito grande (máx 10MB)'
    return
  }
  enviando.value = true
  erroUpload.value = null
  try {
    const form = new FormData()
    form.append('file', arquivoSelecionado.value)
    if (novoTitulo.value.trim()) form.append('titulo', novoTitulo.value.trim())
    if (novaDescricao.value.trim()) form.append('descricao', novaDescricao.value.trim())
    if (novaDataReferencia.value) form.append('data_referencia', novaDataReferencia.value)
    await $fetch('/api/funcionarios/documentos/upload', { method: 'POST', body: form })
    modalUpload.value = false
    await carregarDocumentos()
  } catch (e: any) {
    erroUpload.value = e?.data?.message || 'Erro ao enviar arquivo'
  } finally {
    enviando.value = false
  }
}

const baixar = async (doc: Documento) => {
  const response = await fetch(`/api/funcionarios/documentos/${doc.id}/download`)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.nome_original
  a.click()
  URL.revokeObjectURL(url)
}

const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatarDataRef = (data: string) =>
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
