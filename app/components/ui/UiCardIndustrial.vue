<template>
  <div 
    :class="[
      'bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-industrial-200/50',
      'transition-all duration-300 hover:shadow-2xl',
      padding,
      className
    ]"
  >
    <!-- Header do card -->
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-6">
      <h3 v-if="title" class="text-xl font-bold text-industrial-800 flex items-center gap-3">
        <component 
          v-if="icon" 
          :is="icon" 
          class="w-6 h-6 text-qualitec-600" 
        />
        {{ title }}
        <span v-if="subtitle" class="text-sm font-normal text-industrial-500">{{ subtitle }}</span>
      </h3>
      <slot name="header" />
    </div>
    
    <!-- Conteúdo principal -->
    <slot />
    
    <!-- Footer do card -->
    <div v-if="$slots.footer" class="mt-6 pt-6 border-t border-industrial-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  icon?: any
  padding?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  padding: 'p-8 lg:p-10'
})
</script>