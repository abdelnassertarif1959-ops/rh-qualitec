<template>
  <div class="space-y-4">
    <!-- Ativar/Desativar -->
    <div class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🚌</span>
        <div>
          <h4 class="font-semibold text-gray-800">Vale Transporte</h4>
          <p class="text-sm text-gray-600">Configure o vale transporte do funcionário</p>
        </div>
      </div>
      
      <label class="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          v-model="config.ativo" 
          class="sr-only peer"
          @change="emitChange"
        >
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    <!-- Configurações (só aparece se ativo) -->
    <div v-if="config.ativo" class="space-y-4 p-4 bg-white border border-gray-200 rounded-xl">
      
      <!-- Tipo de Transporte -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🚍 Tipo de Transporte
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label 
            v-for="tipo in tiposTransporte" 
            :key="tipo.value"
            class="relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
            :class="config.tipo_transporte === tipo.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
          >
            <input 
              type="radio" 
              v-model="config.tipo_transporte" 
              :value="tipo.value"
              class="sr-only"
              @change="calcularValorTotal"
            >
            <div class="flex items-center gap-2 w-full">
              <span class="text-xl">{{ tipo.icon }}</span>
              <div class="flex-1">
                <div class="font-medium text-gray-800">{{ tipo.label }}</div>
                <div class="text-xs text-gray-500">{{ tipo.desc }}</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Configuração de Passagens -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Passagens de Ônibus -->
        <div v-if="['onibus', 'integracao'].includes(config.tipo_transporte)">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🚌 Passagens de Ônibus por Dia
          </label>
          <div class="flex items-center gap-2">
            <input 
              type="number" 
              v-model.number="config.passagens_onibus_dia"
              min="0"
              max="10"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="calcularValorTotal"
            >
            <span class="text-sm text-gray-600">passagens</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ config.tipo_transporte === 'integracao' ? 'Integração: até 3 ônibus em 3h' : 'Ex: 2 (ida) + 2 (volta) = 4' }}
          </p>
        </div>

        <!-- Valor da Passagem de Ônibus -->
        <div v-if="['onibus', 'integracao'].includes(config.tipo_transporte)">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            💵 Valor da Passagem de Ônibus
          </label>
          <div class="flex items-center gap-2">
            <span class="text-gray-600">R$</span>
            <input 
              type="number" 
              v-model.number="config.valor_passagem_onibus"
              min="0"
              step="0.01"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="calcularValorTotal"
            >
          </div>
          <p class="text-xs text-gray-500 mt-1">SPTrans: R$ 5,30 (2024)</p>
        </div>

        <!-- Passagens de Metrô -->
        <div v-if="['metro', 'integracao'].includes(config.tipo_transporte)">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🚇 Passagens de Metrô/Trem por Dia
          </label>
          <div class="flex items-center gap-2">
            <input 
              type="number" 
              v-model.number="config.passagens_metro_dia"
              min="0"
              max="10"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="calcularValorTotal"
            >
            <span class="text-sm text-gray-600">passagens</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ config.tipo_transporte === 'integracao' ? 'Integração: 1 metrô/trem em 2h' : 'Ex: 1 (ida) + 1 (volta) = 2' }}
          </p>
        </div>

        <!-- Valor da Passagem de Metrô -->
        <div v-if="['metro', 'integracao'].includes(config.tipo_transporte)">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            💵 Valor da Passagem de Metrô/Trem
          </label>
          <div class="flex items-center gap-2">
            <span class="text-gray-600">R$</span>
            <input 
              type="number" 
              v-model.number="config.valor_passagem_metro"
              min="0"
              step="0.01"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="calcularValorTotal"
            >
          </div>
          <p class="text-xs text-gray-500 mt-1">CPTM/Metrô: R$ 5,40 (2024)</p>
        </div>
      </div>

      <!-- Dias Úteis -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📅 Dias Úteis Trabalhados no Mês
        </label>
        <input 
          type="number" 
          v-model.number="config.dias_uteis"
          min="1"
          max="31"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="calcularValorTotal"
        >
        <p class="text-xs text-gray-500 mt-1">Normalmente 22 dias úteis por mês</p>
      </div>

      <!-- Desconto -->
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📉 Desconto do Funcionário
        </label>
        <div class="flex items-center gap-2">
          <input 
            type="number" 
            v-model.number="config.percentual_desconto"
            min="0"
            max="100"
            step="0.01"
            class="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            @input="calcularValorTotal"
          >
          <span class="text-gray-600">% do salário base</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Máximo legal: 6% do salário base</p>
      </div>

      <!-- Resumo do Cálculo -->
      <div class="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-3">💰 Resumo do Cálculo</h5>
        
        <div class="space-y-2 text-sm">
          <!-- Ônibus -->
          <div v-if="['onibus', 'integracao'].includes(config.tipo_transporte)" class="flex justify-between">
            <span class="text-gray-600">
              🚌 Ônibus: {{ config.passagens_onibus_dia }} passagens × R$ {{ formatarMoeda(config.valor_passagem_onibus) }} × {{ config.dias_uteis }} dias
            </span>
            <span class="font-semibold">R$ {{ formatarMoeda(calcularCustoOnibus()) }}</span>
          </div>
          
          <!-- Metrô -->
          <div v-if="['metro', 'integracao'].includes(config.tipo_transporte)" class="flex justify-between">
            <span class="text-gray-600">
              🚇 Metrô: {{ config.passagens_metro_dia }} passagens × R$ {{ formatarMoeda(config.valor_passagem_metro) }} × {{ config.dias_uteis }} dias
            </span>
            <span class="font-semibold">R$ {{ formatarMoeda(calcularCustoMetro()) }}</span>
          </div>
          
          <div class="border-t border-gray-300 pt-2 mt-2"></div>
          
          <!-- Total -->
          <div class="flex justify-between text-base">
            <span class="font-semibold text-gray-800">Total Vale Transporte:</span>
            <span class="font-bold text-green-600">R$ {{ formatarMoeda(config.valor_total) }}</span>
          </div>
          
          <!-- Desconto -->
          <div class="flex justify-between text-base">
            <span class="font-semibold text-gray-800">Desconto ({{ config.percentual_desconto }}%):</span>
            <span class="font-bold text-red-600">- R$ {{ formatarMoeda(calcularDesconto()) }}</span>
          </div>
          
          <div class="border-t border-gray-300 pt-2 mt-2"></div>
          
          <!-- Valor Líquido -->
          <div class="flex justify-between text-lg">
            <span class="font-bold text-gray-800">Valor Líquido:</span>
            <span class="font-bold text-blue-600">R$ {{ formatarMoeda(config.valor_total - calcularDesconto()) }}</span>
          </div>
        </div>
      </div>

      <!-- Observações -->
      <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start gap-2">
          <span class="text-yellow-500">ℹ️</span>
          <div class="text-xs text-yellow-800">
            <p class="font-semibold mb-1">Observações:</p>
            <ul class="space-y-1">
              <li>• O desconto máximo permitido por lei é de 6% do salário base</li>
              <li>• Valores atualizados: Ônibus R$ 5,30 | Metrô/Trem R$ 5,40 (SP 2024)</li>
              <li>• Integração permite até 3 ônibus em 3h + 1 metrô/trem em 2h</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ValeTransporteConfig {
  ativo: boolean
  tipo_transporte: 'onibus' | 'metro' | 'integracao'
  passagens_onibus_dia: number
  valor_passagem_onibus: number
  passagens_metro_dia: number
  valor_passagem_metro: number
  dias_uteis: number
  percentual_desconto: number
  valor_total: number
}

