<template>
  <NuxtLink 
    :to="to"
    class="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
  >
    <div class="flex items-start gap-4">
      <div 
        class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        :class="iconBgClass"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ description }}
        </p>
        
        <!-- Slot para conteúdo adicional (como badges) -->
        <slot />
      </div>
      
      <!-- Ícone de seta -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
  title: string
  description: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  iconPath: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600'
  }
  return colors[props.color]
})
</script>
