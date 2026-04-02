<template>
  <div>
    <UiPageHeader title="Documentos dos Funcionários" description="Visualize e baixe os arquivos enviados pelos funcionários" />

    <!-- Filtro por funcionário -->
    <UiCard class="mb-6" padding="p-4">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar por funcionário ou nome do arquivo..."
          class="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
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
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-blue-700 font-bold text-sm">{{ iniciais(String(nome)) }}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ nome }}</p>
              <p class="text-xs text-gray-500">{{ grupo.length }} arquivo(s)</p>
            </div>
          </div>
        </template>

        <div class="divide-y divide-gray-100">
          <div
            v-for="doc in grupo"
            :key="doc.id"
            class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="corIcone(doc.tipo_arquivo)">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ doc.nome_original }}</p>
              <p class="text-xs text-gray-500">{{ formatarTamanho(doc.tamanho_bytes) }} · {{ formatarData(doc.criado_em) }}</p>
            </div>

            <!-- Badge novo (últimas 48h) -->
            <span v-if="isRecente(doc.criado_em)" class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
              Novo
            </span>

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
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'] })

interface Documento {
  id: string
  nome_original: string
  tipo_arquivo: string
  tamanho_bytes: number
  criado_em: string
  funcionario_id: number
  funcionarios: { nome_completo: string } | null
}

const carregando = ref(true)
const documentos = ref<Documento[]>([])
const busca = ref('')

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

const isRecente = (data: string) => {
  return Date.now() - new Date(data).getTime() < 48 * 60 * 60 * 1000
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

const iniciais = (nome: string) =>
  nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const corIcone = (tipo: string) => {
  if (tipo.includes('pdf')) return 'bg-red-500'
  if (tipo.includes('image')) return 'bg-green-500'
  if (tipo.includes('word') || tipo.includes('document')) return 'bg-blue-500'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'bg-emerald-600'
  return 'bg-gray-500'
}

onMounted(() => carregarDocumentos())
</script>
