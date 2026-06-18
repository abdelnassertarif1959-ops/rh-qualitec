<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-semibold text-industrial-700 mb-2"
    >
      <span class="flex items-center gap-2">
        <component 
          v-if="icon" 
          :is="icon" 
          class="w-4 h-4 text-qualitec-600" 
        />
        {{ label }}
        <span v-if="required" class="text-safety-danger">*</span>
      </span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'w-full px-4 py-3.5 text-base font-medium',
          'border-2 rounded-xl outline-none transition-all duration-200',
          'bg-white/95 backdrop-blur-sm',
          'placeholder:text-industrial-400 placeholder:font-normal',
          showPasswordToggle ? 'pr-12' : '',
          disabled 
            ? 'border-industrial-200 bg-industrial-50 text-industrial-400 cursor-not-allowed' 
            : error
              ? 'border-safety-danger/50 focus:border-safety-danger focus:ring-4 focus:ring-safety-danger/10'
              : 'border-industrial-300 focus:border-qualitec-500 focus:ring-4 focus:ring-qualitec-100 hover:border-industrial-400',
          'shadow-sm focus:shadow-md'
        ]"
        @input="handleInput"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      
      <!-- Toggle de senha -->
      <button
        v-if="showPasswordToggle && type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-industrial-400 hover:text-industrial-600 transition-colors rounded-lg hover:bg-industrial-50"
        @click="passwordVisible = !passwordVisible"
        tabindex="-1"
      >
        <EyeIcon v-if="!passwordVisible" class="w-5 h-5" />
        <EyeSlashIcon v-else class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Mensagem de ajuda -->
    <p v-if="hint && !error" class="text-xs text-industrial-500 mt-1 flex items-center gap-1">
      <InformationCircleIcon class="w-3 h-3" />
      {{ hint }}
    </p>
    
    <!-- Mensagem de erro -->
    <p v-if="error" class="text-xs text-safety-danger mt-1 flex items-center gap-1">
      <ExclamationTriangleIcon class="w-3 h-3" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { 
  EyeIcon, 
  EyeSlashIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  icon?: any
  hint?: string
  error?: string
  showPasswordToggle?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  showPasswordToggle: false,
  autocomplete: 'off'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': []
  'blur': []
}>()

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const passwordVisible = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && passwordVisible.value) return 'text'
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Converter para número se for input numérico
  if (props.type === 'number') {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      emit('update:modelValue', numValue)
    } else if (value === '') {
      emit('update:modelValue', '')
    } else {
      emit('update:modelValue', value)
    }
  } else {
    emit('update:modelValue', value)
  }
}
</script>