<template>
  <AnimatedModal v-model:open="internalValue">
    <AnimatedModalBody
      :class="maxWidth"
      :show-close="true"
      :close-on-outside="closeOnBackdrop"
    >
      <div class="flex flex-col h-full max-h-[85vh]">
        <!-- Header -->
        <div class="px-8 pt-8 pb-4 flex-shrink-0">
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        </div>

        <!-- Content (scrollable) -->
        <div class="flex-1 overflow-y-auto px-8" :class="contentPadding">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </div>
    </AnimatedModalBody>
  </AnimatedModal>
</template>

<script setup lang="ts">
import {
  AnimatedModal,
  AnimatedModalBody,
} from '~/components/ui/animated-modal'

interface Props {
  modelValue: boolean
  title: string
  maxWidth?: string
  maxHeight?: string
  contentPadding?: string
  contentMaxHeight?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-lg',
  maxHeight: 'max-h-[90vh]',
  contentPadding: '',
  contentMaxHeight: 'calc(90vh - 180px)',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Computed para sincronizar com AnimatedModal
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
