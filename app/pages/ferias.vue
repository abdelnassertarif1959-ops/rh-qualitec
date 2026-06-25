<template>
  <div>
    <UiPageHeader title="Minhas Férias" description="Agende e acompanhe suas solicitações de férias" />

    <!-- Loading -->
    <div v-if="carregando" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando seus dados de férias...</p>
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-else>
      <UiCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <svg class="w-6 h-6 rounded shadow-sm flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="url(#uf-logo-grad)"/>
                <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
                <circle cx="10" cy="16" r="3" fill="#1e40af"/>
                <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
                <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
                <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
                <defs>
                  <linearGradient id="uf-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
              <span class="font-semibold text-gray-900">Minhas Férias</span>
            </div>
            <UiButton 
              size="sm" 
              variant="primary" 
              @click="abrirFeriasModal"
              class="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Solicitar Férias
            </UiButton>
          </div>
        </template>

        <!-- Loading Férias -->
        <div v-if="carregandoFerias" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Lista de Férias -->
        <div v-else-if="minhasFerias.length > 0" class="space-y-4">
          <div 
            v-for="ferias in minhasFerias" 
            :key="ferias.id"
            class="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-sm transition-all"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div>
                <p class="font-semibold text-gray-800 text-sm">
                  📅 {{ formatarData(ferias.data_inicio) }} a {{ formatarData(ferias.data_fim) }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  Duração: {{ ferias.dias_corridos }} dias corridos
                </p>
              </div>
              <div>
                <span 
                  :class="statusBadgeClass(ferias.status)" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                >
                  {{ statusLabel(ferias.status) }}
                </span>
              </div>
            </div>

            <!-- Valores e Pagamento (Apenas se APROVADO/PROGRAMADO/EM GOZO/CONCLUIDO) -->
            <div v-if="ferias.status !== 'pendente'" class="mt-3">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <p class="text-gray-400 font-medium">Remuneração</p>
                  <p class="font-semibold text-gray-800">{{ formatarMoeda(ferias.valor_remuneracao) }}</p>
                </div>
                <div>
                  <p class="text-gray-400 font-medium">1/3 Constitucional</p>
                  <p class="font-semibold text-gray-800">{{ formatarMoeda(ferias.valor_um_terco) }}</p>
                </div>
                <div v-if="ferias.abono_pecuniario">
                  <p class="text-amber-600 font-medium">Abono Pecuniário</p>
                  <p class="font-semibold text-amber-700">{{ formatarMoeda(ferias.valor_abono_pecuniario) }}</p>
                </div>
                <div>
                  <p class="text-gray-400 font-medium">Descontos</p>
                  <p class="font-semibold text-red-600">- {{ formatarMoeda((ferias.inss || 0) + (ferias.irrf || 0) + (ferias.pensao_alimenticia || 0)) }}</p>
                </div>
                <div class="bg-blue-50 rounded-lg py-1 px-2 col-span-2 sm:col-span-1">
                  <p class="text-blue-600 font-medium">Líquido a Receber</p>
                  <p class="font-bold text-blue-700">{{ formatarMoeda(ferias.valor_liquido) }}</p>
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-gray-200/60 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span v-if="ferias.pensao_alimenticia > 0" class="text-red-600">
                  💸 Pensão Alimentícia: <strong>{{ formatarMoeda(ferias.pensao_alimenticia) }}</strong>
                </span>
                <span v-if="ferias.data_pagamento">
                  💳 Pagamento previsto: <strong>{{ formatarData(ferias.data_pagamento) }}</strong>
                </span>
              </div>

              <!-- Ações do Recibo (Mobile e Desktop) -->
              <div v-if="ferias.holerite_id" class="mt-4 pt-3 border-t border-gray-200/80 flex flex-col sm:flex-row gap-2 justify-end">
                <a 
                  :href="`/api/holerites/${ferias.holerite_id}/pdf`" 
                  target="_blank"
                  class="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors w-full sm:w-auto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Visualizar Recibo
                </a>
                <a 
                  :href="`/api/holerites/${ferias.holerite_id}/pdf`" 
                  target="_blank"
                  class="flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-colors w-full sm:w-auto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Baixar PDF
                </a>
              </div>
            </div>

            <!-- Mensagem de pendente -->
            <div v-else class="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 flex items-start gap-2">
              <svg class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="font-semibold">Solicitação pendente de aprovação</p>
                <p class="mt-0.5 text-amber-600">Os valores financeiros e a data de pagamento serão disponibilizados assim que o RH aprovar este período.</p>
              </div>
            </div>
            
            <div v-if="ferias.observacoes" class="mt-2 text-xs text-gray-500 italic">
              Obs: {{ ferias.observacoes }}
            </div>
          </div>
        </div>

        <!-- Estado Vazio -->
        <div v-else class="text-center py-8 text-gray-500 text-sm">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="font-medium">Nenhum período de férias agendado ou solicitado.</p>
          <p class="text-xs text-gray-400 mt-1">Deseja programar suas férias? Clique em "Solicitar Férias" acima.</p>
        </div>
      </UiCard>
    </div>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />

    <!-- Modal de Solicitação de Férias (Funcionário) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFeriasModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="fecharFeriasModal"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 rounded-lg shadow-sm flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="url(#uf-modal-grad)"/>
                  <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
                  <circle cx="10" cy="16" r="3" fill="#1e40af"/>
                  <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
                  <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
                  <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
                  <defs>
                    <linearGradient id="uf-modal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                </svg>
                <h3 class="text-lg font-bold text-gray-900">Solicitar Férias</h3>
              </div>
              <button @click="fecharFeriasModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
              <UiAlert variant="info" class="text-xs">
                As datas solicitadas serão enviadas para análise e aprovação do RH.
              </UiAlert>

              <!-- Período Aquisitivo -->
              <div class="bg-gray-50 rounded-xl p-3 text-xs border border-gray-200">
                <p class="font-semibold text-gray-500 uppercase tracking-wider mb-2">Período Aquisitivo Estimado</p>
                <div class="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <label class="block font-medium text-gray-600 mb-0.5">Início</label>
                    <input 
                      type="date" 
                      v-model="feriasForm.periodo_aquisitivo_inicio" 
                      class="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block font-medium text-gray-600 mb-0.5">Fim</label>
                    <input 
                      type="date" 
                      v-model="feriasForm.periodo_aquisitivo_fim" 
                      class="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Datas de Gozo -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Data de Início *</label>
                  <input 
                    type="date" 
                    v-model="feriasForm.data_inicio" 
                    :min="dataMinimaInicio"
                    class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Data de Fim *</label>
                  <input 
                    type="date" 
                    v-model="feriasForm.data_fim" 
                    class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <!-- Aviso Carência 1 ano de Serviço -->
              <div v-if="erroDataAdmissao" class="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
                <svg class="w-4.5 h-4.5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                  <p class="font-semibold text-red-800">Carência de 1 ano</p>
                  <p class="mt-0.5 text-red-600 leading-relaxed">{{ erroDataAdmissao }}</p>
                </div>
              </div>

              <!-- Abono Pecuniário -->
              <div class="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                <div class="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="abono_pecuniario_emp" 
                    v-model="feriasForm.abono_pecuniario"
                    class="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <label for="abono_pecuniario_emp" class="text-xs font-semibold text-amber-800 cursor-pointer">
                      Abono Pecuniário (Venda de Férias)
                    </label>
                    <p class="text-[11px] text-amber-600 mt-0.5">Deseja converter até 10 dias de suas férias em abono?</p>
                  </div>
                </div>
                <div v-if="feriasForm.abono_pecuniario" class="mt-2 pl-6">
                  <label class="block text-[11px] font-semibold text-amber-800 mb-0.5">Dias de abono (máx. 10)</label>
                  <input 
                    type="number" 
                    v-model.number="feriasForm.dias_abono"
                    min="1" 
                    max="10"
                    class="w-20 rounded-lg border border-amber-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Observações</label>
                <textarea 
                  v-model="feriasForm.observacoes" 
                  rows="2"
                  placeholder="Justificativa ou comentários adicionais..."
                  class="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
              <button 
                @click="fecharFeriasModal"
                class="px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                @click="solicitarFerias"
                :disabled="salvandoFerias || !feriasFormValido"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <div v-if="salvandoFerias" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                {{ salvandoFerias ? 'Enviar Solicitação' : 'Enviar Solicitação' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'

definePageMeta({ middleware: 'auth' })

const { user, isAdmin } = useAuth()

// Redirecionar administradores para a rota administrativa de férias
if (isAdmin.value) {
  navigateTo('/admin/ferias')
}

const carregando = ref(true)
const dadosOriginais = ref<any>(null)

// Gestão de Férias
const minhasFerias = ref<any[]>([])
const carregandoFerias = ref(false)
const showFeriasModal = ref(false)
const salvandoFerias = ref(false)

const feriasForm = reactive({
  periodo_aquisitivo_inicio: '',
  periodo_aquisitivo_fim: '',
  data_inicio: '',
  data_fim: '',
  abono_pecuniario: false,
  dias_abono: 10,
  observacoes: ''
})

const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error'
})

const mostrarMensagem = (title: string, message: string, variant: 'success' | 'error') => {
  notificacao.value = { title, message, variant }
  mostrarNotificacao.value = true
  setTimeout(() => {
    mostrarNotificacao.value = false
  }, 5000)
}

watch(
  [() => feriasForm.data_inicio, () => feriasForm.abono_pecuniario, () => feriasForm.dias_abono],
  ([dataInicio, abono, diasAbono]) => {
    if (!dataInicio) return
    try {
      const data = new Date(dataInicio + 'T00:00:00')
      if (isNaN(data.getTime())) return
      const diasVenda = abono ? (Number(diasAbono) || 0) : 0
      const diasGozo = 30 - diasVenda
      data.setDate(data.getDate() + diasGozo - 1)
      feriasForm.data_fim = data.toISOString().split('T')[0]
    } catch (e) {
      console.error('Erro ao calcular data de fim das férias:', e)
    }
  }
)

const dataMinimaInicio = computed(() => {
  if (!dadosOriginais.value?.data_admissao) return ''
  try {
    const admissao = new Date(dadosOriginais.value.data_admissao + 'T00:00:00')
    const umAnoAposAdmissao = new Date(admissao)
    umAnoAposAdmissao.setFullYear(umAnoAposAdmissao.getFullYear() + 1)
    return umAnoAposAdmissao.toISOString().split('T')[0]
  } catch (e) {
    console.error('Erro ao calcular data mínima de início:', e)
    return ''
  }
})

const erroDataAdmissao = computed(() => {
  if (!dadosOriginais.value?.data_admissao || !feriasForm.data_inicio) return ''
  try {
    const admissao = new Date(dadosOriginais.value.data_admissao + 'T00:00:00')
    const inicio = new Date(feriasForm.data_inicio + 'T00:00:00')
    const umAnoAposAdmissao = new Date(admissao)
    umAnoAposAdmissao.setFullYear(umAnoAposAdmissao.getFullYear() + 1)
    if (inicio < umAnoAposAdmissao) {
      return `Você só pode agendar férias a partir de ${umAnoAposAdmissao.toLocaleDateString('pt-BR')}, quando completa 1 ano de serviço.`
    }
  } catch (e) {
    console.error('Erro ao verificar data de admissão:', e)
  }
  return ''
})

const feriasFormValido = computed(() => {
  return feriasForm.data_inicio && feriasForm.data_fim &&
         feriasForm.periodo_aquisitivo_inicio && feriasForm.periodo_aquisitivo_fim &&
         !erroDataAdmissao.value
})

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pendente: '⏳ Aguardando Aprovação',
    programado: '📅 Programada',
    em_gozo: '🌴 Em Gozo',
    concluido: '✅ Concluída',
    cancelado: '❌ Cancelada',
  }
  return map[status] || status
}

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pendente: 'bg-amber-100 text-amber-700',
    programado: 'bg-blue-100 text-blue-700',
    em_gozo: 'bg-emerald-100 text-emerald-700',
    concluido: 'bg-gray-100 text-gray-600',
    cancelado: 'bg-red-100 text-red-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const formatarData = (data: string) => {
  if (!data) return '--'
  const date = new Date(data + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

const formatarMoeda = (valor: number | string) => {
  const num = typeof valor === 'string' ? parseFloat(valor) : valor
  if (num === null || num === undefined || isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

const carregarMinhasFerias = async () => {
  if (!user.value?.id) return
  carregandoFerias.value = true
  try {
    const res: any = await $fetch(`/api/ferias?funcionario_id=${user.value.id}`)
    minhasFerias.value = res.data || []
  } catch (err) {
    console.error('Erro ao carregar férias:', err)
  } finally {
    carregandoFerias.value = false
  }
}

const carregarDados = async () => {
  if (!user.value?.id) return
  carregando.value = true
  try {
    const response: any = await $fetch(`/api/funcionarios/meus-dados?userId=${user.value.id}`)
    if (response.success && response.data) {
      dadosOriginais.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    carregando.value = false
  }
}

const abrirFeriasModal = () => {
  Object.assign(feriasForm, {
    periodo_aquisitivo_inicio: '',
    periodo_aquisitivo_fim: '',
    data_inicio: '',
    data_fim: '',
    abono_pecuniario: false,
    dias_abono: 10,
    observacoes: ''
  })

  if (dadosOriginais.value?.data_admissao) {
    try {
      const admissao = new Date(dadosOriginais.value.data_admissao + 'T00:00:00')
      const feriasDoFunc = minhasFerias.value || []
      const periodoNum = feriasDoFunc.length + 1
      const inicioPeriodo = new Date(admissao)
      inicioPeriodo.setFullYear(inicioPeriodo.getFullYear() + periodoNum - 1)
      const fimPeriodo = new Date(inicioPeriodo)
      fimPeriodo.setFullYear(fimPeriodo.getFullYear() + 1)
      fimPeriodo.setDate(fimPeriodo.getDate() - 1)

      feriasForm.periodo_aquisitivo_inicio = inicioPeriodo.toISOString().split('T')[0]
      feriasForm.periodo_aquisitivo_fim = fimPeriodo.toISOString().split('T')[0]
    } catch (e) {
      console.error('Erro ao calcular período aquisitivo sugerido:', e)
    }
  }

  showFeriasModal.value = true
}

const fecharFeriasModal = () => {
  showFeriasModal.value = false
}

const solicitarFerias = async () => {
  if (!feriasFormValido.value || !user.value?.id) return
  salvandoFerias.value = true
  try {
    const payload = {
      ...feriasForm,
      funcionario_id: user.value.id,
      status: 'pendente'
    }
    await $fetch('/api/ferias', {
      method: 'POST',
      body: payload
    })
    mostrarMensagem('Sucesso!', 'Solicitação de férias enviada ao RH!', 'success')
    fecharFeriasModal()
    await carregarMinhasFerias()
  } catch (error: any) {
    console.error('Erro ao solicitar férias:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Erro ao enviar solicitação', 'error')
  } finally {
    salvandoFerias.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    carregarDados(),
    carregarMinhasFerias()
  ])
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
