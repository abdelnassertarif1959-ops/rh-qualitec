<template>
  <div :class="['rounded-xl p-4 flex items-start gap-3', variantClasses]">
    <svg v-if="showIcon" class="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
    </svg>
    <span v-if="icon" class="text-xl flex-shrink-0">{{ icon }}</span>
    <div class="flex-1">
      <p v-if="title" class="font-semibold mb-1">{{ title }}</p>
      <p><slot /></p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  icon?: string
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  showIcon: true
})

const variantClasses = computed(() => {
  const variants = {
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border border-red-200 text-red-800'
  }
  return variants[props.variant]
})

const iconPath = computed(() => {
  const icons = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[props.variant]
})
</script>
