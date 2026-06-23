<template>
  <div>
    <UiPageHeader title="Documentos dos Funcionários" description="Visualize, baixe e configure os tipos de documentos" />

    <!-- Abas -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="aba in abas"
          :key="aba.id"
          @click="abaAtiva = aba.id"
          :class="[
            'py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
            abaAtiva === aba.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="aba.iconPath"/>
          </svg>
          {{ aba.label }}
        </button>
      </nav>
    </div>

    <!-- Aba: Documentos -->
    <div v-if="abaAtiva === 'documentos'">
      <!-- Filtro -->
      <UiCard class="mb-6" padding="p-4">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="busca"
            type="text"
            placeholder="Buscar por funcionário, título ou nome do arquivo..."
            class="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
          <button
            v-if="Object.keys(documentosAgrupados).length > 0"
            @click="toggleTodos"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="todosExpandidos ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
            </svg>
            {{ todosExpandidos ? 'Colapsar Todos' : 'Expandir Todos' }}
          </button>
          <span class="text-xs text-gray-500">{{ documentosFiltrados.length }} arquivo(s)</span>
        </div>
      </UiCard>

      <!-- Loading -->
      <div v-if="carregando" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Vazio -->
      <UiCard v-else-if="documentosFiltrados.length === 0">
        <div class="text-center py-10 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="font-medium">Nenhum documento encontrado</p>
        </div>
      </UiCard>

      <!-- Lista agrupada por funcionário -->
      <div v-else class="space-y-4">
        <UiCard v-for="(grupo, nome) in documentosAgrupados" :key="nome">
          <template #header>
            <button 
              @click="toggleGrupo(String(nome))"
              class="w-full flex items-center gap-3 hover:bg-gray-50 -m-4 p-4 rounded-t-xl transition-colors"
            >
              <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-blue-700 font-bold text-sm">{{ iniciais(String(nome)) }}</span>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-gray-900">{{ nome }}</p>
                <p class="text-xs text-gray-500">{{ grupo.length }} arquivo(s)</p>
              </div>
              <svg 
                class="w-5 h-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isGrupoExpandido(String(nome)) }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </template>

          <div 
            v-show="isGrupoExpandido(String(nome))"
            class="divide-y divide-gray-100"
          >
            <div v-for="doc in grupo" :key="doc.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>

              <!-- Título + descrição (coluna esquerda) -->
              <div class="w-36 flex-shrink-0">
                <p class="text-sm font-bold text-gray-900 truncate">{{ doc.titulo || '—' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ doc.descricao || '' }}</p>
              </div>

              <!-- Nome do arquivo + tamanho/data -->
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-700 truncate">{{ doc.nome_original }}</p>
                <p class="text-xs text-gray-400">
                  {{ formatarTamanho(doc.tamanho_bytes) }} · 
                  <span v-if="doc.data_referencia" class="font-medium text-gray-600">Ref: {{ formatarData(doc.data_referencia) }}</span>
                  <span v-else>{{ formatarData(doc.criado_em) }}</span>
                </p>
              </div>

              <span v-if="isRecente(doc.criado_em)" class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                Novo
              </span>

              <button
                type="button"
                class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Editar"
                @click="abrirModalEdicao(doc)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>

              <button
                type="button"
                class="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex-shrink-0"
                title="Visualizar"
                @click="visualizar(doc)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>

              <button
                type="button"
                class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                title="Baixar"
                @click="baixar(doc)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>

              <button
                type="button"
                class="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                title="Excluir"
                @click="confirmarExclusao(doc)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </UiCard>
      </div>
    </div>

    <!-- Aba: Configurar Tipos -->
    <div v-if="abaAtiva === 'tipos'">
      <UiCard>
        <template #header>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="font-semibold text-gray-900">Tipos de Documentos</span>
          </div>
        </template>
        <AdminDocumentoTiposConfig />
      </UiCard>
    </div>

    <!-- Modal Editar -->
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

    <!-- Modal Excluir -->
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
  </div>
</template>

<script setup lang="ts">
import AdminDocumentoTiposConfig from '~/components/admin/DocumentoTiposConfig.vue'

definePageMeta({ middleware: ['auth', 'admin'] })

