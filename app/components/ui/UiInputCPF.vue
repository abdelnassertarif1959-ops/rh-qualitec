<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
          disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500',
          error ? 'border-red-300' : '',
          cpfValido ? 'border-green-300' : ''
        ]"
        @input="handleInput"
        @blur="handleBlur"
      />
      
      <!-- Ícone de validação -->
      <div v-if="modelValue && !disabled" class="absolute right-4 top-1/2 -translate-y-1/2">
        <svg v-if="cpfValido" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else-if="modelValue.length >= 11" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6m0 0l-6-6m6 6l-6 6"/>
        </svg>
      </div>
    </div>
    
    <!-- Mensagens -->
    <div class="mt-1 space-y-1">
      <p v-if="hint && !error" class="text-xs text-gray-400">{{ hint }}</p>
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <p v-if="cpfValido && !error" class="text-xs text-green-600">CPF válido</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '000.000.000-00',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = computed(() => `cpf-input-${Math.random().toString(36).substring(2, 11)}`)

// Valor formatado para exibição
const displayValue = computed(() => {
  return formatarCPF(props.modelValue)
})

// Verifica se CPF é válido
const cpfValido = computed(() => {
  const cpfLimpo = props.modelValue.replace(/[^\d]/g, '')
  return cpfLimpo.length === 11 && validarCPF(cpfLimpo)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let valor = target.value.replace(/[^\d]/g, '') // Remove tudo que não é número
  
  // Limita a 11 dígitos
  if (valor.length > 11) {
    valor = valor.substring(0, 11)
  }
  
  emit('update:modelValue', valor)
}

const handleBlur = () => {
  // Pode adicionar validações adicionais aqui
}

// Função para formatar CPF
function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/[^\d]/g, '')
  
  if (cpfLimpo.length <= 3) return cpfLimpo
  if (cpfLimpo.length <= 6) return cpfLimpo.replace(/^(\d{3})(\d+)/, '$1.$2')
  if (cpfLimpo.length <= 9) return cpfLimpo.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
}

// Função para validar CPF
function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpfLimpo)) return false
  
  // Validação dos dígitos verificadores
  let soma = 0
  
  // Primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i)
  }
  
  let digito1 = 11 - (soma % 11)
  if (digito1 > 9) digito1 = 0
  
  if (parseInt(cpfLimpo.charAt(9)) !== digito1) return false
  
  // Segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i)
  }
  
  let digito2 = 11 - (soma % 11)
  if (digito2 > 9) digito2 = 0
  
  return parseInt(cpfLimpo.charAt(10)) === digito2
}
</script>