interface Props {
  modelValue: ValeTransporteConfig
  salarioBase: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const config = ref<ValeTransporteConfig>({ ...props.modelValue })

const tiposTransporte = [
  { 
    value: 'onibus', 
    label: 'Apenas Ônibus', 
    icon: '🚌',
    desc: 'SPTrans - R$ 5,30'
  },
  { 
    value: 'metro', 
    label: 'Apenas Metrô/Trem', 
    icon: '🚇',
    desc: 'CPTM - R$ 5,40'
  },
  { 
    value: 'integracao', 
    label: 'Integração', 
    icon: '🔄',
    desc: 'Ônibus + Metrô'
  }
]

// Funções de cálculo
const calcularCustoOnibus = (): number => {
  return config.value.passagens_onibus_dia * config.value.valor_passagem_onibus * config.value.dias_uteis
}

const calcularCustoMetro = (): number => {
  return config.value.passagens_metro_dia * config.value.valor_passagem_metro * config.value.dias_uteis
}

const calcularValorTotal = () => {
  let total = 0
  
  if (['onibus', 'integracao'].includes(config.value.tipo_transporte)) {
    total += calcularCustoOnibus()
  }
  
  if (['metro', 'integracao'].includes(config.value.tipo_transporte)) {
    total += calcularCustoMetro()
  }
  
  config.value.valor_total = total
  emitChange()
}

const calcularDesconto = (): number => {
  return props.salarioBase * (config.value.percentual_desconto / 100)
}

const formatarMoeda = (valor: number): string => {
  return valor.toFixed(2).replace('.', ',')
}

const emitChange = () => {
  emit('update:modelValue', { ...config.value })
}

// Inicializar valores padrão
onMounted(() => {
  if (!config.value.dias_uteis) {
    config.value.dias_uteis = 22
  }
  if (!config.value.percentual_desconto) {
    config.value.percentual_desconto = 6
  }
  // Valores padrão de São Paulo (2024)
  if (!config.value.valor_passagem_onibus) {
    config.value.valor_passagem_onibus = 5.30
  }
  if (!config.value.valor_passagem_metro) {
    config.value.valor_passagem_metro = 5.40
  }
  calcularValorTotal()
})

// Watch para mudanças no salário base
watch(() => props.salarioBase, () => {
  calcularValorTotal()
})
</script>