interface Documento {
  id: string
  nome_original: string
  tipo_arquivo: string
  tamanho_bytes: number
  criado_em: string
  funcionario_id: number
  titulo: string | null
  descricao: string | null
  data_referencia: string | null
  funcionarios: { nome_completo: string } | null
}

const abaAtiva = ref('documentos')
const abas = [
  { id: 'documentos', label: 'Documentos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'tipos', label: 'Configurar Tipos', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' }
]

const carregando = ref(true)
const documentos = ref<Documento[]>([])
const busca = ref('')

// Estado de expansão dos grupos (todos expandidos por padrão)
const gruposExpandidos = ref<Record<string, boolean>>({})

const carregarDocumentos = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ data: Documento[] }>('/api/admin/documentos')
    documentos.value = res.data || []
  } catch (e) {
    console.error('Erro ao carregar documentos:', e)
  } finally {
    carregando.value = false
  }
}

const documentosFiltrados = computed(() => {
  if (!busca.value.trim()) return documentos.value
  const t = busca.value.toLowerCase()
  return documentos.value.filter(d =>
    d.nome_original.toLowerCase().includes(t) ||
    (d.titulo || '').toLowerCase().includes(t) ||
    (d.funcionarios?.nome_completo || '').toLowerCase().includes(t)
  )
})

const documentosAgrupados = computed(() => {
  const grupos: Record<string, Documento[]> = {}
  for (const doc of documentosFiltrados.value) {
    const nome = doc.funcionarios?.nome_completo || 'Desconhecido'
    if (!grupos[nome]) grupos[nome] = []
    grupos[nome].push(doc)
  }
  return grupos
})

// Função para alternar expansão de um grupo
const toggleGrupo = (nome: string) => {
  gruposExpandidos.value[nome] = !gruposExpandidos.value[nome]
}

// Verificar se um grupo está expandido (padrão: colapsado)
const isGrupoExpandido = (nome: string) => {
  return gruposExpandidos.value[nome] ?? false
}

// Verificar se todos os grupos estão expandidos
const todosExpandidos = computed(() => {
  const nomes = Object.keys(documentosAgrupados.value)
  if (nomes.length === 0) return false
  return nomes.every(nome => gruposExpandidos.value[nome] === true)
})

// Expandir ou colapsar todos os grupos
const toggleTodos = () => {
  const expandir = !todosExpandidos.value
  const nomes = Object.keys(documentosAgrupados.value)
  nomes.forEach(nome => {
    gruposExpandidos.value[nome] = expandir
  })
}

const isRecente = (data: string) => Date.now() - new Date(data).getTime() < 48 * 60 * 60 * 1000

const visualizar = (doc: Documento) => {
  window.open(`/api/admin/documentos/${doc.id}/view`, '_blank')
}

const baixar = async (doc: Documento) => {
  const response = await fetch(`/api/admin/documentos/${doc.id}/download`)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.nome_original
  a.click()
  URL.revokeObjectURL(url)
}

// Editar
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
    const { fetchWithCsrf } = useCsrf()
    await fetchWithCsrf(`/api/admin/documentos/${docParaEditar.value.id}`, {
      method: 'PATCH',
      body: { titulo: edicaoTitulo.value.trim() || null, descricao: edicaoDescricao.value.trim() || null }
    })
    modalEdicao.value = false
    await carregarDocumentos()
  } catch (e) {
    console.error('Erro ao salvar:', e)
  } finally {
    salvandoEdicao.value = false
  }
}

// Excluir
const modalExclusao = ref(false)
const docParaExcluir = ref<Documento | null>(null)
const excluindo = ref(false)

const confirmarExclusao = (doc: Documento) => {
  docParaExcluir.value = doc
  modalExclusao.value = true
}

const excluir = async () => {
  if (!docParaExcluir.value) return
  excluindo.value = true
  try {
    const { fetchWithCsrf } = useCsrf()
    await fetchWithCsrf(`/api/admin/documentos/${docParaExcluir.value.id}`, { method: 'DELETE' })
    modalExclusao.value = false
    docParaExcluir.value = null
    await carregarDocumentos()
  } catch (e) {
    console.error('Erro ao excluir:', e)
  } finally {
    excluindo.value = false
  }
}

const iniciais = (nome: string) =>
  nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

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
