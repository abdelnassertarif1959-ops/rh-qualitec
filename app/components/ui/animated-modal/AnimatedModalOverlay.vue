<script setup lang="ts">
import { inject } from 'vue'
import { ANIMATED_MODAL_KEY } from './AnimatedModalContext'

const ctx = inject(ANIMATED_MODAL_KEY)

if (!ctx) {
  throw new Error('AnimatedModalOverlay must be used within AnimatedModal')
}

const handleClick = () => {
  ctx.closeModal()
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="ctx.open.value"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      @click="handleClick"
    >
      <slot />
    </div>
  </Transition>
</template>
