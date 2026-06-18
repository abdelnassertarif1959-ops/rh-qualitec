<template>
  <div>
    <UiPageHeader title="Cargos" description="Defina os cargos e hierarquia da empresa">
      <UiButton size="lg" icon="➕" @click="abrirModal()">
        Novo Cargo
      </UiButton>
    </UiPageHeader>

    <!-- Lista -->
    <div class="space-y-4">
      <UiCard v-for="cargo in cargos" :key="cargo.id" padding="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ cargo.nome }}</h3>
              <p class="text-gray-500">{{ cargo.descricao }}</p>
              <p v-if="cargo.nivel" class="text-sm text-gray-400 mt-1">
                Nível: {{ cargo.nivel }}
              </p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-gray-500">{{ cargo.funcionarios_count || 0 }} funcionários</span>
                <UiButton 
                  v-if="cargo.funcionarios_count > 0" 
                  variant="ghost" 
                  size="sm" 
                  @click="verFuncionarios(cargo)"
                >
                  👥 Ver funcionários
                </UiButton>
              </div>
            </div>
          </div>
          <UiButton variant="ghost" @click="abrirModal(cargo)">✏️ Editar</UiButton>
        </div>
      </UiCard>
    </div>

    <!-- Modal -->
    <UiModal v-model="modalAberto" :title="editando ? 'Editar Cargo' : 'Novo Cargo'">
      <form @submit.prevent="salvar" class="space-y-4">
        <UiInput v-model="form.nome" label="Nome do Cargo" required />
        <UiTextarea v-model="form.descricao" label="Descrição" />
        <UiSelect v-model="form.nivel" :options="superioresOptions" label="Cargo Superior (Reporta a)" placeholder="Nenhum (cargo mais alto)" />
        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="secondary" @click="modalAberto = false">Cancelar</UiButton>
          <UiButton type="submit" icon="💾" :disabled="loading">Salvar</UiButton>
        </div>
      </form>
    </UiModal>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useCargos } from '~/composables/useCargos'

definePageMeta({ middleware: ['auth', 'admin'] })

const { cargos, loading, carregarCargos, salvarCargo, opcoesCargos } = useCargos()

const modalAberto = ref(false)
const editando = ref<any>(null)
const form = ref({ nome: '', descricao: '', nivel: '' })
const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error'
})

// Carregar cargos ao montar
onMounted(() => {
  carregarCargos()
})

// Opções de cargos superiores (excluindo o cargo atual)
const superioresOptions = computed(() => {
  return cargos.value
    .filter(c => !editando.value || c.id !== editando.value.id)
    .map(c => ({
      value: c.id,
      label: c.nome
    }))
})

const abrirModal = (cargo?: any) => {
  editando.value = cargo || null
  form.value = cargo ? { ...cargo } : { nome: '', descricao: '', nivel: '' }
  modalAberto.value = true
}

const salvar = async () => {
  const dadosCargo = editando.value ? { ...form.value, id: editando.value.id } : form.value
  const resultado = await salvarCargo(dadosCargo)
  
  notificacao.value = {
    title: resultado.success ? 'Sucesso!' : 'Erro!',
    message: resultado.message,
    variant: resultado.success ? 'success' : 'error'
  }
  mostrarNotificacao.value = true
  
  if (resultado.success) {
    modalAberto.value = false
  }
  
  setTimeout(() => {
    mostrarNotificacao.value = false
  }, 3000)
}

const verFuncionarios = (cargo: any) => {
  navigateTo(`/admin/funcionarios?cargo=${cargo.id}`)
}
</script>
