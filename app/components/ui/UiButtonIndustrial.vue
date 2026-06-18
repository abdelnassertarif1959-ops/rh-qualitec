<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
      'focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
      'transform hover:scale-[1.02] active:scale-[0.98]',
      'shadow-lg hover:shadow-xl',
      sizeClasses,
      variantClasses
    ]"
  >
    <!-- Loading spinner -->
    <svg 
      v-if="loading" 
      class="w-5 h-5 animate-spin" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      />
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <!-- Ícone -->
    <component 
      v-else-if="icon && !loading" 
      :is="icon" 
      class="w-5 h-5" 
    />
    
    <!-- Conteúdo do slot -->
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'industrial'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'text-white bg-gradient-to-r from-qualitec-600 to-qualitec-700 hover:from-qualitec-700 hover:to-qualitec-800 focus:ring-qualitec-200',
    secondary: 'text-industrial-700 bg-industrial-100 hover:bg-industrial-200 focus:ring-industrial-200 border border-industrial-300',
    danger: 'text-white bg-gradient-to-r from-safety-danger to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-200',
    success: 'text-white bg-gradient-to-r from-safety-success to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-200',
    ghost: 'text-qualitec-700 bg-qualitec-50 hover:bg-qualitec-100 focus:ring-qualitec-200 border border-qualitec-200',
    industrial: 'text-white bg-gradient-to-r from-industrial-600 to-industrial-700 hover:from-industrial-700 hover:to-industrial-800 focus:ring-industrial-200'
  }
  return variants[props.variant]
})
</script>