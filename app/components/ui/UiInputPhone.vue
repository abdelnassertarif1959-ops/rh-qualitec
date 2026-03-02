<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      :id="id"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
        disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500',
        error ? 'border-red-300' : ''
      ]"
      @input="handleInput"
    />
    
    <!-- Mensagens -->
    <div class="mt-1 space-y-1">
      <p v-if="hint && !error" class="text-xs text-gray-400">{{ hint }}</p>
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
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
  placeholder: '(11) 99999-9999',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = computed(() => `phone-input-${Math.random().toString(36).substring(2, 11)}`)

// Valor formatado para exibição
const displayValue = computed(() => {
  return formatarTelefone(props.modelValue)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let valor = target.value.replace(/[^\d]/g, '') // Remove tudo que não é número
  
  // Limita a 11 dígitos (celular com DDD)
  if (valor.length > 11) {
    valor = valor.substring(0, 11)
  }
  
  emit('update:modelValue', valor)
}

// Função para formatar telefone
function formatarTelefone(telefone: string): string {
  const telLimpo = telefone.replace(/[^\d]/g, '')
  
  if (telLimpo.length <= 2) return telLimpo
  if (telLimpo.length <= 6) return telLimpo.replace(/^(\d{2})(\d+)/, '($1) $2')
  if (telLimpo.length <= 10) return telLimpo.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  return telLimpo.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
}
</script>