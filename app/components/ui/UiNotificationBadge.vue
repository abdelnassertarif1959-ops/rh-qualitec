<template>
  <div class="relative inline-block">
    <!-- Slot para o conteúdo (ícone, botão, etc.) -->
    <slot />
    
    <!-- Badge de notificação -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="scale-0 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-0 opacity-0"
    >
      <div
        v-if="shouldShowBadge"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1 shadow-sm ring-2 ring-white"
        :class="badgeClasses"
        :aria-label="ariaLabel"
        role="status"
      >
        {{ displayCount }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count: number
  maxCount?: number
  showZero?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  maxCount: 99,
  showZero: false,
  size: 'md',
  color: 'red',
  pulse: false
})

// Computed para determinar se deve mostrar o badge
const shouldShowBadge = computed(() => {
  return props.count > 0 || (props.showZero && props.count === 0)
})

// Computed para o texto do badge
const displayCount = computed(() => {
  if (props.count === 0) return '0'
  if (props.count > props.maxCount) return `${props.maxCount}+`
  return props.count.toString()
})

// Classes dinâmicas do badge
const badgeClasses = computed(() => {
  const classes = []
  
  // Tamanhos
  switch (props.size) {
    case 'sm':
      classes.push('min-w-[14px] h-[14px] text-[10px] -top-0.5 -right-0.5')
      break
    case 'lg':
      classes.push('min-w-[22px] h-[22px] text-sm -top-1.5 -right-1.5')
      break
    default: // md
      classes.push('min-w-[18px] h-[18px] text-xs -top-1 -right-1')
  }
  
  // Cores
  switch (props.color) {
    case 'blue':
      classes.push('bg-blue-500')
      break
    case 'green':
      classes.push('bg-green-500')
      break
    case 'yellow':
      classes.push('bg-yellow-500')
      break
    case 'purple':
      classes.push('bg-purple-500')
      break
    default: // red
      classes.push('bg-red-500')
  }
  
  // Animação de pulso
  if (props.pulse && props.count > 0) {
    classes.push('animate-pulse')
  }
  
  return classes
})

// Aria label para acessibilidade
const ariaLabel = computed(() => {
  if (props.count === 0) return 'Nenhuma notificação não lida'
  if (props.count === 1) return '1 notificação não lida'
  if (props.count > props.maxCount) return `Mais de ${props.maxCount} notificações não lidas`
  return `${props.count} notificações não lidas`
})
</script>