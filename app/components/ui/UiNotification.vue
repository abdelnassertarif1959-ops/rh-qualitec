<template>
  <Teleport to="body">
    <Transition name="notification">
      <div 
        v-if="show"
        :class="[
          'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-lg border-l-4 p-4',
          variantClasses
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ title }}</p>
            <p v-if="message" class="text-sm opacity-90 mt-1">{{ message }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  message?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'success',
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

// Auto close após duration
watch(() => props.show, (newShow) => {
  if (newShow && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})

const variantClasses = computed(() => {
  const variants = {
    success: 'border-green-500 text-green-700 bg-green-50',
    error: 'border-red-500 text-red-700 bg-red-50',
    warning: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    info: 'border-blue-500 text-blue-700 bg-blue-50'
  }
  return variants[props.variant]
})

const iconPath = computed(() => {
  const icons = {
    success: 'M5 13l4 4L19 7',
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[props.variant]
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>