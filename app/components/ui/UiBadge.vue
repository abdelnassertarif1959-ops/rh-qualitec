<template>
  <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', variantClasses]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-600'
  }
  return variants[props.variant]
})
</script>
