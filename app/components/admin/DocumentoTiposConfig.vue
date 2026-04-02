<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-600">Gerencie os títulos pré-configurados que aparecem ao anexar documentos.</p>
      <UiButton size="sm" @click="abrirNovo">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Novo Tipo
      </UiButton>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="text-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-2">
      <div
        v-for="tipo in tipos"
        :key="tipo.id"
        class="flex items-center gap-3 p-3 rounded-xl border transition-colors"
        :class="tipo.ativo ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ tipo.nome }}</p>
          <p v-if="tipo.descricao_padrao" class="text-xs text-gray-500 truncate">{{ tipo.descricao_padrao }}</p>
        </div>
        <span
          class="text-xs px-2 py-0.5 rounded-full font-medium"
          :class="tipo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'"
        >
          {{ tipo.ativo ? 'Ativo' : 'Inativo' }}
        </span>
        <div class="flex gap-1">
          <button type="button" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" @click="abrirEditar(tipo)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button type="button" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" :class="tipo.ativo ? 'text-orange-500' : 'text-green-600'" @click="toggleAtivo(tipo)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="tipo.ativo" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>
          <button type="button" class="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors" @click="confirmarExcluir(tipo)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="tipos.length === 0" class="text-center py-8 text-gray-500 text-sm">
        Nenhum tipo cadastrado ainda
      </div>
    </div>

    <!-- Modal criar/editar -->
    <UiModal v-model="modalAberto" :title="editando ? 'Editar Tipo' : 'Novo Tipo de Documento'" max-width="max-w-md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do tipo *</label>
          <input
            v-model="form.nome"
            type="text"
            placeholder="Ex: Atestado Médico"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição padrão (opcional)</label>
          <textarea
            v-model="form.descricao_padrao"
            rows="2"
            placeholder="Descrição que aparece como sugestão ao anexar"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div v-if="erro" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ erro }}</div>
        <div class="flex gap-3 justify-end">
          <UiButton variant="secondary" @click="modalAberto = false">Cancelar</UiButton>
          <UiButton :disabled="salvando" @click="salvar">{{ salvando ? 'Salvando...' : 'Salvar' }}</UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal confirmar exclusão -->
    <UiModal v-model="modalExcluir" title="Excluir Tipo" max-width="max-w-sm">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">Tem certeza que deseja excluir <strong>{{ tipoParaExcluir?.nome }}</strong>?</p>
        <p class="text-xs text-gray-500">Se este tipo estiver em uso, a exclusão será bloqueada. Desative-o em vez disso.</p>
        <div v-if="erroExcluir" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ erroExcluir }}</div>
        <div class="flex gap-3 justify-end">
          <UiButton variant="secondary" @click="modalExcluir = false">Cancelar</UiButton>
          <UiButton variant="danger" :disabled="excluindo" @click="excluir">{{ excluindo ? 'Excluindo...' : 'Excluir' }}</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
interface DocumentoTipo {
  id: number
  nome: string
  descricao_padrao: string | null
  ativo: boolean
}

const tipos = ref<DocumentoTipo[]>([])
const carregando = ref(true)
const modalAberto = ref(false)
const modalExcluir = ref(false)
const editando = ref<DocumentoTipo | null>(null)
const tipoParaExcluir = ref<DocumentoTipo | null>(null)
const salvando = ref(false)
const excluindo = ref(false)
const erro = ref<string | null>(null)
const erroExcluir = ref<string | null>(null)

const form = ref({ nome: '', descricao_padrao: '' })

const carregar = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ data: DocumentoTipo[] }>('/api/admin/documento-tipos')
    tipos.value = res.data || []
  } finally {
    carregando.value = false
  }
}

const abrirNovo = () => {
  editando.value = null
  form.value = { nome: '', descricao_padrao: '' }
  erro.value = null
  modalAberto.value = true
}

const abrirEditar = (tipo: DocumentoTipo) => {
  editando.value = tipo
  form.value = { nome: tipo.nome, descricao_padrao: tipo.descricao_padrao || '' }
  erro.value = null
  modalAberto.value = true
}

const salvar = async () => {
  if (!form.value.nome.trim()) { erro.value = 'Nome é obrigatório'; return }
  salvando.value = true
  erro.value = null
  try {
    if (editando.value) {
      await $fetch(`/api/admin/documento-tipos/${editando.value.id}`, {
        method: 'PATCH',
        body: { nome: form.value.nome, descricao_padrao: form.value.descricao_padrao }
      })
    } else {
      await $fetch('/api/admin/documento-tipos', {
        method: 'POST',
        body: { nome: form.value.nome, descricao_padrao: form.value.descricao_padrao }
      })
    }
    modalAberto.value = false
    await carregar()
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao salvar'
  } finally {
    salvando.value = false
  }
}

const toggleAtivo = async (tipo: DocumentoTipo) => {
  try {
    await $fetch(`/api/admin/documento-tipos/${tipo.id}`, {
      method: 'PATCH',
      body: { ativo: !tipo.ativo }
    })
    await carregar()
  } catch {}
}

const confirmarExcluir = (tipo: DocumentoTipo) => {
  tipoParaExcluir.value = tipo
  erroExcluir.value = null
  modalExcluir.value = true
}

const excluir = async () => {
  if (!tipoParaExcluir.value) return
  excluindo.value = true
  erroExcluir.value = null
  try {
    await $fetch(`/api/admin/documento-tipos/${tipoParaExcluir.value.id}`, { method: 'DELETE' })
    modalExcluir.value = false
    await carregar()
  } catch (e: any) {
    erroExcluir.value = e?.data?.message || 'Erro ao excluir'
  } finally {
    excluindo.value = false
  }
}

onMounted(() => carregar())
</script>
