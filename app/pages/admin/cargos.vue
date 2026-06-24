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
            <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-14 h-14 rounded-xl shadow-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="url(#cargo-logo-grad)"/>
                <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                <circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
                <circle cx="10" cy="16" r="3" fill="#1e40af"/>
                <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
                <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
                <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
                <circle cx="28" cy="8" r="2" fill="#10b981"/>
                <defs>
                  <linearGradient id="cargo-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
                  </linearGradient>
                </defs>
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
