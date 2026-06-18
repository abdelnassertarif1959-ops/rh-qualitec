<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">{{ title }}</h1>
      <p v-if="description" class="text-lg text-gray-500 mt-2">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>
