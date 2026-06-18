<script setup lang="ts">
interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div class="flex justify-end bg-gray-50 border-t border-gray-200 p-4" :class="[props.class]">
    <slot />
  </div>
</template>
