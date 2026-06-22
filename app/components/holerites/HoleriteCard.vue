<template>
  <div v-if="holerite" :class="[
    'border rounded-xl p-6 hover:shadow-lg transition-shadow',
    getTipoHoleriteStyle().card
  ]">
    <div class="flex items-start justify-between">
      <!-- Informações Principais -->
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <!-- Indicador de Tipo (Adiantamento vs Folha Mensal) -->
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              getTipoHoleriteStyle().icon
            ]"
          >
            <svg v-if="isAdiantamento" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-bold text-gray-800">
                {{ holerite.referencia }}
              </h3>
              <!-- Badge do Tipo -->
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                  getTipoHoleriteStyle().badge
                ]"
              >
                {{ getTipoHoleriteLabel() }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>{{ holerite.competencia }}</span>
              <span v-if="holerite.quinzena" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {{ holerite.quinzena }}ª Quinzena
              </span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(holerite!.status).badge
                ]"
              >
                {{ holerite!.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Valores -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <div class="text-xs text-gray-500 mb-1">Proventos</div>
            <div class="text-sm font-semibold text-green-600">
              R$ {{ formatarMoeda(holerite.totalProventos) }}
            </div>
          </div>
          
          <div>
            <div class="text-xs text-gray-500 mb-1">Descontos</div>
            <div class="text-sm font-semibold text-red-600">
              R$ {{ formatarMoeda(holerite.totalDescontos) }}
            </div>
          </div>
          
          <div>
            <div class="text-xs text-gray-500 mb-1">Líquido</div>
            <div class="text-lg font-bold text-blue-600">
              R$ {{ formatarMoeda(holerite.liquido) }}
            </div>
          </div>
          
          <div v-if="holerite.dataDisponibilizacao">
            <div class="text-xs text-gray-500 mb-1">Disponível em</div>
            <div class="text-sm font-medium text-gray-700">
              {{ formatarData(holerite.dataDisponibilizacao) }}
            </div>
          </div>
        </div>

        <!-- Período de Referência -->
        <div v-if="holerite.periodo_inicio && holerite.periodo_fim" class="mt-3 p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center gap-1.5 text-xs text-blue-700 font-medium mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Período de Referência
          </div>
          <div class="text-sm text-blue-800">
            {{ formatarPeriodoReferencia() }}
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-col gap-2 ml-4">
        <UiButton 
          variant="primary" 
          size="sm"
          @click="$emit('view', holerite)"
          :disabled="!isDisponivel"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Visualizar
        </UiButton>
        
        <UiButton 
          variant="secondary" 
          size="sm"
          @click="$emit('download', holerite)"
          :disabled="!isDisponivel"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Baixar PDF
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  holerite: {
    id: number
    referencia: string
    competencia: string
    mes: string
    ano: string
    quinzena?: 1 | 2
    tipo: string
    status: string
    salarioBase: number
    bonus?: number
    totalProventos: number
    totalDescontos: number
    liquido: number
    dataDisponibilizacao?: Date
    periodoInicio?: Date
    periodoFim?: Date
  }
}

const props = defineProps<Props>()

defineEmits<{
  view: [holerite: any]
  download: [holerite: any]
}>()

const { formatarDataSimples: formatarData } = useDateFormat()

// Verificar se o holerite está disponível
const isDisponivel = computed(() => {
  // Se o holerite está visível no perfil do funcionário, sempre está disponível
  // A lógica de disponibilização já foi feita pelo admin
  return true
})

// Função para formatar moeda
const formatarMoeda = (valor: number): string => {
  if (valor === undefined || valor === null) {
    return '0,00'
  }
  try {
    return valor.toFixed(2).replace('.', ',')
  } catch (error) {
    return '0,00'
  }
}

// Função para obter cor do status
const getStatusColor = (status?: string) => {
  const colors: Record<string, { bg: string; badge: string }> = {
    'Pago': {
      bg: 'bg-green-100',
      badge: 'bg-green-100 text-green-800'
    },
    'Pendente': {
      bg: 'bg-yellow-100',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'Programado': {
      bg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-800'
    },
    'Cancelado': {
      bg: 'bg-red-100',
      badge: 'bg-red-100 text-red-800'
    },
    'enviado': {
      bg: 'bg-green-100',
      badge: 'bg-green-100 text-green-800'
    },
    'gerado': {
      bg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-800'
    }
  }
  
  return colors[status || 'Pendente'] || colors['Pendente']
}

// Função para obter ícone do status
const getStatusIcon = (status?: string): string => {
  // Não usado mais - mantido para compatibilidade
  return ''
}

// Função para determinar se é adiantamento ou folha mensal
const isAdiantamento = computed(() => {
  // Verificar pela observação (mais confiável)
  if (props.holerite?.observacoes?.startsWith('Adiantamento')) return true
  
  // Fallback: verificar pelo tipo
  return props.holerite?.tipo?.toLowerCase().includes('adiantamento') ||
         props.holerite?.referencia?.toLowerCase().includes('adiantamento')
})

// Função para obter estilo do tipo de holerite
const getTipoHoleriteStyle = () => {
  if (isAdiantamento.value) {
    return {
      card: 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200',
      icon: 'bg-gradient-to-br from-orange-400 to-yellow-500 text-white shadow-lg',
      badge: 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-sm'
    }
  } else {
    return {
      card: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
      icon: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg',
      badge: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm'
    }
  }
}

// Função para obter ícone do tipo de holerite
const getTipoHoleriteIcon = (): string => {
  // Não usado mais - ícones SVG são renderizados no template
  return ''
}

// Função para obter label do tipo de holerite
const getTipoHoleriteLabel = (): string => {
  return isAdiantamento.value ? 'Adiantamento' : 'Folha Mensal'
}

// Função para formatar período de referência
const formatarPeriodoReferencia = (): string => {
  if (!props.holerite?.periodo_inicio || !props.holerite?.periodo_fim) {
    return 'Período não definido'
  }
  
  // Parse seguro de datas para evitar problemas de timezone
  const parseDateOnly = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  const dataInicio = parseDateOnly(props.holerite.periodo_inicio)
  
  // O mês de referência é SEMPRE o mês do periodo_inicio (mês trabalhado)
  // Exemplo: periodo_inicio = 01/04/2026 → "Abril"
  const mesNome = dataInicio.toLocaleDateString('pt-BR', { month: 'long' })
  return mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
}
</script>
