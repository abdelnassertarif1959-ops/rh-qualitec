<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      type="text"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
        disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500'
      ]"
      @input="handleInput"
      @blur="$emit('blur')"
      maxlength="14"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '000.00000.00-0',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const id = computed(() => `pis-${Math.random().toString(36).substr(2, 9)}`)

const displayValue = computed(() => {
  return formatarPIS(props.modelValue)
})

const formatarPIS = (valor: string): string => {
  if (!valor) return ''
  
  // Remove tudo que não é número
  const numeros = valor.replace(/\D/g, '')
  
  // Aplica a máscara: 000.00000.00-0
  if (numeros.length <= 3) {
    return numeros
  } else if (numeros.length <= 8) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3)}`
  } else if (numeros.length <= 10) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 8)}.${numeros.slice(8)}`
  } else {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 8)}.${numeros.slice(8, 10)}-${numeros.slice(10, 11)}`
  }
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const valor = input.value.replace(/\D/g, '')
  emit('update:modelValue', valor)
}

const validarPIS = (pis: string): boolean => {
  const numeros = pis.replace(/\D/g, '')
  
  if (numeros.length !== 11) return false
  
  // Validação do dígito verificador
  const multiplicadores = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let soma = 0
  
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * multiplicadores[i]
  }
  
  const resto = soma % 11
  const digitoVerificador = resto < 2 ? 0 : 11 - resto
  
  return digitoVerificador === parseInt(numeros[10])
}
</script>
